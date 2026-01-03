import { createDatabase, initializeDatabase } from './db/index';
import { createApp, config } from './app';

const db = createDatabase();
await initializeDatabase(db);

const app = createApp(db);

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
