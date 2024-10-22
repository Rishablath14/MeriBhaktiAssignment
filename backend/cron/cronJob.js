const nodeCron = require("node-cron");
const mongoose = require("mongoose");
const Data = require("../models/Data");
const dotenv = require("dotenv");
const { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } = require("@aws-sdk/client-sqs");

dotenv.config();

// Initialize SQS Client
const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

module.exports = (io) => {
  const fetchAndProcessMessages = async () => {
    const params = {
      QueueUrl: process.env.AWS_SQS_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10,
    };

    try {
      const data = await sqsClient.send(new ReceiveMessageCommand(params));
      if (data.Messages) {
        for (const message of data.Messages) {
          const session = await mongoose.startSession();
          session.startTransaction();

          try {
            const { dataId } = JSON.parse(message.Body);

            // Fetch the document within the session
            const data = await Data.findById(dataId).session(session);

            if (data) {
              // Perform a calculation on the data (e.g., character count of title and description)
              data.calculatedField = `Total chars: ${data.title.length + data.description.length}`;

              // Save the updated document within the session
              await data.save({ session });

              // Commit the transaction
              await session.commitTransaction();
              
              // Emit a WebSocket event for real-time frontend update
              io.emit("dataUpdated", data);  // Use the passed io instance

              // Delete the message from SQS
              await sqsClient.send(new DeleteMessageCommand({
                QueueUrl: process.env.AWS_SQS_URL,
                ReceiptHandle: message.ReceiptHandle,
              }));

              console.log(`Processed message with dataId: ${dataId}`);
            } else {
              console.warn(`Data with ID ${dataId} not found`);
            }
          } catch (error) {
            await session.abortTransaction();
            console.error(`Error processing message: ${error.message}`);
          } finally {
            session.endSession();
          }
        }
      } else {
        console.log("No messages received.");
      }
    } catch (error) {
      console.error("Error receiving messages:", error);
    }
  };

  // Schedule the cron job to run every minute
  nodeCron.schedule("* * * * *", fetchAndProcessMessages);
};
