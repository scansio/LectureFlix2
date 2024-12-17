/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express'
import BaseController from './base/BaseController'
import { BAD_REQUEST, GET_SUCCESS, NOTFOUND, POST_SUCCESS } from '../configs/statusCodeConstants'
import multer from 'multer'
import { Model } from 'mongoose'
import MigrationModel, { IUpdatingOption } from '../models/MigrationModel'
import IAny from '../types/IAny'
import IUser from '../types/IUser'

class Migration extends BaseController {
  positions = []
  readonly MAX_FILE_SIZE = 25 * 1024 * 1024 // 25 MB
  readonly ALLOWED_FILE_TYPES = ['application/json']
  migrationModel!: MigrationModel

  upload = multer({
    storage: multer.memoryStorage(), // Can still store in memory if desired
    limits: {
      fileSize: this.MAX_FILE_SIZE,
    },
    fileFilter: (req, file, cb) => {
      if (this.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
        cb(null, true) // Accept the file
      } else {
        cb(new Error('Invalid file type. Only JSON files are allowed.'))
      }
    },
  })

  constructor(req: Request, res: Response, next: NextFunction) {
    super(req, res, next)
    this.__readModelsFiles = this.__readModelsFiles.bind(this)
    this.___readModelsFiles = this.___readModelsFiles.bind(this)
  }

  private __readModelsFiles(resolve: any, reject: any) {
    this.upload.array('docs')(this.req, this.res, this.___readModelsFiles(resolve, reject))
  }

  private ___readModelsFiles(resolve: any, reject: any) {
    return (error: any) => {
      if (error) {
        return reject(error)
      }
      const files: Express.Multer.File[] = this.req.files as any

      if (!files || files.length === 0) {
        return reject(new Error('No files uploaded'))
      }
      const docs: Model<IAny>[] = []

      files.forEach((file: any) => {
        const fileContent = file.buffer.toString()
        if (fileContent) {
          let json
          try {
            json = JSON.parse(fileContent)
          } catch (e) {
            /* empty */
          }
          if (json) {
            docs.push(json)
          }
        }
      })

      return resolve(docs)
    }
  }

  async readModelsFiles(): Promise<IAny[]> {
    return await new Promise(this.__readModelsFiles)
  }

  async init(): Promise<boolean | IUser | null | undefined> {
    this.migrationModel = await MigrationModel.initModels()
    return true
  }

  async names(): Promise<void> {
    this.status(true).statusCode(GET_SUCCESS).setData(Object.keys(this.migrationModel.models)).send()
  }

  async get({ modelName }: any): Promise<void> {
    const model = await this.migrationModel.getModel(modelName)?.find().exec()
    if (!model) this.status(false).statusCode(NOTFOUND).message('Model not found').send()
    else
      this.status(true)
        .statusCode(GET_SUCCESS)
        .setData({ [modelName]: model })
        .send()
  }

  async all() {
    const models = await this.migrationModel.getAll()
    if (!models || models.length < 1) this.status(false).statusCode(NOTFOUND).message('Models not found').send()
    else this.status(true).statusCode(GET_SUCCESS).setData(models).send()
  }

  async backup() {
    const backupData = await this.migrationModel.backup()
    this.status(true).statusCode(GET_SUCCESS).setData(backupData).send()
  }

  async create({ updatingOption, ...data }: any): Promise<void> {
    let modelDocs: IAny[] = []
    if (data && Array.isArray(data)) {
      modelDocs = data
    } else {
      try {
        modelDocs = await this.readModelsFiles()
      } catch (error) {
        this.status(false)
          .statusCode(BAD_REQUEST)
          .message((error as any).message)
          .send()
      }
    }

    if (!modelDocs || modelDocs.length < 1) {
      this.status(false).statusCode(BAD_REQUEST).message('No file content').send()
    }

    const msg = await this.migrationModel.create(modelDocs as any, updatingOption)

    this.status(true)
      .statusCode(POST_SUCCESS)
      .message(msg || `No Model is ${updatingOption ? 'updated' : 'created'}`)
      .send()
  }

  async update(updatingOption: IUpdatingOption): Promise<void> {
    return await this.create({ updatingOption: updatingOption || {} })
  }

  async delete({ all, models }: any): Promise<void> {
    if (all) {
      this.migrationModel.delete()
    } else if (!models) {
      this.status(false)
        .statusCode(BAD_REQUEST)
        .message('Provide a list of model names to delete or specify all to true')
        .send()
    } else {
      this.migrationModel.delete(models)
    }

    this.status(true).statusCode(POST_SUCCESS).message('Models deleted').send()
  }
}

export default Migration
