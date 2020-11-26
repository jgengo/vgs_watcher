const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (_, res) => {
    const users = await User.find({}).populate('evaluations', { 
        intraId: 1,
        beginAt: 1,
        repo: 1,
    })
    res.json(users)
})

// usersRouter.post('/', async (req, res) => {
//     const body = req.body
//     const user = new User({
//     })
//     const savedUser = await user.save()
//     res.status(201).json(savedUser)
// })

module.exports = usersRouter