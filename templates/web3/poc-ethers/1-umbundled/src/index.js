const { generateTx } = require('./helpers/generateTransaction')
const { generateAddress } = require('./helpers/generateAddress')

let isColdStartController = true
const stage = process.env.STAGE || 'dev'

exports.handler = async (event, context) => {
  const { requestContext, body } = event
  const { path, method: httpMethod } = requestContext.http

  console.log(`Request: ${httpMethod} ${path}`)

  try {
    if (httpMethod === 'GET' && path === `/${stage}/health-check`) {
      return formatResponse(200, { message: 'OK' })
    }

    if (httpMethod === 'GET' && path === `/${stage}/new-address`) {
      return formatResponse(200, await generateAddress())
    }

    if (httpMethod === 'POST' && path === `/${stage}/generate-tx`) {
      const payload = JSON.parse(body)
      return formatResponse(200, await generateTx(payload))
    }

    return formatResponse(404, { error: `Route not found: ${httpMethod} ${path}` })
  } catch (err) {
    console.error('Handler error:', err)
    // Returning original error is not recommended, but helpful for debugging
    // Let's keep it simple — remember this is just a PoC.
    return formatResponse(500, { error: err.message })
  }
}

function formatResponse (statusCode, data) {
  console.log({ statusCode, data })
  const isColdStart = isColdStartController

  if (isColdStart) {
    isColdStartController = false
  }

  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      isColdStart,
      ...data
    })
  }
}
