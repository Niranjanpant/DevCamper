const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "please add a  title for a review"],
    maxLength: 100,
  },
  text: {
    type: String,
    required: [true, "please add a text"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, "please add a rating between 1 and 10"],
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});
//prevent user from making more than one review for a bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//static methods to get the average rating for a bootcamp
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageRating: Math.ceil(obj[0].averageRating),
    });
  } catch (e) {
    console.log(e);
  }
};

//call getAverageRating after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

//call getAverageRating before remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.bootcamp);
});

const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
