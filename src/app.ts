import express from 'express'
import { config } from './config.ts'
import routes from './routes/index.ts'
import { errorHandler } from './middleware/error-handler.ts'

const app = express()

app.use(express.json())

app.use('/', routes)

app.use(errorHandler)

export { app, config }
