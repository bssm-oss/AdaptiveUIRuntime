import type {
  BehaviorEvent,
  BehaviorSummary,
  LearnedPreferences,
  UserProfile
} from './types';

export const DEFAULT_BEHAVIOR_SUMMARY: BehaviorSummary = {
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
};

export function createBehaviorSummary(
  partial?: Partial<BehaviorSummary>
): BehaviorSummary {
  return {
    ...DEFAULT_BEHAVIOR_SUMMARY,
    ...partial,
    widgetCollapses: {
      ...DEFAULT_BEHAVIOR_SUMMARY.widgetCollapses,
      ...partial?.widgetCollapses
    },
    widgetExpansions: {
      ...DEFAULT_BEHAVIOR_SUMMARY.widgetExpansions,
      ...partial?.widgetExpansions
    },
    moduleDismissals: {
      ...DEFAULT_BEHAVIOR_SUMMARY.moduleDismissals,
      ...partial?.moduleDismissals
    }
  };
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, Number(value.toFixed(4))));
}

export function trackBehaviorEvent(
  summary: BehaviorSummary,
  event: BehaviorEvent
): BehaviorSummary {
  const timestamp = event.timestamp ?? Date.now();
  const next = createBehaviorSummary(summary);

  switch (event.type) {
    case 'surface_viewed':
      next.viewCount += 1;
      break;
    case 'chart_interaction':
      next.chartInteractions += 1;
      break;
    case 'table_interaction':
      next.tableInteractions += 1;
      break;
    case 'keyboard_shortcut':
      next.keyboardShortcuts += 1;
      break;
    case 'quick_action_used':
      next.quickActionUses += 1;
      break;
    case 'command_palette_opened':
      next.commandPaletteUses += 1;
      break;
    case 'detail_expanded':
      next.detailExpansions += 1;
      break;
    case 'widget_collapsed':
      if (event.moduleId) {
        next.widgetCollapses[event.moduleId] =
          (next.widgetCollapses[event.moduleId] ?? 0) + 1;
      }
      break;
    case 'widget_expanded':
      if (event.moduleId) {
        next.widgetExpansions[event.moduleId] =
          (next.widgetExpansions[event.moduleId] ?? 0) + 1;
      }
      break;
    case 'module_dismissed':
      if (event.moduleId) {
        next.moduleDismissals[event.moduleId] =
          (next.moduleDismissals[event.moduleId] ?? 0) + 1;
      }
      break;
  }

  next.lastInteractionAt = timestamp;
  return next;
}

export function inferLearnedPreferences(
  profile: UserProfile,
  behavior: BehaviorSummary
): LearnedPreferences {
  const views = Math.max(1, behavior.viewCount);
  const detailRate = behavior.detailExpansions / views;
  const chartRate =
    behavior.chartInteractions /
    Math.max(1, behavior.chartInteractions + behavior.tableInteractions);
  const keyboardRate = behavior.keyboardShortcuts / views;
  const commandRate = behavior.commandPaletteUses / views;
  const quickActionsRate = behavior.quickActionUses / views;
  const collapseCount = Object.values(behavior.widgetCollapses).reduce(
    (sum, count) => sum + count,
    0
  );
  const expansionCount = Object.values(behavior.widgetExpansions).reduce(
    (sum, count) => sum + count,
    0
  );
  const stabilitySignal = expansionCount >= collapseCount ? 0.78 : 0.42;

  return {
    prefersDenseUI: clamp01(
      (profile.learned.prefersDenseUI + keyboardRate + quickActionsRate) / 3
    ),
    prefersSummary: clamp01(
      (profile.learned.prefersSummary + (1 - detailRate)) / 2
    ),
    prefersCharts: clamp01((profile.learned.prefersCharts + chartRate) / 2),
    prefersKeyboardFlow: clamp01(
      (profile.learned.prefersKeyboardFlow + keyboardRate) / 2
    ),
    prefersQuickActions: clamp01(
      (profile.learned.prefersQuickActions + quickActionsRate) / 2
    ),
    prefersCommandPalette: clamp01(
      (profile.learned.prefersCommandPalette + commandRate) / 2
    ),
    prefersExploration: clamp01(
      (profile.learned.prefersExploration + detailRate) / 2
    ),
    prefersStableLayout: clamp01(
      (profile.learned.prefersStableLayout + stabilitySignal) / 2
    )
  };
}
