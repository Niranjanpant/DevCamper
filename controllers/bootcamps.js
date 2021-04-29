const Bootcamp = require("../modals/bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const geocoder = require("../utils/geocoder");
const asyncHandler = require("../middleware/async");
//@desc  Get all Bootcamps
//@route GET/api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  //copy req.query
  const reqQuery = { ...req.query };

  //remove select as a field
  const removeField = ["select", "sort", "page", "limit"];
  //loop over remove fields to delete them from req.query
  removeField.forEach((field) => delete reqQuery[field]);

  //create query String
  let queryStr = JSON.stringify(reqQuery);

  //create operators like $gt,$gte
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  console.log(req.query);
  //finding resource
  query = Bootcamp.find(JSON.parse(queryStr)).populate("courses");

  //select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  //pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();
  query = query.skip(startIndex).limit(limit);

  //executing query
  const bootcamps = await query;

  //pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, pagination, bootcamps });
});

//@desc  Get a Bootcamp
//@route GET/api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return new ErrorResponse(
      `Bootcamp not found with id of ${req.params.id}`,
      404
    );
  }
  res.status(200).json({ success: true, bootcamp });

  // res.status(200).json({ success: true, msg: `get bootcamp ${req.params.id}` });
});

//@desc  Create a new Bootcamp
//@route POST/api/v1/bootcamps
//@access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc  update a  Bootcamp
//@route PUT/api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return new ErrorResponse(
      `Bootcamp not found with id of ${req.params.id}`,
      404
    );
  }
  res.status(200).json({ success: true, bootcamp });
});

//@desc  delete a  Bootcamp
//@route DELETE/api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return new ErrorResponse(
      `Bootcamp not found with id of ${req.params.id}`,
      404
    );
  }
  bootcamp.remove();
  res.status(200).json({ success: true, data: {} });
});

//@desc  get a bootcamp with radius(distance)
//@route DELETE/api/v1/bootcamps/radius/:zipcode/:distance
//@access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipCode, distance } = req.params;

  //get lat n longitude from geocoder
  const loc = await geocoder.geocode(zipCode);
  const lat = loc[0].latitude;
  const lon = loc[0].longitude;

  //calc radius using radian
  //radius of earth 3963 miles
  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: {
      $geoWithin: { $centerSphere: [[lon, lat], radius] },
    },
  });
  res.status(200).json({ success: true, count: bootcamps.length, bootcamps });
});
