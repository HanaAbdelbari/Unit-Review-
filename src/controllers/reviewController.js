const reviewService = require('../services/reviewService'); // Import the review service

exports.createReview = async (req, res) => {
    console.log('Incoming request body:', req.body);

    try {
        const review = await reviewService.createReview(req.body); // Use the service to create a review
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(400).json({ message: error.message }); // Return 400 for validation errors
    }
};

exports.getReviews = async (req, res) => {
    const { serviceId, userId, reviewType } = req.query;

    const filter = {};

    // Add filter for serviceId if provided
    if (serviceId) {
        filter.serviceId = serviceId;
    }

    // Add filter for userId if provided
    if (userId) {
        filter.$or = [
            { clientId: userId },
            { providerId: userId }
        ];
    }

    // Add filter for reviewType if provided
    if (reviewType) {
        filter.reviewType = reviewType;
    }

    try {
        const reviews = await reviewService.getReviews(filter); // Use the service to get reviews
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews.', error: error.message });
    }
};