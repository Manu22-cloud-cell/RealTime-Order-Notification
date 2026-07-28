# Real-Time Order Notification System

A backend application that provides real-time order notifications to connected clients whenever an order is **created, updated, or deleted** in the MySQL database.

The application uses **Node.js, Express.js, Sequelize ORM, MySQL, MySQL Binary Log (Binlog), ZongJi, Socket.IO, and an Event Bus** to detect database changes and broadcast them to connected clients without polling.

---

## Features

* RESTful CRUD APIs for orders
* Sequelize ORM for MySQL database operations
* MySQL database migrations using Sequelize CLI
* Change Data Capture (CDC) using MySQL Binary Log
* ZongJi for listening to MySQL binlog events
* Normalized application-level CDC events
* Internal Event Bus for decoupling CDC and WebSocket logic
* Socket.IO for real-time client notifications
* Real-time notifications for:

  * Order created
  * Order updated
  * Order deleted
* Centralized HTTP error handling
* Centralized 404 route handling
* Simple real-time frontend client
* Environment-based configuration
* Separate database user for CDC operations

---

## Architecture

```text
                        ┌─────────────────────┐
                        │       Client        │
                        │  HTML / JavaScript  │
                        └──────────┬──────────┘
                                   │
                         Socket.IO │
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────┐
│                      Node.js Application                    │
│                                                             │
│  ┌─────────────┐     ┌──────────────┐     ┌─────────────┐ │
│  │   Express   │────▶│ Controllers  │────▶│  Services   │ │
│  │   REST API  │     └──────────────┘     └──────┬──────┘ │
│  └─────────────┘                                  │        │
│                                                   ▼        │
│                                            ┌────────────┐  │
│                                            │ Sequelize  │  │
│                                            └─────┬──────┘  │
│                                                  │         │
│                                                  ▼         │
│                                            ┌────────────┐  │
│                                            │   MySQL    │  │
│                                            └─────┬──────┘  │
│                                                  │         │
│                                            MySQL Binlog    │
│                                                  │         │
│                                                  ▼         │
│                                            ┌────────────┐  │
│                                            │   ZongJi   │  │
│                                            │ CDC Layer  │  │
│                                            └─────┬──────┘  │
│                                                  │         │
│                                                  ▼         │
│                                         ┌────────────────┐ │
│                                         │ Event Normalizer│ │
│                                         └───────┬────────┘ │
│                                                 │          │
│                                                 ▼          │
│                                         ┌────────────────┐ │
│                                         │   Event Bus    │ │
│                                         └───────┬────────┘ │
│                                                 │          │
│                                                 ▼          │
│                                         ┌────────────────┐ │
│                                         │   Socket.IO    │ │
│                                         └───────┬────────┘ │
│                                                 │          │
└─────────────────────────────────────────────────┼──────────┘
                                                  │
                                                  ▼
                                           Connected Clients
```

---

## Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **ORM:** Sequelize
* **Database:** MySQL
* **CDC:** MySQL Binary Log
* **CDC Library:** ZongJi
* **Real-Time Communication:** Socket.IO
* **Event Communication:** Node.js EventEmitter
* **Database Migrations:** Sequelize CLI
* **Frontend:** HTML, CSS, JavaScript
* **API Testing:** Postman

---

## Project Structure

```text
realtime-order-notification/
│
├── client/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── src/
│   │
│   ├── config/
│   │   └── database.js
│   │
│   ├── controllers/
│   │   └── order.controller.js
│   │
│   ├── middleware/
│   │   ├── error.middleware.js
│   │   └── not-found.middleware.js
│   │
│   ├── models/
│   │   └── order.model.js
│   │
│   ├── routes/
│   │   └── order.routes.js
│   │
│   ├── services/
│   │   ├── order.service.js
│   │   ├── binlog.service.js
│   │   └── cdc-event.service.js
│   │
│   ├── sockets/
│   │   └── socket.service.js
│   │
│   ├── app.js
│   ├── event-bus.js
│   └── server.js
│
├── migrations/
│   └── create-orders-table migration
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

# Database Setup

Create the application database in MySQL:

```sql
CREATE DATABASE realtime_orders;
```

The application uses an `orders` table with the following fields:

| Field         | Type     | Description                 |
| ------------- | -------- | --------------------------- |
| id            | INTEGER  | Primary key, auto-increment |
| customer_name | VARCHAR  | Customer name               |
| product_name  | VARCHAR  | Product name                |
| status        | ENUM     | pending, shipped, delivered |
| updated_at    | DATETIME | Last update timestamp       |

---

# MySQL Binary Log Configuration

CDC depends on MySQL binary logging.

The following configuration was verified:

```text
binlog_format = ROW
log_bin = ON
server_id = 1
```

The application uses MySQL row-based binary logging to capture changes to the `orders` table.

---

# CDC User

A dedicated MySQL user is used for CDC operations.

The CDC user requires the following privileges:

```text
REPLICATION SLAVE
REPLICATION CLIENT
```

The CDC user also requires appropriate access to the database/table being monitored so that ZongJi can inspect the required table metadata.

The application database user and CDC user are intentionally separated.

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000

DB_NAME=realtime_orders
DB_USER=your_application_user
DB_PASSWORD=your_application_password
DB_HOST=127.0.0.1
DB_PORT=3306

CDC_DB_HOST=127.0.0.1
CDC_DB_PORT=3306
CDC_DB_USER=cdc_user
CDC_DB_PASSWORD=your_cdc_password
```

Do not commit the `.env` file to Git.

Add it to `.gitignore`:

```gitignore
.env
```

