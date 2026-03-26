import type {
  AccountPolicy,
  EffectivePreferences,
  ExplicitPreferences,
  LayoutBiasPreference,
  PreferenceResolutionSources,
  ResolvedContentMode,
  ResolvedDefaultView,
  ResolvedDensity,
  ResolvedLayoutBias,
  ResolvedNavMode,
  ResolvedPreferenceValues,
  TraceEntry,
  UserProfile
} from './types';

const PROFILE_VERSION = 1;

export const DEFAULT_EXPLICIT_PREFERENCES: ExplicitPreferences = {
  theme: 'system',
  density: 'auto',
  motion: 'full',
  contrast: 'system',
  navMode: 'auto',
  expertise: 'auto',
  contentMode: 'auto',
  defaultView: 'auto',
  layoutBias: 'auto',
  pinnedModules: [],
  hiddenOptionalModules: []
};

export const DEFAULT_LEARNED_PREFERENCES = {
  prefersDenseUI: 0.5,
  prefersSummary: 0.5,
  prefersCharts: 0.5,
  prefersKeyboardFlow: 0.5,
  prefersQuickActions: 0.5,
  prefersCommandPalette: 0.5,
  prefersExploration: 0.5,
  prefersStableLayout: 0.8
};

export function createUserProfile(partial?: Partial<UserProfile>): UserProfile {
  return {
    explicit: {
      ...DEFAULT_EXPLICIT_PREFERENCES,
      ...partial?.explicit,
      pinnedModules:
        partial?.explicit?.pinnedModules ??
        DEFAULT_EXPLICIT_PREFERENCES.pinnedModules,
      hiddenOptionalModules:
        partial?.explicit?.hiddenOptionalModules ??
        DEFAULT_EXPLICIT_PREFERENCES.hiddenOptionalModules
    },
    learned: {
      ...DEFAULT_LEARNED_PREFERENCES,
      ...partial?.learned
    },
    metadata: {
      lastUpdated: partial?.metadata?.lastUpdated ?? Date.now(),
      version: partial?.metadata?.version ?? PROFILE_VERSION,
      source: partial?.metadata?.source ?? 'merged'
    }
  };
}

export function serializeProfile(profile: UserProfile): string {
  return JSON.stringify(profile);
}

export function hydrateProfile(
  data: string | Partial<UserProfile>
): UserProfile {
  const parsed =
    typeof data === 'string'
      ? (JSON.parse(data) as Partial<UserProfile>)
      : data;
  return createUserProfile(parsed);
}

function resolveTheme(
  profile: UserProfile,
  trace: TraceEntry[],
  sources: PreferenceResolutionSources,
  systemTheme: 'light' | 'dark'
) {
  if (profile.explicit.theme !== 'system') {
    sources.theme = 'explicit';
    trace.push({
      id: 'pref-theme-explicit',
      label: 'Theme',
      detail: `Explicit theme preference selected ${profile.explicit.theme}.`,
      source: 'explicit'
    });
    return profile.explicit.theme;
  }

  sources.theme = 'system';
  return systemTheme;
}

function resolveContrast(
  profile: UserProfile,
  trace: TraceEntry[],
  sources: PreferenceResolutionSources,
  systemContrast: 'normal' | 'more' | 'less'
) {
  if (profile.explicit.contrast !== 'system') {
    sources.contrast = 'explicit';
    trace.push({
      id: 'pref-contrast-explicit',
      label: 'Contrast',
      detail: `Explicit contrast preference selected ${profile.explicit.contrast}.`,
      source: 'explicit'
    });
    return profile.explicit.contrast;
  }

  sources.contrast = 'system';
  return systemContrast;
}

function resolveDensity(
  profile: UserProfile,
  accountPolicy: AccountPolicy | undefined,
  sources: PreferenceResolutionSources,
  trace: TraceEntry[]
): ResolvedDensity {
  if (profile.explicit.density !== 'auto') {
    sources.density = 'explicit';
    trace.push({
      id: 'pref-density-explicit',
      label: 'Density',
      detail: `Explicit density preference selected ${profile.explicit.density}.`,
      source: 'explicit'
    });
    return profile.explicit.density;
  }

  if (
    accountPolicy?.preferences?.density &&
    accountPolicy.preferences.density !== 'auto'
  ) {
    sources.density = 'policy';
    return accountPolicy.preferences.density;
  }

  if (profile.learned.prefersDenseUI > 0.58) {
    sources.density = 'learned';
    return 'compact';
  }

  sources.density = 'default';
  return 'comfortable';
}

function resolveExpertise(
  profile: UserProfile,
  accountPolicy: AccountPolicy | undefined,
  sources: PreferenceResolutionSources
): 'novice' | 'regular' | 'expert' {
  if (profile.explicit.expertise !== 'auto') {
    sources.expertise = 'explicit';
    return profile.explicit.expertise;
  }

  if (
    accountPolicy?.preferences?.expertise &&
    accountPolicy.preferences.expertise !== 'auto'
  ) {
    sources.expertise = 'policy';
    return accountPolicy.preferences.expertise;
  }

  if (profile.learned.prefersKeyboardFlow > 0.62) {
    sources.expertise = 'learned';
    return 'expert';
  }

  if (profile.learned.prefersExploration > 0.64) {
    sources.expertise = 'learned';
    return 'novice';
  }

  sources.expertise = 'default';
  return 'regular';
}

