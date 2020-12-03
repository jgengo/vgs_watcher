const express = require('express')
require('express-async-errors')

const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')


const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)
if (process.env.NODE_ENV === 'development') {
  const devRouter = require('./controllers/dev')
  app.use('/api/dev', devRouter)
}
app.use(middleware.errorHandler)

module.exports = app