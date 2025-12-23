import express from 'express'
import { config } from './config.ts'
import { healthHandler } from './routes/health.ts'

const app = express()

app.use(express.json())

app.get('/health', healthHandler)

export { app, config }
