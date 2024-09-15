import { sendMessage } from "./infra/queue-api.mjs"
import { RetryableError } from "./errors/retryable-error.mjs"
import { batchFailureAlert } from "./infra/notification-api.mjs"

export async function handler(event, context) {
    try {
        console.info("index", "handler", JSON.stringify({ event, context, envs: process.env }))
        const recordPromises = event.Records.map(recordHandler)
        const results = await Promise.allSettled(recordPromises)
        console.info("index", "handler", JSON.stringify(results))

        const batchFailures = results
            .filter(result => result.status === "rejected")
        const retryableBatchFailures = batchFailures 
            .filter(result => result.reason instanceof RetryableError)
            .map(result => ({ itemIdentifier: result.status === "rejected" ? result.reason.messageId : undefined }))

        if (batchFailures.length > 0) {
            const batchFailureAlertResult = await batchFailureAlert({
                context,
                totalRecords: event.Records.length,
                failedRecords: batchFailureAlert.length
            }).catch((error) => ({ error: "Unable to send batchFailureAlert", reason: error }))
            console.info("index", "handler", { batchFailureAlertResult })
        }

        const result = { batchItemFailures: retryableBatchFailures }
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
            INVALID_REQUEST_ERROR: 'InvalidRequest',
            NON_RETRYABLE_ERROR: 'NonRetryable',
            RETRYABLE_ERROR: 'Retryable',
            FATAL_ERROR: 'Fatal',
            SUCCESS: 'Success'
        }

        console.log("index", "recordHandler", body)

        switch (body.type) {           
            case options.SUCCESS:
                return true
            case options.FATAL_ERROR:
                await sendToDlq(record)
                return Promise.reject(new Error("Any Fatal Error"))
            case options.NON_RETRYABLE_ERROR:
                await sendToErrorQueue(record)
                return Promise.reject(new Error("Non Retryable Error"))
            case options.INVALID_REQUEST_ERROR:
                await sendToDlq(record)
                return Promise.reject(new Error("Invalid Request Error"))
            case options.RETRYABLE_ERROR:
                return Promise.reject(new RetryableError(record.messageId, "Any Retryable Error"))
            default:
                return Promise.reject(new RetryableError(record.messageId, "Unknow Error"))
        }
    } catch (error) {
        console.error("index", "recordHandler", error.message, error.stack, error.payload)
        throw new RetryableError(record.messageId, error.message)
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
        throw new RetryableError(record.messageId, error.message)
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
        throw new RetryableError(record.messageId, error.message)
    }
}
