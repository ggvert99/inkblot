import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Настройки для GitHub Pages
  site: 'https://ggvert99.github.io',
  base: '/inkblot',
  output: 'static',
  integrations: [
    react(), // Для Shopify компонентов (корзина, интерактивность)
  ],
  vite: {
    css: {
      // Можно добавить preprocessor options для SCSS если нужно
    }
  }
});
