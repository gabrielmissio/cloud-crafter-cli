import { PartialBatchFailureError } from './partial-batch-failure-error.mjs'

export class NonRetryableError extends PartialBatchFailureError {
    constructor(messageId, payload) {
        super(messageId, payload)
    }
}
