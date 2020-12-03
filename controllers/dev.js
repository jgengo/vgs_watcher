const devRouter = require('express').Router()

const User = require('../models/user')
const Sync = require('../models/sync')
const Evaluation = require('../models/evaluation')

devRouter.get('/reset_db', async (_, res) => {
  await User.deleteMany({})
  await Sync.deleteMany({})
  await Evaluation.deleteMany({})

  res.status(204).end()
})

// usersRouter.post('/', async (req, res) => {
//     const body = req.body
//     const user = new User({
//     })
//     const savedUser = await user.save()
//     res.status(201).json(savedUser)
// })

module.exports = devRouter