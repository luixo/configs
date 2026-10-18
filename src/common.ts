export const baseIgnorePatterns = [".history/", "bun.lock", "**/*.gen.ts"];

export const arraify = <T>(input: T | T[] | undefined): T[] =>
	input === undefined ? [] : Array.isArray(input) ? input : [input];
