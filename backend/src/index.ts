import express from 'express'
import { connectToDb } from './config/db'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { errorHandler } from './middleware/error-handler'
import { config } from './constants/env'
import authRoutes from './routes/auth.route'
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(cookieParser())

app.use('/api/auth', authRoutes)


app.use(errorHandler)


app.listen(config.env.PORT, async () => {
    console.log(`server is running in port 4004`)
    await connectToDb()
    console.log(process.env.DATABASE_URL)
})