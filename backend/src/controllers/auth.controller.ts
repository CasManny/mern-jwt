import { z } from "zod";
import { catchErrors } from "../utils/catch-error";
import {
  createAccount,
  loginUserAccount,
  refreshUserAccessToken,
  verifyEmail,
} from "../services/auth.service";
import { CREATED, OK, UNAUTHORIZED } from "../constants/http-status-codes";
import {
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "../utils/cookies";
import { loginSchema, registerSchema, verificationCodeSchema } from "../schemas/auth.schema";
import { verifyToken } from "../utils/jwt";
import { SessionModel } from "../models/session.model";
import { clearAuthCookies } from "../utils/clear-auth-cookies";
import appAssert from "../utils/app-assert";

export const registerUser = catchErrors(async (req, res) => {
  // validate the request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });
  // call the service
  const { user, accessToken, refreshToken } = await createAccount(request);
  // return response
  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json(user);
});

export const loginUser = catchErrors(async (req, res) => {
  const request = loginSchema.parse({
    ...req.body,
    userAgent: req.headers["user-agent"],
  });

  const { user, accessToken, refreshToken } = await loginUserAccount(request);

  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    message: "login successful",
  });
});

export const logoutUser = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || "");
  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }
  return clearAuthCookies(res)
    .status(OK)
    .json({ message: "logout successful" });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "No refreshtoken found");
  const { accessToken, newRefreshToken } = await refreshUserAccessToken(
    refreshToken
  );

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  return res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({ message: "Access token refreshed" });
});

export const verifyTokenHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code)
  const { user } = await verifyEmail(verificationCode)
  return res.status(OK).json({message: "Email successfully verified"})
})
