import { spawn } from 'child_process'
import * as fs from 'fs'
import { resolve } from 'path'
import IServerConfig from './types/IServerConfig'
;(async () => {
  const argv = process.argv
  const serverNameArg = argv.find((arg) => arg.startsWith('--server='))
  const serverName = serverNameArg?.split('=')[1]

  const servers: IServerConfig[] = [
    { name: 'MainServer', module: resolve(__dirname, './server/MainServer') },
    {
      name: 'SchedulingServer',
      module: resolve(__dirname, './server/SchedulingServer'),
    },
    {
      name: 'RepoHookServer',
      module: resolve(__dirname, './server/RepoHookServer'),
    },
    { name: 'CdnServer', module: resolve(__dirname, './server/CdnServer') },
    {
      name: 'SocketServer',
      module: resolve(__dirname, './server/SocketServer'),
    },
  ]


  const forkServer = (serverConfig: IServerConfig) => {
    // Open files for stdout and stderr logging
    const out = fs.openSync(`./${serverConfig.name}-out.log`, 'a')
    const err = fs.openSync(`./${serverConfig.name}-err.log`, 'a')

    // Spawn the child process
    const child = spawn('node', [serverConfig.module], {
      detached: true, // Ensure the child process runs independently of its parent
      stdio: ['ignore', out, err], // Ignore stdin, and direct stdout and stderr to the log files
    })

    // Allow the parent to exit while the child continues running
    //child.unref();
  }

  const found = serverName && servers.find((serverConfig) => serverName === serverConfig.name)

  if (found) {
    forkServer(found)
  } else {
    for (const serverConfig of servers) {
      forkServer(serverConfig)
    }
  }
})()
