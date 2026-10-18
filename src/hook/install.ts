// oxlint-disable no-console
import { exec } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { packageName } from "../common";

// oxlint-disable-next-line typescript/strict-void-return
const promisifiedExec = promisify(exec);

const { stdout: rawGitRepositoryRoot } = await promisifiedExec(
	"git rev-parse --show-toplevel",
);
const gitRepositoryRoot = rawGitRepositoryRoot.trim();
const gitRoot = path.join(gitRepositoryRoot.trim(), ".git");
const packageJson = await fs.readFile(
	path.join(gitRepositoryRoot, "package.json"),
	"utf8",
);
const { name } = JSON.parse(packageJson) as { name: string };
const isSelf = name === packageName;

const HOOK_CONTENT = [
	"#!/bin/bash",
	`node ${isSelf ? "." : `./node_modules/${packageName}`}/dist/hook/pre-commit.mjs`,
].join("\n");

const preCommitPath = path.join(gitRoot, "/hooks/pre-commit");

let oldHook = "";
const preCommitExists = await fs
	.stat(preCommitPath)
	.then(() => true)
	.catch(() => false);
if (preCommitExists) {
	const preCommitStats = await fs.lstat(preCommitPath);
	if (preCommitStats.isSymbolicLink()) {
		console.log("Detected an existing git pre-commit hook");
		await fs.unlink(preCommitPath);
	} else {
		oldHook = await fs.readFile(preCommitPath, "utf8");
		if (oldHook !== HOOK_CONTENT) {
			console.log(`Found git path: "${gitRoot}"`);
			console.log("Detected an existing git pre-commit hook");
			await fs.writeFile(`${preCommitPath}.old`, oldHook);
		}
	}
}

if (oldHook !== HOOK_CONTENT) {
	console.log(`Found git path: "${gitRoot}"`);
	await fs.writeFile(preCommitPath, HOOK_CONTENT, { mode: 0o755 });
	console.log("Hook saved");
}
