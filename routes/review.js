const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reveiwController = require("../controllers/reviewController.js");

// POST route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reveiwController.createReview)
);

// Delete reviews
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reveiwController.destroyReview)
);

module.exports = router;
