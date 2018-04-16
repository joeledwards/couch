//const axios = require('axios')
const oboe = require('oboe')
const url = 'https://replicate.npmjs.com/_changes'

/*
axios.get(url)
.then(response => {
  response
})
*/

oboe(url)
.node('!.*', node => {
  console.log('received a node')
})
.done(nodes => {
  console.info('Changes stopped.')
})
.fail(error => {
  console.error('Error reading changes:', error)
})

