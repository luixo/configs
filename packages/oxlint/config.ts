import type { defineConfig } from "oxlint";

export const config: ReturnType<typeof defineConfig> = {
  categories: {
    correctness: "error",
    nursery: "error",
    pedantic: "error",
    perf: "error",
    restriction: "error",
    style: "error",
    suspicious: "error",
  },
  env: { browser: true, es2026: true },
  ignorePatterns: [".history/**"],
  options: {
    denyWarnings: true,
    reportUnusedDisableDirectives: "error",
    typeAware: true,
  },
  plugins: [
    "eslint",
    "react",
    "unicorn",
    "typescript",
    "oxc",
    "import",
    "vitest",
    "jsx-a11y",
    "react-perf",
    "promise",
    "node",
  ],
  rules: {
    // This is usually too much
    "eslint/sort-keys": "off",
    // We don't need readonly parameter types
    "typescript/prefer-readonly-parameter-types": "off",
    // We export inline
    "import/exports-last": "off",
    // We have multiple exports
    "import/group-exports": "off",
    // We prefer named exports
    "import/prefer-default-export": "off",
    "import/no-named-export": "off",
  },
} as const;
