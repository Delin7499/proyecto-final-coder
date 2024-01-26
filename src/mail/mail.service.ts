import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
@Injectable()
export class MailService {
  private transport: any;

  constructor() {
    this.transport = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.APP_PASS,
      },
    });
  }

  async send(user: string, subject: string, html: string) {
    const result = await this.transport.sendMail({
      from: process.env.MAIL_USER,
      to: user,
      subject,
      html,
    });

    return result;
  }
}
