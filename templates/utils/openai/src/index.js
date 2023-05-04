require('dotenv').config()

// https://platform.openai.com/docs/api-reference
const { getModels, sendPrompt } = require('./openai')

async function demo () {
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

demo()
