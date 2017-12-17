const {colorCode} = require('./log')('seq')

const axios = require('axios')
const follow = require('follow')

const db = 'https://replicate.npmjs.com/registry'
const context = 10
const limit = 10
const options = {
  db,
  include_docs: false
}

const getSequence = () => {
  return axios.get(`${db}/_changes?since=now&limit=1`)
  .then(({data}) => data.last_seq)
}

const follower = (limit) => {
  let count = 0
  return (error, change) => {
    count++

    if (error) {
      console.error(`Error in CouchDB follower:`, error)
    } else {
      console.log(`[change-${count}]`, JSON.stringify(change, null, 2))
    }

    // Only process up to the limit
    if (limit > 0 && count >= limit) {
      process.exit(0)
    }
  }
}

getSequence()
.then(sequence => {
  const since = sequence - context
  console.log(`Following from sequence ${since}`)
  follow({...options, since}, follower(limit))
})

