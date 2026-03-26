import type { AdaptiveIntentInput } from './types';

function stringifyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function createAdaptiveIntentInstructions() {
  return [
    'You compile user intent into safe adaptive UI recommendations.',
    'Never generate HTML, CSS, JSX, or arbitrary component trees.',
    'Only recommend explicit preference updates, bounded context patches, and approved variant hints.',
    'Stay inside the declared surface schema.',
    'If the user asks for something unsupported, keep the response safe and explain the limitation.',
    'Prefer explicit preference updates when the user clearly states a durable preference.',
    'Use variant hints only when the surface already declares those variants.',
    'Return strict JSON only. Do not wrap the answer in markdown.'
  ].join(' ');
}

export function createAdaptiveIntentPrompt(input: AdaptiveIntentInput) {
  const surfaceSummary = {
    surfaceId: input.surface.id,
    label: input.surface.label,
    zones: Object.entries(input.surface.zones).map(([zoneName, zone]) => ({
      zoneName,
      label: zone.label,
      kind: zone.kind ?? 'content',
      defaultVariant: zone.defaultVariant,
      variants: Object.entries(zone.variants).map(([variantId, variant]) => ({
        variantId,
        component: variant.component,
        description: variant.description ?? '',
        traits: variant.traits ?? {}
      }))
    }))
  };

  const currentState = {
    explicit: input.userProfile.explicit,
    learned: input.userProfile.learned,
    context: {
      deviceCategory: input.context.deviceCategory,
      pointerType: input.context.pointerType,
      inputModality: input.context.inputModality,
      viewport: input.context.viewport,
      system: input.context.system,
      route: input.context.route
    },
    currentPlan: input.currentPlan
      ? {
          layoutMode: input.currentPlan.layoutMode,
          disclosureLevel: input.currentPlan.disclosureLevel,
          transitionMode: input.currentPlan.transitionMode,
          zones: Object.fromEntries(
            Object.entries(input.currentPlan.zones).map(([zoneName, zone]) => [
              zoneName,
              zone.variantId
            ])
          )
        }
      : null
  };

  return [
    `User request language: ${input.language ?? 'unknown'}`,
    `User request: ${input.userRequest}`,
    'Allowed response shape:',
    stringifyJson({
      summary: 'short summary',
      message_to_user: 'brief product-facing explanation',
      reasoning: ['reason 1', 'reason 2'],
      confidence: 0.82,
      preference_updates: {
        density: 'compact',
        defaultView: 'chart'
      },
      context_patch: {
        deviceCategory: 'mobile'
      },
      variant_hints: {
        primaryNav: 'commandNav',
        mainContent: 'chartPowerView'
      },
      unsupported_requests: [],
      suggested_prompts: ['prompt 1', 'prompt 2']
    }),
    'Surface schema summary:',
    stringifyJson(surfaceSummary),
    'Current adaptive state:',
    stringifyJson(currentState),
    'Important constraints:',
    '- explicit settings must remain understandable and safe',
    '- do not invent zones or variants',
    '- do not propose hidden critical actions',
    '- respect accessibility and reduced-motion expectations',
    '- keep the result inside the surface contract'
  ].join('\n\n');
}
