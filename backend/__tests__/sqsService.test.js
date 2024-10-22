const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");
const { sendTaskToSQS } = require('../services/sqsService');

// Mock the SQSClient
jest.mock('@aws-sdk/client-sqs', () => {
  const mockSend = jest.fn();
  return {
    SQSClient: jest.fn(() => ({
      send: mockSend
    })),
    SendMessageCommand: jest.fn()
  };
});

describe('SQS Service', () => {
  it('should send a message to SQS successfully', async () => {
    // Mock the result of SQS `send` operation
    const mockMessageId = '12345';
    SQSClient().send.mockResolvedValue({ MessageId: mockMessageId });

    // Call the function that sends a message
    const dataId = '601f92f1fc13ae5c93000000';
    const result = await sendTaskToSQS(dataId);

    // Assert that the message was sent and received the correct MessageId
    expect(result.MessageId).toBe(mockMessageId);
    expect(SQSClient().send).toHaveBeenCalledTimes(1);
    expect(SQSClient().send).toHaveBeenCalledWith(expect.any(SendMessageCommand));
  });

  it('should throw an error if SQS send fails', async () => {
    // Mock a failed SQS send operation
    SQSClient().send.mockRejectedValue(new Error('Failed to send message'));

    // Call the function and expect it to throw an error
    const dataId = '601f92f1fc13ae5c93000000';
    await expect(sendTaskToSQS(dataId)).rejects.toThrow('Failed to send message');
  });
});
