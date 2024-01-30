import { defineConfig } from 'astro/config';
import react from "@astrojs/react";

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: 'https://brandonslp.github.io',
  vite: {
    ssr: {
      noExternal: ["react-icons", "@mui/*", "@emotion/*"],
    },
  },
  base: '/susesos-app',
  integrations: [react(), tailwind()]
});