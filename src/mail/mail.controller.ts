import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { ApiTags } from '@nestjs/swagger';
import { Cron, CronExpression } from '@nestjs/schedule';
@ApiTags('mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService,
    private mailerService: MailerService
  ) { }

  @Cron(CronExpression.EVERY_5_MINUTES)
  @Get()
  @Public()
  @ResponseMessage("Test email")
  @Cron("0 0 0 * * 0")
  async handleTestEmail() {
    await this.mailerService.sendMail({
      to: "tatthang52hz@gmail.com",
      from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: "newjob",
      context: {
        rece: " Thang"
      }
    });
  }
}
