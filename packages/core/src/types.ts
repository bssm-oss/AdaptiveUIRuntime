export type ThemePreference = 'light' | 'dark' | 'system';
export type DensityPreference = 'compact' | 'comfortable' | 'auto';
export type MotionPreference = 'full' | 'reduced' | 'none';
export type ContrastPreference = 'normal' | 'more' | 'less' | 'system';
export type NavModePreference =
  | 'sidebar'
  | 'tabs'
  | 'bottom'
  | 'command'
  | 'auto';
export type ExpertisePreference = 'novice' | 'regular' | 'expert' | 'auto';
export type ContentModePreference =
  | 'summary'
  | 'detailed'
  | 'progressive'
  | 'auto';
export type DefaultViewPreference = 'table' | 'chart' | 'cards' | 'auto';
export type LayoutBiasPreference = 'focus' | 'overview' | 'compare' | 'auto';
export type ResolvedTheme = Exclude<ThemePreference, 'system'>;
export type ResolvedDensity = Exclude<DensityPreference, 'auto'>;
export type ResolvedContrast = Exclude<ContrastPreference, 'system'>;
export type ResolvedNavMode = Exclude<NavModePreference, 'auto'>;
export type ResolvedExpertise = Exclude<ExpertisePreference, 'auto'>;
export type ResolvedContentMode = Exclude<ContentModePreference, 'auto'>;
export type ResolvedDefaultView = Exclude<DefaultViewPreference, 'auto'>;
export type ResolvedLayoutBias = Exclude<LayoutBiasPreference, 'auto'>;
export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';
export type PointerType = 'fine' | 'coarse' | 'none';
export type InputModality = 'mouse' | 'touch' | 'keyboard' | 'mixed';
export type SessionPhase = 'first-visit' | 'returning' | 'deep-session';
export type ProfileSource =
  | 'explicit'
  | 'system'
  | 'learned'
  | 'server'
  | 'merged';
export type PreferenceSource =
  | 'explicit'
  | 'policy'
  | 'learned'
  | 'session'
  | 'default'
  | 'system'
  | 'safety';
export type TransitionMode = 'none' | 'css' | 'view-transition';
export type ZoneKind = 'navigation' | 'content' | 'support' | 'actions';
export type ManualPreferenceKey =
  | 'theme'
  | 'density'
  | 'motion'
  | 'contrast'
  | 'navMode'
  | 'expertise'
  | 'contentMode'
  | 'defaultView'
  | 'layoutBias';

export interface ExplicitPreferences {
  theme: ThemePreference;
  density: DensityPreference;
  motion: MotionPreference;
  contrast: ContrastPreference;
  navMode: NavModePreference;
  expertise: ExpertisePreference;
  contentMode: ContentModePreference;
  defaultView: DefaultViewPreference;
  layoutBias: LayoutBiasPreference;
  pinnedModules: string[];
  hiddenOptionalModules: string[];
}

export interface LearnedPreferences {
  prefersDenseUI: number;
  prefersSummary: number;
  prefersCharts: number;
  prefersKeyboardFlow: number;
  prefersQuickActions: number;
  prefersCommandPalette: number;
  prefersExploration: number;
  prefersStableLayout: number;
}

export interface ProfileMetadata {
  lastUpdated: number;
  version: number;
  source: ProfileSource;
}

export interface UserProfile {
  explicit: ExplicitPreferences;
  learned: LearnedPreferences;
  metadata: ProfileMetadata;
}

export interface SystemPreferencesSnapshot {
  colorScheme: ResolvedTheme;
  contrast: ResolvedContrast;
  reducedMotion: boolean;
  pointer: PointerType;
  viewTransitions: boolean;
}

export interface ContextSnapshot<SurfaceId extends string = string> {
  surfaceId: SurfaceId;
  route: string;
  viewport: {
    width: number;
    height: number;
  };
  containers: Record<string, { width: number; height: number }>;
  deviceCategory: DeviceCategory;
  pointerType: PointerType;
  inputModality: InputModality;
  locale: string;
  timezone: string;
  sessionPhase: SessionPhase;
  featureFlags: Record<string, boolean>;
  networkIndependentHints: Record<string, string | number | boolean>;
  serverHints: Record<string, string | number | boolean>;
  system: SystemPreferencesSnapshot;
  timestamp: number;
}

export interface BehaviorSummary {
  viewCount: number;
  chartInteractions: number;
  tableInteractions: number;
  keyboardShortcuts: number;
  quickActionUses: number;
  commandPaletteUses: number;
  detailExpansions: number;
  widgetCollapses: Record<string, number>;
  widgetExpansions: Record<string, number>;
  moduleDismissals: Record<string, number>;
  lastInteractionAt: number;
}

export type BehaviorEventType =
  | 'surface_viewed'
  | 'chart_interaction'
  | 'table_interaction'
  | 'keyboard_shortcut'
  | 'quick_action_used'
  | 'command_palette_opened'
  | 'detail_expanded'
  | 'widget_collapsed'
  | 'widget_expanded'
  | 'module_dismissed';

