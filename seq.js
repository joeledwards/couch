const {colorCode} = require('./log')('seq')

const axios = require('axios')
const durations = require('durations')
const request = require('request')

const url = `https://replicate.npmjs.com/registry/_changes?since=now&limit=1`
const options = {
  validateStatus: status => true
}

const watch = durations.stopwatch().start()

function axiosGet() {
  axios
  .get(url, options)
  .then(resp => {
    watch.stop()
    const {status, data} = resp
    console.log(`[${colorCode(status)}] (${watch})`, data)
  })
  .catch(console.error)
}

function requestGet() {
  request.get(url, (err, {statusCode}, body) => {
    if (err) {
      bole.error('Failed to fetch last sequence from leader:', err)
    } else if (statusCode === 200) {
      const seq = Number.parseInt(JSON.parse(body).last_seq)
      console.log(seq)
    }
  })
}

requestGet()
