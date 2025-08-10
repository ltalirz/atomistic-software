import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Also process JSX in .js files
      include: [/\.jsx?$/, /\.tsx?$/],
    }),
  ],
  // Treat Markdown files as static assets so they can be fetched at runtime
  assetsInclude: ["**/*.md"],
  // For GitHub Pages with a custom domain (CNAME), base can remain '/'
  base: "/",
});
