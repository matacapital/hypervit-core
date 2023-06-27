import { Collection } from "../Collection/Collection.ts";

export const Container = new Collection();
export const Keys = {
  Config: {
    App: `config-app-${crypto.randomUUID()}`,
  },
  Env: {
    Default: `env-default-${crypto.randomUUID()}`,
    Helper: `env-helper-${crypto.randomUUID()}`,
  },
};
