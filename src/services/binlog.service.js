const startBinlogListener = async () => {
  console.log("Starting CDC listener...");

  try {
    const { default: ZongJi } = await import("@vlasky/zongji");

    const zongji = new ZongJi({
      host: process.env.CDC_DB_HOST,
      port: Number(process.env.CDC_DB_PORT),
      user: process.env.CDC_DB_USER,
      password: process.env.CDC_DB_PASSWORD,
    });

    zongji.on("error", (error) => {
      console.error("CDC listener error:", error);
    });

    zongji.on("binlog", (event) => {
      const eventType = event.getTypeName();

      // Ignore TableMap events for now
      if (eventType === "TableMap") {
        return;
      }

      console.log("Database change detected");
      console.log("Event Type:", eventType);
      console.log("Database:", event.schemaName);
      console.log("Table:", event.tableName);
      console.log("Rows:", event.rows);
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

    console.log(
      "CDC listener started. Waiting for database changes..."
    );
  } catch (error) {
    console.error(
      "Failed to start CDC listener:",
      error
    );
  }
};

module.exports = {
  startBinlogListener,
};