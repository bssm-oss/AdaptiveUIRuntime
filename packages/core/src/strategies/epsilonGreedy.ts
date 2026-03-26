import type {
  SelectionContext,
  SelectionResult,
  SelectionStrategy
} from '../types';
import { RuleBasedStrategy } from './ruleBased';

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
}

export class OptionalEpsilonGreedyStrategy implements SelectionStrategy {
  readonly name = 'epsilon-greedy';

  constructor(
    private readonly epsilon = 0.1,
    private readonly seed = 'adaptive-ui'
  ) {}

  select(context: SelectionContext): SelectionResult {
    const fallback = new RuleBasedStrategy().select(context);
    const eligible = context.rankedVariants.filter(
      (candidate) => candidate.eligible
    );
    if (eligible.length < 2) {
      return fallback;
    }

    const explorationBucket =
      (hashString(
        `${this.seed}:${context.surface.id}:${context.zoneName}:${context.context.route}:${context.context.timestamp}`
      ) %
        10_000) /
      10_000;

    if (explorationBucket > this.epsilon) {
      return fallback;
    }

    const alternative = eligible[1] ?? eligible[0];
    if (!alternative) {
      return fallback;
    }
    return {
      winner: alternative,
      explored: true,
      trace: {
        id: `strategy-explore-${context.zoneName}`,
        label: 'Exploration branch',
        detail: `Epsilon-greedy explored ${alternative.variantId} with epsilon ${this.epsilon}.`,
        source: 'strategy'
      }
    };
  }
}
