const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const router = express.Router();

app.use(cors());
app.use(express.json());
app.use(helmet());

// Swagger setup
require("./swagger/swagger")(app);

// Import elevator router
require("./routers/elevator.router")(router);

// Base path for the routes
app.use("/api/authenticationService", router);

module.exports = { app };
