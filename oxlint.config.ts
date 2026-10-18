import { getConfig } from "./src/oxlint.ts";

export default getConfig({
	env: {
		bun: true,
		node: true,
	},
	overrides: [
		{
			files: ["src/hook/**"],
			rules: {
				"node/no-top-level-await": "off",
			},
		},
	],
	rules: {
		// We'll migrate to a namespace later
		"import/no-relative-parent-imports": "off",
	},
	serverSide: {
		files: ["src/**"],
	},
});
