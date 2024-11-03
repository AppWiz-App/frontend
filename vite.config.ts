import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { config } from 'dotenv';
import svgr from 'vite-plugin-svgr';

// Load environment variables from .env file
config();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          // other Babel plugins
          [
            '@locator/babel-jsx/dist',
            {
              env: 'development',
            },
          ],
        ],
      },
    }),
    svgr({ include: '**/*.svg' }),
  ],
  define: {
    'process.env': process.env,
  },
});
