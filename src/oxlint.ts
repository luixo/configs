import type { OxlintConfig } from "oxlint";

import { baseIgnorePatterns } from "./common.ts";

export const disabledRules: OxlintConfig["rules"] = {
	// We don't care that much
	"eslint/capitalized-comments": "off",
	// Typescript version is typescript/switch-exhaustiveness-check
	"eslint/default-case": "off",
	// It took more time to fight it than to turn it off
	"eslint/id-length": "off",
	// No need to control that
	"eslint/max-lines": "off",
	"eslint/max-lines-per-function": "off",
	"eslint/max-params": "off",
	"eslint/max-statements": "off",
	// I didn't find the case when it helped
	"eslint/no-await-in-loop": "off",
	// We see no evil in continue
	"eslint/no-continue": "off",
	// False positives for type imports
	"eslint/no-duplicate-imports": "off",
	// We definitely use inline comments
	"eslint/no-inline-comments": "off",
	// We see no evil in nested ternaries
	"eslint/no-nested-ternary": "off",
	// We love ternaries
	"eslint/no-ternary": "off",
	// We love undefineds
	"eslint/no-undefined": "off",
	// TODO: fix this one
	"eslint/no-warning-comments": "off",
	// This is extremly outdated
	"eslint/one-var": "off",
	// Controlled by `typescript/require-await`
	"eslint/require-await": "off",

	// We export inline
	"import/exports-last": "off",
	"import/group-exports": "off",
	// We'll care about that ourselves
	"import/max-dependencies": "off",
	// We prefer named exports
	"import/no-named-export": "off",
	// There are a lot of proper usecases of namespace imports
	"import/no-namespace": "off",
	// When we don't assign import module a variable, we mean that
	"import/no-unassigned-import": "off",
	// We prefer named exports
	"import/prefer-default-export": "off",
	// No idea why do we need that
	"import/unambiguous": "off",

	// This is not particulary good, but on out scale it doesn't matter
	"oxc/no-accumulating-spread": "off",
	// We definitely want to use these features
	"oxc/no-async-await": "off",
	// Nah, we're good
	"oxc/no-map-spread": "off",
	// We use a lot of optional chaining
	"oxc/no-optional-chaining": "off",
	// We use a lot of rest spreading
	"oxc/no-rest-spread-properties": "off",

	// We use new Promise when it's necessary
	"promise/avoid-new": "off",
	// There are no good usecases for that, all callbacks are valid
	"promise/prefer-await-to-callbacks": "off",
	// There are false positives on `z.foo().catch()`
	"promise/prefer-await-to-then": "off",

	// These all should be addressed by React Compiler
	"react-perf/jsx-no-jsx-as-prop": "off",
	"react-perf/jsx-no-new-array-as-prop": "off",
	"react-perf/jsx-no-new-function-as-prop": "off",
	"react-perf/jsx-no-new-object-as-prop": "off",

	// We don't really need display names for react components
	"react/display-name": "off",
	// There's a forbid syntax rule for that
	"react/forbid-component-props": "off",
	// We use non-function components most of the time
	"react/function-component-definition": "off",
	// No need for that
	"react/jsx-filename-extension": "off",
	// We'll manage these
	"react/jsx-handler-names": "off",
	// No problem with that
	"react/jsx-max-depth": "off",
	// We extensively spread props: `<Foo {...props} />`
	"react/jsx-props-no-spreading": "off",
	// I guess we're going to decide how many components file can hold
	"react/no-multi-comp": "off",
	// They say fast refresh won't work with these errors. Ok.
	"react/only-export-components": "off",
	// Compilers know how to manage this
	"react/react-in-jsx-scope": "off",

	// This is heavily guarded by typescript itself
	"typescript/consistent-return": "off",
	// Typescript guards us good enough
	"typescript/explicit-function-return-type": "off",
	// We have typescript strict enough to have implicit boundary types
	"typescript/explicit-module-boundary-types": "off",
	// We enjoy confusing fellow developers with void expressions
	// Mainly used for:
	// - returning `void` from a function, assigning that to a value and validating value is undefined
	// - shorthanding functions returns that don't matter (because they're void)
	"typescript/no-confusing-void-expression": "off",
	// That's a weird thing to forbid
	"typescript/no-dynamic-delete": "off",
	// We use a few `void` types around
	"typescript/no-invalid-void-type": "off",
	// Rule emits false positives on `const fn = <T>(value: T) => {...}`
	// see https://github.com/typescript-eslint/typescript-eslint/issues/9667
	"typescript/no-unnecessary-type-parameters": "off",
	// We use type assertions heavily (but with caution)
	"typescript/no-unsafe-type-assertion": "off",
	// `(object | undefined) || number` is assumed incorrect by this rule
	// it should be `(object | undefined) ?? number`
	"typescript/prefer-nullish-coalescing": "off",
	// We don't need readonly parameter types
	"typescript/prefer-readonly-parameter-types": "off",
	// This is replaced by typescript/no-floating-promises
	"typescript/promise-function-async": "off",

	// We've got typescript for that
	"unicorn/no-array-callback-reference": "off",
	// No way we're not using reduce
	"unicorn/no-array-reduce": "off",
	// We see no evil in nested ternaries
	"unicorn/no-nested-ternary": "off",
	// We're going to be using null literals
	"unicorn/no-null": "off",
	// There are too many false positives
	"unicorn/no-useless-undefined": "off",
	// Oxfmt lowercases hex numbers
	"unicorn/number-literal-case": "off",
	// There's no particular reason not to use `window`
	"unicorn/prefer-global-this": "off",
	// This creates more problem that solves
	"unicorn/prefer-spread": "off",

	// We want to run as many expects as needed
	"vitest/max-expects": "off",
	// There are so many valid cases for conditionals in tests
	"vitest/no-conditional-in-test": "off",
	// We need before/after hooks
	"vitest/no-hooks": "off",
	// We import vitest globals
	"vitest/no-importing-vitest-globals": "off",
	// No idea why it triggers on every expect
	"vitest/no-standalone-expect": "off",
	// This conflict with vitest/prefer-called-times
	"vitest/prefer-called-once": "off",
	// We don't need to know amount of assertions in every test
	"vitest/prefer-expect-assertions": "off",
	// This one is not ready for fixtures
	"vitest/prefer-importing-vitest-globals": "off",
	// We'll do titles ourselves
	"vitest/prefer-lowercase-title": "off",
	// This one conflicts with other similar rules
	"vitest/prefer-to-be": "off",
	// These conflict with vitest/prefer-strict-boolean-matchers
	"vitest/prefer-to-be-falsy": "off",
	"vitest/prefer-to-be-truthy": "off",
	// This one does a bad job calculating what a hook is
	"vitest/require-hook": "off",
	// We don't need timeouts for every test
	"vitest/require-test-timeout": "off",
} as const;