export interface BehaviorEvent {
  type: BehaviorEventType;
  surfaceId?: string;
  zoneName?: string;
  moduleId?: string;
  timestamp?: number;
}

export interface AccountPolicy {
  preferences?: Partial<ExplicitPreferences>;
  blockedVariants?: string[];
  requiredVariants?: Record<string, string>;
}

export type DesignTokenOverrides = Record<`--${string}`, string>;

export interface TraceEntry {
  id: string;
  label: string;
  detail: string;
  source: PreferenceSource | 'stability' | 'guard' | 'strategy';
}

export interface ScoreContribution {
  id: string;
  label: string;
  contribution: number;
  status: 'applied' | 'blocked' | 'neutral';
  detail: string;
}

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
}

export interface VariantTraits {
  density?: DensityPreference;
  contentMode?: ContentModePreference;
  navMode?: NavModePreference;
  defaultView?: DefaultViewPreference;
  layoutBias?: LayoutBiasPreference;
  expertise?: ExpertisePreference;
  quickActions?: number;
  onboarding?: number;
  stableLayout?: number;
  touchComfort?: number;
  chartAffinity?: number;
  summaryAffinity?: number;
  keyboardAffinity?: number;
  primaryCtaProminence?: number;
}

export interface VariantRuleContext<SurfaceId extends string = string> {
  surface: SurfaceSchema<SurfaceId>;
  zoneName: string;
  variantId: string;
  userProfile: UserProfile;
  behaviorSummary: BehaviorSummary;
  context: ContextSnapshot<SurfaceId>;
  accountPolicy?: AccountPolicy | undefined;
  effectivePreferences: EffectivePreferences;
  previousPlan?: AdaptationPlan<SurfaceId> | undefined;
}

export interface VariantRule {
  id: string;
  label: string;
  apply(context: VariantRuleContext): number | ScoreContribution | null;
}

export type EligibilityPredicate<SurfaceId extends string = string> = (
  context: VariantRuleContext<SurfaceId>
) => boolean | EligibilityResult;

export interface VariantSchema {
  component: string;
  description?: string;
  baseScore?: number;
  tokenOverrides?: DesignTokenOverrides;
  traits?: VariantTraits;
  eligibility?: EligibilityPredicate[];
  rules?: VariantRule[];
}

export interface ZoneSchema<VariantId extends string = string> {
  label: string;
  kind?: ZoneKind;
  defaultVariant?: VariantId;
  variants: Record<VariantId, VariantSchema>;
}

export interface SurfacePolicies {
  hysteresisThreshold?: number;
  navCooldownMs?: number;
  minConfidenceDelta?: number;
}

export interface SurfaceConstraint<SurfaceId extends string = string> {
  id: string;
  label: string;
  check(context: VariantRuleContext<SurfaceId>): boolean | EligibilityResult;
}

export interface SurfaceSchema<
  SurfaceId extends string = string,
  Zones extends Record<string, ZoneSchema> = Record<string, ZoneSchema>
> {
  id: SurfaceId;
  label: string;
  zones: Zones;
  defaults?: Partial<ResolvedPreferenceValues>;
  tokenPacks?: Record<string, DesignTokenOverrides>;
  policies?: SurfacePolicies;
  hardConstraints?: SurfaceConstraint<SurfaceId>[];
}

export type ZoneName<TSurface extends SurfaceSchema> = keyof TSurface['zones'] &
  string;
export type VariantName<
  TSurface extends SurfaceSchema,
  TZone extends ZoneName<TSurface>
> = keyof TSurface['zones'][TZone]['variants'] & string;

export interface ResolvedPreferenceValues {
  theme: ResolvedTheme;
  density: ResolvedDensity;
  motion: MotionPreference;
  contrast: ResolvedContrast;
  navMode: ResolvedNavMode;
  expertise: ResolvedExpertise;
  contentMode: ResolvedContentMode;
  defaultView: ResolvedDefaultView;
  layoutBias: ResolvedLayoutBias;
  pinnedModules: string[];
  hiddenOptionalModules: string[];
}

export type PreferenceResolutionSources = {
  [K in keyof ResolvedPreferenceValues]: PreferenceSource;
};

export interface EffectivePreferences {
  values: ResolvedPreferenceValues;
  sources: PreferenceResolutionSources;
  trace: TraceEntry[];
}

export interface RankedVariant {
  variantId: string;
  component: string;
  score: number;
  tokenOverrides: DesignTokenOverrides;
  contributions: ScoreContribution[];
  eligible: boolean;
  blockedReason?: string | undefined;
}

export interface ZonePlan {
  zoneName: string;
  variantId: string;
  component: string;
  score: number;
  confidence: number;
  tokenOverrides: DesignTokenOverrides;
  reasoning: TraceEntry[];
  contributions: ScoreContribution[];
  candidates: RankedVariant[];
}

