const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

// Function to send a message to the SQS queue
const sendTaskToSQS = async (dataId) => {
  const params = {
    QueueUrl: process.env.AWS_SQS_URL,
    MessageBody: JSON.stringify({ dataId }),
  };

  try {
    const result = await sqsClient.send(new SendMessageCommand(params));
    return result;
  } catch (error) {
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

module.exports = { sendTaskToSQS };
