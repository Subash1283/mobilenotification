import { Body, Controller, Post } from '@nestjs/common';
import { SendNotificationService } from './service/notification.service';
// import { sendNotificationDto } from './dto/firebase.dto';
import { sendNotificationDto1 } from './dto/token.dto';

@Controller()
export class AppController {
  
  constructor(
    private readonly service: SendNotificationService
  ) {}

  @Post('send')
  async send(@Body() sendDto: sendNotificationDto1) {
    const message = await this.service.sendNotification(sendDto);

    return {
      success: true,
      message: message
    };
  }
    @Post('sendOtp')
    async sendOtp(@Body() body:{email:string}){
      return this.service.sendOtp(body.email);
    }
  @Post('verifyOtp')
  verifyOtp(@Body() body:{email:string,otp:string}){
      return this.service.verifyOtp(body.email,body.otp);
    }
  }
  
  

