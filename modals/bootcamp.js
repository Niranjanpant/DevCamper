const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const BootcampSchema = new mongoose.Schema(
  {
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
        enum: ["Point"],
        // required: false,
      },
      coordinates: {
        //[Number] representes array of numbers
        type: [Number],
        // required: false,
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//create bootcamp slug from the name property
BootcampSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//geocode and Create location field
BootcampSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address);

  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipCode: loc[0].zipCode,
    country: loc[0].countryCode,
  };
  //do not save address in db
  this.address = undefined;
  next();
});

//casacde delete courses when bootcamp is deleted
BootcampSchema.pre("remove", async function (next) {
  await this.model("Course").deleteMany({ bootcamp: this._id });
  next();
});

//virtualizing == reverse populate with
BootcampSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "bootcamp",
  justOne: false,
});

const Bootcamp = mongoose.model("Bootcamp", BootcampSchema);

module.exports = Bootcamp;
