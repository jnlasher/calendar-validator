export class ErrorResponse {
  // HTTP status codes
  public static readonly OK: number = 200;
  public static readonly UNAUTHORIZED: number = 401;
  public static readonly FORBIDDEN: number = 403;
  public static readonly NOT_FOUND: number = 404;
  public static readonly SERVER_ERROR: number = 500;

  // response properties
  statusCode: number;
  responseString: string;
  responseBody: string;

  constructor(statusCode, responseString, responseBody) {
    this.statusCode = statusCode;
    this. responseString = responseString;
    this.responseBody = responseBody;
  }

  setStatusCode(statusCode: number) {
    this.statusCode = statusCode;
  }

  setResponseString(responseString: string) {
    this.responseString = responseString;
  }

  setResponseBody(responseBody: string) {
    this.responseBody = responseBody;
  }
}
