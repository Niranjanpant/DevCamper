const dotenv = require("dotenv");
//load env vars
dotenv.config({ path: "./config/config.env" });

const express = require("express");
const colors = require("colors");
require("./db/mongoose");

//route files
const bootcamps = require("./routes/bootcamps");
//logger
const morgan = require("morgan");
const errorHandler = require("./middleware/error");

const app = express();

//Body parser
app.use(express.json());

//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mount routers
app.use("/api/v1/bootcamps", bootcamps);

//custome middleware for error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `server is running wild ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold
  );
});
