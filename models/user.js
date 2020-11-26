const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  login: { type: String, required: true, unique: true },
  intraId: { type: Number, required: true, unique: true },
  evaluations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Evaluation'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User