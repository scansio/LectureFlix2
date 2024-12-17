/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
import Config from './configs/repohook.config'
import { Config as Configuration, Credential } from './configs/repohook.config'
import { Request, Router, Response, NextFunction } from 'express'
import * as path from 'path'
import * as child_process from 'child_process'
import * as fs from 'fs'
import dotenv from 'dotenv'
import IAny from './types/IAny'

enum WriteType {
  BASE,
  REPO_PARENT,
  CREDENTIAL,
}

enum ReadType {
  CREDENTIAL,
  BASE,
  CUSTOM_BASE,
  REPO_CUSTOM_BASE,
}

class RepoHooks {
  req?: Request
  res?: Response
  next?: NextFunction
  commandTimeout!: number | undefined
  LIFT_DEPLOYMENT_KEY: string
  GIT_ORIGIN: string

  private constructor(
    private app?: Router,
    private credential?: { username: string; password: string },
  ) {
    dotenv.config()
    this.LIFT_DEPLOYMENT_KEY = `${process.env.LIFT_DEPLOYMENT_KEY}`
    this.GIT_ORIGIN = `https://${this.LIFT_DEPLOYMENT_KEY}@github.com/${process.env.GITHUB_USERNAME}`
  }

  static async instance(app?: Router, credential?: { username: string; password: string }) {
    const thiz = new RepoHooks(app, credential)
    await thiz.init()
    return thiz
  }

  private async init() {
    if (this.app) {
      this.app.use(async (req: Request, res: Response, next: NextFunction) => {
        this.req = req
        this.res = res
        this.next = next

        const requestArguments = { ...req.params, ...req.body } as {
          [k: string]: string
        }

        this.commandTimeout = requestArguments.commandTimeout
          ? parseInt(requestArguments.commandTimeout) * 1000
          : undefined

        const pathnames = req.path.split('/')
        const pathname = pathnames[1]

        switch (pathname) {
          case 'credential':
            this.checkMethod()
            this.authenticate(requestArguments)
            this.setCredential(requestArguments)
            this.success()
            break

          case 'sync':
            const path = req.path
            const searchString = 'sync/'
            const parts = path.split(searchString)
            const repo = parts[1]
            !repo && this.fail('Append repo name in the url')
            await this.sync({ ...requestArguments, repo: `${repo}` })
            break

          case 'push':
            this.checkMethod()
            this.authenticate(requestArguments)
            await this.push(requestArguments)
            break

          case 'run':
            this.checkMethod()
            this.authenticate(requestArguments)
            await this.run(requestArguments)
            break

          case 'config':
            this.checkMethod()
            this.authenticate(requestArguments)
            this.config(requestArguments)
            this.success()
            break

          default:
            this.fail('Invalid route')
            break
        }
      })

      this.app.use(this.terminator)
    } else {
      this.authenticate(this.credential || {})
    }
  }

  private checkMethod(method = 'post') {
    if (this.req) {
      const reqMethod = this.req.method.toLowerCase()
      if (method !== reqMethod) {
        return this.fail('Invalid Method')
      }
      return true
    }
  }

  private setCredential({ newUsername, newPassword }: { [k: string]: string }) {
    this.write({
      type: WriteType.CREDENTIAL,
      value: { username: newUsername, password: newPassword },
    })
  }

  private fail(message?: string) {
    this.send(400, message)
  }

  private authFail(message?: string) {
    this.send(403, message)
  }

  private send(statusCode = 400, message = '') {
    const terminatingSignal = new Error()
    ;(terminatingSignal as any).statusCode = statusCode
    terminatingSignal.message = message
    if (this.next) {
      this.next(terminatingSignal)
    } else {
      if (statusCode != 200) {
        throw terminatingSignal
      } else {
        return terminatingSignal
      }
    }
  }

  private success(message?: string) {
    this.send(200, message)
  }

  private async sync({ repo }: { [k: string]: string }) {
    const repoDir = this.getPath(repo)
    await this.exec(
      repoDir,
      `git pull ${this.getOrigin(repo)}`,
      //"npm run build",
      'sudo systemctl restart liftMainServer',
    )
  }

  async push({ repo, commitMessage }: { [k: string]: string }) {
    commitMessage = commitMessage ? `${commitMessage}` : 'Repo Hook push: ' + new Date().toUTCString()

    const repoDir = this.getPath(repo)

    await this.exec(repoDir, `git add .`, `git commit -am "${commitMessage}" `, `git push ${this.getOrigin(repo)}`)
  }

  async run({ repo, command }: { [k: string]: string }) {
    const repoDir = this.getPath(repo)
    await this.exec(repoDir, command)
  }

