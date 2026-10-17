import type { OxfmtConfig } from "oxfmt";

type ConfigOptions = OxfmtConfig & {
	tailwind?: {
		stylesheet: string;
		functions?: string[];
	};
	imports?: Exclude<OxfmtConfig["sortImports"], boolean>;
};

export const getConfig = async ({
	ignorePatterns = [],
	tailwind,
	imports,
	sortImports,
	...rest
	// We might introduce something async later
	// oxlint-disable-next-line typescript/require-await
}: ConfigOptions = {}) =>
	({
		astro: true,
		ignorePatterns: [".history/", "bun.lock", ...ignorePatterns],
		printWidth: 80,
		semi: true,
		singleQuote: false,
		sortImports:
			sortImports ??
			(imports
				? {
						newlinesBetween: false,
						order: "asc",
						...imports,
					}
				: true),
		sortPackageJson: true,
		sortTailwindcss: tailwind
			? {
					functions: tailwind.functions,
					stylesheet: tailwind.stylesheet,
				}
			: undefined,
		tabWidth: 2,
		trailingComma: "all",
		useTabs: true,
		...rest,
	}) as const satisfies OxfmtConfig;
