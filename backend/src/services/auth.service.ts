import { UserModel } from "../models/user.model"

export type CreateAccountParams = {
    email: string,
    password: string,
    userAgent: string
}

export const createAccount = async (data: CreateAccountParams) => {
    // verify if user already exist
    const existingUser = await UserModel.exists({
        email: data.email
    })
    if (existingUser) {
        throw new Error("User alreay exists")
    }

    const user = await UserModel.create({
        email: data.email,
        password: data.password
    })

    
}