const logger = require('./logger')
const vgsService = require('../services/vogsphere')
const intraService = require('../services/intra')

const vgsIsAlive = async () => {
  try {
    await vgsService.ping()
    logger.info('\tvogsphere ✔')
  } catch(err) {
    if (err.response)
      logger.error(`${err.response.status} - data: ${JSON.stringify(err.response.data)}`)
    else 
      logger.error(err)
  }
}

const intraIsAlive = async () => {
  try {
    const res = await intraService.req('GET', 'users/jgengo')
    logger.info('\tintra api ✔')
  } catch(err) {
    if (err.response)
      logger.error(`${err.response.status} - data: ${JSON.stringify(err.response.data)}}`)
    else
      logger.error(err)
  }
}

const run = () => {
  logger.info("[init] config + health check")
  vgsIsAlive()
  intraIsAlive()
}

module.exports = { run }