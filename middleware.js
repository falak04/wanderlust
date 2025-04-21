const Listing = require('./models/listing');
const Review = require('./models/review');
const ExpressError = require('./utils/Expresserror.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const review = require('./models/review.js');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //info save
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'you must be logged in to creat elisting');
    return res.redirect('/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params; // ✅ Extract 'id' from the route parameters
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash('error', 'Listing not found');
    return res.redirect('/listings');
  }

  if (!req.user || !listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash('error', 'You are not the owner of this listing');
    return res.redirect(`/listings/${id}`);
  }

  next();
};
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; // ✅ Extract 'id' from the route parameters
  const review = await Review.findById(reviewId);

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash('error', 'You are not the owner of this review');
    return res.redirect(`/listings/${id}`);
  }

  next();
};
