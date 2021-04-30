const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "please add a course title"],
  },
  description: {
    type: String,
    required: [true, "please add a description"],
  },
  weeks: {
    type: String,
    required: [true, "please add number of week"],
  },
  tuition: {
    type: Number,
    required: [true, "please add a tution cost"],
  },
  minimumSkill: {
    type: String,
    required: [true, "please add minimun skill"],
    enum: ["beginner", "intermediate", "expert"],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bootcamp",
    required: true,
  },
});

//getAverageCostfunction
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$tuition" },
      },
    },
  ]);
  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost),
    });
  } catch (e) {
    console.log(e);
  }
};

//call getAverageCost after save

CourseSchema.post("save", async function () {
  this.constructor.getAverageCost(this.bootcamp);
});
//call averageCost before remove
CourseSchema.pre("save", async function () {
  this.constructor.getAverageCost(this.bootcamp);
});

const Course = mongoose.model("Course", CourseSchema);

module.exports = Course;
