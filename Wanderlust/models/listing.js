const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// delete review middleware
listingSchema.post("findOneAndDelete", async (deletedListing) => {
  let res = await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
  // console.log(res);
  console.log("Listing reviews deleted with listing");
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
