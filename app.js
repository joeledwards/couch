const rest = require('./rest')
const yargs = require('yargs')

const url = `http://localhost:15984`

module.exports = makeApp

function makeApp(app) {
  const args = yargs.argv._

  if (typeof app === 'function') {
    app({args, rest, url})
  } else if (app instanceof Array) {
    const argSet = app
    if (args.length !== argSet.length) {
      const argList = argSet.map(a => `<${a}>`).join(' ')
      console.error(`Usage: ${args.$0} ${argList}`)
      process.exit(1)
    }

    return makeApp
  } else if (Number.isInteger(app)) {
    const argCount = app
    if (args.length !== argCount) {
      console.error(`${app} argument${argCount === 1 ? '' : 's'} required`)
      process.exit(1)
    }

    return makeApp
  } else {
    console.error(`Bad app setup!`)
    process.exit(1)
  }
}
