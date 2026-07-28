const { Server } = require("socket.io");
const eventBus = require("../event-bus");

let io;

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

  eventBus.on(
    "database.change",
    (event) => {
      console.log(
        "Broadcasting event to clients:",
        event.type
      );

      io.emit(
        event.type,
        event.data
      );
    }
  );

  console.log(
    "Socket.IO initialized successfully"
  );
};

module.exports = {
  initializeSocket,
};