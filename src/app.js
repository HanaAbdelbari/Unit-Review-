const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const reviewRoutes = require('./routes/reviewRoutes');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const connectRabbitMQ = require('./messager/messageConsumer'); // Import the RabbitMQ consumer
const fs = require('fs');
const openApiSpec = JSON.parse(fs.readFileSync('./schemas/openapi.json', 'utf8'));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
    origin: '*', // Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.options('*', cors(corsOptions)); // Enable preflight requests for all routes

// MongoDB connection with retry logic
const connectWithRetry = () => {
    mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
    });
};

connectWithRetry();

// Serve Swagger UI
app.use('/api/reviews/doc', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Routes
app.use('/api/reviews', reviewRoutes);

// Start the RabbitMQ consumer without blocking
connectRabbitMQ().then(() => {
    console.log("RabbitMQ consumer started.");
}).catch(err => {
    console.error("Failed to start RabbitMQ consumer:", err);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
