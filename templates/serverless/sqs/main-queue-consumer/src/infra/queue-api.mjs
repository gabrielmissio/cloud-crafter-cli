import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs"

const sqsClient = new SQSClient()

export async function sendMessage({ body, queueUrl }) {
    const sendMessageCommand = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: body,
    })
    const result = await sqsClient.send(sendMessageCommand)

    return result
}
