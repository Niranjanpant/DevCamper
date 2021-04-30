const express = require("express");
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../modals/course");
const advancedResults = require("../middleware/advancedResult");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(createCourse);

router.route("/:id").get(getCourse).post(updateCourse).delete(deleteCourse);

module.exports = router;
