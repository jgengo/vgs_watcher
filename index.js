const app = require('./app')
const http = require('http')
const mongoose = require('mongoose')


const config = require('./utils/config.js')
const logger = require('./utils/logger')
const init = require('./utils/init')

const server = http.createServer(app)

init.check()
init.populateUser()
init.populateEvaluation()

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })


server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})