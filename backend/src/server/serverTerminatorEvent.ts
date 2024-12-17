import fs from 'fs'
import path from 'path'

const IPC = path.resolve(__dirname, 'server-terminator-ipc')

export const startServerTerminatorListener = (server: string, cb: () => void) => {
  fs.watchFile(IPC, (curr, prev) => {
    if (curr.mtime > prev.mtime) {
      fs.readFile(IPC, 'utf8', (err, serverName) => {
        if (err) {
          console.log('Error reading IPC: ' + IPC, err)
        } else {
          serverName = `${serverName}`.trim()
          if (serverName && (serverName === server || serverName === 'All')) {
            cb()
          }
        }
      })
    }
  })
}

export const serverTerminatorEvent = (server?: string) => fs.writeFileSync(IPC, `${server || 'All'}`)
