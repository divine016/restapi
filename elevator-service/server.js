const dotenv = require("dotenv");
const path = require("path");

dotenv.config({
  path: path.resolve(__dirname, "../server.env")
});

const { app } = require("./app");

const port = process.env.ELEVATOR_SERVICE_PORT || 8000;

app.listen(port, () => {
  console.log(`Authentication-service is running on port ${process.env.ELEVATOR_SERVICE_PORT}`);
});
