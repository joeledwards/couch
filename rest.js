const {color} = require('log-a-log')
const axios = require('axios')

const defaultOpts = {
  validateStatus: status => true
}

const colorCode = status => (
  (status > 499) ? color.yellow : (
  (status > 399) ? color.red : (
  (status > 299) ? color.blue : color.green
)))(`${status}`)

function rest(method) {
  return (url, data, options = {}) => {
    axios({...defaultOpts, ...options, method, url, data})
    .then(({status, data}) => console.log(`[${colorCode(status)}]`, data))
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
  delete: rest('DELETE'),
  colorCode
}
