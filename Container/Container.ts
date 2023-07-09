import { Collection } from "./deps.ts";

export const Container = new Collection();
export const Keys = {
  Config: {
    App: `config-app-${crypto.randomUUID()}`,
  },
  Env: {
    Default: `env-default-${crypto.randomUUID()}`,
    Helper: `env-helper-${crypto.randomUUID()}`,
  },
  Routes: `routes-${crypto.randomUUID()}`,
};
