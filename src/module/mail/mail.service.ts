import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async welcomeEmail(data) {
    const { email, receipt } = data;

    const subject = `Your Booking is Successfull : ${name}`;
    const text = `Receipt No RCP0${receipt}`;

    await this.mailerService.sendMail({
      to: email,
      subject,
      text,
    });
  }
}
