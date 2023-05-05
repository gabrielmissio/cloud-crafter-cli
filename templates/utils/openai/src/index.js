require('dotenv').config()

const openai = require('./openai')

async function demo () {
  const { data } = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: 'Hello, World!'
    }]
  })
  console.log('Chat Completion:', JSON.stringify(data))
}

demo().catch((error) => {
  if (error.response) {
    console.log(error.response.status)
    console.log(error.response.data)
  } else {
    console.log(error.message)
  }
})
