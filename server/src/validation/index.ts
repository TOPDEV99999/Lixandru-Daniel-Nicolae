export * from './userValidation';
export * from './contactValidation';
export * from './meetingValidation';
export * from './visitorValidation';

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: ValidationError[];

  constructor(success: boolean, data?: T, errors?: ValidationError[]) {
    this.success = success;
    this.data = data;
    this.errors = errors;
    
  }

  static success<T>(data: T): ValidationResult<T> {
    return new ValidationResult(true, data);
  }

  static error<T>(errors: ValidationError[]): ValidationResult<T> {
    return new ValidationResult<T>(false, undefined, errors);
  }
}