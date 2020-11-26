const logger = require('./logger')
const vgsService = require('../services/vogsphere')
const intraService = require('../services/intra')

const User = require('../models/user')
const usersRouter = require('../controllers/users')

const vgsIsAlive = async () => {
  try {
    await vgsService.ping()
  } catch(err) {
    if (err.response)
      logger.error(`${err.response.status} - data: ${JSON.stringify(err.response.data)}`)
    else 
      logger.error(err)
  }
}

const intraIsAlive = async () => {
  try {
    await intraService.req('GET', 'users/jgengo')
  } catch(err) {
    if (err.response)
      logger.error(`${err.response.status} - data: ${JSON.stringify(err.response.data)}}`)
    else
      logger.error(err)
  }
}

const populateUser = async () => {
  let users = await intraService.reqAll('GET', 'users?filter[staff?]=false&filter[primary_campus_id]=13')
  
  // remove anonymized ones
  users = users.filter( user => !user.login.startsWith('3b3-')  )

  await Promise.all(

    users.map(async (user) => {
      const u = await User.findOne({intraId: user.id})
      
      if (!u) {
        newUser = new User({
          intraId: user.id,
          login: user.login,
        })
        try {
          await newUser.save()
        } catch(err) {
          console.log(`[init] error while creating user ${user.login} - ${err}`)
        }
      }
    })
  )
}


const check = () => {
  vgsIsAlive()
  intraIsAlive()
}

module.exports = { check, populateUser }