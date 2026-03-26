import { findPreviousVariant } from './guards';
import type { RankedVariant, SurfaceSchema, ZoneSchema } from './types';

export const DEFAULT_HYSTERESIS_THRESHOLD = 6;
export const DEFAULT_NAV_COOLDOWN_MS = 120_000;

export interface StabilityGuardInput {
  surface: SurfaceSchema;
  zoneName: string;
  zone: ZoneSchema;
  rankedVariants: RankedVariant[];
  previousZoneVariantId?: string;
  previousCooldownUntil?: number;
  now: number;
}

export interface StabilityGuardResult {
  winner: RankedVariant;
  keptPrevious: boolean;
  reason?: string;
  cooldownUntil?: number;
}

export function applyStabilityGuard(
  input: StabilityGuardInput
): StabilityGuardResult {
  const [winner] = input.rankedVariants;
  if (!winner) {
    throw new Error(
      `No ranked variants were provided for zone ${input.zoneName}.`
    );
  }

  const previous = findPreviousVariant(
    input.rankedVariants,
    input.previousZoneVariantId
  );
  if (
    !previous ||
    !previous.eligible ||
    previous.variantId === winner.variantId
  ) {
    return {
      winner,
      keptPrevious: false,
      ...(input.zone.kind === 'navigation' && winner.eligible
        ? {
            cooldownUntil:
              input.now +
              (input.surface.policies?.navCooldownMs ?? DEFAULT_NAV_COOLDOWN_MS)
          }
        : input.previousCooldownUntil
          ? {
              cooldownUntil: input.previousCooldownUntil
            }
          : {})
    };
  }

  const hysteresisThreshold =
    input.surface.policies?.hysteresisThreshold ?? DEFAULT_HYSTERESIS_THRESHOLD;
  const delta = winner.score - previous.score;

  if (delta < hysteresisThreshold) {
    return {
      winner: previous,
      keptPrevious: true,
      reason: `Hysteresis kept ${previous.variantId} because delta ${delta.toFixed(2)} is below ${hysteresisThreshold}.`,
      ...(input.previousCooldownUntil
        ? { cooldownUntil: input.previousCooldownUntil }
        : {})
    };
  }

  if (
    input.zone.kind === 'navigation' &&
    input.previousCooldownUntil &&
    input.previousCooldownUntil > input.now
  ) {
    return {
      winner: previous,
      keptPrevious: true,
      reason: `Navigation cooldown kept ${previous.variantId} until ${new Date(input.previousCooldownUntil).toISOString()}.`,
      cooldownUntil: input.previousCooldownUntil
    };
  }

  return {
    winner,
    keptPrevious: false,
    ...(input.zone.kind === 'navigation'
      ? {
          cooldownUntil:
            input.now +
            (input.surface.policies?.navCooldownMs ?? DEFAULT_NAV_COOLDOWN_MS)
        }
      : input.previousCooldownUntil
        ? {
            cooldownUntil: input.previousCooldownUntil
          }
        : {})
  };
}
