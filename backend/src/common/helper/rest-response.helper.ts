export class RestResponse<T> {
  status: boolean;
  message: string;
  data: T;

  constructor(status: boolean, message: string, data: T) {
    this.status = status;
    this.message = message;
    this.data = data;
  }

  static success<T>(message = 'Success', data: T): RestResponse<T> {
    return new RestResponse<T>(true, message, data);
  }

  static error(message = 'Error', data: any = null): RestResponse<null> {
    return new RestResponse<null>(false, message, data);
  }
}
