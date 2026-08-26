import { app } from "./app";
import { env } from "./app/config/env";

app.listen(env.PORT, () => {
  console.log(`Backend listening on http://localhost:${env.PORT}`);
});
