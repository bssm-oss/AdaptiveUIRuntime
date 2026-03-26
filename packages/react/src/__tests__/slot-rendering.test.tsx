import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createExpertInitialProfile, ReactHarness } from './fixtures';

describe('AdaptiveSlot', () => {
  it('renders the expert variant when the initial profile demands it', () => {
    render(<ReactHarness initialProfile={createExpertInitialProfile()} />);

    expect(screen.getByText('Expert hero')).toBeInTheDocument();
  });
});
