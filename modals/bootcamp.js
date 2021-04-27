const mongoose = require("mongoose");

const BootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "please add a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 character"],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "please add a name"],
    maxlength: [500, "Name cannot be more than 50 character"],
  },
  website: {
    type: String,
    match: [
      /^(https:|http:|www\.)\S*/,
      "please use a valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxLength: [15, "Phone number cannot be longer than 20 characters"],
  },
  email: {
    type: String,
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "please add a valid email"],
  },
  address: {
    type: String,
    required: [true, "please add an address"],
  },
  location: {
    //GeoJSON point
    type: {
      type: String,
      enum: ["point"],
      required: false,
    },
    coordinates: {
      //[Number] representes array of numbers
      type: [Number],
      required: false,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  carrers: {
    //array of stings
    type: [String],
    required: true,
    //it means that this field can oly have the values given below
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating cannot be more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "No-photo.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Bootcamp = mongoose.model("Bootcamp", BootcampSchema);

module.exports = Bootcamp;
