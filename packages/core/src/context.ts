import type {
  ContextSnapshot,
  DeviceCategory,
  PointerType,
  ResolvedContrast,
  ResolvedTheme,
  SystemPreferencesSnapshot
} from './types';

const DEFAULT_SYSTEM: SystemPreferencesSnapshot = {
  colorScheme: 'light',
  contrast: 'normal',
  reducedMotion: false,
  pointer: 'fine',
  viewTransitions: false
};

export function deriveDeviceCategory(width: number): DeviceCategory {
  if (width < 768) {
    return 'mobile';
  }

  if (width < 1024) {
    return 'tablet';
  }

  return 'desktop';
}

export function normalizeThemeFromSystem(value?: ResolvedTheme): ResolvedTheme {
  return value ?? DEFAULT_SYSTEM.colorScheme;
}

export function normalizeContrastFromSystem(
  value?: ResolvedContrast
): ResolvedContrast {
  return value ?? DEFAULT_SYSTEM.contrast;
}

export function normalizePointer(pointer?: PointerType): PointerType {
  return pointer ?? DEFAULT_SYSTEM.pointer;
}

export function createContextSnapshot<SurfaceId extends string = string>(
  partial: Partial<ContextSnapshot<SurfaceId>>
): ContextSnapshot<SurfaceId> {
  const viewportWidth = partial.viewport?.width ?? 1280;
  const viewportHeight = partial.viewport?.height ?? 800;
  const system = {
    ...DEFAULT_SYSTEM,
    ...partial.system
  };

  return {
    surfaceId: (partial.surfaceId ?? 'surface.unknown') as SurfaceId,
    route: partial.route ?? '/',
    viewport: {
      width: viewportWidth,
      height: viewportHeight
    },
    containers: partial.containers ?? {},
    deviceCategory:
      partial.deviceCategory ?? deriveDeviceCategory(viewportWidth),
    pointerType: partial.pointerType ?? normalizePointer(system.pointer),
    inputModality: partial.inputModality ?? 'mouse',
    locale: partial.locale ?? 'en-US',
    timezone: partial.timezone ?? 'UTC',
    sessionPhase: partial.sessionPhase ?? 'first-visit',
    featureFlags: partial.featureFlags ?? {},
    networkIndependentHints: partial.networkIndependentHints ?? {},
    serverHints: partial.serverHints ?? {},
    system: {
      ...system,
      colorScheme: normalizeThemeFromSystem(system.colorScheme),
      contrast: normalizeContrastFromSystem(system.contrast)
    },
    timestamp: partial.timestamp ?? Date.now()
  };
}

export function mergeContextSnapshot<SurfaceId extends string = string>(
  current: ContextSnapshot<SurfaceId>,
  patch: Partial<ContextSnapshot<SurfaceId>>
): ContextSnapshot<SurfaceId> {
  return createContextSnapshot({
    ...current,
    ...patch,
    viewport: {
      ...current.viewport,
      ...patch.viewport
    },
    containers: {
      ...current.containers,
      ...patch.containers
    },
    system: {
      ...current.system,
      ...patch.system
    },
    featureFlags: {
      ...current.featureFlags,
      ...patch.featureFlags
    },
    networkIndependentHints: {
      ...current.networkIndependentHints,
      ...patch.networkIndependentHints
    },
    serverHints: {
      ...current.serverHints,
      ...patch.serverHints
    }
  });
}
