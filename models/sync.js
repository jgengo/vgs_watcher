const mongoose = require('mongoose')


const syncSchema = new mongoose.Schema({
  model: { type: String, required: true }, // [scale_teams, users]
})

syncSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    returnedObject.created_at = (new mongoose.Types.ObjectId).getTimestamp()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

syncSchema.virtual('created_at').get( () => {
  return (new mongoose.Types.ObjectId).getTimestamp()
})

const Sync = mongoose.model('Sync', syncSchema)

module.exports = Sync