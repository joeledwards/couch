const axios = require('axios')

const defaultOpts = {
  validateStatus: status => true
}

function rest(method) {
  return (url, data, options = {}) => {
    axios({...defaultOpts, ...options, method, url, data})
    .then(resp => console.log(`[${resp.status}]`, resp.data))
    .catch(console.error)
  }
}

module.exports = {
  head: rest('HEAD'),
  options: rest('OPTIONS'),
  get: rest('GET'),
  post: rest('POST'),
  put: rest('PUT'),
  patch: rest('PATCH'),
  copy: rest('COPY'),
  delete: rest('DELETE')
}
