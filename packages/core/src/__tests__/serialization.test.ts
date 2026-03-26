import { describe, expect, it } from 'vitest';
import { hydrateProfile, serializeProfile } from '../engine';
import { createTestProfile } from './fixtures';

describe('serialization', () => {
  it('serializes and hydrates profiles without losing defaults', () => {
    const profile = createTestProfile();
    profile.explicit.theme = 'dark';
    const hydrated = hydrateProfile(serializeProfile(profile));

    expect(hydrated.explicit.theme).toBe('dark');
    expect(hydrated.learned.prefersStableLayout).toBe(
      profile.learned.prefersStableLayout
    );
  });
});
