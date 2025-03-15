let doesLambdaWarmup = false;

exports.handler = async (event, context) => {
    const warmup = doesLambdaWarmup
    
    if (!doesLambdaWarmup) {
        doesLambdaWarmup = true
    }

    return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        success: true,
        warmup,
          env: {
            stage: process.env.STAGE,
            appName: process.env.APP_NAME
          },
          event,
          context
        })
    }
}
  