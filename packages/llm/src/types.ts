import type {
  AdaptationPlan,
  ContextSnapshot,
  DeviceCategory,
  ExplicitPreferences,
  InputModality,
  ManualPreferenceKey,
  PointerType,
  SurfaceSchema,
  UserProfile
} from '@adaptive-ui/core';

export interface AdaptiveIntentContextPatch {
  viewport?: {
    width: number;
    height: number;
  };
  deviceCategory?: DeviceCategory;
  pointerType?: PointerType;
  inputModality?: InputModality;
  reducedMotion?: boolean;
  highContrast?: boolean;
}

export interface AdaptiveIntentRecommendation<
  SurfaceId extends string = string
> {
  surfaceId: SurfaceId;
  request: string;
  summary: string;
  messageToUser: string;
  reasoning: string[];
  confidence: number;
  preferenceUpdates: Partial<ExplicitPreferences>;
  contextPatch: AdaptiveIntentContextPatch;
  variantHints: Record<string, string>;
  unsupportedRequests: string[];
  suggestedPrompts: string[];
}

export interface AdaptiveIntentInput<
  TSurface extends SurfaceSchema = SurfaceSchema
> {
  surface: TSurface;
  userRequest: string;
  userProfile: UserProfile;
  context: ContextSnapshot<TSurface['id']>;
  currentPlan?: AdaptationPlan<TSurface['id']> | undefined;
  language?: string;
}

export interface AdaptiveIntentTextTransportRequest {
  model?: string;
  instructions: string;
  input: string;
}

export interface AdaptiveIntentTextTransport {
  name: string;
  generateText(request: AdaptiveIntentTextTransportRequest): Promise<string>;
}

export interface AdaptiveIntentCompilerOptions {
  transport: AdaptiveIntentTextTransport;
  model?: string;
}

export interface AdaptiveIntentCompiler {
  compile<TSurface extends SurfaceSchema>(
    input: AdaptiveIntentInput<TSurface>
  ): Promise<AdaptiveIntentRecommendation<TSurface['id']>>;
}

export interface AdaptiveIntentApplyHandlers {
  currentContext: ContextSnapshot;
  updateExplicitPreference<TKey extends ManualPreferenceKey>(
    key: TKey,
    value: UserProfile['explicit'][TKey]
  ): void;
  patchContext(patch: Partial<ContextSnapshot>): void;
}

export interface AppliedAdaptiveIntent {
  updatedPreferences: ManualPreferenceKey[];
  patchedContext: boolean;
  variantHints: Record<string, string>;
}
