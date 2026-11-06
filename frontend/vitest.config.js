import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{js,jsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{js,jsx}"],
      exclude: [
        "src/**/*.test.{js,jsx}",
        "src/**/*.jsx",
        "src/shared-theme/**",
        "src/dashboard/**",
        "src/features/shared/useApiResource.js",
      ],
    },
  },
});
