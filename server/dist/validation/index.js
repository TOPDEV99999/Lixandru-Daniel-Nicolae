"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationResult = void 0;
__exportStar(require("./userValidation"), exports);
__exportStar(require("./contactValidation"), exports);
__exportStar(require("./meetingValidation"), exports);
__exportStar(require("./visitorValidation"), exports);
class ValidationResult {
    success;
    data;
    errors;
    constructor(success, data, errors) {
        this.success = success;
        this.data = data;
        this.errors = errors;
    }
    static success(data) {
        return new ValidationResult(true, data);
    }
    static error(errors) {
        return new ValidationResult(false, undefined, errors);
    }
}
exports.ValidationResult = ValidationResult;
//# sourceMappingURL=index.js.map