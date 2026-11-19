import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Keep CRA's old dev port.
    port: 3000,
  },
  build: {
    // The prod workflow uploads ./build to S3, so keep CRA's output folder.
    outDir: 'build',
  },
});
