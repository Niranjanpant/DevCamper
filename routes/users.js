const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const router = express.Router();
const User = require("../modals/user");
const { protect, authorize } = require("../middleware/auth");
const advancedResults = require("../middleware/advancedResult");

router.use(protect);
router.use(authorize("admin"));
router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).put(deleteUser);

module.exports = router;
