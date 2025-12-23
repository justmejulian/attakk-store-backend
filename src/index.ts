import { app, config } from './app.ts'

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
