const User = require("../modals/user");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");

//@desc  Get All Users
//@route GET/api/v1/auth/users
//@access Private/Admin

exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc  Get A User
//@route GET/api/v1/auth/user/:id
//@access Public/Admin

exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});

//@desc  Create A User
//@route Post/api/v1/auth/users
//@access Public/Admin

exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({ success: true, data: user });
});

//@desc  Update A User
//@route PUT/api/v1/auth/users/:id
//@access Public/Admin

exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

//@desc  Delete A User
//@route DELETE/api/v1/auth/users/:id
//@access Public/Admin

exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: user });
});
