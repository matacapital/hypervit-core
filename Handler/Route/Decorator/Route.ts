import {
  Directory,
  File,
  Helper,
  MethodDecoratorReturnType,
  z,
} from "../../deps.ts";
import { RouteException } from "../RouteException.ts";
import { RouteDefinitionSchema } from "../schema.ts";
import { RouteDefinitionType, RoutePathType } from "../types.ts";

export const Route = (
  name: z.infer<typeof RouteDefinitionSchema.shape.name>,
  path: RoutePathType,
  _config?: Omit<
    RouteDefinitionType,
    "name" | "path" | "handler"
  >,
): MethodDecoratorReturnType => {
  if (!name) {
    throw new RouteException(`Cannot register route. Name is required`, null, {
      try: `@route("name", "/my-route-path")`,
    });
  }

  if (!path) {
    throw new RouteException(`Cannot register route. Path is required`, null, {
      try: `@route("name", "/my-route-path")`,
    });
  }

  return (
    // deno-lint-ignore ban-types
    target: Object,
    propertyName: string,
    // deno-lint-ignore no-explicit-any
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    if (!target || !propertyName || !Helper.isObject(descriptor)) {
      throw new RouteException(
        `Cannot register route. Available only for class method`,
      );
    }

    const content = "";
    const file = new File(`routes${path}/index.ts`);
    if (file.exists()) {
      const lastContent = file.read();
      if (lastContent === content) {
        return;
      }
    }

    const directory = new Directory(`routes${path}`);
    directory.ensure();
    directory.touch("index.ts", "");
  };
};
