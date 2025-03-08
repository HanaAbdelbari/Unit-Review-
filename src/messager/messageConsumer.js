const amqp = require('amqplib');
const { handleMessage } = require('./messageHandlers'); // Import the handler function

let channel;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        channel = await connection.createChannel();

        // Define the queue name for consuming messages
        const queueName = 'zokhrof.interiordesigner.reviews.q';
        
        // Start consuming messages from the queue
        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const routingKey = msg.fields.routingKey; // Get the routing key
                const messageContent = JSON.parse(msg.content.toString()); // Parse the message content
                const replyQueue = msg.properties.replyTo; // Get the reply queue
                const correlationId = msg.properties.correlationId; // Get the correlation ID

                // Debug logging
                console.debug(`Received message: ${JSON.stringify(messageContent)}`);
                console.debug(`Routing Key: ${routingKey}`);
                console.debug(`Reply Queue: ${replyQueue}`);
                console.debug(`Correlation ID: ${correlationId}`);

                // TODO in case of requests, Check if replyQueue and correclationid are not empty
                //if (routingKey.startsWith('request.') && !replyQueue) {
                //    throw new Error("Reply queue is not specified for request messages. Cannot send response.");
                //}

                try {
                    // Handle the message based on the routing key
                    await handleMessage(routingKey, messageContent, replyQueue, channel, correlationId);
                } catch (error) {
                    console.error("Error processing message:", error);

                    // Send an error response back
                    channel.sendToQueue(replyQueue, Buffer.from(JSON.stringify({ status: 'error', message: error.message })), {
                        correlationId: correlationId,
                    });
                }

                channel.ack(msg); // Acknowledge the message
            }
        });

        console.log(`Waiting for messages in '${queueName}'.`);

        // Handle connection close
        connection.on('close', () => {
            console.error('RabbitMQ connection closed. Attempting to reconnect...');
            setTimeout(connectRabbitMQ, 5000); // Retry connection after 5 seconds
        });

        // Handle connection error
        connection.on('error', (error) => {
            console.error('RabbitMQ connection error:', error);
        });

    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        setTimeout(connectRabbitMQ, 5000); // Retry connection after 5 seconds
    }
};

module.exports = connectRabbitMQ;