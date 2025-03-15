let isLambdaWarmupController = false

exports.handler = async (event, context) => {
  const isLambdaWarmup = isLambdaWarmupController

  if (!isLambdaWarmup) {
    isLambdaWarmupController = true
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: true,
      warmup: isLambdaWarmup,
      env: {
        stage: process.env.STAGE,
        appName: process.env.APP_NAME
      },
      event,
      context
    })
  }
}
