const express = require('express')
require('express-async-errors')

const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')

const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/users', usersRouter)

app.use(middleware.errorHandler)

module.exports = app