require('dotenv').config()

const openai = require('./openai')

async function demo () {
  // const { data: models } = await openai.listModels()
  // console.log('Models', models)

  const { data: completion } = await openai.createCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{
      role: 'user',
      content: 'Say this is a test!'
    }]
  })
  console.log('Completion', completion)
}

demo()