import { createDatabase, initializeDatabase } from './db/index.ts';
import { createApp, config } from './app.ts';

const db = createDatabase();
await initializeDatabase(db);

const app = createApp(db);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
