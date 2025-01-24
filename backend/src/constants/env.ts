import dotenv from 'dotenv'
dotenv.config()
export const config = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL!,
    PORT: process.env.PORT!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    NODE_ENV: process.env.NODE_ENV
  },
};
