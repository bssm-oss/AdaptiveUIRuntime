import type { SurfaceSchema } from '@adaptive-ui/core';
import {
  createAdaptiveIntentInstructions,
  createAdaptiveIntentPrompt
} from './prompt';
import type {
  AdaptiveIntentApplyHandlers,
  AdaptiveIntentCompiler,
  AdaptiveIntentCompilerOptions,
  AdaptiveIntentInput,
  AdaptiveIntentRecommendation,
  AppliedAdaptiveIntent
} from './types';
import {
  MANUAL_KEYS,
  createContextPatch,
  normalizeAdaptiveIntentRecommendation
} from './validate';

function parseRecommendationJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    const fencedMatch = text.match(/```json\s*([\s\S]+?)```/i);
    if (fencedMatch?.[1]) {
      return JSON.parse(fencedMatch[1]);
    }
    throw new Error('The LLM response did not contain valid JSON.');
  }
}

export function createAdaptiveIntentCompiler(
  options: AdaptiveIntentCompilerOptions
): AdaptiveIntentCompiler {
  return {
    async compile<TSurface extends SurfaceSchema>(
      input: AdaptiveIntentInput<TSurface>
    ): Promise<AdaptiveIntentRecommendation<TSurface['id']>> {
      const rawText = await options.transport.generateText({
        instructions: createAdaptiveIntentInstructions(),
        input: createAdaptiveIntentPrompt(input),
        ...(options.model ? { model: options.model } : {})
      });

      const rawRecommendation = parseRecommendationJson(rawText);
      return normalizeAdaptiveIntentRecommendation(
        input.surface,
        input.userRequest,
        rawRecommendation
      ) as AdaptiveIntentRecommendation<TSurface['id']>;
    }
  };
}

export function applyAdaptiveIntentRecommendation(
  recommendation: AdaptiveIntentRecommendation,
  handlers: AdaptiveIntentApplyHandlers
): AppliedAdaptiveIntent {
  const updatedPreferences: AppliedAdaptiveIntent['updatedPreferences'] = [];

  for (const key of MANUAL_KEYS) {
    const nextValue = recommendation.preferenceUpdates[key];
    if (nextValue !== undefined) {
      switch (key) {
        case 'theme':
        case 'density':
        case 'motion':
        case 'contrast':
        case 'navMode':
        case 'expertise':
        case 'contentMode':
        case 'defaultView':
        case 'layoutBias':
          handlers.updateExplicitPreference(key, nextValue);
          break;
      }
      updatedPreferences.push(key);
    }
  }

  const patch = createContextPatch(
    handlers.currentContext,
    recommendation.contextPatch
  );
  const patchedContext = Object.keys(patch).length > 0;

  if (patchedContext) {
    handlers.patchContext(patch);
  }

  return {
    updatedPreferences,
    patchedContext,
    variantHints: recommendation.variantHints
  };
}
