const mongoose = require('mongoose');
const fs = require('fs');
const mongoosify = require('mongoosify');

// Load the review schema from the JSON file
const reviewSchemaJson = JSON.parse(fs.readFileSync('./schemas/review.json', 'utf8'));

// Convert the JSON schema to a Mongoose schema using mongoosify
const mySchema = mongoosify(reviewSchemaJson);

// Create a Mongoose schema
const mongooseSchema = new mongoose.Schema(mySchema);

// Create and export the Mongoose model
module.exports = mongoose.model('Review', mongooseSchema);
