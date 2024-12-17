/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema } from 'mongoose'
import ITimestamp from '../../types/ITimestamp'

const UpdateListenerPlugin = <T extends ITimestamp>(scm: Schema<T>, handler: (arg: T) => any): void => {
  scm.post(/update*/, async (docs: T[], next) => {
    if (!Array.isArray(docs)) {
      docs = [docs]
    }
    processHook(docs)
    next()
  })

  scm.post(/save/, async (docs: T[], next) => {
    if (!Array.isArray(docs)) {
      docs = [docs]
    }
    processHook(docs)
    next()
  })

  scm.post(/find*AndUpdate/, async (docs: T[], next) => {
    if (!Array.isArray(docs)) {
      docs = [docs]
    }
    processHook(docs)
    next()
  })

  async function processHook(docs: T[]) {
    if (!docs) {
      return
    }

    for (const doc of docs) {
      handler(doc)
    }
  }
}

export default UpdateListenerPlugin
