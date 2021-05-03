const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../modals/reviews");
const Bootcamp = require("../modals/bootcamp");

//@desc  Get reviews
//@route GET/api/v1/revies
//@route GET/api/v1/bootcamps/:bootcampId/reviews
//@access Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc  Get single review
//@route GET/api/v1/reviews/:id
//@access Public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await (await Review.findById(req.params.id)).populated({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorResponse(`there is no any review for this bootcamp`, 404)
    );
  }
  res.status(200).json({ success: true, review });
});

//@desc  create a review
//@route POST/api/v1/bootcamp/:bootcampId/reviews
//@access Private

exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp not found`, 404));
  }

  const review = await Review.create(req.body);

  res.status(200).json({ success: true, review });
});

//@desc  update a review
//@route PUT/api/v1/reviews/:id
//@access Private

exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.bootcampId);

  if (!review) {
    return next(new ErrorResponse(`review not found`, 404));
  }
  //make sure review belongs to or user is an admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`not authorize to update`, 401));
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, review });
});

//@desc  delete a review
//@route DELETE/api/v1/reviews/:id
//@access Private

exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.bootcampId);

  if (!review) {
    return next(new ErrorResponse(`review not found`, 404));
  }
  //make sure review belongs to or user is an admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new ErrorResponse(`not authorize to update`, 401));
  }

  await review.remove();
  res.status(200).json({ success: true, data: {} });
});
