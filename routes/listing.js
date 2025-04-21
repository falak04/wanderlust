const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/WrapAsync.js');
const ExpressError = require('../utils/Expresserror.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });
const listingController = require('../controllers/listing.js');

router
  .route('/')
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.get('/new', isLoggedIn, listingController.renderNewForm);
router
  .route('/:id')
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isOwner, isLoggedIn, wrapAsync(listingController.deleteListing));

//edit
router.get(
  '/:id/edit',
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.renderReview)
);

module.exports = router;
