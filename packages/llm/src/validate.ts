import type {
  ContextSnapshot,
  ExplicitPreferences,
  ManualPreferenceKey,
  SurfaceSchema
} from '@adaptive-ui/core';
import type {
  AdaptiveIntentContextPatch,
  AdaptiveIntentRecommendation
} from './types';

const THEME_VALUES = new Set<ExplicitPreferences['theme']>([
  'light',
  'dark',
  'system'
]);
const DENSITY_VALUES = new Set<ExplicitPreferences['density']>([
  'compact',
  'comfortable',
  'auto'
]);
const MOTION_VALUES = new Set<ExplicitPreferences['motion']>([
  'full',
  'reduced',
  'none'
]);
const CONTRAST_VALUES = new Set<ExplicitPreferences['contrast']>([
  'normal',
  'more',
  'less',
  'system'
]);
const NAV_VALUES = new Set<ExplicitPreferences['navMode']>([
  'sidebar',
  'tabs',
  'bottom',
  'command',
  'auto'
]);
const EXPERTISE_VALUES = new Set<ExplicitPreferences['expertise']>([
  'novice',
  'regular',
  'expert',
  'auto'
]);
const CONTENT_VALUES = new Set<ExplicitPreferences['contentMode']>([
  'summary',
  'detailed',
  'progressive',
  'auto'
]);
const DEFAULT_VIEW_VALUES = new Set<ExplicitPreferences['defaultView']>([
  'table',
  'chart',
  'cards',
  'auto'
]);
const LAYOUT_VALUES = new Set<ExplicitPreferences['layoutBias']>([
  'focus',
  'overview',
  'compare',
  'auto'
]);

const MANUAL_KEYS: ManualPreferenceKey[] = [
  'theme',
  'density',
  'motion',
  'contrast',
  'navMode',
  'expertise',
  'contentMode',
  'defaultView',
  'layoutBias'
];

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function sanitizePreferenceUpdates(raw: unknown) {
  const preferenceUpdates: Partial<ExplicitPreferences> = {};
  if (!isObject(raw)) {
    return preferenceUpdates;
  }

  if (THEME_VALUES.has(raw.theme as ExplicitPreferences['theme'])) {
    preferenceUpdates.theme = raw.theme as ExplicitPreferences['theme'];
  }
  if (DENSITY_VALUES.has(raw.density as ExplicitPreferences['density'])) {
    preferenceUpdates.density = raw.density as ExplicitPreferences['density'];
  }
  if (MOTION_VALUES.has(raw.motion as ExplicitPreferences['motion'])) {
    preferenceUpdates.motion = raw.motion as ExplicitPreferences['motion'];
  }
  if (CONTRAST_VALUES.has(raw.contrast as ExplicitPreferences['contrast'])) {
    preferenceUpdates.contrast =
      raw.contrast as ExplicitPreferences['contrast'];
  }
  if (NAV_VALUES.has(raw.navMode as ExplicitPreferences['navMode'])) {
    preferenceUpdates.navMode = raw.navMode as ExplicitPreferences['navMode'];
  }
  if (EXPERTISE_VALUES.has(raw.expertise as ExplicitPreferences['expertise'])) {
    preferenceUpdates.expertise =
      raw.expertise as ExplicitPreferences['expertise'];
  }
  if (
    CONTENT_VALUES.has(raw.contentMode as ExplicitPreferences['contentMode'])
  ) {
    preferenceUpdates.contentMode =
      raw.contentMode as ExplicitPreferences['contentMode'];
  }
  if (
    DEFAULT_VIEW_VALUES.has(
      raw.defaultView as ExplicitPreferences['defaultView']
    )
  ) {
    preferenceUpdates.defaultView =
      raw.defaultView as ExplicitPreferences['defaultView'];
  }
  if (LAYOUT_VALUES.has(raw.layoutBias as ExplicitPreferences['layoutBias'])) {
    preferenceUpdates.layoutBias =
      raw.layoutBias as ExplicitPreferences['layoutBias'];
  }
  if (Array.isArray(raw.pinnedModules)) {
    preferenceUpdates.pinnedModules = raw.pinnedModules.filter(
      (item): item is string => typeof item === 'string'
    );
  }
  if (Array.isArray(raw.hiddenOptionalModules)) {
    preferenceUpdates.hiddenOptionalModules = raw.hiddenOptionalModules.filter(
      (item): item is string => typeof item === 'string'
    );
  }

  return preferenceUpdates;
}

