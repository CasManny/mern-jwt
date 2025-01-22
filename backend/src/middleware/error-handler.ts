import { ErrorRequestHandler, Response } from "express";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../constants/http-status-codes";
import { z } from "zod";

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

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    if (error instanceof z.ZodError) {
        return handleZodError(res, error);
    }
    console.error(`Error at path: ${req.path}`, error);
    res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};
