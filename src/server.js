const http = require("http");
const app = require("./app");
const sequelize = require("./config/database");

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const startServer = async () => {
  try {
    console.log("Connecting to database...");
    
    await sequelize.authenticate();

    console.log("Database connected successfully");

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);
    process.exit(1);
  }
};

startServer();