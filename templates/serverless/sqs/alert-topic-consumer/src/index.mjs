export async function handler(event, context) {
    console.info("index", "handler", JSON.stringify({ event, context, envs: process.env }))

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event,
            context,
            success: true,
            envs: process.env
        })
    }
}
