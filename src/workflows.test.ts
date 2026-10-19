import { afterEach, expect, test } from "bun:test";
import { rejects } from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { parse } from "yaml";

import {
	NormalJob,
	Step,
	Workflow,
	generateWorkflows,
	setupEnvAction,
	updatePackagesWorkflow,
} from "./workflows.ts";

const directories: string[] = [];
afterEach(async () => {
	await Promise.all(
		directories
			.splice(0)
			.map((directory) => rm(directory, { force: true, recursive: true })),
	);
});
const temporaryDirectory = async () => {
	const directory = await mkdtemp(path.join(tmpdir(), "oxiul-workflows-"));
	directories.push(directory);
	return directory;
};

test("generates shared and project workflows plus a composite action deterministically", async () => {
	const directory = await temporaryDirectory();
	const custom = new Workflow("ci", { name: "CI", on: "pull_request" }).addJob(
		new NormalJob("test", { "runs-on": "ubuntu-latest" }).addStep(
			new Step({ run: "bun test" }),
		),
	);
	const options = {
		actions: { "setup-env": setupEnvAction() },
		directory,
		workflows: [updatePackagesWorkflow(), custom],
	};
	await generateWorkflows(options);
	await generateWorkflows({ ...options, check: true });
	const readYaml = async (filePath: string): Promise<unknown> =>
		parse(await readFile(path.join(directory, filePath), "utf8"));
	expect(await readYaml(".github/workflows/ci.yml")).toEqual(custom.workflow);
	expect(await readYaml(".github/workflows/update-packages.yml")).toEqual(
		updatePackagesWorkflow().workflow,
	);
	expect(await readYaml(".github/actions/setup-env/action.yml")).toEqual(
		setupEnvAction(),
	);
	await writeFile(
		path.join(directory, ".github/workflows/ci.yml"),
		"changed\n",
	);
	await rejects(generateWorkflows({ ...options, check: true }), /out of date/u);
	expect(
		await readFile(path.join(directory, ".github/workflows/ci.yml"), "utf8"),
	).toBe("changed\n");
});

test("check rejects missing outputs without creating them", async () => {
	await rejects(
		generateWorkflows({
			check: true,
			directory: await temporaryDirectory(),
			workflows: [updatePackagesWorkflow()],
		}),
		/out of date/u,
	);
});

test("rejects unsafe and duplicate output names before writing", async () => {
	const directory = await temporaryDirectory();
	for (const name of ["../outside", "", "/absolute", "a/b"]) {
		await rejects(
			generateWorkflows({ actions: { [name]: setupEnvAction() }, directory }),
			/Invalid/u,
		);
	}
	await rejects(
		generateWorkflows({
			directory,
			workflows: [updatePackagesWorkflow(), updatePackagesWorkflow()],
		}),
		/Duplicate/u,
	);
});

test("factories return independent instances", () => {
	const first = updatePackagesWorkflow();
	first.addEnvs({ CUSTOM: "value" });
	expect(updatePackagesWorkflow().workflow.env).toBeUndefined();
	const action = setupEnvAction();
	const originalSteps = [...action.runs.steps];
	action.runs.steps.length = 0;
	expect(setupEnvAction().runs.steps).toEqual(originalSteps);
});

test("package updates select workspace flags only for monorepos", async () => {
	const directory = await temporaryDirectory();
	const job = updatePackagesWorkflow().workflow.jobs?.update;
	const steps = job && "steps" in job ? job.steps : undefined;
	const updateScript = steps?.find((step) => step.id === "updates")?.run;
	if (!updateScript) {
		throw new Error("Missing package update script");
	}
	const [command] = updateScript.split("\n\n");
	for (const workspaces of [undefined, ["packages/*"]]) {
		await writeFile(
			path.join(directory, "package.json"),
			JSON.stringify({ workspaces }),
		);
		// execFile returns a child process as well as invoking its completion callback.
		// oxlint-disable-next-line typescript/strict-void-return
		await promisify(execFile)(
			"bash",
			[
				"-e",
				"-c",
				`REPORT="${directory}/report"\nbunx() { printf '%s\\n' "$@"; }\n${command}`,
			],
			{
				cwd: directory,
				encoding: "utf8",
			},
		);
		const report = await readFile(path.join(directory, "report"), "utf8");
		const args = report.split("\n");
		expect(args.includes("--workspaces")).toBe(Boolean(workspaces));
	}
});
