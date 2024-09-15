import { sendMessage } from "./infra/queue-api.mjs"

export async function handler(event) {
    try {
        console.log('envs:', process.env)
        const body = JSON.parse(event.body)

        const { value, errors } = validateRequest(body)
        if (errors) return makeResponse({ errors }, 400)

        // TODO: implement batch sending
        // TODO: keep success/error of messages sent
        for (const key in value) {
            for (let i = 0; i < value[key].count; i++) {
                console.log('sending message:', key)
                const result = await sendMessage({
                    body: JSON.stringify({ type: value[key].type }),
                    queueUrl: process.env.MAIN_QUEUE_URL
                })
                console.log('message sent:', result)
            }
        }

        return makeResponse({ success: true }, 200)
    } catch (error) {
        console.error(error)
        return makeResponse(error, 500)
    }
}

function validateRequest(body) {
    const errors = []

    if (body.successCount && typeof body.successCount !== 'number') {
        errors.push({ error: 'successCount must be a number' })
    }
    if (body.fatalErrorCount && typeof body.fatalErrorCount !== 'number') {
        errors.push({ error: 'fatalErrorCount must be a number' })
    }
    if (body.retryableErrorCount && typeof body.retryableErrorCount !== 'number') {
        errors.push({ error: 'retryableErrorCount must be a number' })
    }
    if (body.nonRetryableErrorCount && typeof body.nonRetryableErrorCount !== 'number') {
        errors.push({ error: 'nonRetryableErrorCount must be a number' })
    }

    return {
        value: {
            success: { count: body.successCount || 0, type: 'Success' },
            fatalError: { count: body.fatalErrorCount || 0, type: 'Fatal' },
            retryableError: { count: body.retryableErrorCount || 0, type: 'Retryable' },
            nonRetryableError: { count: body.nonRetryableErrorCount || 0, type: 'NonRetryable' },
        },
        errors: errors.length ? errors : null,
    }
}

function makeResponse(body = {}, statusCode = 200) {
    return {
        statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    }
}
