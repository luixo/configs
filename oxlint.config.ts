import { getConfig } from "./src/oxlint.ts";

export default getConfig({
	env: {
		bun: true,
		node: true,
	},
	overrides: [
		{
			files: ["src/workflows.ts", "workflows.config.ts"],
			rules: {
				// Keep generated YAML in the conventional workflow key order.
				"no-template-curly-in-string": "off",
				"sort-keys": "off",
			},
		},
		{
			files: ["src/hook/**"],
			rules: {
				"node/no-top-level-await": "off",
			},
		},
		{
			files: ["workflows.config.ts"],
			rules: { "node/no-top-level-await": "off" },
		},
		{
			files: ["scripts/postinstall.mjs"],
			rules: {
				"node/no-process-env": "off",
				"node/no-sync": "off",
				"node/no-top-level-await": "off",
				"unicorn/no-process-exit": "off",
			},
		},
	],
	rules: {
		// We'll migrate to a namespace later
		"import/no-relative-parent-imports": "off",
	},
	serverSide: {
		files: ["src/**", "scripts/**"],
	},
});
