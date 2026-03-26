import { screen } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { act } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { ReactHarness } from './fixtures';

describe('SSR-safe hydration', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('hydrates without changing the initial markup', async () => {
    const html = renderToString(<ReactHarness />);
    document.body.innerHTML = `<div id="root">${html}</div>`;
    const root = document.getElementById('root');
    if (!root) {
      throw new Error('Root container missing.');
    }

    const before = root.innerHTML;
    let rootHandle: ReturnType<typeof hydrateRoot> | undefined;
    await act(async () => {
      rootHandle = hydrateRoot(root, <ReactHarness />);
      await Promise.resolve();
    });
    expect(root.innerHTML).toBe(before);
    expect(screen.getByText('Novice hero')).toBeInTheDocument();
    await act(async () => {
      rootHandle?.unmount();
    });
  });
});
