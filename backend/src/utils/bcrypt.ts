import bcrypt from 'bcrypt'
export const hashvalue = async (value: string, salt?: number) => {
    return bcrypt.hash(value, salt || 10)
}

export const compareValue = async (value: string, hashedString: string) => {
    return bcrypt.compare(value, hashedString).catch(() => false)
}