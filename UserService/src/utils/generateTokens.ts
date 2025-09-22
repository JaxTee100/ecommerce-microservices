import { logger } from "../utils/logger";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { PrismaClient, User } from "@prisma/client";
import { prisma } from "..";



export const generateTokens = async (user: User) => {
  try {
    // Generate Access Token
    const accessToken = jwt.sign(
      {
        userId: user.id,
        username: user.name,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "35m" }
    );

    // Generate Refresh Token
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // refresh token expires in 7 days

    // Save Refresh Token in DB
    await prisma.refresh.create({
      data: {
        token: refreshToken,
        expiresAt,
        user: {
          connect: { id: user.id }, // link refreshToken to User
        },
      },
    });

    return { accessToken, refreshToken };
  } catch (error: any) {
    logger.error("Error generating tokens or saving refresh token", error.message);
    throw new Error("Error generating tokens or saving refresh token: " + error.message);
  }
};
