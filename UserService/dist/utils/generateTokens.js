"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const logger_1 = require("../utils/logger");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const __1 = require("..");
const generateTokens = async (user) => {
    try {
        // Generate Access Token
        const accessToken = jsonwebtoken_1.default.sign({
            userId: user.id,
            username: user.name,
        }, process.env.JWT_SECRET, { expiresIn: "35m" });
        // Generate Refresh Token
        const refreshToken = crypto_1.default.randomBytes(40).toString("hex");
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // refresh token expires in 7 days
        // Save Refresh Token in DB
        await __1.prisma.refresh.create({
            data: {
                token: refreshToken,
                expiresAt,
                user: {
                    connect: { id: user.id }, // link refreshToken to User
                },
            },
        });
        return { accessToken, refreshToken };
    }
    catch (error) {
        logger_1.logger.error("Error generating tokens or saving refresh token", error.message);
        throw new Error("Error generating tokens or saving refresh token: " + error.message);
    }
};
exports.generateTokens = generateTokens;
