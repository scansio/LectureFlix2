import { Transporter, createTransport } from 'nodemailer'
import { Address, AttachmentLike, Headers } from 'nodemailer/lib/mailer'
import * as fs from 'fs'
import UserEmailNotificationModel from '../models/UserEmailNotificationModel'
import path from 'path'
import { rand } from '../libs/md5'
import UserEmailAuthenticationModel from '../models/UserEmailAuthenticationModel'
import UserModel from '../models/UserModel'
import SharedConfig from '../libs/SharedConfig'
import { getCurrentUrlWithoutQueryParams } from '../common'
import Logger from './Logger'
import IAny from '../types/IAny'

export interface Recipient extends Address {}

class Mailer {
  transporter: Transporter
  from?: string = SharedConfig.get('SERVICE_MAIL_ADDRESS')
  senderName?: string = SharedConfig.get('SERVICE_MAIL_NAME')
  title?: string = SharedConfig.get('SERVICE_MAIL_TITLE')
  subject?: string
  body?: string
  html?: string
  replyTo?: string
  headers?: Headers[]
  recipients: Recipient[] = []
  attachments: AttachmentLike[] = []
  call2Action?: string
  call2ActionText?: string
  complimentary?: string

  constructor() {
    // configure email transport
    const options: IAny = {
      host:
        process.env.ENVIRONMENT === 'development'
          ? SharedConfig.get('MAILER_SERVER')
          : SharedConfig.get('MAILER_SERVER_TEST'),
      port:
        process.env.ENVIRONMENT === 'development'
          ? SharedConfig.get('MAILER_SERVER_PORT')
          : SharedConfig.get('MAILER_SERVER_PORT_TEST'),
      secure: false,
      pool: true,
    }
    process.env.ENVIRONMENT === 'development' &&
      (options['auth'] = {
        user: SharedConfig.get('MAILER_USERNAME'),
        pass: SharedConfig.get('MAILER_PASSWORD'),
      })
    this.transporter = createTransport(options)
  }

  setFrom(address: string, name: string): Mailer {
    this.from = address
    this.senderName = name
    return this
  }

  setSubject(value: string): Mailer {
    this.subject = value
    return this
  }

  setBody(
    body: string,
    call2Action: string = `${SharedConfig.get('SITE_URL')}`,
    call2ActionText: string = 'Visit our platform to learn more',
    complimentary: string = 'Thanks',
  ): Mailer {
    this.body = body
    this.call2Action = call2Action
    this.call2ActionText = call2ActionText
    this.complimentary = complimentary
    return this
  }

  setReplyTo(value: string): Mailer {
    this.replyTo = value
    return this
  }

  setHeaders(header: Headers): Mailer {
    this.headers?.push(header)
    return this
  }

  addAttachment(value: AttachmentLike): Mailer {
    this.attachments.push(value)
    return this
  }

  addRecipient(value: Recipient): Mailer {
    this.recipients.push(value)
    return this
  }

  addRecipients(values: Recipient[]): Mailer {
    values.forEach((value) => {
      this.recipients.push(value)
    })
    return this
  }

  async send(save: boolean = false) {
    const result = {
      status: false,
      message: 'Not Sent',
    }
    if (!this.from) {
      result.message = 'From required'
      return result
    }
    if (!this.subject) {
      result.message = 'Subject required'
      return result
    }
    if (!this.body) {
      result.message = 'Body required'
      return result
    }
    if (this.recipients.length == 0) {
      result.message = 'Recipient required'
      return result
    }
    const numRecipients = this.recipients.length
    let numSuccess = 0
    try {
      await Promise.all(
        this.recipients.map(async (recipient) => {
          await this.prepareBodyFor(recipient.name)
          const options = {
            from: this.from,
            to: recipient.address,
            subject: this.subject,
            html: this.html,
            replyTo: this.replyTo,
            attachments: this.attachments,
          }
          try {
            const sent = await this.transporter.sendMail(options)
            if (sent && sent.accepted.length > 0) {
              ++numSuccess
              if (save) {
                try {
                  const saveOptions = {
                    from: `${this.from}`,
                    subject: `${this.subject}`,
                    body: `${this.body}`,
                    html: `${this.html}`,
                    replyTo: `${this.replyTo}`,
                    headers: `${this.headers}`,
                    recipients: this.recipients,
                    attachments: this.attachments,
                    call2Action: `${this.call2Action}`,
                    call2ActionText: `${this.call2ActionText}`,
                    complimentary: `${this.complimentary}`,
                    senderName: `${this.senderName}`,
                  }
                  UserEmailNotificationModel.create(saveOptions)
                } catch (error) {
                  Logger.log('error', error)
                }
              }
            }
          } catch (error) {
            result.message = result.message.concat(`\n${(error as Error).message}`)
            Logger.log('error', error)
          }
        }),
      )

      if (numRecipients == numSuccess) {
        result.message = 'ok'
        result.status = true
      } else {
        result.message = 'Not all went through\n'.concat(result.message)
        ;(result as IAny).success = numSuccess
        ;(result as IAny).fail = numRecipients - numSuccess
      }
      //console.log(result.message)
      Logger.log('error', result.message)
      return result
    } catch (error) {
      result.message = `${(error as Error).message}`
      Logger.log('error', error)
      return result
    }
  }

  private async prepareBodyFor(name: string) {
    const p = path.resolve(`${__dirname}/../../dist/configs/email_template.html`)
    this.html = fs.readFileSync(p, 'utf8')
    const emailSkeleton = SharedConfig.get('email_skeleton')
    const bodyOptions = {
      '[EMAIL_SKELETON]': emailSkeleton,
      '[NAME]': name,
      '[SITE_URL]': SharedConfig.get('SITE_URL'),
      '[API_URL]': SharedConfig.get('API_URL') || getCurrentUrlWithoutQueryParams(),
      '[SITE_TITLE]': SharedConfig.get('SITE_TITLE'),
      '[SITE_TAGLINE]': SharedConfig.get('SITE_TAGLINE'),
      '[TEXT]': this.body,
      '[TITLE]': this.title,
      '[BUTTON_LINK]': this.call2Action,
      '[BUTTON_TEXT]': this.call2ActionText,
      '[ADDITIONAL_TEXT]': this.complimentary,
      '[FROM_NAME]': this.senderName,
    }
    for (const k in bodyOptions) {
      const key = k.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
      const regex = new RegExp(key, 'g')
      this.html = this.html.replace(regex, (bodyOptions as IAny)[k] as string)
    }
    return this.html
  }

  public async sendConfirmationCode() {
    const code = rand(123456, 987654)
    const user = await UserModel.findOne({
      email: this.recipients[0].address,
    }).exec()
    if (!user) {
      return
    }
    const auth = {
      uid: user._id,
      code,
      duration: Date.now(),
    }
    try {
      UserEmailAuthenticationModel.findOneAndUpdate({ uid: user._id }, auth, {
        upsert: true,
        new: true,
      }).exec()
    } catch (error) {
      /* empty */
    }
    this.call2ActionText = `${code}`
    this.send()
    return code
  }
}

export default Mailer
