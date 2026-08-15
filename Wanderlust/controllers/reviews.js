const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// create review
module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let { review } = req.body;
  let newReview = new Review(review);
  newReview.author = req.user._id;

  let listing = await Listing.findById(id);
  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "Review Added!");
  console.log("Review added to database");
  res.redirect(`/listings/${listing.id}`);
};

// delete review
module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  console.log("Review deleted");
  res.redirect(`/listings/${id}`);
};