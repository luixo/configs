import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

if (process.env.CI) {
	process.exit(0);
}

const readName = (dir) => {
	try {
		// oxlint-disable-next-line typescript/no-unsafe-argument
		const fileContent = readFileSync(path.join(dir, "package.json"), "utf8");
		// oxlint-disable-next-line typescript/no-unsafe-return typescript/no-unsafe-member-access
		return JSON.parse(fileContent).name;
	} catch {
		return undefined;
	}
};

// oxlint-disable-next-line typescript/no-unsafe-assignment
const ownName = readName(process.cwd());

let gitRoot = "";
try {
	gitRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
		encoding: "utf8",
		stdio: ["ignore", "pipe", "ignore"],
	}).trim();
} catch {
	process.exit(0);
}

const [cmd, ...args] =
	readName(gitRoot) === ownName
		? ["bun", "src/hook/install.ts"]
		: ["node", "dist/hook/install.mjs"];

const result = spawnSync(cmd, args, { stdio: "inherit" });
process.exit(result.status ?? 1);
