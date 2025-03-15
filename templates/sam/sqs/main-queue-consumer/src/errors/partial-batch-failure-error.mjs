export class PartialBatchFailureError {    
    constructor(messageId, payload) {
        this.messageId = messageId
        this.payload = payload
    }
}