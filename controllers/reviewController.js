const Review = require("../models/reviews");
const Listing = require("../models/listings");

// Create review route
module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.review.push(newReview);

  await newReview.save();
  await listing.save();
  req.flash("success", "New review created!");
  res.redirect(`/listings/${listing._id}`);
};

// delete review route
module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted!");
  res.redirect(`/listings/${id}`);
};
