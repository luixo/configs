import { defineConfig } from "tsdown";

export default defineConfig({
	attw: {
		level: "error",
		profile: "esm-only",
	},
	deps: {
		neverBundle: true,
	},
	entry: [
		"src/index.ts",
		"src/workflows.ts",
		"src/hook/install.ts",
		"src/hook/pre-commit.ts",
	],
	publint: true,
});
