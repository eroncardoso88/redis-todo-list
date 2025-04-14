// @ts-check
import react from '@astrojs/react';
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from 'astro/config';
import { fileURLToPath, URL } from 'node:url';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [
      tailwindcss()
    ],
    resolve: {
      alias: [
        // Map '@/' to the project root directory
        {
          find: '@/',
          // Use import.meta.url to get the current file's URL,
          // resolve '.' (current directory, which is project root for config file),
          // and convert it to a file path.
          replacement: fileURLToPath(new URL('.', import.meta.url))
        }
        // You could add more aliases here if needed, e.g.,
        // {
        //   find: '@components/',
        //   replacement: fileURLToPath(new URL('./src/components/', import.meta.url))
        // },
      ],
    },
  }
});
