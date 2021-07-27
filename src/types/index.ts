export class ApiResponse {
  success: boolean;
  result: any;
  constructor(success: boolean = false, result?: any) {
    this.result = result;
    this.success = success;
  }
}
