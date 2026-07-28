const { Server } = require("socket.io");

const eventBus = require("../event-bus");

let io = null;
let databaseChangeListener = null;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(
      `Client connected: ${socket.id}`
    );

    socket.on("disconnect", (reason) => {
      console.log(
        `Client disconnected: ${socket.id}`,
        reason
      );
    });
  });

  databaseChangeListener = (event) => {
    console.log(
      "Broadcasting event to clients:",
      event.type
    );

    io.emit(
      event.type,
      event.data
    );
  };

  eventBus.on(
    "database.change",
    databaseChangeListener
  );

  console.log(
    "Socket.IO initialized successfully"
  );
};

const closeSocket = async () => {
  if (!io) {
    console.log(
      "Socket.IO is not initialized"
    );

    return;
  }

  console.log(
    "Closing Socket.IO..."
  );

  if (databaseChangeListener) {
    eventBus.removeListener(
      "database.change",
      databaseChangeListener
    );

    databaseChangeListener = null;
  }

  await io.close();

  io = null;

  console.log(
    "Socket.IO closed successfully"
  );
};

module.exports = {
  initializeSocket,
  closeSocket,
};