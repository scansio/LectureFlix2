import multer from 'multer'
import BaseController from '../controllers/base/BaseController'
import path from 'path'
import { rand } from '../libs/md5'
import fs from 'fs'
import IUser from '../types/IUser'

class FileStore {
  private storage
  private upload
  private privateDir
  private privateDirName
  private publicDir
  private publicDirName
  private activeDir
  private activeDirName

  constructor(
    private controller: BaseController,
    private isPublic = false,
    private allowedFileTypes = ['image/jpeg', 'image/png'],
    user?: IUser['_id'],
  ) {
    this.privateDirName = `/file_store/private/user/${user ? user : this.controller.user._id}`
    this.publicDirName = `/cdn/file_store/${this.controller?.user?._id || 'anonymous'}`
    this.privateDir = path.resolve(`${__dirname}/../..${this.privateDirName}`)
    this.publicDir = path.resolve(`${__dirname}/../..${this.publicDirName}`)
    fs.mkdirSync(this.privateDir, { recursive: true })
    fs.mkdirSync(this.publicDir, { recursive: true })
    this.activeDir = this.isPublic ? this.publicDir : this.privateDir
    this.activeDirName = `${this.isPublic ? this.publicDirName : this.privateDirName}/`
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.activeDir)
      },
      filename: (req, file, cb) => {
        cb(null, `${rand(12345, 678910)}.${file.mimetype.split('/')[1]}`)
      },
    })
    this.upload = multer({
      storage: this.storage,
      limits: {
        fieldSize: 2 * 1024 * 1024, // Set max size for non-file fields (e.g., text fields)
        fileSize: 5 * 1024 * 1024, // Set max size for uploaded files (e.g., images)
      },
      fileFilter: (req, file, cb) => {
        if (this.allowedFileTypes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new Error('Invalid file type. (jpeg or png only)'))
        }
      },
    })
  }

  public uploadFor(filename: string): Promise<boolean | string> {
    return new Promise((resolve, reject) => {
      this.upload.single(filename)(this.controller.req, this.controller.res, (error) => {
        if (error) {
          return reject(error)
        }
        const file = this.controller.req.file
        if (!file) {
          return reject(false)
        } else {
          return resolve(this.activeDirName + file.filename)
        }
      })
    })
  }

  public uploadForMultiple(filename: string, maxCount: number = 10): Promise<boolean | string[]> {
    return new Promise((resolve, reject) => {
      this.upload.array(filename, maxCount)(
        // Use array for multiple files
        this.controller.req,
        this.controller.res,
        (error) => {
          if (error) {
            return reject(error)
          }
          const files = this.controller.req.files
          if (!files || files.length === 0) {
            return reject(false)
          } else {
            const filenames = (files as Express.Multer.File[]).map(
              (file: Express.Multer.File) => this.activeDirName + file.filename,
            )
            return resolve(filenames)
          }
        },
      )
    })
  }

  delete(filename: string) {
    const f = `${this.activeDir}/${filename}`
    try {
      fs.rmSync(f)
    } catch (error) {
      /* empty */
    }
  }
}

export default FileStore
