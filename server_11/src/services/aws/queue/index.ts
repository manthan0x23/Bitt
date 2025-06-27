import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from "@aws-sdk/client-sqs";
import { Env } from "../../../utils/env";

export class SubmissionQueueService {
  private client: SQSClient;
  private queueUrl: string;

  constructor() {
    this.client = new SQSClient({
      region: Env.AWS_REGION,
      credentials: {
        accessKeyId: Env.AWS_ACCESS_KEY,
        secretAccessKey: Env.AWS_SECRET_KEY,
      },
    });
    this.queueUrl = Env.AWS_SQS_FIFO_QUEUE_URL;
  }

  /**
   * Sends a submission job to the FIFO queue
   */
  async sendSubmission(submissionId: string): Promise<boolean> {
    const payload = { submissionId };

    const command = new SendMessageCommand({
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(payload),
      MessageGroupId: "code-submissions",
      MessageDeduplicationId: submissionId,
    });

    try {
      await this.client.send(command);
      return true;
    } catch (err) {
      throw new Error("Failed to enqueue submission");
    }
  }

  /**
   * Receives messages from the FIFO queue
   */
  async receiveMessages(
    maxMessages = 1,
    waitTimeSeconds = 5,
    visibilityTimeout = 30
  ): Promise<Message[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: maxMessages,
      WaitTimeSeconds: waitTimeSeconds,
      VisibilityTimeout: visibilityTimeout,
      MessageAttributeNames: ["All"],
    });

    try {
      const response = await this.client.send(command);
      return response.Messages ?? [];
    } catch (err) {
      console.error("Failed to receive SQS messages", err);
      return [];
    }
  }

  /**
   * Deletes a processed message from the queue
   */
  async deleteMessage(receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: receiptHandle,
    });

    try {
      await this.client.send(command);
    } catch (err) {
      console.error("Failed to delete SQS message", err);
    }
  }
}
