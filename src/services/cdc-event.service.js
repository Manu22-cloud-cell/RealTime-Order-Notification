const EVENT_TYPES = {
  WriteRows: "order.created",
  UpdateRows: "order.updated",
  DeleteRows: "order.deleted",
};

const normalizeCDCEvent = (event) => {
  const eventType = event.getTypeName();

  const applicationEventType = EVENT_TYPES[eventType];

  if (!applicationEventType) {
    return null;
  }

  return {
    type: applicationEventType,
    data: event.rows,
  };
};

module.exports = {
  normalizeCDCEvent,
};