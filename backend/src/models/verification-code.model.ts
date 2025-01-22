import mongoose, { Document, Schema } from "mongoose"
import { VerificationCodeType } from "../constants/verification-types";

export interface VerificationCodeDocument extends Document {
    userId: mongoose.Types.ObjectId;
    type: VerificationCodeType,
    expiresAt: Date,
    createdAt: Date,
}

const verificationCodeSchema = new Schema<VerificationCodeDocument>({})