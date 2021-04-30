const dotenv = require("dotenv");
//load env vars
dotenv.config({ path: "./config/config.env" });
const path = require("path");
const express = require("express");
const colors = require("colors");
const fileupload = require("express-fileupload");
require("./db/mongoose");

//route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

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

//fileupload middleware
app.use(fileupload());
//set static folder so that we can access it in browser
app.use(express.static(path.join(__dirname, "public")));
//mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

//custome middleware for error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `server is running wild ${process.env.NODE_ENV} mode on ${PORT}`.yellow.bold
  );
});
