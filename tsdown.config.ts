import { defineConfig } from "tsdown";

export default defineConfig({
	attw: {
		level: "error",
		profile: "esm-only",
	},
	deps: {
		neverBundle: true,
	},
	publint: true,
});
