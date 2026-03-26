import { createBehaviorSummary } from './behavior';
import { resolveEffectivePreferences } from './preferences';
import { rankVariants } from './scoring';
import { applyStabilityGuard, DEFAULT_HYSTERESIS_THRESHOLD } from './stability';
import { RuleBasedStrategy } from './strategies/ruleBased';
import type {
  AdaptationPlan,
  EffectivePreferences,
  PlanExplanation,
  ResolvePlanInput,
  TraceEntry,
  ZonePlan
} from './types';

function createExposureId(
  surfaceId: string,
  zoneName: string,
  variantId: string
): string {
  return `${surfaceId}:${zoneName}:${variantId}`;
}

function computeTransitionMode(
  effectivePreferences: EffectivePreferences,
  supportsViewTransitions: boolean
) {
  if (effectivePreferences.values.motion === 'none') {
    return 'none' as const;
  }

  if (effectivePreferences.values.motion === 'reduced') {
    return 'css' as const;
  }

  return supportsViewTransitions
    ? ('view-transition' as const)
    : ('css' as const);
}

function computeConfidence(
  score: number,
  fallbackScore: number | undefined
): number {
  if (
    fallbackScore === undefined ||
    fallbackScore === Number.NEGATIVE_INFINITY
  ) {
    return 1;
  }

  const delta = Math.max(0, score - fallbackScore);
  return Math.max(0, Math.min(1, Number((0.5 + delta / 20).toFixed(3))));
}

