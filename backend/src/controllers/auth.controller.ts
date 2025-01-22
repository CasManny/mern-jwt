import { z } from "zod";
import { catchErrors } from "../utils/catch-error";
import { createAccount, loginUserAccount } from "../services/auth.service";
import { CREATED, OK } from "../constants/http-status-codes";
import { setAuthCookies } from "../utils/cookies";
import { loginSchema, registerSchema } from "../schemas/auth.schema";

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

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(OK)
    .json(user);
});
