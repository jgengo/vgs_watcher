require('dotenv').config()

const PORT = process.env.PORT || 3000
const MONGODB_URI = (process.env.NODE_ENV === 'test') ? process.env.MONGODB_TEST_URI : process.env.MONGODB_URI

const VGS_API_URI = process.env.VGS_API_URI
const VGS_API_SECRET = process.env.VGS_API_SECRET

module.exports = {
  VGS_API_SECRET,
  VGS_API_URI,
  MONGODB_URI,
  PORT
}