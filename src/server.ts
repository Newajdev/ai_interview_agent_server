import { app } from "./app";
import { env } from "./app/config/env";
import { disconnectPrisma } from "./app/lib/prisma";

const server = app.listen(env.PORT, () => {
  console.log(`Backend listening on http://localhost:${env.PORT}`);
});

async function shutdown(signal: string) {
  console.log(`${signal} received. Closing server.`);
  server.close(async () => {
    await disconnectPrisma();
    process.exit(0);
  });
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
