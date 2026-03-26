import type {
  SelectionContext,
  SelectionResult,
  SelectionStrategy
} from '../types';

export class RuleBasedStrategy implements SelectionStrategy {
  readonly name = 'rule-based';

  select(context: SelectionContext): SelectionResult {
    const winner = context.rankedVariants.find(
      (candidate) => candidate.eligible
    );
    if (!winner) {
      throw new Error(
        `No eligible variants are available for zone ${context.zoneName}.`
      );
    }

    return {
      winner,
      explored: false,
      trace: {
        id: `strategy-${context.zoneName}`,
        label: 'Rule-based selection',
        detail: `Selected ${winner.variantId} as the highest-scoring eligible variant.`,
        source: 'strategy'
      }
    };
  }
}
