export const Keys = {
  App: {
    Type: Symbol.for(`app-type-${crypto.randomUUID()}`),
    RootDir: Symbol.for(`app-root-${crypto.randomUUID()}`),
  },
  Config: {
    App: Symbol.for(`config-app-${crypto.randomUUID()}`),
  },
  Env: {
    Default: Symbol.for(`env-default-${crypto.randomUUID()}`),
    Helper: Symbol.for(`env-helper-${crypto.randomUUID()}`),
  },
  Router: Symbol.for(`router-${crypto.randomUUID()}`),
  Routes: Symbol.for(`routes-${crypto.randomUUID()}`),
  Controller: {
    Default: Symbol.for(`controller-default-${crypto.randomUUID()}`),
    NotFound: Symbol.for(`controller-notFound-${crypto.randomUUID()}`),
    ServerError: Symbol.for(`controller-serverError-${crypto.randomUUID()}`),
  },
  AbortController: Symbol.for(`abortController${crypto.randomUUID()}`),
  Internal: {
    // For parameter decorators
    Parameters: Symbol.for(`internal-parameters-${crypto.randomUUID()}`),
  },
};