const disabledTailwindRules: OxlintConfig["rules"] = {
	// Maintained by formatter
	"better-tailwindcss/enforce-consistent-class-order": "off",
	// This doesn't work out good with formatter
	"better-tailwindcss/enforce-consistent-line-wrapping": "off",
} as const;

export const overridenRules: OxlintConfig["rules"] = {
	// We use a lot of sensible magic numbers
	"eslint/no-magic-numbers": ["error", { ignore: [0, 1, -1] }],
	// `void foo` is a mark of deliberately floating promise
	"eslint/no-void": ["error", { allowAsStatement: true }],
	// We enjoy sorting imports
	"eslint/sort-imports": ["error", { ignoreDeclarationSort: true }],

	// Allow expressions for stuff like `<>{children}</>`
	"react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],

	// Default option is `interface`
	"typescript/consistent-type-definitions": ["error", "type"],
	// We want to pass `() => Promise<void>` to a prop / arg expecting `() => void`
	"typescript/no-misused-promises": [
		"error",
		{
			checksVoidReturn: {
				arguments: false,
				attributes: false,
			},
		},
	],
	// Allowing `while(true)`
	"typescript/no-unnecessary-condition": [
		"error",
		{ allowConstantLoopConditions: true },
	],
	// We want to allow `Amount ${amount}` to be used
	"typescript/restrict-template-expressions": ["error", { allowNumber: true }],
	// We want to be strict, but not too much
	"typescript/strict-boolean-expressions": [
		"error",
		{
			allowNullableBoolean: true,
			allowNullableNumber: true,
			allowNullableString: true,
			allowNumber: true,
			allowString: true,
		},
	],

	// We want to check `foo.length !== 0`, not `foo.length > 0`
	"unicorn/explicit-length-check": ["error", { "non-zero": "not-equal" }],
	// Default 3 is too little
	"unicorn/max-nested-calls": ["error", { max: 5 }],
} as const;

const isNonNull = <T>(data: T | null): data is T => data !== null;

