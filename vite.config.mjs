import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const srcDirectory = path.resolve(fileURLToPath(new URL('./src', import.meta.url)));

export default defineConfig({
  plugins: [react()],
  base: '/toolbox/',
  resolve: {
    alias: {
      assets: path.join(srcDirectory, 'assets'),
      components: path.join(srcDirectory, 'components'),
      context: path.join(srcDirectory, 'context'),
      data: path.join(srcDirectory, 'data'),
      hooks: path.join(srcDirectory, 'hooks'),
      pages: path.join(srcDirectory, 'pages'),
      utils: path.join(srcDirectory, 'utils'),
    },
  },
  build: {
    outDir: 'build',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});
