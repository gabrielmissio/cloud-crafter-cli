const express = require('express')
const router = express.Router()
const app = express()

const stage = process.env.STAGE || 'dev'
app.disable('x-powered-by')
app.use(express.json())

router.get('/health-check', (req, res) => {
  res.send('OK')
})

router.get('/throw-error', (req, res) => {
  try {
    throw new Error('This is an error')
  } catch (error) {
    console.error(error)
    console.log('-------')
  }
  res.status(500).send('Error')
})

app.use(`/${stage}`, router)
app.use('*', (req, res) => {
  res.status(404).send(`Route '${req.originalUrl}' not found`)
})

module.exports = app
