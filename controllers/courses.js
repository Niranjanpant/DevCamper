const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../modals/course");

//@desc  Get all courses and courses for a specific bootcamp
//@route GET/api/v1/courses
//@route GET/api/v1/bootcamps/:bootcampId/courses
//@access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find({}).populate({
      path: "bootcamp",
      select: "name description",
    });
  }
  const courses = await query;
  res.status(200).json({ success: true, count: courses.length, data: courses });
});