---

# Installation

Clone the repository and install dependencies:

```bash
npm install
```

---

# Database Migration

Run the Sequelize migration:

```bash
npx sequelize-cli db:migrate
```

This creates the `orders` table in the `realtime_orders` database.

To undo the latest migration:

```bash
npx sequelize-cli db:migrate:undo
```

---

# Running the Application

Start the application:

```bash
npm start
```

For development with Nodemon:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:3000
```

Health check:

```text
GET /health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

# REST API

Base URL:

```text
http://localhost:3000/api/orders
```

## Create Order

```http
POST /api/orders
```

Request body:

```json
{
  "customer_name": "Manoj",
  "product_name": "MacBook Air",
  "status": "pending"
}
```

Possible status values:

```text
pending
shipped
delivered
```

---

## Get All Orders

```http
GET /api/orders
```

Example response:

```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "data": [
    {
      "id": 1,
      "customer_name": "Manoj",
      "product_name": "MacBook Air",
      "status": "pending",
      "updated_at": "2026-07-28T04:23:46.000Z"
    }
  ]
}
```

---

## Get Order By ID

```http
GET /api/orders/:id
```

Example:

```text
GET /api/orders/1
```

---

## Update Order

```http
PATCH /api/orders/:id
```

Example request:

```json
{
  "status": "shipped"
}
```

---

## Delete Order

```http
DELETE /api/orders/:id
```

Example:

```text
DELETE /api/orders/1
```

---

# Real-Time CDC Events

The application listens to MySQL binary log events for the `orders` table.

The following database operations are converted into application events:

| MySQL Binlog Event | Application Event |
| ------------------ | ----------------- |
| WriteRows          | order.created     |
| UpdateRows         | order.updated     |
| DeleteRows         | order.deleted     |

The CDC event is normalized before being published to the internal Event Bus.

Example normalized event:

```json
{
  "type": "order.created",
  "data": [
    {
      "id": 1,
      "customer_name": "Manoj",
      "product_name": "MacBook Air",
      "status": "pending",
      "updated_at": "2026-07-28T04:23:46.000Z"
    }
  ]
}
```

For an update event:

```json
{
  "type": "order.updated",
  "data": [
    {
      "before": {
        "id": 1,
        "customer_name": "Manoj",
        "product_name": "MacBook Air",
        "status": "pending"
      },
      "after": {
        "id": 1,
        "customer_name": "Manoj",
        "product_name": "MacBook Air",
        "status": "shipped"
      }
    }
  ]
}
```

---

# Real-Time Client

The frontend client connects to the backend using Socket.IO.

The client listens for:

```text
order.created
order.updated
order.deleted
```

When a database change occurs:

```text
MySQL
   ↓
Binary Log
   ↓
ZongJi CDC Listener
   ↓
CDC Event Normalizer
   ↓
Event Bus
   ↓
Socket.IO
   ↓
Connected Client
```

No polling is required.

---

# Testing

The REST APIs can be tested using Postman.

The CDC functionality can be tested by:

1. Starting the backend.
2. Opening the frontend client.
3. Connecting the client to the Socket.IO server.
4. Creating an order through the REST API.
5. Updating an order.
6. Deleting an order.
7. Observing real-time events in the client.

The same changes can also be performed directly in MySQL.

Expected real-time events:

```text
Order Created
Order Updated
Order Deleted
```

---

# Error Handling

The application includes centralized HTTP error handling.

The following middleware components are used:

```text
not-found.middleware.js
error.middleware.js
```

The application handles:

* Unknown routes
* Sequelize validation errors
* Sequelize database errors
* Generic internal server errors

Controllers pass unexpected errors to the centralized error handler using Express's `next(error)` mechanism.

---

# Design Decisions

## Why Sequelize?

Sequelize provides an ORM abstraction over MySQL and simplifies:

* Model definitions
* CRUD operations
* Database queries
* Migrations
* Validation

The application uses Sequelize for normal application database operations.

---

## Why CDC?

Instead of repeatedly polling the database to detect changes, the application listens to MySQL's binary log.

This provides a more event-driven architecture:

```text
Database Change
      ↓
Binary Log
      ↓
CDC Listener
      ↓
Real-Time Notification
```

---

## Why Socket.IO?

Socket.IO provides persistent connections between the server and clients, allowing the server to push events immediately when database changes occur.

This avoids client-side polling.

---

## Why an Event Bus?

The Event Bus decouples the CDC layer from the Socket.IO layer.

The CDC service is responsible for detecting and normalizing database changes.

The Socket.IO service is responsible for broadcasting those events.

The two components communicate through the internal Event Bus.

This separation makes the architecture easier to extend and maintain.

---

# Current Limitations

The current implementation intentionally keeps the system simple for the assignment.

Potential future improvements include:

* CDC reconnection and retry mechanism
* CDC connection health monitoring
* Application-level health endpoint for CDC status
* Structured logging
* Input validation using a validation library
* Authentication and authorization
* Rate limiting
* WebSocket authentication
* Production CORS configuration
* Graceful CDC restart/recovery
* Automated tests
* Docker-based deployment
* Production deployment configuration

---

# Future Improvements

A production-ready version could introduce:

```text
MySQL
   ↓
CDC
   ↓
Message Broker
   ↓
Event Consumers
   ↓
WebSocket Gateway
   ↓
Clients
```

For a larger distributed system, a message broker such as Kafka or RabbitMQ could replace the in-process Event Bus.

This would allow CDC events to be processed by multiple independent consumers.

---

# License

This project is intended for educational and interview assignment purposes.
