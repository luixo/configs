import type { Config } from "./src/config/schema";

const config: Config = {
	preCommitCommands: [
		"bun install --frozen-lockfile",
		"bun typecheck",
		"bun lint",
		"bun format:verify",
	],
};

export default config;
