export class ErrorResponse {
  // HTTP status codes
  public static readonly OK: string = "200 OK";
  public static readonly UNAUTHORIZED: string = "401 Unauthorized";
  public static readonly FORBIDDEN: string = "403 Forbidden";

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
