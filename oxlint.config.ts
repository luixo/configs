import { getConfig } from "./packages/oxlint/config.ts";

export default getConfig({
	overrides: [
		{
			files: ["packages/oxlint/config.ts"],
			rules: {
				// We actually use await inline to make dependencies optionsl
				"unicorn/no-await-expression-member": "off",
			},
		},
	],
});
