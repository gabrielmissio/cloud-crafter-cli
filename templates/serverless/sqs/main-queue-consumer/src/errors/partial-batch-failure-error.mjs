export class PartialBatchFailureError {    
    constructor(messageId, payload) {
        super("Partial bath failure", payload)
        this.messageId = messageId
        this.payload = payload
    }
}