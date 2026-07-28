const http = require("http");

const app = require("./app");

const sequelize = require("./config/database");

require("dotenv").config();

const {
    startBinlogListener,
    stopBinlogListener,
} = require("./services/binlog.service");

const {
    initializeSocket,
    closeSocket,
} = require("./sockets/socket.service");

const PORT =
    process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

let isShuttingDown = false;

const startServer = async () => {
    try {
        console.log(
            "Connecting to database..."
        );

        await sequelize.authenticate();

        console.log(
            "Database connected successfully"
        );

        await startBinlogListener();

        server.listen(
            PORT,
            () => {
                console.log(
                    `Server running on port ${PORT}`
                );
            }
        );
    } catch (error) {
        console.error(
            "Unable to start server:",
            error
        );

        process.exit(1);
    }
};

const gracefulShutdown = async (
    signal
) => {
    if (isShuttingDown) {
        console.log(
            "Shutdown already in progress..."
        );

        return;
    }

    isShuttingDown = true;

    console.log(
        `\n${signal} received. Starting graceful shutdown...`
    );

    try {
        // Step 1:
        // Stop accepting new HTTP connections
        await new Promise(
            (resolve, reject) => {
                server.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    console.log(
                        "HTTP server closed"
                    );

                    resolve();
                });
            }
        );

        // Step 2:
        // Stop CDC listener
        stopBinlogListener();

        // Step 3:
        // Close Socket.IO
        await closeSocket();

        // Step 4:
        // Close database connection
        await sequelize.close();

        console.log(
            "Database connection closed"
        );

        console.log(
            "Graceful shutdown completed"
        );

        process.exit(0);
    } catch (error) {
        console.error(
            "Error during graceful shutdown:",
            error
        );

        process.exit(1);
    }
};

process.on(
    "SIGINT",
    () => {
        gracefulShutdown("SIGINT");
    }
);

process.on(
    "SIGTERM",
    () => {
        gracefulShutdown("SIGTERM");
    }
);

startServer();