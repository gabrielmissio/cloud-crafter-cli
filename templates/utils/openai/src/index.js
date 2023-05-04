const fetch = require('cross-fetch')

const isLocalhost = process.env.IS_LOCALHOST === 'true'
if (isLocalhost) require('dotenv').config()

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

async function main () {
  const models = await getModels()
  console.log('Models', models)

  const prompt = {
    messages: [
      { role: 'user', content: 'Say this is a test!' }
    ],
    temperature: 0.7
  }
  const promptResponse = await sendPrompt(prompt, 'gpt-3.5-turbo')
  console.log('Prompt response', promptResponse)
}

main()
