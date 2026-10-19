import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { GeneratedWorkflowTypes } from "@github-actions-workflow-ts/lib";
import { NormalJob, Step, Workflow } from "@github-actions-workflow-ts/lib";
import { stringify } from "yaml";

export {
	NormalJob,
	ReusableWorkflowCallJob,
	Step,
	Workflow,
	dedentString,
	expressions,
} from "@github-actions-workflow-ts/lib";
export type { GeneratedWorkflowTypes } from "@github-actions-workflow-ts/lib";

type CompositeStep = GeneratedWorkflowTypes.Step &
	({ uses: string } | { run: string; shell: string });

export type CompositeAction = {
	name: string;
	description: string;
	runs: { using: "composite"; steps: CompositeStep[] };
};

export const setupEnvAction = (): CompositeAction => ({
	name: "Runtime setup",
	description: "Setup runtime",
	runs: {
		using: "composite",
		steps: [
			{
				name: "Setup Node.js",
				uses: "actions/setup-node@v7",
				with: { "node-version-file": "package.json" },
			},
			{
				name: "Setup Bun",
				uses: "oven-sh/setup-bun@v2",
				with: { "bun-version-file": "package.json" },
			},
			{
				name: "Install dependencies",
				run: "bun install --frozen-lockfile",
				shell: "bash",
			},
		],
	},
});

export const updatePackagesWorkflow = () =>
	new Workflow("update-packages", {
		name: "Update major packages",
		on: {
			schedule: [{ cron: "0 0 * * 1" }],
			workflow_dispatch: {},
		},
		permissions: { contents: "write", "pull-requests": "write" },
		concurrency: { group: "update-packages", "cancel-in-progress": true },
	}).addJob(
		new NormalJob("update", {
			name: "Check for major package updates",
			"runs-on": "ubuntu-26.04",
			env: {
				GH_TOKEN: "${{ github.token }}",
				BRANCH: "chore/weekly-package-updates",
				TITLE: "Weekly package updates",
			},
		}).addSteps([
			new Step({ uses: "actions/checkout@v7", with: { ref: "main" } }),
			new Step({
				uses: "oven-sh/setup-bun@v2",
				with: { "bun-version-file": "package.json" },
			}),
			new Step({
				name: "Find and apply package updates",
				id: "updates",
				env: {
					REPORT: "${{ runner.temp }}/package-updates.txt",
					BODY: "${{ runner.temp }}/package-updates.md",
				},
				run: `workspace_args=()
if bun -e 'process.exit(require("./package.json").workspaces ? 0 : 1)'; then
  workspace_args+=(--workspaces)
fi
bunx --yes npm-check-updates "\${workspace_args[@]}" --packageManager bun --dep prod,dev,optional --format group -u > "$REPORT"

if git diff --quiet; then
  echo "updated=false" >> "$GITHUB_OUTPUT"
  echo "All dependencies are up to date." >> "$GITHUB_STEP_SUMMARY"
else
  echo "updated=true" >> "$GITHUB_OUTPUT"
  bun install --lockfile-only
  {
    echo '## Suggested major package updates'
    echo
    echo 'Includes all workspaces and the root catalog. Review major upgrades and patched dependencies before merging.'
    echo
    echo '\`\`\`text'
    cat "$REPORT"
    echo '\`\`\`'
    echo
    echo "[Workflow run]($GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID)"
  } > "$BODY"
  cat "$BODY" >> "$GITHUB_STEP_SUMMARY"
fi
`,
			}),
			new Step({
				name: "Find existing PR by title",
				id: "pr",
				run: `prs=$(gh pr list --state open --limit 1000 --json number,title,headRefName)
branch=$(jq -r --arg title "$TITLE" \\
  '[.[] | select(.title == $title) | .headRefName][0] // empty' <<< "$prs")
if [ -n "$branch" ] && [ "$branch" != "$BRANCH" ]; then
  echo "An open PR named '$TITLE' uses unexpected branch '$branch'." >&2
  exit 1
fi
pr=$(jq -r --arg title "$TITLE" \\
  '[.[] | select(.title == $title) | .number][0] // empty' <<< "$prs")
echo "number=$pr" >> "$GITHUB_OUTPUT"
`,
			}),
			new Step({
				name: "Publish updates",
				if: "steps.updates.outputs.updated == 'true'",
				env: {
					PR_NUMBER: "${{ steps.pr.outputs.number }}",
					BODY: "${{ runner.temp }}/package-updates.md",
				},
				run: `git config user.name 'github-actions[bot]'
git config user.email 'github-actions[bot]@users.noreply.github.com'
git switch -c "$BRANCH"
git add -u
git commit -m 'Chore: update packages'

# Only replace the branch if it has not changed since we looked it up.
previous=$(git ls-remote origin "refs/heads/$BRANCH" | cut -f1)
git push --force-with-lease="refs/heads/$BRANCH:$previous" origin "HEAD:refs/heads/$BRANCH"

if [ -n "$PR_NUMBER" ]; then
  gh pr edit "$PR_NUMBER" --body-file "$BODY"
else
  gh pr create --base main --head "$BRANCH" --title "$TITLE" --body-file "$BODY"
fi
`,
			}),
			new Step({
				name: "Close stale PR",
				if: "steps.updates.outputs.updated == 'false' && steps.pr.outputs.number != ''",
				env: { PR_NUMBER: "${{ steps.pr.outputs.number }}" },
				run: "gh pr close \"$PR_NUMBER\" --comment 'All dependencies are up to date.'",
			}),
		]),
	);

export const generateWorkflows = async ({
	workflows = [],
	actions = {},
	directory = ".",
	check = false,
}: {
	workflows?: Workflow[];
	actions?: Record<string, CompositeAction>;
	directory?: string;
	check?: boolean;
}) => {
	const files = new Map<string, string>();
	const addFile = (
		name: string | undefined,
		filePath: string,
		value: unknown,
	) => {
		if (!name || !/^[\w-]+$/u.test(name)) {
			throw new Error(`Invalid generated file name: ${name}`);
		}
		if (files.has(filePath)) {
			throw new Error(`Duplicate generated file: ${filePath}`);
		}
		files.set(
			filePath,
			`# Generated by @oxiul/configs/workflows. Do not edit.\n${stringify(value, { lineWidth: 0 })}`,
		);
	};
	for (const workflow of workflows) {
		if (workflow.outputPath) {
			throw new Error("Use directory instead of Workflow.outputPath");
		}
		addFile(
			workflow.filename,
			`.github/workflows/${workflow.filename}.yml`,
			workflow.workflow,
		);
	}
	for (const [name, action] of Object.entries(actions)) {
		addFile(name, `.github/actions/${name}/action.yml`, action);
	}
	for (const [filePath, content] of files) {
		const target = path.resolve(directory, filePath);
		if (check) {
			const actual = await readFile(target, "utf8").catch((error: unknown) => {
				if (
					error instanceof Error &&
					"code" in error &&
					error.code === "ENOENT"
				) {
					return undefined;
				}
				throw error;
			});
			if (actual !== content) {
				throw new Error(`Generated file is out of date: ${filePath}`);
			}
		} else {
			await mkdir(path.dirname(target), { recursive: true });
			await writeFile(target, content);
		}
	}
};
