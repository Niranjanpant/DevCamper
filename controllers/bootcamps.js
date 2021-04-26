//@desc  Get all Bootcamps
//@route GET/api/v1/bootcamps
//@access Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: "show all bootcamp" });
};

//@desc  Get a Bootcamp
//@route GET/api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `get bootcamp ${req.params.id}` });
};

//@desc  Create a new Bootcamp
//@route POST/api/v1/bootcamps
//@access Private
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: "create a bootcamp" });
};

//@desc  update a  Bootcamp
//@route PUT/api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `update bootcamp ${req.params.id}` });
};

//@desc  delete a  Bootcamp
//@route DELETE/api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `delete bootcamp ${req.params.id}` });
};
