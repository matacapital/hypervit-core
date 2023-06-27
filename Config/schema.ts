import { z } from "./deps.ts";

export const ConfigSchema = z.object({
  copy: z.record(z.string()).optional(),
  inject: z.object({
    styles: z.string().array().optional(),
    scripts: z.string().array().optional(),
  }).optional(),
});