export function resolvePlan<SurfaceId extends string = string>(
  input: ResolvePlanInput<SurfaceId>
): AdaptationPlan<SurfaceId> {
  const now = input.now ?? Date.now();
  const effectivePreferences = resolveEffectivePreferences(
    input.userProfile,
    {
      theme: input.context.system.colorScheme,
      contrast: input.context.system.contrast,
      deviceCategory: input.context.deviceCategory,
      reducedMotion: input.context.system.reducedMotion
    },
    input.accountPolicy
  );
  const behaviorSummary = createBehaviorSummary(input.behaviorSummary);
  const strategy = input.strategy ?? new RuleBasedStrategy();
  const zonePlans: Record<string, ZonePlan> = {};
  const reasoningTrace: TraceEntry[] = [...effectivePreferences.trace];
  const tokenOverrides: Record<`--${string}`, string> = {};
  const keptPrevious: string[] = [];
  const cooldownUntil: Record<string, number> = {
    ...(input.previousPlan?.stability.cooldownUntil ?? {})
  };

  for (const [zoneName, zone] of Object.entries(input.surface.zones)) {
    const rankedVariants = rankVariants(
      {
        ...input,
        behaviorSummary
      },
      zoneName,
      zone,
      effectivePreferences
    );
    const selection = strategy.select({
      surface: input.surface,
      zoneName,
      zone,
      rankedVariants,
      userProfile: input.userProfile,
      behaviorSummary,
      context: input.context,
      accountPolicy: input.accountPolicy,
      effectivePreferences,
      previousPlan: input.previousPlan
    });
    const stabilityResult = applyStabilityGuard({
      surface: input.surface,
      zoneName,
      zone,
      rankedVariants,
      now,
      ...(input.previousPlan?.zones[zoneName]?.variantId
        ? {
            previousZoneVariantId: input.previousPlan.zones[zoneName]?.variantId
          }
        : {}),
      ...(input.previousPlan?.stability.cooldownUntil[zoneName]
        ? {
            previousCooldownUntil:
              input.previousPlan.stability.cooldownUntil[zoneName]
          }
        : {})
    });

    const finalWinner =
      stabilityResult.keptPrevious &&
      selection.winner.variantId !== stabilityResult.winner.variantId
        ? stabilityResult.winner
        : selection.winner;
    const runnerUp = rankedVariants.find(
      (candidate) =>
        candidate.eligible && candidate.variantId !== finalWinner.variantId
    );
    const confidence = computeConfidence(finalWinner.score, runnerUp?.score);

    if (stabilityResult.keptPrevious) {
      keptPrevious.push(zoneName);
      reasoningTrace.push({
        id: `stability-${zoneName}`,
        label: 'Stability guard',
        detail:
          stabilityResult.reason ??
          `Previous variant retained for ${zoneName}.`,
        source: 'stability'
      });
    }

    if (selection.trace) {
      reasoningTrace.push(selection.trace);
    }

    Object.assign(tokenOverrides, finalWinner.tokenOverrides);
    if (stabilityResult.cooldownUntil) {
      cooldownUntil[zoneName] = stabilityResult.cooldownUntil;
    }

    zonePlans[zoneName] = {
      zoneName,
      variantId: finalWinner.variantId,
      component: finalWinner.component,
      score: finalWinner.score,
      confidence,
      tokenOverrides: finalWinner.tokenOverrides,
      reasoning: [
        ...(selection.trace ? [selection.trace] : []),
        ...finalWinner.contributions
          .filter(
            (contribution) =>
              contribution.status === 'applied' &&
              contribution.contribution !== 0
          )
          .map((contribution) => ({
            id: contribution.id,
            label: contribution.label,
            detail: contribution.detail,
            source: 'default' as const
          })),
        ...(stabilityResult.reason
          ? [
              {
                id: `stability-zone-${zoneName}`,
                label: 'Zone stability',
                detail: stabilityResult.reason,
                source: 'stability' as const
              }
            ]
          : [])
      ],
      contributions: finalWinner.contributions,
      candidates: rankedVariants
    };
  }

  const exposureIds = Object.entries(zonePlans).map(([zoneName, plan]) =>
    createExposureId(input.surface.id, zoneName, plan.variantId)
  );
  const confidence =
    Object.values(zonePlans).reduce(
      (sum, zonePlan) => sum + zonePlan.confidence,
      0
    ) / Math.max(1, Object.keys(zonePlans).length);

  reasoningTrace.push({
    id: 'plan-summary',
    label: 'Plan resolved',
    detail: `Resolved ${Object.keys(zonePlans).length} zones for ${input.surface.id}.`,
    source: 'default'
  });

  return {
    surfaceId: input.surface.id,
    layoutMode: effectivePreferences.values.layoutBias,
    disclosureLevel: effectivePreferences.values.contentMode,
    transitionMode: computeTransitionMode(
      effectivePreferences,
      input.context.system.viewTransitions
    ),
    tokenOverrides,
    zones: zonePlans,
    reasoningTrace,
    confidence: Number(confidence.toFixed(3)),
    stability: {
      frozen: false,
      keptPrevious,
      cooldownUntil,
      hysteresisThreshold:
        input.surface.policies?.hysteresisThreshold ??
        DEFAULT_HYSTERESIS_THRESHOLD,
      reasons: reasoningTrace
        .filter((trace) => trace.source === 'stability')
        .map((trace) => trace.detail)
    },
    exposureIds,
    resolvedPreferences: effectivePreferences,
    timestamp: now
  };
}

export function summarizePlan(plan: AdaptationPlan): PlanExplanation {
  return {
    summary: [
      `${plan.surfaceId} resolved in ${plan.layoutMode} mode with ${plan.disclosureLevel} disclosure.`,
      `Transition mode is ${plan.transitionMode} with overall confidence ${plan.confidence.toFixed(2)}.`,
      ...plan.stability.reasons
    ],
    zones: Object.fromEntries(
      Object.entries(plan.zones).map(([zoneName, zonePlan]) => [
        zoneName,
        {
          variantId: zonePlan.variantId,
          why: zonePlan.reasoning.map((trace) => trace.detail),
          blocked: zonePlan.candidates
            .filter(
              (candidate) => !candidate.eligible && candidate.blockedReason
            )
            .map((candidate) => candidate.blockedReason as string)
        }
      ])
    )
  };
}
