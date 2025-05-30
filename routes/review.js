const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/Expresserror.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require('../middleware.js');
const reviewController = require('../controllers/review.js');

// Create Review
router.post(
  '/',
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// Delete Review
router.delete(
  '/:reviewId',
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;
