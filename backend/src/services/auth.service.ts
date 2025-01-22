import { config } from "../constants/env";
import { CONFLICT, UNAUTHORIZED } from "../constants/http-status-codes";
import { VerificationCodeType } from "../constants/verification-types";
import { SessionModel } from "../models/session.model";
import { UserModel } from "../models/user.model";
import { VerificationCodeModel } from "../models/verification-code.model";
import appAssert from "../utils/app-assert";
import { oneYearFromNow } from "../utils/date";
import jwt from "jsonwebtoken";

export type CreateAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export type LoginAccountParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export const createAccount = async (data: CreateAccountParams) => {
  // verify if user already exist
  const existingUser = await UserModel.exists({
    email: data.email,
  });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: VerificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  // send verification email

  const session = await SessionModel.create({
    userId: user._id,
    userAgent: data.userAgent,
  });

  // sign access token & refresh token
  const refreshToken = jwt.sign(
    { sessionId: session._id },
    config.env.JWT_SECRT,
    { expiresIn: "30d", audience: ["user"] }
  );

  const accessToken = jwt.sign(
    { sessionId: session._id, userId: user._id },
    config.env.JWT_SECRT,
    { expiresIn: "15m", audience: ["user"] }
  );

  return { user: user.omitPassword(), accessToken, refreshToken };
};

export const loginUserAccount = async ({
  email,
  password,
  userAgent,
}: LoginAccountParams) => {
  // get the user
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");
  // validate password from the request
  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  const userId = user._id;

  const session = await SessionModel.create({
    userId,
    userAgent,
  });

  const sessionInfo = {
    sessionId: session._id,
  };

  // sign access token & refresh token
  const refreshToken = jwt.sign(sessionInfo, config.env.JWT_SECRT, {
    expiresIn: "30d",
    audience: ["user"],
  });

  const accessToken = jwt.sign(
    { ...sessionInfo, userId: user._id },
    config.env.JWT_SECRT,
    { expiresIn: "15m", audience: ["user"] }
  );

  return { user: user.omitPassword(), accessToken, refreshToken };
};
