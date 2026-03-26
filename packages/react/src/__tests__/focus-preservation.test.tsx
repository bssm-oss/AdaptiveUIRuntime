import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { OverrideButton, ReactHarness } from './fixtures';

describe('focus preservation', () => {
  it('keeps focus on the triggering control during adaptation', () => {
    render(
      <ReactHarness>
        <OverrideButton />
      </ReactHarness>
    );

    const button = screen.getByText('Switch to expert');
    button.focus();
    fireEvent.click(button);
    expect(document.activeElement).toBe(button);
    expect(screen.getByText('Expert hero')).toBeInTheDocument();
  });
});
