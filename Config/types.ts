import { z } from "./deps.ts";
import { ConfigSchema } from "./schema.ts";

export type AppConfigType = z.infer<typeof ConfigSchema>;
