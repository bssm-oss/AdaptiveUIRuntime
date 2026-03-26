import { summarizePlan } from './planner';
import type { AdaptationPlan, PlanExplanation } from './types';

export function explainPlan(plan: AdaptationPlan): PlanExplanation {
  return summarizePlan(plan);
}
