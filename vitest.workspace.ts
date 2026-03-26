import { defineWorkspace } from 'vitest/config';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const alias = {
  '@adaptive-ui/core': `${root}packages/core/src/index.ts`,
  '@adaptive-ui/react': `${root}packages/react/src/index.ts`,
  '@adaptive-ui/devtools': `${root}packages/devtools/src/index.ts`,
  '@adaptive-ui/otel': `${root}packages/otel/src/index.ts`
};

export default defineWorkspace([
  {
    resolve: {
      alias
    },
    test: {
      name: 'core',
      environment: 'node',
      include: ['packages/core/src/**/*.test.ts']
    }
  },
  {
    resolve: {
      alias
    },
    test: {
      name: 'react',
      environment: 'jsdom',
      setupFiles: ['packages/react/src/test-setup.ts'],
      include: ['packages/react/src/**/*.test.ts?(x)']
    }
  }
]);
