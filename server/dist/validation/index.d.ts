export * from './userValidation';
export * from './contactValidation';
export * from './meetingValidation';
export * from './visitorValidation';
export interface ValidationError {
    field: string;
    message: string;
}
export declare class ValidationResult<T> {
    success: boolean;
    data?: T;
    errors?: ValidationError[];
    constructor(success: boolean, data?: T, errors?: ValidationError[]);
    static success<T>(data: T): ValidationResult<T>;
    static error<T>(errors: ValidationError[]): ValidationResult<T>;
}
//# sourceMappingURL=index.d.ts.map