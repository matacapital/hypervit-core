import { Header } from "../Header/mod.ts";
import { Collection } from "../deps.ts";
import { HttpStatusType } from "../types.ts";

export interface IResponse {
  readonly data: Collection;
  readonly body: Collection;
  status: HttpStatusType;
  readonly header: Header;
  string: (content: string, status?: HttpStatusType) => Response;
  html: (content: string, status?: HttpStatusType) => Response;
  json: (data: Record<string, unknown>, status?: HttpStatusType) => Response;
  stream: (filePath: string) => Promise<Response>;
  download: (filePath: string, filename: string) => Promise<Response>;
  render: <T>(
    data?: T,
    status?: HttpStatusType,
  ) => Promise<Response> | Response;
  notFound: () => Promise<Response> | Response;
  // redirect: (
  // routeName: string,
  // params: Record<string, string | number>,
  // status?: HttpStatusType,
  // ) => Response;
  // redirectToUrl: (url: string | URL, status?: HttpStatusType) => Response;
}
