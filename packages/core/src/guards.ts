import type {
  EligibilityResult,
  RankedVariant,
  ResolvePlanInput,
  VariantRuleContext,
  VariantSchema
} from './types';

function toEligibilityResult(
  value: boolean | EligibilityResult
): EligibilityResult {
  return typeof value === 'boolean' ? { eligible: value } : value;
}

export function evaluateVariantEligibility(
  input: ResolvePlanInput,
  zoneName: string,
  variantId: string,
  variant: VariantSchema,
  baseContext: VariantRuleContext
): EligibilityResult {
  if (input.accountPolicy?.blockedVariants?.includes(variantId)) {
    return {
      eligible: false,
      reason: `Blocked by account policy: ${variantId}.`
    };
  }

  const requiredVariant = input.accountPolicy?.requiredVariants?.[zoneName];
  if (requiredVariant && requiredVariant !== variantId) {
    return {
      eligible: false,
      reason: `Zone ${zoneName} is pinned to ${requiredVariant} by account policy.`
    };
  }

  for (const constraint of input.surface.hardConstraints ?? []) {
    const result = toEligibilityResult(constraint.check(baseContext));
    if (!result.eligible) {
      return {
        eligible: false,
        reason: result.reason ?? `${constraint.label} rejected this variant.`
      };
    }
  }

  for (const predicate of variant.eligibility ?? []) {
    const result = toEligibilityResult(predicate(baseContext));
    if (!result.eligible) {
      return {
        eligible: false,
        reason: result.reason ?? `Variant ${variantId} is not eligible.`
      };
    }
  }

  return { eligible: true };
}

export function findPreviousVariant(
  rankedVariants: RankedVariant[],
  previousVariantId?: string
): RankedVariant | undefined {
  if (!previousVariantId) {
    return undefined;
  }

  return rankedVariants.find(
    (candidate) => candidate.variantId === previousVariantId
  );
}
