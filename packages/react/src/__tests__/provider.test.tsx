import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReactHarness } from './fixtures';

describe('AdaptiveProvider', () => {
  it('bootstraps and renders a default slot plan', () => {
    render(<ReactHarness />);
    expect(screen.getByText('Novice hero')).toBeInTheDocument();
  });
});
