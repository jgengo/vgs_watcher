const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const evaluationSchema = new mongoose.Schema({
  intraId: { type: Number, required: true }, // st.id
  beginAt: { type: Date, required: true }, //st.begin_at
  repo: { type: String, required: true },
  corrector: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  } //corrector{id, login} // st.team.repo_uuid
})

evaluationSchema.set('toJSON', {
  transform: (_, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

evaluationSchema.plugin(uniqueValidator)

const Evaluation = mongoose.model('Evaluation', evaluationSchema)

module.exports = Evaluation