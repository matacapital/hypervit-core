import { Header, HeaderContentTypeType } from "../Header/mod.ts";
import { Request } from "../Request/mod.ts";
import {
  Collection,
  ControllerType,
  File,
  get,
  HeaderChecker,
  Helper,
  Keys,
  registerConstant,
  renderView,
  RouteNotFoundException,
  ViewType,
} from "../deps.ts";
import { HttpCodeType, HttpStatusType } from "../types.ts";
import { IResponse } from "./types.ts";

export class HttpResponse extends HeaderChecker implements IResponse {
  public readonly id: string = crypto.randomUUID();
  public readonly data: Collection;
  public readonly body: Collection;
  public readonly status: HttpStatusType;
  public readonly header: Header;

  constructor(
    body: Collection | null = null,
    status: HttpStatusType | null = null,
    header: Header | null = null,
  ) {
    header = header ?? new Header();
    super(header.native);
    this.data = new Collection();
    this.body = body ?? new Collection();
    this.status = status ?? HttpStatusType.OK;
    this.header = header;
  }

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
      JSON.stringify(data),
      "application/json",
      status,
    );
  }

  /**
   * Render component response
   */
  public async render<T = unknown>(
    view: ViewType<T>,
    data?: T,
    status?: HttpStatusType,
  ): Promise<Response> {
    const content = await renderView(view, data);

    return this.html(content, status);
  }

  /**
   * Render not found response
   */
  public async notFound(
    message: string,
    request: Request,
    status?: HttpStatusType,
  ): Promise<Response> {
    const NotFoundController = get<ControllerType>(Keys.Controller.NotFound);
    const error = new RouteNotFoundException(
      message,
      status ?? HttpStatusType.NotFound,
    );

    const K = get<{ Exception: symbol }>(request.id);
    registerConstant(K.Exception, error);

    return await NotFoundController(request);
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
   * Redirect response
   */
  public redirect(): Response {
    // TODO: redirect by route name
    // TODO: redirect by url

    const url = new URL("/users/45", "http://localhost:5000");

    return Response.redirect(url, HttpStatusType.TemporaryRedirect);
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
