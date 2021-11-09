export interface PayloadValidationResponse {
  isValid: boolean;
  error?: any;
}

export type PayloadValidationFunction = (
  data: any
) => PayloadValidationResponse;

export interface PayloadValidator {
  getValidationFunction(schema: object): PayloadValidationFunction;
}
