import { getConfig } from "./src/oxlint.ts";

export default getConfig({
	overrides: [
		{
			files: ["src/oxlint.ts"],
			rules: {
				// We actually use await inline to make dependencies optional
				"unicorn/no-await-expression-member": "off",
			},
		},
	],
});
