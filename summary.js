require('log-a-log')

const axios = require('axios')
const durations = require('durations')

const couch = `https://replicate.npmjs.com/registry`
//const url = `${couch}/_changes?since=now&limit=1`
const url = couch

const options = {
  validateStatus: status => true
}

const watch = durations.stopwatch().start()

axios
.get(url, options)
.then(resp => {
  watch.stop()
  const {status, data} = resp
  console.log(`[${status}] (${watch})`, data)
})
.catch(console.error)

