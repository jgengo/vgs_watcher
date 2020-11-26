const axios = require('axios')
const config = require('../utils/config')

axios.defaults.headers.common['X-Secret'] = config.VGS_API_SECRET

const ping = () => {
    return axios.get(config.VGS_API_URI + '/getrepos')
}

module.exports = {
  ping
}