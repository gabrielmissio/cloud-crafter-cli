exports.handler = async (event, context) => ({
  statusCode: 200,
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    success: true,
    env: {
      demo01: process.env.VARIABLE_DEMO_1,
      demo02: process.env.VARIABLE_DEMO_2
    },
    event,
    context
  })
})
