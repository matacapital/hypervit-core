import { EnvValidationException } from "./EnvValidationException.ts";
import { Collection, EnvSchema, File, ICollection } from "./deps.ts";
import { parseEnv } from "./parseEnv.ts";
import { DotEnvValueType } from "./types.ts";

export const loadEnv = (): ICollection<string, DotEnvValueType> => {
  const data = new Collection<string, DotEnvValueType>();

  let envData: Record<string, DotEnvValueType> = {
    APP_ENV: "local",
    LOCALE: "en",
    COUNTRY: "United States",
    VERSION: "1.0.0",
    SECRET: crypto.randomUUID(),
    DEBUG: true,
    PORT: 3000,
    HOST: "localhost",
    CHARSET: "utf-8",
    HASH: "06ab5a12afe58b3",
  };

  for (
    const key of [
      ".env",
      ".env.local",
      ".env.example",
      ".env.defaults",
      ".env.test",
    ]
  ) {
    const file = new File(key);
    if (file.exists()) {
      envData = { ...envData, ...parseEnv(file.read()) };
    }
  }

  const result = EnvSchema.safeParse(envData);

  if (!result.success) {
    const error = result.error.issues[0];

    throw new EnvValidationException(
      `${error.path.join(".")}: ${error.message}`,
    );
  }

  data.setData(envData);

  for (const [key, value] of data) {
    Deno.env.set(`${key}`, `${value}`);
  }

  return data;
};
