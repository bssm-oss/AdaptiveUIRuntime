export const ADAPTIVE_INTENT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'summary',
    'message_to_user',
    'reasoning',
    'confidence',
    'preference_updates',
    'context_patch',
    'variant_hints',
    'unsupported_requests',
    'suggested_prompts'
  ],
  properties: {
    summary: { type: 'string' },
    message_to_user: { type: 'string' },
    reasoning: {
      type: 'array',
      items: { type: 'string' }
    },
    confidence: {
      type: 'number',
      minimum: 0,
      maximum: 1
    },
    preference_updates: {
      type: 'object',
      additionalProperties: false,
      properties: {
        theme: { type: 'string', enum: ['light', 'dark', 'system'] },
        density: {
          type: 'string',
          enum: ['compact', 'comfortable', 'auto']
        },
        motion: { type: 'string', enum: ['full', 'reduced', 'none'] },
        contrast: {
          type: 'string',
          enum: ['normal', 'more', 'less', 'system']
        },
        navMode: {
          type: 'string',
          enum: ['sidebar', 'tabs', 'bottom', 'command', 'auto']
        },
        expertise: {
          type: 'string',
          enum: ['novice', 'regular', 'expert', 'auto']
        },
        contentMode: {
          type: 'string',
          enum: ['summary', 'detailed', 'progressive', 'auto']
        },
        defaultView: {
          type: 'string',
          enum: ['table', 'chart', 'cards', 'auto']
        },
        layoutBias: {
          type: 'string',
          enum: ['focus', 'overview', 'compare', 'auto']
        },
        pinnedModules: {
          type: 'array',
          items: { type: 'string' }
        },
        hiddenOptionalModules: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    },
    context_patch: {
      type: 'object',
      additionalProperties: false,
      properties: {
        viewport: {
          type: 'object',
          additionalProperties: false,
          required: ['width', 'height'],
          properties: {
            width: { type: 'number', minimum: 240 },
            height: { type: 'number', minimum: 320 }
          }
        },
        deviceCategory: {
          type: 'string',
          enum: ['mobile', 'tablet', 'desktop']
        },
        pointerType: {
          type: 'string',
          enum: ['fine', 'coarse', 'none']
        },
        inputModality: {
          type: 'string',
          enum: ['mouse', 'touch', 'keyboard', 'mixed']
        },
        reducedMotion: { type: 'boolean' },
        highContrast: { type: 'boolean' }
      }
    },
    variant_hints: {
      type: 'object',
      additionalProperties: {
        type: 'string'
      }
    },
    unsupported_requests: {
      type: 'array',
      items: { type: 'string' }
    },
    suggested_prompts: {
      type: 'array',
      items: { type: 'string' }
    }
  }
} as const;
