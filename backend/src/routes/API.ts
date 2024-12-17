import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'
import { IAPI } from './interfaces/IAPI'
import IAPIVersionInfo from './interfaces/IAPIVersionInfo'
import { writeFile } from 'fs/promises'
import { IControllerRoute } from './interfaces/IControllerRoute'

const API: IAPI = []

const isDir = (dir: string) => {
  const stats = statSync(dir)
  return stats.isDirectory()
}

const versionsDir = resolve(__dirname, 'versions')
for (const dir of readdirSync(versionsDir)) {
  const dirPath = resolve(versionsDir, dir)
  const controllerRoutes: IControllerRoute[] = []
  let info: IAPIVersionInfo | null = null

  const recursive = (__dirPath: string) => {
    for (const filename of isDir(__dirPath) ? readdirSync(__dirPath) : []) {
      const filePath = resolve(__dirPath, filename)
      if (isDir(filePath)) {
        recursive(filePath)
      } else if (filename.endsWith('.js')) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const fetch = (__filePath: string) => require(resolve(__filePath)).default
        if (filename === 'info.js') {
          info = fetch(filePath)
        } else {
          controllerRoutes.push(fetch(filePath))
        }
      }
    }
  }

  recursive(dirPath)

  if (info) {
    API.push({ info, controllerRoutes, status: (info as any).status })
  }
}

const APIDocPath = resolve(__dirname, '..', '..', 'cdn', 'APIDoc.json')
const APIDoc = JSON.stringify(API)

writeFile(APIDocPath, APIDoc)

export default API
