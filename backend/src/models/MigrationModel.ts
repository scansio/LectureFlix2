/* eslint-disable @typescript-eslint/no-explicit-any */
import { resolve } from 'path'
import Logger from '../miscs/Logger'
import { Model, QueryOptions, ReturnsNewDoc } from 'mongoose'
import { findFilesRecursively } from '../common'
import { writeFile } from 'fs/promises'
import { EXPORT_DIRNAME } from '../configs/constants'
import IAny from '../types/IAny'

export interface IDoc {
  [name: string]: IAny[]
}

export interface IModels {
  [name: string]: typeof Model
}

export type IUpdatingOption = QueryOptions<IAny> & { upsert: true } & ReturnsNewDoc

class MigrationModel {
  modelDir = resolve(__dirname, '..', 'models')
  models: IModels = {}

  private constructor() {}

  static async initModels(): Promise<MigrationModel> {
    const thiz = new this()
    await thiz.initModels()
    return thiz
  }

  private async initModels() {
    const modelPaths = await findFilesRecursively(this.modelDir, [], ['.js'])
    for (const modelPath of modelPaths) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const model = require(modelPath).default
        model && model.modelName && (this.models[model.modelName] = model)
      } catch (error) {
        Logger.error(error)
      }
    }
  }

  getModel(name: string): Model<any> {
    name = name.split('Model')[0]
    return this.models[name]
  }

  async backup() {
    const backupPath = resolve(__dirname, '..', '..', '..', EXPORT_DIRNAME)
    const models = await this.getAll()
    for (const model of models) {
      const [name] = Object.keys(model)
      const modelString = JSON.stringify(model)
      await writeFile(`${backupPath}/${name}.json`, modelString)
    }
    return models
  }

  async getAll() {
    const models: IAny[] = []
    for (const [name, model] of Object.entries(this.models)) {
      try {
        const docs = await (<Promise<any>>model!.find().exec())
        if (!docs) continue
        models.push({ [name]: docs })
      } catch (error) {
        Logger.error(error)
      }
    }
    return models
  }

  async create(modelDocs: IDoc[], updatingOption?: IUpdatingOption) {
    const updating = !!updatingOption
    let msg = ''

    for (const modelDoc of modelDocs) {
      const [name, docs] = Object.entries(modelDoc)[0]
      const model = this.getModel(name)
      for (const doc of docs) {
        try {
          if (updating) {
            await model?.findOneAndUpdate({ _id: doc?._id }, doc, updatingOption || {})
          } else {
            await model?.create(doc)
          }
        } catch (error) {
          //Logger.error(error)
          msg += `${(error as any)?.message}\n\n`
        }
      }
      msg += `Docs ${updating ? 'update in' : 'add to'} ${name}\n`
    }
    return msg
  }

  async update(modelDocs: IDoc[], updatingOption?: IUpdatingOption) {
    return await this.create(modelDocs, updatingOption || ({} as any))
  }

  async delete(models?: []) {
    if (!models || models.length < 1) {
      for (const model of Object.values(this.models)) {
        await model.deleteMany().exec()
      }
    } else {
      for (const modelName of models) {
        await this.getModel(modelName).deleteMany().exec()
      }
    }
  }
}

export default MigrationModel
