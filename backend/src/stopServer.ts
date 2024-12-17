import { serverTerminatorEvent } from './server/serverTerminatorEvent'
;(() => {
  const argv = process.argv
  const serverNameArg = argv.find((arg) => arg.startsWith('--server='))
  const serverName = serverNameArg?.split('=')[1]
  serverTerminatorEvent(serverName)
})()
