import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OverrideButton, ReactHarness } from './fixtures';

describe('manual overrides', () => {
  it('applies explicit overrides immediately', () => {
    render(
      <ReactHarness>
        <OverrideButton />
      </ReactHarness>
    );

    fireEvent.click(screen.getByText('Switch to expert'));
    expect(screen.getByText('Expert hero')).toBeInTheDocument();
  });
});
