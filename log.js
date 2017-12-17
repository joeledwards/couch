const {color, init: logInit} = require('log-a-log')

const colorCode = status => (
  (status > 499) ? color.yellow : (
  (status > 399) ? color.red : (
  (status > 299) ? color.blue : color.green
)))(`${status}`)

module.exports = alias => {
  logInit({alias})

  return {
    colorCode
  }
}
