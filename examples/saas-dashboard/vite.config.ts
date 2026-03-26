import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@adaptive-ui/core': fileURLToPath(
        new URL('../../packages/core/src/index.ts', import.meta.url)
      ),
      '@adaptive-ui/llm': fileURLToPath(
        new URL('../../packages/llm/src/index.ts', import.meta.url)
      ),
      '@adaptive-ui/llm/openai': fileURLToPath(
        new URL('../../packages/llm/src/openai.ts', import.meta.url)
      ),
      '@adaptive-ui/react': fileURLToPath(
        new URL('../../packages/react/src/index.ts', import.meta.url)
      ),
      '@adaptive-ui/devtools': fileURLToPath(
        new URL('../../packages/devtools/src/index.ts', import.meta.url)
      )
    }
  }
});
