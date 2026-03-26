import { evaluateVariantEligibility } from './guards';
import type {
  EffectivePreferences,
  RankedVariant,
  ResolvePlanInput,
  ScoreContribution,
  VariantRuleContext,
  ZoneSchema
} from './types';

const SCORES = {
  exactPreferenceMatch: 12,
  zoneCriticalPreferenceMatch: 16,
  expertiseMatch: 10,
  defaultPenalty: -4,
  strongAffinity: 10,
  mediumAffinity: 6,
  optionalHiddenPenalty: -12,
  touchComfortBonus: 8,
  quickActionBonus: 8,
  stabilityBonus: 6
} as const;

function sourceStrength(source: string): number {
  switch (source) {
    case 'explicit':
    case 'safety':
      return 2.2;
    case 'policy':
      return 1.8;
    case 'learned':
      return 1.3;
    case 'session':
      return 1.15;
    default:
      return 1;
  }
}

function pushContribution(
  target: ScoreContribution[],
  id: string,
  label: string,
  contribution: number,
  detail: string,
  status: 'applied' | 'blocked' | 'neutral' = contribution === 0
    ? 'neutral'
    : 'applied'
): number {
  target.push({
    id,
    label,
    contribution,
    detail,
    status
  });
  return contribution;
}

function scorePreferenceMatch(
  contributions: ScoreContribution[],
  label: string,
  trait: string | undefined,
  resolved: string,
  source: string,
  critical = false
): number {
  if (!trait) {
    return 0;
  }

  const matchScore = Number(
    (
      (critical
        ? SCORES.zoneCriticalPreferenceMatch
        : SCORES.exactPreferenceMatch) * sourceStrength(source)
    ).toFixed(3)
  );
  const mismatchScore = Number(
    (SCORES.defaultPenalty * sourceStrength(source)).toFixed(3)
  );

  if (trait === resolved) {
    return pushContribution(
      contributions,
      `pref-${label}`,
      `${label} match`,
      matchScore,
      `${label} matched resolved preference ${resolved} from ${source}.`
    );
  }

  return pushContribution(
    contributions,
    `pref-${label}-mismatch`,
    `${label} mismatch`,
    mismatchScore,
    `${label} prefers ${trait} while resolved preference is ${resolved} from ${source}.`
  );
}

function scoreAffinity(
  contributions: ScoreContribution[],
  id: string,
  label: string,
  traitWeight: number | undefined,
  learnedValue: number,
  detail: string
): number {
  if (!traitWeight) {
    return 0;
  }

  const centered = learnedValue - 0.5;
  const contribution = Number(
    (centered * traitWeight * SCORES.strongAffinity).toFixed(3)
  );

  return pushContribution(contributions, id, label, contribution, detail);
}

