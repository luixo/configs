import {
	generateWorkflows,
	setupEnvAction,
	updatePackagesWorkflow,
} from "./src/workflows.ts";

await generateWorkflows({
	workflows: [updatePackagesWorkflow()],
	actions: { "setup-env": setupEnvAction() },
	check: process.argv.includes("--check"),
});
