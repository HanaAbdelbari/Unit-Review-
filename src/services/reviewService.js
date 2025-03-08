const mongoose = require('mongoose');
const Ajv = require('ajv');
const fs = require('fs');
const addFormats = require('ajv-formats');
const Review = require('../models/review');

// Load the review schema from the JSON file
const reviewSchema = JSON.parse(fs.readFileSync('./schemas/review.json', 'utf8'));
const ajv = new Ajv();
addFormats(ajv);
const validate = ajv.compile(reviewSchema);

// Function to create a review
const createReview = async (reviewData) => {
    // Validate the review data
    const valid = validate(reviewData);
    if (!valid) {
        throw new Error('Invalid review data: ' + JSON.stringify(validate.errors));
    }

    const review = new Review(reviewData);
    await review.save();
    return review;
};

// Function to get reviews based on filter criteria
const getReviews = async (filter) => {
    return await Review.find(filter);
};

module.exports = {
    createReview,
    getReviews,
};