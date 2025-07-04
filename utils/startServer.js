import connectDB from "../config/database.js";
import { server } from "../config/socket.js";

const startServer = async (app) => {
  try {
    const { DB, PORT } = process.env;
    if (!DB) {
      throw new Error("DB not found in .env file");
    }
    if (!PORT) {
      throw new Error("PORT not found in .env file");
    }
    await connectDB(DB);
    console.log("✅ Database is Connected Successfully 🔥🔥");
    const port = PORT || 3000;
    server.listen(port, () => {
      console.log(`✅ Server is listening on port ${port} 🚀🚀`);
    });
  } catch (error) {
    // Handle errors that occur during server startup
    console.error("❌ Error starting the server:", error);
    process.exit(1); // Exit with status 1 (failure)
  }
};

export default startServer;