function resolveNavMode(
  profile: UserProfile,
  accountPolicy: AccountPolicy | undefined,
  sources: PreferenceResolutionSources,
  deviceCategory: 'mobile' | 'tablet' | 'desktop'
): ResolvedNavMode {
  if (profile.explicit.navMode !== 'auto') {
    sources.navMode = 'explicit';
    return profile.explicit.navMode;
  }

  if (
    accountPolicy?.preferences?.navMode &&
    accountPolicy.preferences.navMode !== 'auto'
  ) {
    sources.navMode = 'policy';
    return accountPolicy.preferences.navMode;
  }

  if (deviceCategory === 'mobile') {
    sources.navMode = 'session';
    return 'bottom';
  }

  if (
    profile.learned.prefersCommandPalette > 0.67 ||
    profile.learned.prefersKeyboardFlow > 0.68
  ) {
    sources.navMode = 'learned';
    return 'command';
  }

  sources.navMode = 'default';
  return 'sidebar';
}

function resolveContentMode(
  profile: UserProfile,
  sources: PreferenceResolutionSources
): ResolvedContentMode {
  if (profile.explicit.contentMode !== 'auto') {
    sources.contentMode = 'explicit';
    return profile.explicit.contentMode;
  }

  if (profile.learned.prefersSummary > 0.6) {
    sources.contentMode = 'learned';
    return 'summary';
  }

  if (profile.learned.prefersExploration > 0.65) {
    sources.contentMode = 'learned';
    return 'detailed';
  }

  sources.contentMode = 'default';
  return 'progressive';
}

function resolveDefaultView(
  profile: UserProfile,
  sources: PreferenceResolutionSources
): ResolvedDefaultView {
  if (profile.explicit.defaultView !== 'auto') {
    sources.defaultView = 'explicit';
    return profile.explicit.defaultView;
  }

  if (profile.learned.prefersCharts > 0.58) {
    sources.defaultView = 'learned';
    return 'chart';
  }

  if (profile.learned.prefersSummary > 0.64) {
    sources.defaultView = 'learned';
    return 'cards';
  }

  sources.defaultView = 'default';
  return 'table';
}

function resolveLayoutBias(
  preference: LayoutBiasPreference,
  profile: UserProfile,
  sources: PreferenceResolutionSources
): ResolvedLayoutBias {
  if (preference !== 'auto') {
    sources.layoutBias = 'explicit';
    return preference;
  }

  if (profile.learned.prefersCharts > 0.67) {
    sources.layoutBias = 'learned';
    return 'compare';
  }

  if (profile.learned.prefersSummary > 0.62) {
    sources.layoutBias = 'learned';
    return 'overview';
  }

  sources.layoutBias = 'default';
  return 'focus';
}

export function resolveEffectivePreferences(
  profile: UserProfile,
  system: {
    theme: 'light' | 'dark';
    contrast: 'normal' | 'more' | 'less';
    deviceCategory: 'mobile' | 'tablet' | 'desktop';
    reducedMotion: boolean;
  },
  accountPolicy?: AccountPolicy
): EffectivePreferences {
  const trace: TraceEntry[] = [];
  const sources: PreferenceResolutionSources = {
    theme: 'default',
    density: 'default',
    motion: 'default',
    contrast: 'default',
    navMode: 'default',
    expertise: 'default',
    contentMode: 'default',
    defaultView: 'default',
    layoutBias: 'default',
    pinnedModules: 'explicit',
    hiddenOptionalModules: 'explicit'
  };

  const values: ResolvedPreferenceValues = {
    theme: resolveTheme(profile, trace, sources, system.theme),
    density: resolveDensity(profile, accountPolicy, sources, trace),
    motion: system.reducedMotion ? 'none' : profile.explicit.motion,
    contrast: resolveContrast(profile, trace, sources, system.contrast),
    navMode: resolveNavMode(
      profile,
      accountPolicy,
      sources,
      system.deviceCategory
    ),
    expertise: resolveExpertise(profile, accountPolicy, sources),
    contentMode: resolveContentMode(profile, sources),
    defaultView: resolveDefaultView(profile, sources),
    layoutBias: resolveLayoutBias(
      profile.explicit.layoutBias,
      profile,
      sources
    ),
    pinnedModules: profile.explicit.pinnedModules,
    hiddenOptionalModules: profile.explicit.hiddenOptionalModules
  };

  if (system.reducedMotion && values.motion !== 'none') {
    values.motion = 'none';
    sources.motion = 'safety';
    trace.push({
      id: 'safety-reduced-motion',
      label: 'Reduced motion',
      detail: 'System reduced-motion preference disabled runtime transitions.',
      source: 'safety'
    });
  } else if (profile.explicit.motion !== 'full') {
    sources.motion = 'explicit';
  } else {
    sources.motion = 'default';
  }

  return {
    values,
    sources,
    trace
  };
}

export function patchExplicitPreference<TKey extends keyof ExplicitPreferences>(
  profile: UserProfile,
  key: TKey,
  value: ExplicitPreferences[TKey]
): UserProfile {
  return createUserProfile({
    ...profile,
    explicit: {
      ...profile.explicit,
      [key]: value
    },
    metadata: {
      ...profile.metadata,
      lastUpdated: Date.now(),
      source: 'explicit'
    }
  });
}
