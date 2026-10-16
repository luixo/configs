import type { defineConfig } from "oxfmt";

export const config: ReturnType<typeof defineConfig> = {
  printWidth: 80,
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  astro: true,
  sortImports: true,
  sortPackageJson: true,
  ignorePatterns: [".history/", "dist/", "bun.lock"],
} as const;
