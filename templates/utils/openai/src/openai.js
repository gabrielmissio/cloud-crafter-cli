const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_ID,
  apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

module.exports = openai
