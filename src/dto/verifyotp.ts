import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtp {
  @ApiProperty({ example: 'user@example.com', description: 'Email associated with the OTP' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: '123456', description: '6-digit OTP code' })
  @IsNotEmpty({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;
}