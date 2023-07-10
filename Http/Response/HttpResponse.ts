import { Header } from "../Header/Header.ts";
import { HeaderContentTypeType } from "../Header/types.ts";
import {
  Collection,
  File,
  generateUrl,
  HandlerContextType,
  Helper,
} from "../deps.ts";
import { HttpCodeType, HttpStatusType } from "../types.ts";
import { IResponse } from "./types.ts";

export class HttpResponse implements IResponse {
  public readonly data: Collection = new Collection();
  public readonly body: Collection = new Collection();
  public status: HttpStatusType = HttpStatusType.OK;
  public readonly header: Header = new Header();

  constructor(public readonly ctx?: HandlerContextType) {}

  /**
   * Render string response
   */
  public string(content: string, status?: HttpStatusType): Response {
    return this.buildResponse(content, "text/plain", status);
  }

  /**
   * Render html response
   */
  public html(content: string, status?: HttpStatusType): Response {
    return this.buildResponse(content, "text/html", status);
  }

  /**
   * Render json response
   */
  public json(
    data: Record<string, unknown> = {},
    status?: HttpStatusType,
  ): Response {
    return this.buildResponse(
      JSON.stringify({ ...this.body.toJson(), ...this.data.toJson(), ...data }),
      "application/json",
      status,
    );
  }

  /**
   * Render component response
   */
  public render<T = Record<string, unknown>>(
    data?: T,
    status?: HttpStatusType,
  ): Promise<Response> | Response {
    if (!this.ctx) {
      return this.json(data as Record<string, unknown>, status);
    }

    this.ctx.state = { ...this.body.toJson(), ...this.data.toJson(), ...data };

    return this.ctx.render(data, this.getInitOptions(status));
  }

  /**
   * Render not found response
   */
  public notFound(
    data?: Record<string, unknown>,
  ): Promise<Response> | Response {
    if (!this.ctx) {
      return this.json(
        data as Record<string, unknown> ?? {},
        HttpStatusType.NotFound,
      );
    }

    return this.ctx.renderNotFound();
  }

  /**
   * Render file stream response
   */
  public async stream(
    filePath: string,
  ): Promise<Response> {
    const file = new File(filePath);

    return this.buildResponse(await file.stream(), "application/octet-stream");
  }

  /**
   * Download file
   */
  public async download(
    filePath: string,
    filename: string,
  ): Promise<Response> {
    const file = new File(filePath);
    this.header.contentDisposition(`attachment; filename="${filename}"`);

    return this.buildResponse(await file.stream(), "application/octet-stream");
  }

  /**
   * Redirect by route definition name
   */
  public redirect(
    routeName: string,
    params: Record<string, string | number> = {},
    baseUrl?: URL | null,
    status?: HttpStatusType | null,
  ): Response {
    const path = generateUrl(routeName, params, baseUrl);

    return this.redirectToUrl(path, status ?? HttpStatusType.TemporaryRedirect);
  }

  public redirectToUrl(
    url: string | URL,
    status?: HttpStatusType,
  ): Response {
    return Response.redirect(url, status ?? HttpStatusType.TemporaryRedirect);
  }

  private getInitOptions(status?: HttpStatusType): ResponseInit {
    status = status ?? this.status;

    return {
      headers: this.header.native,
      status,
      statusText: HttpCodeType[status],
    };
  }

  private buildResponse(
    content: string | ReadableStream,
    contentType: HeaderContentTypeType | null = null,
    status?: HttpStatusType,
  ): Response {
    this.header.delete("Content-Type");
    this.header.delete("Content-Length");

    if (contentType) {
      this.header.contentType(contentType);
    }

    if (Helper.isString(content)) {
      this.header.contentLength((content as string).length);
    }

    return new Response(content, this.getInitOptions(status));
  }
}
