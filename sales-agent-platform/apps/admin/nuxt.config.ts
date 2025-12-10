import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  ui: {
    colorMode: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/content",
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:3000",
    },
  },
  devServer: {
    port: 5173,
  },
});
