import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yetongliu.com',
  outDir: process.env.SITE_OUT_DIR ?? './dist',
  publicDir: process.env.SITE_PUBLIC_DIR ?? './public',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
