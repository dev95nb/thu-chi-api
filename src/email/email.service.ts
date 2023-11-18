import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: nodemailer.Transporter;
  constructor(private configService: ConfigService) {
    const user = this.configService.get<string>('email.user');
    const pass = this.configService.get<string>('email.pass');
    this.transporter = nodemailer.createTransport({
      host: 'smtp.elasticemail.com',
      port: 2525,
      secure: false,
      auth: {
        user,
        pass,
      },
    });
  }
  async sendCodeVerifyUser(to: string, name: string, code: number) {
    const senderVerifyEmail = this.configService.get<string>(
      'email.sender_verify_email',
    );

    const senderVerifyEmailName = this.configService.get<string>(
      'email.sender_verify_email_name',
    );
    await this.transporter.sendMail({
      from: `"${senderVerifyEmailName}" <${senderVerifyEmail}>`,
      to,
      subject: 'Test Verify email code',
      html: this._genHtmlContentVerifyUser(name, code),
    });
  }

  _genHtmlContentVerifyUser(name: string, code: number) {
    return `${name},<br/><br/> ${code}`;
  }
}