const getTailwindPlugin = () => import("eslint-plugin-better-tailwindcss");
const getTanstackRouterPlugin = () => import("@tanstack/eslint-plugin-router");
const getPackageJsonPlugin = () => import("eslint-plugin-package-json");
const getPlaywrightPlugin = () => import("eslint-plugin-playwright");

type ConfigOptions = {
	rules?: OxlintConfig["rules"];
	env?: OxlintConfig["env"];
	ignorePatterns?: string[];
	options?: OxlintConfig["options"];
	categories?: OxlintConfig["categories"];
	settings?: OxlintConfig["settings"];
	overrides?: OxlintConfig["overrides"];
	jsPlugins?: Exclude<OxlintConfig["jsPlugins"], null>;
	globals?: OxlintConfig["globals"];
	plugins?: {
		tailwind?: {
			config: {
				entryPoint: string;
				callees?: string[];
			};
		};
		packageJson?: true;
		playwright?: {
			files: string[];
			assertFunctionNames?: string[];
		};
		tanstackRouter?: true;
	};
};

export const getConfig = async ({
	plugins: { tailwind, tanstackRouter, packageJson, playwright } = {},
	env: envLocal = {
		browser: true,
		es2026: true,
	},
	ignorePatterns = [],
	overrides = [],
	jsPlugins = [],
	rules,
	options,
	categories,
	settings,
	globals,
}: ConfigOptions = {}): Promise<OxlintConfig> =>
	({
		categories: {
			correctness: "error",
			nursery: "error",
			pedantic: "error",
			perf: "error",
			restriction: "error",
			style: "error",
			suspicious: "error",
			...categories,
		},
		env: envLocal,
		globals,
		ignorePatterns: [...baseIgnorePatterns, ...ignorePatterns],
		jsPlugins: [
			tailwind
				? {
						name: "better-tailwindcss",
						specifier: "eslint-plugin-better-tailwindcss",
					}
				: null,
			tanstackRouter
				? {
						name: "@tanstack/router",
						specifier: "@tanstack/eslint-plugin-router",
					}
				: null,
			packageJson
				? { name: "package-json", specifier: "eslint-plugin-package-json" }
				: null,
			playwright
				? { name: "playwright", specifier: "eslint-plugin-playwright" }
				: null,
			...jsPlugins,
		].filter(isNonNull),
		options: {
			denyWarnings: true,
			reportUnusedDisableDirectives: "error",
			typeAware: true,
			...options,
		},
		overrides: [
			{
				files: ["**/*.config.{j,t}s"],
				rules: {
					// Config files tend to export default
					"import/no-default-export": "off",
					"node/no-top-level-await": "off",
				},
			} satisfies NonNullable<OxlintConfig["overrides"]>[number],
			{
				files: ["**/*.d.ts"],
				rules: {
					// Decalaration files are exactly where triple slash references are used
					"typescript/triple-slash-reference": "off",
				},
			} satisfies NonNullable<OxlintConfig["overrides"]>[number],
			playwright
				? ({
						files: playwright.files,
						rules: {
							...(await getPlaywrightPlugin()).default.configs[
								"flat/recommended"
							].rules,
							...(playwright.assertFunctionNames
								? {
										"playwright/expect-expect": [
											"error",
											{
												assertFunctionNames: playwright.assertFunctionNames,
											},
										] as const,
									}
								: {}),
						},
					} satisfies NonNullable<OxlintConfig["overrides"]>[number])
				: null,
			...overrides,
		].filter(isNonNull),
		plugins: [
			"eslint",
			"react",
			"react-perf",
			"unicorn",
			"typescript",
			"oxc",
			"import",
			"vitest",
			"jsx-a11y",
			"promise",
			"node",
		],
		rules: {
			...(tailwind
				? {
						...Object.fromEntries(
							Object.keys((await getTailwindPlugin()).default.rules).map(
								(key) => [`better-tailwindcss/${key}`, "error"],
							),
						),
						...disabledTailwindRules,
					}
				: {}),
			...(tanstackRouter
				? (await getTanstackRouterPlugin()).default.configs[
						"flat/recommended"
					][0]?.rules
				: {}),
			...(packageJson
				? (await getPackageJsonPlugin()).configs.recommended.rules
				: {}),
			...disabledRules,
			...overridenRules,
			...rules,
		},
		settings: {
			...(tailwind
				? {
						"better-tailwindcss": tailwind.config,
					}
				: {}),
			...settings,
		},
	}) as const satisfies OxlintConfig;
