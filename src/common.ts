export const baseIgnorePatterns = [".history/", "bun.lock", "**/*.gen.ts"];

export const arraify = <T>(input: T | T[] | undefined): T[] =>
	input === undefined ? [] : Array.isArray(input) ? input : [input];

// This is our config name etc
export const moduleName = "oxiul";
export const packageName = "@oxiul/configs";
