"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLogin = exports.validateRegistration = void 0;
const joi_1 = __importDefault(require("joi"));
const validateRegistration = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).max(50).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).max(50).required(),
    });
    return schema.validate(data);
};
exports.validateRegistration = validateRegistration;
const validateLogin = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).max(50).required(),
    });
    return schema.validate(data);
};
exports.validateLogin = validateLogin;
