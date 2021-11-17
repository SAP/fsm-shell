export class PayloadValidationError extends Error {
  public detail: any;

  constructor(message: string, detail: any) {
    super(message);
    this.name = 'PayloadValidationError';
    this.detail = detail;
  }
}