function sanitizeContextPatch(raw: unknown): AdaptiveIntentContextPatch {
  const contextPatch: AdaptiveIntentContextPatch = {};
  if (!isObject(raw)) {
    return contextPatch;
  }

  if (
    isObject(raw.viewport) &&
    typeof raw.viewport.width === 'number' &&
    typeof raw.viewport.height === 'number'
  ) {
    contextPatch.viewport = {
      width: raw.viewport.width,
      height: raw.viewport.height
    };
  }

  if (
    raw.deviceCategory === 'mobile' ||
    raw.deviceCategory === 'tablet' ||
    raw.deviceCategory === 'desktop'
  ) {
    contextPatch.deviceCategory = raw.deviceCategory;
  }

  if (
    raw.pointerType === 'fine' ||
    raw.pointerType === 'coarse' ||
    raw.pointerType === 'none'
  ) {
    contextPatch.pointerType = raw.pointerType;
  }

  if (
    raw.inputModality === 'mouse' ||
    raw.inputModality === 'touch' ||
    raw.inputModality === 'keyboard' ||
    raw.inputModality === 'mixed'
  ) {
    contextPatch.inputModality = raw.inputModality;
  }

  if (typeof raw.reducedMotion === 'boolean') {
    contextPatch.reducedMotion = raw.reducedMotion;
  }

  if (typeof raw.highContrast === 'boolean') {
    contextPatch.highContrast = raw.highContrast;
  }

  return contextPatch;
}

function sanitizeVariantHints(
  surface: SurfaceSchema,
  raw: unknown,
  unsupportedRequests: string[]
) {
  const variantHints: Record<string, string> = {};
  if (!isObject(raw)) {
    return variantHints;
  }

  for (const [zoneName, variantId] of Object.entries(raw)) {
    if (typeof variantId !== 'string') {
      continue;
    }

    const zone = surface.zones[zoneName];
    if (!zone) {
      unsupportedRequests.push(`Unknown zone requested: ${zoneName}`);
      continue;
    }

    if (!zone.variants[variantId]) {
      unsupportedRequests.push(
        `Variant ${variantId} is not declared for zone ${zoneName}.`
      );
      continue;
    }

    variantHints[zoneName] = variantId;
  }

  return variantHints;
}

export function normalizeAdaptiveIntentRecommendation(
  surface: SurfaceSchema,
  request: string,
  raw: unknown
): AdaptiveIntentRecommendation {
  const unsupportedRequests: string[] = [];
  const parsed = isObject(raw) ? raw : {};

  return {
    surfaceId: surface.id,
    request,
    summary:
      typeof parsed.summary === 'string'
        ? parsed.summary
        : 'Safe adaptive recommendation generated.',
    messageToUser:
      typeof parsed.message_to_user === 'string'
        ? parsed.message_to_user
        : 'The runtime prepared a safe screen recommendation inside the approved surface contract.',
    reasoning: Array.isArray(parsed.reasoning)
      ? parsed.reasoning.filter(
          (item): item is string => typeof item === 'string'
        )
      : [],
    confidence:
      typeof parsed.confidence === 'number' &&
      Number.isFinite(parsed.confidence) &&
      parsed.confidence >= 0 &&
      parsed.confidence <= 1
        ? parsed.confidence
        : 0.5,
    preferenceUpdates: sanitizePreferenceUpdates(parsed.preference_updates),
    contextPatch: sanitizeContextPatch(parsed.context_patch),
    variantHints: sanitizeVariantHints(
      surface,
      parsed.variant_hints,
      unsupportedRequests
    ),
    unsupportedRequests: [
      ...unsupportedRequests,
      ...(Array.isArray(parsed.unsupported_requests)
        ? parsed.unsupported_requests.filter(
            (item): item is string => typeof item === 'string'
          )
        : [])
    ],
    suggestedPrompts: Array.isArray(parsed.suggested_prompts)
      ? parsed.suggested_prompts.filter(
          (item): item is string => typeof item === 'string'
        )
      : []
  };
}

export function createContextPatch(
  currentContext: ContextSnapshot,
  contextPatch: AdaptiveIntentContextPatch
): Partial<ContextSnapshot> {
  const patch: Partial<ContextSnapshot> = {};

  if (contextPatch.viewport) {
    patch.viewport = contextPatch.viewport;
  }
  if (contextPatch.deviceCategory) {
    patch.deviceCategory = contextPatch.deviceCategory;
  }
  if (contextPatch.pointerType) {
    patch.pointerType = contextPatch.pointerType;
  }
  if (contextPatch.inputModality) {
    patch.inputModality = contextPatch.inputModality;
  }
  if (
    contextPatch.reducedMotion !== undefined ||
    contextPatch.highContrast !== undefined
  ) {
    patch.system = {
      ...currentContext.system,
      ...(contextPatch.reducedMotion !== undefined
        ? { reducedMotion: contextPatch.reducedMotion }
        : {}),
      ...(contextPatch.highContrast !== undefined
        ? { contrast: contextPatch.highContrast ? 'more' : 'normal' }
        : {})
    };
  }

  return patch;
}

export { MANUAL_KEYS };