  async exec(repoDir: string, ...commands: string[]) {
    process.chdir(repoDir)

    try {
      const commandReturns: Promise<any>[] = []
      let lock = 0
      for (let i = 0; i < commands.length; i++) {
        const command = commands[i]
        const commandTemp = `${command}`
        commandReturns.push(
          new Promise((resolve, _reject) => {
            //Execute immediately if first
            if (lock == 0 && i == 0) {
              const runningCommand = child_process.exec(commandTemp, (error: any, stdout: any, stderr: any) => {
                let msg = ''
                if (error) {
                  msg += error.message
                } else {
                  msg += `${command} executed successfully: ${stdout}`
                }
                lock++
                resolve(msg)
              })
              this.timeRunningCommandOut({ runningCommand, resolve, timeout: this.commandTimeout })
            } else {
              const intervalId = setInterval(() => {
                if (lock == i) {
                  const runningCommand = child_process.exec(commandTemp, (error: any, stdout: any, stderr: any) => {
                    let msg = ''
                    if (error) {
                      msg += error.message
                    } else {
                      msg += `${command} executed successfully: ${stdout}`
                    }
                    lock++
                    resolve(msg)
                  })
                  this.timeRunningCommandOut({ runningCommand, resolve, timeout: this.commandTimeout })
                  clearInterval(intervalId)
                }
              }, 500)
            }
          }),
        )
      }
      const results = await Promise.all(commandReturns)
      const stdout = results.reduce((prev, current) => {
        return (prev += '\n\n' + current)
      })
      this.success(stdout as string)
    } catch (error: any) {
      this.fail(error.message)
    }
  }

  private timeRunningCommandOut({
    runningCommand,
    timeout = 1000 * 60,
    resolve,
  }: {
    runningCommand: child_process.ChildProcess
    timeout?: number
    resolve(arg: any): any
  }) {
    // Set a timeout to terminate the command if it exceeds the specified timeout
    const timeoutId = setTimeout(() => {
      runningCommand.kill() // Terminate the command
      resolve && resolve(`Command timed out after ${timeout} milliseconds`)
    }, timeout)

    runningCommand.on('exit', () => {
      clearTimeout(timeoutId) // Cancel the timeout if the command exits before timeout
    })
  }

  private getParentPath(repo: string) {
    const d = this.getData() as Configuration
    let base = d.customBase[repo]
    if (base) {
      base = path.resolve(base)
    } else {
      base = path.resolve(__dirname, d.base)
    }
    return base
  }

  private getPath(repo: string) {
    const parent = this.getParentPath(repo)
    const repoPath = path.join(parent, repo)
    return repoPath
  }

  private getOrigin(repo: string) {
    return `${this.GIT_ORIGIN}/${repo}`
  }

  private setBase(value: string) {
    this.write({ type: WriteType.BASE, value })
  }

  private getData(type?: number, name?: string): Configuration | Credential | { [k: string]: string } | string {
    const config = Config as any as Configuration
    let value: null | string | Credential | IAny = null

    switch (type) {
      case ReadType.CREDENTIAL:
        value = name ? config.credential[name as string] : config.credential
        break

      case ReadType.REPO_CUSTOM_BASE:
        value = name ? config.customBase[name as string] : config.customBase
        break

      case ReadType.CUSTOM_BASE:
        value = name ? { [name]: config.customBase[name as string] } : config.customBase
        break

      case ReadType.BASE:
        value = config.base
        break

      default:
        value = config
        break
    }

    return value
  }

  private authenticate({ username, password }: { [k: string]: string }) {
    const credential = this.getData(ReadType.CREDENTIAL) as Credential
    if (!(username == credential.username && password == credential.password)) {
      this.authFail('Invalid credential')
    }
  }

  private write({ type, value, name }: { type: WriteType; value: any; name?: string }) {
    const config = Config as any as Configuration

    switch (type) {
      case WriteType.CREDENTIAL:
        value.username && (config.credential.username = value.username)
        value.password && (config.credential.password = value.password)
        break

      case WriteType.REPO_PARENT:
        config.customBase[name as string] = value as string
        break

      case WriteType.BASE:
      default:
        config.base = value as string
        break
    }
    return this._write(config as any)
  }

  private remove({ repo }: { [k: string]: string }) {
    const config = Config as any as Configuration
    config.customBase[repo] && delete config.customBase[repo]
    this._write(config as any)
  }

  private _write(obj: { [k: string]: string }) {
    const data = JSON.stringify(obj)
    const outPath = path.join(__dirname, 'configs', 'repohook.config.json')
    try {
      fs.writeFileSync(outPath, data)
    } catch (error) {
      this.fail((error as any).message)
    }
  }

  private config({ base, repo, parentPath, removeRepo }: { [k: string]: string }) {
    if (base) {
      try {
        const tp = path.resolve(base)
        fs.accessSync(tp, fs.constants.W_OK)
        this.setBase(tp)
      } catch (error: any) {
        this.fail('Error resolving base: ' + error.message)
      }
    }

    removeRepo && this.remove({ repo: removeRepo })

    if (repo && parentPath) {
      try {
        const tpp = path.resolve(parentPath)
        const existRepoDir = path.join(tpp, repo)
        fs.accessSync(tpp, fs.constants.W_OK)
        fs.accessSync(existRepoDir, fs.constants.W_OK)
        this.write({
          type: WriteType.REPO_PARENT,
          value: parentPath,
          name: repo,
        })
      } catch (error: any) {
        this.fail('Error resolving parentPath: ' + error.message)
      }
    }
  }

  private terminator(error: Error, req: Request, res: Response, next: NextFunction) {
    res.status((error as any).statusCode || 400).send(error.message || 'Service unavailable')
  }
}

export default RepoHooks
