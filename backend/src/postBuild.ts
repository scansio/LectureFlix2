import { resolve } from 'path'
import { createIndexHtmlRecursively } from './common'

;(async () => {
  await createIndexHtmlRecursively(resolve(__dirname, '..'))
})()
