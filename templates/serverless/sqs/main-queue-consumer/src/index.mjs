import { sendMessage } from "./infra/queue-api.mjs"
import { batchFailureAlert } from "./infra/notification-api.mjs"
import { PartialBatchFailureError } from "./errors/partial-batch-failure-error.mjs"

export async function handler(event, context) {
    try {
        const recordPromises = event.Records.map(recordHandler)
        const results = await Promise.allSettled(recordPromises)
        console.info("index", "handler", JSON.stringify(results))

        const batchItemFailures = results
            .filter(result => result.status === "rejected")
            .map(result => ({ itemIdentifier: result.status === "rejected" ? result.reason.messageId : undefined }))

        if (batchItemFailures.length > 0) {
            const batchFailureAlertResult = await batchFailureAlert({
                context,
                totalRecords: event.Records.length,
                failedRecords: batchFailureAlert.length
            }).catch((error) => ({ error: "Unable to send batchFailureAlert", reason: error }))
            console.info("index", "handler", { batchFailureAlertResult })
        }

        const result = { batchItemFailures }
        console.info("index", "handler", JSON.stringify(result))

        return result
    } catch (error) {
        console.error("index", "handler", error.message, error.stack, error.payload)
        throw error
    }
}

async function recordHandler(record) {
    try {
        // TODO: ensure record.body is a valid JSON string
        const body = JSON.parse(record.body)

        const options = {
            NON_RETRYABLE_ERROR: 'NonRetryable',
            RETRYABLE_ERROR: 'Retryable',
            FATAL_ERROR: 'Fatal',
            SUCCESS: 'Success'
        }

        switch (body.type) {           
            case options.SUCCESS:
                return true
            case options.FATAL_ERROR:
                await sendToDlq(record)
                return true        
            case options.RETRYABLE_ERROR:
                throw new Error("Any Retryable Error")
            case options.NON_RETRYABLE_ERROR:
                await sendToErrorQueue(record)
                return true // centralize error handling
            default:
                // treat as invalid record / change based on your use case
                await sendToDlq(record)
                return true
        }
    } catch (error) {
        console.error("index", "recordHandler", error.message, error.stack, error.payload)
        throw new PartialBatchFailureError(record.messageId, error)
    }
}

async function sendToErrorQueue(record) {
    try {
        const { ERROR_QUEUE_URL } = process.env

        if (typeof ERROR_QUEUE_URL !== "string") {
            throw new Error("ERROR_QUEUE_URL is not defined")
        }

        // NOTE: we may send additional context to the DLQ to help with error handling
        return await sendMessage({
            queueUrl: ERROR_QUEUE_URL,
            body: record.body,
        })
    } catch (error) {
        console.error("index", "sendToErrorQueue", error.message, error.stack, error.payload)
        throw new PartialBatchFailureError(record.messageId, error)
    }
}

async function sendToDlq(record) {
    try {
        const { DEAD_LETTER_QUEUE_URL } = process.env

        if (typeof DEAD_LETTER_QUEUE_URL !== "string") {
            throw new Error("DEAD_LETTER_QUEUE_URL is not defined")
        }

        // NOTE: we may send additional context to the DLQ to help with error handling
        return await sendMessage({
            queueUrl: DEAD_LETTER_QUEUE_URL,
            body: record.body,
        })
    } catch (error) {
        console.error("index", "sendToDlq", error.message, error.stack, error.payload)
        throw new PartialBatchFailureError(record.messageId, error)
    }
}
