import { app } from './app.js';
import { env } from './env/index.js';


app.listen({
  port: env.PORT,
  host: '0.0.0.0',
}, (error, address) => {
  if (error) {
    app.log.error(error);
    process.exit(1);
  }

  console.log(`🔥 API Running on ${address} - env: ${env.NODE_ENV}`);
});
