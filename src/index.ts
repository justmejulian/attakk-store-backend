import { initializeDatabase } from './db/index.ts'
import { app, config } from './app.ts'

await initializeDatabase()

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
