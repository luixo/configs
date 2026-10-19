# Configs

## Lint config

A shared config for oxlint

## Format config

A shared config for oxfmt

## GitHub Actions

Define shared and project-specific workflows in `workflows.config.ts`:

```ts
import {
	generateWorkflows,
	NormalJob,
	setupEnvAction,
	Step,
	updatePackagesWorkflow,
	Workflow,
} from "@oxiul/configs/workflows";

const ci = new Workflow("ci", { name: "CI", on: "pull_request" }).addJob(
	new NormalJob("check", { "runs-on": "ubuntu-26.04" }).addSteps([
		new Step({ uses: "actions/checkout@v7" }),
		new Step({ uses: "./.github/actions/setup-env" }),
		new Step({ run: "bun test" }),
	]),
);

await generateWorkflows({
	workflows: [updatePackagesWorkflow(), ci],
	actions: { "setup-env": setupEnvAction() },
	check: process.argv.includes("--check"),
});
```

Run `bun workflows.config.ts` and commit the generated YAML. Run
`bun workflows.config.ts --check` in CI to detect missing or outdated output.
The generator writes only the listed files; it does not delete other workflows.
Names are extensionless filenames; workflows go in `.github/workflows`, actions
in `.github/actions/<name>/action.yml`. `directory` selects the project root
(defaults to the current directory); per-workflow `outputPath` is not supported.
The upstream workflow/job/step builders and helpers are re-exported.

`updatePackagesWorkflow()` ports receipt-app's Monday dependency-update workflow:
it opens or updates a PR against `main`, and closes stale PRs when no updates remain.
It supports both single-package repositories and workspace monorepos.
It requires Bun, a `bun.lock`, and repository settings allowing GitHub Actions to
create pull requests. Review upgrades before merging. `setupEnvAction()` ports its
runtime setup, reading Node's `engines.node` and Bun's `packageManager` from
`package.json` instead of requiring `.nvmrc`. Both factories return fresh,
customizable objects. Custom composite actions can use the exported
`CompositeAction` type.

This repository uses `bun run workflows` and `bun run workflows:verify` itself.

## Development

### Prerequisites

- Node.js (from `engines.node` field in `package.json`)
- Bun (from `packageManager` field in `package.json`)
