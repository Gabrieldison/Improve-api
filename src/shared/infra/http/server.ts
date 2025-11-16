import { registerAreaRoutes } from "@/modules/areas/area.routes";
import { pool } from "@/shared/infra/database/connection";
import { app } from "@/shared/infra/http/app";

const port = process.env.PORT || 3000;

async function main() {
  try {
    const client = await pool.connect();
    console.log("🟢 Database connected successfully");
    client.release();

    // Register routes BEFORE starting the server
    registerAreaRoutes();

    app.listen(Number(port), () => {
      console.log(`🚀 Server of improve is active and running on port ${port}`);
    });

    process.on("SIGINT", async () => {
      console.log("\n🛑 Gracefully shutting down...");
      await pool.end();
      process.exit(0);
    });
  } catch (error) {
    console.error(
      "🔴 Failed to connect to the database:",
      (error as Error).message
    );
    process.exit(1);
  }
}

main();
