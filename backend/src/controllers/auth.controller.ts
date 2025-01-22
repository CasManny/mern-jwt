import { z } from "zod";
import { catchErrors } from "../utils/catch-error";
import { createAccount } from "../services/auth.service";
import { CREATED } from "../constants/http-status-codes";
import { setAuthCookies } from "../utils/cookies";

const registerSchema = z
  .object({
    email: z.string().email().min(1).max(256),
    password: z.string().min(6).max(255),
    confirmPassword: z.string().min(6).max(255),
    userAgent: z.optional(z.string()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

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
    .json(user)
  
  
});
