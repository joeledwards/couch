const {colorCode} = require('./log')('seq')

const axios = require('axios')
const follow = require('follow')
const ChangesStream = require('changes-stream')

const db = 'https://replicate.npmjs.com/registry'
const context = 10
const limit = 5

const options = {
  db,
  include_docs: true,
  attachments: true,
}

const getSequence = () => {
  return axios.get(`${db}/_changes?since=now&limit=${limit}`)
  .then(({data}) => data.last_seq)
}

const follower = (limit) => {
  let count = 0
  return (error, change) => {
    count++

    if (error) {
      console.error(`Error in CouchDB follower:`, error)
    } else {
      //console.log(`[change-${count}]`, JSON.stringify(change, null, 2))
      //console.log(`[change-${count}]`, Object.keys(change.doc || {}))
      console.log(`[change-${count}]`, Object.keys(change.doc || {}))
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

  const handler = follower(limit) 

  // driver: changes-stream
  /*
  const stream = new ChangesStream({...options, since})
  stream.on('readable', () => {
    const change = stream.read()
    handler(null, change)
  })
  stream.on('error', error => follower(error))
  */

  // driver: follow
  follow({...options, since}, handler)
})
.catch(error => {
  console.error('Error:', error)
})

