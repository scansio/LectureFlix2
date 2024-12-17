"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = require("nodemailer");
const fs = __importStar(require("fs"));
const UserEmailNotificationModel_1 = __importDefault(require("../models/UserEmailNotificationModel"));
const path_1 = __importDefault(require("path"));
const md5_1 = require("../libs/md5");
const UserEmailAuthenticationModel_1 = __importDefault(require("../models/UserEmailAuthenticationModel"));
const UserModel_1 = __importDefault(require("../models/UserModel"));
const SharedConfig_1 = __importDefault(require("../libs/SharedConfig"));
const common_1 = require("../common");
const Logger_1 = __importDefault(require("./Logger"));
class Mailer {
    transporter;
    from = SharedConfig_1.default.get('SERVICE_MAIL_ADDRESS');
    senderName = SharedConfig_1.default.get('SERVICE_MAIL_NAME');
    title = SharedConfig_1.default.get('SERVICE_MAIL_TITLE');
    subject;
    body;
    html;
    replyTo;
    headers;
    recipients = [];
    attachments = [];
    call2Action;
    call2ActionText;
    complimentary;
    constructor() {
        // configure email transport
        const options = {
            host: process.env.ENVIRONMENT === 'development'
                ? SharedConfig_1.default.get('MAILER_SERVER')
                : SharedConfig_1.default.get('MAILER_SERVER_TEST'),
            port: process.env.ENVIRONMENT === 'development'
                ? SharedConfig_1.default.get('MAILER_SERVER_PORT')
                : SharedConfig_1.default.get('MAILER_SERVER_PORT_TEST'),
            secure: false,
            pool: true,
        };
        process.env.ENVIRONMENT === 'development' &&
            (options['auth'] = {
                user: SharedConfig_1.default.get('MAILER_USERNAME'),
                pass: SharedConfig_1.default.get('MAILER_PASSWORD'),
            });
        this.transporter = (0, nodemailer_1.createTransport)(options);
    }
    setFrom(address, name) {
        this.from = address;
        this.senderName = name;
        return this;
    }
    setSubject(value) {
        this.subject = value;
        return this;
    }
    setBody(body, call2Action = `${SharedConfig_1.default.get('SITE_URL')}`, call2ActionText = 'Visit our platform to learn more', complimentary = 'Thanks') {
        this.body = body;
        this.call2Action = call2Action;
        this.call2ActionText = call2ActionText;
        this.complimentary = complimentary;
        return this;
    }
    setReplyTo(value) {
        this.replyTo = value;
        return this;
    }
    setHeaders(header) {
        this.headers?.push(header);
        return this;
    }
    addAttachment(value) {
        this.attachments.push(value);
        return this;
    }
    addRecipient(value) {
        this.recipients.push(value);
        return this;
    }
    addRecipients(values) {
        values.forEach((value) => {
            this.recipients.push(value);
        });
        return this;
    }
    async send(save = false) {
        const result = {
            status: false,
            message: 'Not Sent',
        };
        if (!this.from) {
            result.message = 'From required';
            return result;
        }
        if (!this.subject) {
            result.message = 'Subject required';
            return result;
        }
        if (!this.body) {
            result.message = 'Body required';
            return result;
        }
        if (this.recipients.length == 0) {
            result.message = 'Recipient required';
            return result;
        }
        const numRecipients = this.recipients.length;
        let numSuccess = 0;
        try {
            await Promise.all(this.recipients.map(async (recipient) => {
                await this.prepareBodyFor(recipient.name);
                const options = {
                    from: this.from,
                    to: recipient.address,
                    subject: this.subject,
                    html: this.html,
                    replyTo: this.replyTo,
                    attachments: this.attachments,
                };
                try {
                    const sent = await this.transporter.sendMail(options);
                    if (sent && sent.accepted.length > 0) {
                        ++numSuccess;
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
                                };
                                UserEmailNotificationModel_1.default.create(saveOptions);
                            }
                            catch (error) {
                                Logger_1.default.log('error', error);
                            }
                        }
                    }
                }
                catch (error) {
                    result.message = result.message.concat(`\n${error.message}`);
                    Logger_1.default.log('error', error);
                }
            }));
            if (numRecipients == numSuccess) {
                result.message = 'ok';
                result.status = true;
            }
            else {
                result.message = 'Not all went through\n'.concat(result.message);
                result.success = numSuccess;
                result.fail = numRecipients - numSuccess;
            }
            //console.log(result.message)
            Logger_1.default.log('error', result.message);
            return result;
        }
        catch (error) {
            result.message = `${error.message}`;
            Logger_1.default.log('error', error);
            return result;
        }
    }
    async prepareBodyFor(name) {
        const p = path_1.default.resolve(`${__dirname}/../../dist/configs/email_template.html`);
        this.html = fs.readFileSync(p, 'utf8');
        const emailSkeleton = SharedConfig_1.default.get('email_skeleton');
        const bodyOptions = {
            '[EMAIL_SKELETON]': emailSkeleton,
            '[NAME]': name,
            '[SITE_URL]': SharedConfig_1.default.get('SITE_URL'),
            '[API_URL]': SharedConfig_1.default.get('API_URL') || (0, common_1.getCurrentUrlWithoutQueryParams)(),
            '[SITE_TITLE]': SharedConfig_1.default.get('SITE_TITLE'),
            '[SITE_TAGLINE]': SharedConfig_1.default.get('SITE_TAGLINE'),
            '[TEXT]': this.body,
            '[TITLE]': this.title,
            '[BUTTON_LINK]': this.call2Action,
            '[BUTTON_TEXT]': this.call2ActionText,
            '[ADDITIONAL_TEXT]': this.complimentary,
            '[FROM_NAME]': this.senderName,
        };
        for (const k in bodyOptions) {
            const key = k.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            const regex = new RegExp(key, 'g');
            this.html = this.html.replace(regex, bodyOptions[k]);
        }
        return this.html;
    }
    async sendConfirmationCode() {
        const code = (0, md5_1.rand)(123456, 987654);
        const user = await UserModel_1.default.findOne({
            email: this.recipients[0].address,
        }).exec();
        if (!user) {
            return;
        }
        const auth = {
            uid: user._id,
            code,
            duration: Date.now(),
        };
        try {
            UserEmailAuthenticationModel_1.default.findOneAndUpdate({ uid: user._id }, auth, {
                upsert: true,
                new: true,
            }).exec();
        }
        catch (error) {
            /* empty */
        }
        this.call2ActionText = `${code}`;
        this.send();
        return code;
    }
}
exports.default = Mailer;
