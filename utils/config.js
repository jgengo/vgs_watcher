require('dotenv').config()

const PORT = process.env.PORT || 3000
const MONGODB_URI = (process.env.NODE_ENV === 'test') ? process.env.MONGODB_TEST_URI : process.env.MONGODB_URI

const VGS_API_URI = process.env.VGS_API_URI
const VGS_API_SECRET = process.env.VGS_API_SECRET

const INTRA_UID = process.env.INTRA_UID
const INTRA_SECRET = process.env.INTRA_SECRET

module.exports = {
  INTRA_SECRET,
  INTRA_UID,
  VGS_API_SECRET,
  VGS_API_URI,
  MONGODB_URI,
  PORT
}