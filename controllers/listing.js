const geocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const baseClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render('listings/index.ejs', { listings });
};
module.exports.renderNewForm = (req, res) => {
  res.render('listings/new.ejs');
};
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('owner');
  if (!listing) {
    req.flash('error', 'listing you requested for does not exist');
    res.redirect('/listings');
  }
  res.render('listings/show.ejs', { listing });
};
module.exports.createListing = async (req, res, next) => {
  let response = await baseClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newlisting = new Listing(req.body.listing);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };

  newlisting.geometry = response.body.features[0].geometry;

  let savedlist = await newlisting.save();
  console.log(savedlist);
  req.flash('success', 'newlisting');
  res.redirect('/listings');
};
//render editform
module.exports.renderReview = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing you requested does not exist');
    res.redirect('/listings');
  }
  let originalimageUrl = listing.image.url;
  originalimageUrl = originalimageUrl.replace('/upload', '/upload/h_300,w_250');
  res.render('listings/edit.ejs', { listing, originalimageUrl });
};
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
  });
  if (req.file) {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash('success', 'Listing Created');
  res.redirect('/listings');
};
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  req.flash('success', 'listing deleted');
  res.redirect('/listings');
};

