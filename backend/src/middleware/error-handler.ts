import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http-status-codes";
import { z } from "zod";
import AppError from "../utils/app-error";

const handleZodError = (res: Response, error: z.ZodError) => {
    const errors = error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
    }));
    res.status(BAD_REQUEST).json({
        message: "Validation error",
        errors,
    });
};

const handleAppError = (res: Response, error: AppError) => {
     res.status(error.statusCode).json({
        message: error.message,
        errorCode: error.errorCode
    })
}

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof z.ZodError) {
        return handleZodError(res, error);
    }

    if (error instanceof AppError) {
        return handleAppError(res, error)
    }
    console.error(`Error at path: ${req.path}`, error);
    res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};
