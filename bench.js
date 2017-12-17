const {colorCode} = require('./log')('bench')

const axios = require('axios')
const Promise = require('bluebird')
const chalk = require('chalk')
const durations = require('durations')

// Collect numeric stats 
const stats = ({alias, interval = 5000, rolling = true}) => {
  let lastReport = Date.now()
  let min
  let max
  let sum
  let count

  const reset = () => {
    min = 0
    max = 0
    sum = 0
    count = 0
  }

  const report = () => {
    if (Date.now() - lastReport > interval) {
      lastReport = Date.now()
      console.log(`[${alias}]`, JSON.stringify({
        min, max, sum, count,
        avg: sum / count
      }, null, 2))

      if (rolling) reset()
    }
  }

  return value => {
    if (!count) {
      min = value
      max = value
      sum = value
      count = 1
    } else {
      min = Math.min(min, value)
      max = Math.max(max, value)
      sum += value
      count++
    }

    report()
  }
}

const baseUrl = 'https://replicate.npmjs.com/registry' 
const couches = {
  summary: {
    url: baseUrl,
    attr: 'update_seq'
  },
  follow: {
    url: `${baseUrl}/_changes?since=now&limit=1`,
    attr: 'last_seq'
  }
}

const axiosOptions = {
  validateStatus: status => true
}

//const mode = 'follow'
const mode = 'summary'
const {url, attr} = couches[mode]

// Fetch the tip sequence from the CouchDB
const getSeq = () => {
  const watch = durations.stopwatch().start()

  return axios.get(url, axiosOptions).then(resp => {
    watch.stop()
    const {status, data} = resp
    console.log(`[${colorCode(status)}] (${watch})`, data[attr])

    return {
      sequence: data[attr],
      duration: watch.duration()
    }
  })
}

const totalStats = stats({alias: 'totals', rolling: false})
const intervalStats = stats({alias: 'interval'})

// Recursive runner
// TODO: add support for parallelism
const nextSeq = () => {
  getSeq()
  .then(({sequence, duration}) => {
    totalStats(duration.millis())
    intervalStats(duration.millis())
  })
  .catch(console.error)
  .then(nextSeq, nextSeq)
}

nextSeq()
