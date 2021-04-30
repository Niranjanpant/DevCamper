const express = require("express");
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadPhotoBootcamp,
} = require("../controllers/bootcamps");
const Bootcamp = require("../modals/bootcamp");
const advancedResults = require("../middleware/advancedResult");

//include other resource router
const courseRouter = require("./courses");

const router = express.Router();

//re-route into other resource router
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipCode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(advancedResults(Bootcamp, "courses"), getBootcamps)
  .post(createBootcamp);

router.route("/:id/photo").put(uploadPhotoBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
