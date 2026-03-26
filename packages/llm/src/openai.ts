import OpenAI from 'openai';
import { createAdaptiveIntentCompiler } from './compiler';
import type {
  AdaptiveIntentCompiler,
  AdaptiveIntentTextTransport
} from './types';

export interface OpenAIAdaptiveTransportOptions {
  apiKey?: string;
  model?: string;
  reasoningEffort?: 'low' | 'medium' | 'high';
  client?: OpenAI;
}

export function createOpenAIAdaptiveTransport(
  options: OpenAIAdaptiveTransportOptions = {}
): AdaptiveIntentTextTransport {
  const client =
    options.client ??
    new OpenAI({
      apiKey: options.apiKey
    });

  return {
    name: 'openai-responses',
    async generateText(request) {
      const response = await client.responses.create({
        model: request.model ?? options.model ?? 'gpt-5.4',
        ...(options.reasoningEffort
          ? { reasoning: { effort: options.reasoningEffort } }
          : {}),
        instructions: request.instructions,
        input: request.input
      });

      return response.output_text;
    }
  };
}

export function createOpenAIAdaptiveIntentCompiler(
  options: OpenAIAdaptiveTransportOptions = {}
): AdaptiveIntentCompiler {
  return createAdaptiveIntentCompiler({
    transport: createOpenAIAdaptiveTransport(options),
    ...(options.model ? { model: options.model } : {})
  });
}
