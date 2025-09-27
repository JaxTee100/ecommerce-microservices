"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const logger_1 = require("./utils/logger");
const auth_1 = __importDefault(require("./routes/auth"));
const body_parser_1 = __importDefault(require("body-parser"));
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000;
app.use(body_parser_1.default.json());
app.use('/auth', auth_1.default);
app.listen(PORT, async () => {
    logger_1.logger.info(`User Service running on port ${PORT}`);
    await exports.prisma.$connect();
});
