const express = require("express");
const { getReviews } = require("../controllers/reviews");

const Review = require("../modals/reviews");
const advancedResults = require("../middleware/advancedResult");
const router = express.Router({ mergeParams: true });

//using protect middleware to give users
//acces to change sensitive information after they are verified

const { protect, authorize } = require("../middleware/auth");

router.route("/").get(
  advancedResults(Review, {
    path: "bootcamp",
    select: "name description",
  }),
  getReviews
);

module.exports = router;
