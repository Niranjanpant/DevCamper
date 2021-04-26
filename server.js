const express = require("express");
const dotenv = require("dotenv");

//load env vars
dotenv.config({ path: "./config/config.env" });
//route files
const bootcamps = require("./routes/bootcamps");
//logger
const morgan = require("morgan");

const app = express();

//dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//mount routers
app.use("/api/v1/bootcamps", bootcamps);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server is running wild ${process.env.NODE_ENV} mode on ${PORT}`);
});