export interface StabilityMetadata {
  frozen: boolean;
  keptPrevious: string[];
  cooldownUntil: Record<string, number>;
  hysteresisThreshold: number;
  reasons: string[];
}

export interface AdaptationPlan<SurfaceId extends string = string> {
  surfaceId: SurfaceId;
  layoutMode: ResolvedLayoutBias;
  disclosureLevel: ResolvedContentMode;
  transitionMode: TransitionMode;
  tokenOverrides: DesignTokenOverrides;
  zones: Record<string, ZonePlan>;
  reasoningTrace: TraceEntry[];
  confidence: number;
  stability: StabilityMetadata;
  exposureIds: string[];
  resolvedPreferences: EffectivePreferences;
  timestamp: number;
}

export interface PlanExplanation {
  summary: string[];
  zones: Record<
    string,
    {
      variantId: string;
      why: string[];
      blocked: string[];
    }
  >;
}

export interface SelectionContext<
  SurfaceId extends string = string
> extends Omit<VariantRuleContext<SurfaceId>, 'variantId'> {
  zone: ZoneSchema;
  rankedVariants: RankedVariant[];
}

export interface SelectionResult {
  winner: RankedVariant;
  explored: boolean;
  trace?: TraceEntry;
}

export interface SelectionStrategy {
  readonly name: string;
  select(context: SelectionContext): SelectionResult;
}

export interface ExperimentAdapter {
  assign(experimentId: string, choices: string[]): string | null;
}

export interface TelemetryEvent {
  type:
    | 'plan_resolved'
    | 'plan_applied'
    | 'preference_updated'
    | 'behavior_tracked'
    | 'plan_exposure';
  timestamp: number;
  surfaceId?: string;
  payload: Record<string, unknown>;
}

export interface TelemetryAdapter {
  emit(event: TelemetryEvent): void;
}

export interface StoredAdaptiveState {
  profile: UserProfile;
  behavior: BehaviorSummary;
}

export interface StorageAdapter {
  load(): StoredAdaptiveState | null;
  save(state: StoredAdaptiveState): void;
  clear(): void;
}

export interface ResolvePlanInput<SurfaceId extends string = string> {
  surface: SurfaceSchema<SurfaceId>;
  userProfile: UserProfile;
  context: ContextSnapshot<SurfaceId>;
  behaviorSummary?: BehaviorSummary | undefined;
  accountPolicy?: AccountPolicy | undefined;
  previousPlan?: AdaptationPlan<SurfaceId> | undefined;
  strategy?: SelectionStrategy | undefined;
  now?: number | undefined;
}

export interface AdaptiveEngineConfig {
  surfaces?: SurfaceSchema[];
  storage?: StorageAdapter;
  telemetry?: TelemetryAdapter;
  selectionStrategy?: SelectionStrategy;
  experimentAdapter?: ExperimentAdapter;
  initialProfile?: Partial<UserProfile>;
  initialBehavior?: Partial<BehaviorSummary>;
  now?: () => number;
  learnedPersistenceThrottleMs?: number;
}

export interface AdaptiveEngineSnapshot {
  profile: UserProfile;
  behavior: BehaviorSummary;
  surfaces: Record<string, SurfaceSchema>;
  plans: Record<string, AdaptationPlan>;
  events: TelemetryEvent[];
  frozenSurfaces: string[];
}

export interface AdaptiveEngine {
  registerSurface(surface: SurfaceSchema): void;
  createBootstrapContext<SurfaceId extends string = string>(
    partial: Partial<ContextSnapshot<SurfaceId>>
  ): ContextSnapshot<SurfaceId>;
  resolvePlan<SurfaceId extends string = string>(
    input: Omit<ResolvePlanInput<SurfaceId>, 'strategy' | 'previousPlan'> & {
      previousPlan?: AdaptationPlan<SurfaceId>;
    }
  ): AdaptationPlan<SurfaceId>;
  applyPlan<SurfaceId extends string = string>(
    plan: AdaptationPlan<SurfaceId>,
    target?: HTMLElement | null
  ): AdaptationPlan<SurfaceId>;
  updateExplicitPreference<TKey extends ManualPreferenceKey>(
    key: TKey,
    value: ExplicitPreferences[TKey]
  ): UserProfile;
  trackBehavior(event: BehaviorEvent): BehaviorSummary;
  explainPlan<SurfaceId extends string = string>(
    plan: AdaptationPlan<SurfaceId>
  ): PlanExplanation;
  serializeProfile(profile?: UserProfile): string;
  hydrateProfile(data: string | Partial<UserProfile>): UserProfile;
  getSnapshot(): AdaptiveEngineSnapshot;
  getProfile(): UserProfile;
  getBehaviorSummary(): BehaviorSummary;
  freezeSurface(surfaceId: string, frozen: boolean): void;
  reset(): void;
}

export interface Collector<TSnapshot> {
  getSnapshot(): TSnapshot;
  subscribe(listener: (snapshot: TSnapshot) => void): () => void;
}
