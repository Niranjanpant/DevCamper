const fs = require("fs");
const mongoose = require("mongoose");

const dotenv = require("dotenv");

//load env vars
dotenv.config({ path: "./config/config.env" });
//load modals
const Bootcamp = require("./modals/bootcamp");
const Course = require("./modals/course");
//connect to db
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: true,
  useUnifiedTopology: true,
});

//read json files

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, "utf-8")
);
//import data to database

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    console.log("data imported");
    process.exit();
  } catch (e) {
    console.log(e);
  }
};

//dlete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    console.log("data deleted");
  } catch (e) {
    console.log(e);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
