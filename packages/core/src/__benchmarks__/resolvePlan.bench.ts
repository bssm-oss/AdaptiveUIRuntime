import { bench, describe } from 'vitest';
import { resolvePlan } from '../engine';
import {
  createTestContext,
  createTestProfile,
  testSurface
} from '../__tests__/fixtures';

describe('resolvePlan benchmark', () => {
  bench('resolves a plan for a medium surface', () => {
    resolvePlan({
      surface: testSurface,
      userProfile: createTestProfile(),
      context: createTestContext()
    });
  });
});
