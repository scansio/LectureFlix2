import mongoose, { Schema } from 'mongoose'
import { Recipient } from '../miscs/Mailer'
import IEmailNotification from '../types/IEmailNotification'
import TimestampsPlugin from './plugins/TimestampsPlugin'

export const recipientSchema: Schema<Recipient> = new Schema<Recipient>({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },

  address: {
    type: String,
    required: [true, 'Address is required'],
  },
})

export const attachmentSchema: Schema<Recipient> = new Schema<Recipient>({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },

  address: {
    type: String,
    required: [true, 'Address is required'],
  },
})

export const UserEmailNotificationSchema: Schema<IEmailNotification> = new Schema<IEmailNotification>({
  from: {
    type: String,
  },
  to: {
    type: String,
  },
  subject: {
    type: String,
  },
  header: {
    type: String,
  },
  body: {
    type: String,
  },
  html: {
    type: String,
  },
  replyTo: {
    type: String,
  },
  headers: {
    type: String,
  },
  recipients: {
    type: [recipientSchema],
  },
  attachments: {
    type: [attachmentSchema],
  },
  call2Action: {
    type: String,
  },
  call2ActionText: {
    type: String,
  },
  complimentary: {
    type: String,
  },
  senderName: {
    type: String,
  },
})

const UserEmailNotificationModel = mongoose.model<IEmailNotification>(
  'UserEmailNotification',
  TimestampsPlugin(UserEmailNotificationSchema),
)

export default UserEmailNotificationModel
