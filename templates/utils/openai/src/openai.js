const fetch = require('cross-fetch')

const apiUrl = process.env.OPENAI_API_URL
const apiKey = process.env.OPENAI_API_KEY

async function getModels () {
  const response = await fetch(`${apiUrl}/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  })

  const data = await response.json()
  return data
}

async function sendPrompt (prompt, model) {
  const response = await fetch(`${apiUrl}/engines/${model}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(prompt)
  })

  const data = await response.json()
  return data
}

module.exports = {
  getModels,
  sendPrompt
}
