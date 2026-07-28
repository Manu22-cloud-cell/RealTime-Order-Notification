const eventBus = require("../event-bus");

const {
  normalizeCDCEvent,
} = require("./cdc-event.service");

let zongji = null;
let isListenerRunning = false;

const startBinlogListener = async () => {
  if (isListenerRunning) {
    console.log("CDC listener is already running");
    return;
  }

  console.log("Starting CDC listener...");

  try {
    const { default: ZongJi } = await import("@vlasky/zongji");

    zongji = new ZongJi({
      host: process.env.CDC_DB_HOST,
      port: Number(process.env.CDC_DB_PORT),
      user: process.env.CDC_DB_USER,
      password: process.env.CDC_DB_PASSWORD,
    });

    zongji.on("error", (error) => {
      console.error(
        "CDC listener error:",
        error
      );
    });

    zongji.on("binlog", (event) => {
      try {
        const normalizedEvent =
          normalizeCDCEvent(event);

        // Ignore unsupported events such as TableMap
        if (!normalizedEvent) {
          return;
        }

        console.log(
          "Database change detected"
        );

        console.log(
          "Event Type:",
          normalizedEvent.type
        );

        console.log(
          "Data:",
          normalizedEvent.data
        );

        // Publish normalized event
        eventBus.emit(
          "database.change",
          normalizedEvent
        );
      } catch (error) {
        console.error(
          "Error processing CDC event:",
          error
        );
      }
    });

    zongji.start({
      startAtEnd: true,

      includeEvents: [
        "tablemap",
        "writerows",
        "updaterows",
        "deleterows",
      ],

      includeSchema: {
        realtime_orders: [
          "orders",
        ],
      },
    });

    isListenerRunning = true;

    console.log(
      "CDC listener started. Waiting for database changes..."
    );

    return zongji;
  } catch (error) {
    console.error(
      "Failed to start CDC listener:",
      error
    );

    throw error;
  }
};

const stopBinlogListener = () => {
  if (!zongji || !isListenerRunning) {
    console.log(
      "CDC listener is not running"
    );

    return;
  }

  console.log(
    "Stopping CDC listener..."
  );

  try {
    zongji.stop();

    zongji.removeAllListeners();

    zongji = null;
    isListenerRunning = false;

    console.log(
      "CDC listener stopped successfully"
    );
  } catch (error) {
    console.error(
      "Error stopping CDC listener:",
      error
    );
  }
};

module.exports = {
  startBinlogListener,
  stopBinlogListener,
};