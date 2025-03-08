const express = require('express');
const fs = require('fs');
const { createReview, getReviews } = require('../controllers/reviewController');

const router = express.Router();

// Load OpenAPI specification from the root schemas folder
const openApiSpec = JSON.parse(fs.readFileSync('./schemas/openapi.json', 'utf8'));

// Use the OpenAPI spec for documentation
router.post('/', createReview);
router.get('/', getReviews);

// Optionally, you can expose the OpenAPI spec as an endpoint
router.get('/openapi.json', (req, res) => {
    res.json(openApiSpec);
});

module.exports = router;
