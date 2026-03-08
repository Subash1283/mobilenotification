import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtp {
  @ApiProperty({ example: 'user@example.com', description: 'Email address to send OTP' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;
}