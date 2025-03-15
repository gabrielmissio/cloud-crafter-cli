import { PartialBatchFailureError } from './partial-batch-failure-error.mjs'

export class RetryableError extends PartialBatchFailureError {
    constructor(messageId, payload) {
        super(messageId, payload)
    }
}
