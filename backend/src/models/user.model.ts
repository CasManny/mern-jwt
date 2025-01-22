import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashvalue } from "../utils/bcrypt";

export interface UserDocument extends Document {
    email: string,
    password: string,
    verified: boolean,
    createdAt: Date,
    updateAt: Date,
    comparePassword: (value: string) => Promise<boolean>
}
const userSchema = new Schema<UserDocument>({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
}, { timestamps: true })

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = await hashvalue(this.password)
    next()
})

userSchema.methods.comparePassword = async function (val: string) {
    return compareValue(val, this.password)
}

export const UserModel = mongoose.model<UserDocument>("User", userSchema)