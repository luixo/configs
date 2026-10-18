import { z } from "zod";

export const configSchema = z
	.object({
		preCommitCommands: z.string().array(),
	})
	.partial();
export type Config = z.infer<typeof configSchema>;
