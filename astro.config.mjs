import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.rt35manggar.my.id',
  integrations: [
    react(),
    tailwind(),
    sitemap()
  ],
  vite: {
    ssr: {
      noExternal: ['lucide-react', 'recharts']
    }
  }
});
