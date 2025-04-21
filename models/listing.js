const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review.js');
const { ref } = require('joi');

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default:
        'https://unsplash.com/photos/the-sun-is-setting-over-the-ocean-with-a-palm-tree-in-the-foreground-cMZnLi0piN0',
      set: (v) =>
        v === ''
          ? 'https://unsplash.com/photos/the-sun-is-setting-over-the-ocean-with-a-palm-tree-in-the-foreground-cMZnLi0piN0'
          : v,
    },
  },
  price: { type: Number, required: true, default: 0 },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingSchema.post('findOneAndDelete', async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
