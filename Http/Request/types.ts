import { IReadonlyCollection } from "../deps.ts";
import { ReadonlyHeader } from "../Header/ReadonlyHeader.ts";
import { IHeaderChecker } from "../Header/types.ts";
import { HttpMethodType } from "../types.ts";

export interface IRequest extends IHeaderChecker {
  readonly url: Readonly<URL>;
  readonly header: ReadonlyHeader;
  readonly method: HttpMethodType;
  readonly searchParams: IReadonlyCollection;
  readonly native: Request;
  getBody: <T = Record<string, unknown>>() => Promise<
    T | string | FormData | Blob | null
  >;
}
