const axios = require('axios')

const defaultOpts = {
  validateStatus: status => true
}

function rest(method) {
  return (url, data, options = {}) => {
    axios({...defaultOpts, ...options, method, url, data})
    .then(({status, data}) => console.log(`[${status}]`, data))
    .catch(console.error)
  }
}

module.exports = (alias) => {
  logInit({alias})
  
  return {
    head: rest('HEAD'),
    options: rest('OPTIONS'),
    get: rest('GET'),
    post: rest('POST'),
    put: rest('PUT'),
    patch: rest('PATCH'),
    copy: rest('COPY'),
    delete: rest('DELETE'),
    axios,
    colorCode
  }
}
