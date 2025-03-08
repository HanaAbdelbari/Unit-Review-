const reviewService = require('../services/reviewService'); // Import the review service

// Handler for reviewData
const handleAddReview = async (messageContent, replyQueue, channel, correlationId) => {
    try {
        const review = await reviewService.createReview(messageContent); // Use the service to create a review
        console.log("Review saved to database:", review);

        // Send a response back to the reply queue
        channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify({ status: 'success', review })), {
            correlationId: correlationId,
        });
    } catch (error) {
        console.error("Error saving review to database:", error);
        channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify({ status: 'error', message: error.message })), {
            correlationId: correlationId,
        });
    }
};

// Handler for reviewsFilter
const handleGetReviews = async (messageContent, replyQueue, channel, correlationId) => {
    try {
        const reviews = await reviewService.getReviews(messageContent); // Use the service to get reviews
        console.log("Fetched reviews based on filter:", reviews);

        // Send the filtered reviews back to the reply queue
        channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify({ status: 'success', reviews })), {
            correlationId: correlationId,
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify({ status: 'error', message: error.message })), {
            correlationId: correlationId,
        });
    }
};

// Main handler to route messages based on the routing key
const handleMessage = async (routingKey, messageContent, replyQueue, channel, correlationId) => {
    switch (routingKey) {
        case 'Zokhrof.Interiordesigner.Projects.AddReview':
            await handleAddReview(messageContent, replyQueue, channel, correlationId);
            break;
        case 'Zokhrof.Interiordesigner.Projects.GetReviews':
            await handleGetReviews(messageContent, replyQueue, channel, correlationId);
            break;
        default:
            console.warn(`Unhandled routing key: ${routingKey}`);
            // Optionally, you can send an error response for unhandled routing keys
            channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify({ status: 'error', message: 'Unhandled routing key' })), {
                correlationId: correlationId,
            });
            break;
    }
};

module.exports = {
    handleMessage,
};