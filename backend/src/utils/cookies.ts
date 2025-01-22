import { Response, CookieOptions } from "express";
import { config } from "../constants/env";
import { fifteenMinutesFromNow, thirtyDaysFromNow } from "./date";

const secure = config.env.NODE_ENV !== "development";
const cookieDefault: CookieOptions = {
  sameSite: "strict",
  httpOnly: true,
  secure,
};

const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...cookieDefault,
  expires: fifteenMinutesFromNow(),
});
const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...cookieDefault,
  expires: thirtyDaysFromNow(),
  path: "/auth/refresh", // will be sent only when the route is consumed
});
type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) => {
  return res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
      .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());
    
    
};