export function rankVariants(
  input: ResolvePlanInput,
  zoneName: string,
  zone: ZoneSchema,
  effectivePreferences: EffectivePreferences
): RankedVariant[] {
  const entries = Object.entries(zone.variants);
  const rankedVariants = entries.map(([variantId, variant]) => {
    const baseContext: VariantRuleContext = {
      surface: input.surface,
      zoneName,
      variantId,
      userProfile: input.userProfile,
      behaviorSummary: input.behaviorSummary ?? {
        viewCount: 0,
        chartInteractions: 0,
        tableInteractions: 0,
        keyboardShortcuts: 0,
        quickActionUses: 0,
        commandPaletteUses: 0,
        detailExpansions: 0,
        widgetCollapses: {},
        widgetExpansions: {},
        moduleDismissals: {},
        lastInteractionAt: 0
      },
      context: input.context,
      accountPolicy: input.accountPolicy,
      effectivePreferences,
      previousPlan: input.previousPlan
    };

    const contributions: ScoreContribution[] = [];
    const eligibility = evaluateVariantEligibility(
      input,
      zoneName,
      variantId,
      variant,
      baseContext
    );

    if (!eligibility.eligible) {
      contributions.push({
        id: `guard-${variantId}`,
        label: 'Eligibility blocked',
        contribution: Number.NEGATIVE_INFINITY,
        detail: eligibility.reason ?? 'This variant is not eligible.',
        status: 'blocked'
      });

      return {
        variantId,
        component: variant.component,
        score: Number.NEGATIVE_INFINITY,
        tokenOverrides: variant.tokenOverrides ?? {},
        contributions,
        eligible: false,
        blockedReason: eligibility.reason
      } satisfies RankedVariant;
    }

    let score = variant.baseScore ?? 0;
    pushContribution(
      contributions,
      'base',
      'Base score',
      score,
      'Base variant score.'
    );

    if (zone.defaultVariant === variantId) {
      score += pushContribution(
        contributions,
        'default-variant',
        'Default variant',
        2,
        `Zone ${zoneName} defaults to ${variantId}.`
      );
    }

    score += scorePreferenceMatch(
      contributions,
      'density',
      variant.traits?.density,
      effectivePreferences.values.density,
      effectivePreferences.sources.density
    );
    score += scorePreferenceMatch(
      contributions,
      'content-mode',
      variant.traits?.contentMode,
      effectivePreferences.values.contentMode,
      effectivePreferences.sources.contentMode,
      zone.kind === 'content'
    );
    score += scorePreferenceMatch(
      contributions,
      'nav-mode',
      variant.traits?.navMode,
      effectivePreferences.values.navMode,
      effectivePreferences.sources.navMode,
      zone.kind === 'navigation'
    );
    score += scorePreferenceMatch(
      contributions,
      'default-view',
      variant.traits?.defaultView,
      effectivePreferences.values.defaultView,
      effectivePreferences.sources.defaultView,
      zone.kind === 'content'
    );
    score += scorePreferenceMatch(
      contributions,
      'layout-bias',
      variant.traits?.layoutBias,
      effectivePreferences.values.layoutBias,
      effectivePreferences.sources.layoutBias
    );
    score += scorePreferenceMatch(
      contributions,
      'expertise',
      variant.traits?.expertise,
      effectivePreferences.values.expertise,
      effectivePreferences.sources.expertise
    );

    score += scoreAffinity(
      contributions,
      'learned-charts',
      'Chart affinity',
      variant.traits?.chartAffinity,
      input.userProfile.learned.prefersCharts,
      'Weighted by learned chart preference.'
    );
    score += scoreAffinity(
      contributions,
      'learned-summary',
      'Summary affinity',
      variant.traits?.summaryAffinity,
      input.userProfile.learned.prefersSummary,
      'Weighted by learned summary preference.'
    );
    score += scoreAffinity(
      contributions,
      'learned-keyboard',
      'Keyboard affinity',
      variant.traits?.keyboardAffinity,
      input.userProfile.learned.prefersKeyboardFlow,
      'Weighted by learned keyboard usage.'
    );
    score += scoreAffinity(
      contributions,
      'learned-quick-actions',
      'Quick actions affinity',
      variant.traits?.quickActions,
      input.userProfile.learned.prefersQuickActions,
      'Weighted by learned quick action usage.'
    );
    score += scoreAffinity(
      contributions,
      'learned-stable-layout',
      'Stable layout affinity',
      variant.traits?.stableLayout,
      input.userProfile.learned.prefersStableLayout,
      'Weighted by stable layout preference.'
    );

    if (
      variant.traits?.touchComfort &&
      input.context.pointerType === 'coarse'
    ) {
      score += pushContribution(
        contributions,
        'touch-comfort',
        'Touch comfort',
        Number(
          (variant.traits.touchComfort * SCORES.touchComfortBonus).toFixed(3)
        ),
        'Variant favors touch-friendly affordances on coarse pointer devices.'
      );
    }

    if (variant.traits?.quickActions && zone.kind === 'actions') {
      score += pushContribution(
        contributions,
        'zone-actions',
        'Action zone emphasis',
        Number(
          (variant.traits.quickActions * SCORES.quickActionBonus).toFixed(3)
        ),
        'Quick action emphasis in an action zone.'
      );
    }

    if (input.userProfile.explicit.hiddenOptionalModules.includes(variantId)) {
      score += pushContribution(
        contributions,
        'user-hidden',
        'User hidden module',
        SCORES.optionalHiddenPenalty,
        'User has hidden this optional module previously.'
      );
    }

    if (input.userProfile.explicit.pinnedModules.includes(variantId)) {
      score += pushContribution(
        contributions,
        'user-pinned',
        'Pinned module',
        SCORES.stabilityBonus,
        'Pinned modules are favored to remain visible.'
      );
    }

    for (const rule of variant.rules ?? []) {
      const ruleResult = rule.apply({
        ...baseContext,
        effectivePreferences
      });
      if (typeof ruleResult === 'number' && ruleResult !== 0) {
        score += pushContribution(
          contributions,
          rule.id,
          rule.label,
          Number(ruleResult.toFixed(3)),
          `Rule ${rule.label} contributed ${ruleResult.toFixed(2)}.`
        );
      } else if (ruleResult && typeof ruleResult === 'object') {
        score += pushContribution(
          contributions,
          ruleResult.id,
          ruleResult.label,
          Number(ruleResult.contribution.toFixed(3)),
          ruleResult.detail,
          ruleResult.status
        );
      }
    }

    return {
      variantId,
      component: variant.component,
      score: Number(score.toFixed(3)),
      tokenOverrides: variant.tokenOverrides ?? {},
      contributions,
      eligible: true
    } satisfies RankedVariant;
  });

  return rankedVariants.sort(
    (left, right) =>
      right.score - left.score || left.variantId.localeCompare(right.variantId)
  );
}
