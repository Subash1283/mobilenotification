import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import admin from "../config/firebase.config";
import { sendNotificationDto1 } from "../dto/token.dto";
import { BatchResponse } from "firebase-admin/messaging";
import * as nodemailer from "nodemailer";

@Injectable()
export class SendNotificationService {
  async sendNotification(dto: sendNotificationDto1): Promise<BatchResponse> {
    try {
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: dto.title,
          body: dto.body,
        },
        tokens: dto.token,
      };

      return await admin.messaging().sendEachForMulticast(message);
    } catch (error) {
      throw new InternalServerErrorException(
        "Failed to send push notification",
      );
    }
  }

  /* =======================
        🔐 OTP SECTION
  ======================== */

  private otpStore = new Map<
    string,
    { otp: string; expireAt: number }
  >();

  // Generate 6-digit OTP
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendOtp(email: string) {
    try {
      const otp = this.generateOtp();
      const expireAt = Date.now() + 60 * 1000; // 1 minute

      this.otpStore.set(email, { otp, expireAt });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Your App Name" <${process.env.MAIL_USER}>`,
        to: email,
        subject: "Your Verification OTP Code",
        html: `
          <div style="font-family: Arial, sans-serif; padding:20px;">
            <h2 style="color:#2c3e50;">Email Verification</h2>
            <p>Hello,</p>
            <p>Your One-Time Password (OTP) is:</p>
            <h1 style="color:#3498db; letter-spacing:5px;">${otp}</h1>
            <p>This OTP will expire in <b>1 minute</b>.</p>
            <p>If you did not request this, please ignore this email.</p>
            <br/>
            <small style="color:gray;">© 2026 Your App Name</small>
          </div>
        `,
      });

      return {
        success: true,
        message: "OTP sent successfully to your email.",
        expiresIn: "60 seconds",
      };
    } catch (error) {
      throw new InternalServerErrorException("Failed to send OTP email");
    }
  }

  verifyOtp(email: string, otp: string) {
    const record = this.otpStore.get(email);

    if (!record) {
      throw new BadRequestException(
        "OTP not found or already used.",
      );
    }

    if (Date.now() > record.expireAt) {
      this.otpStore.delete(email);
      throw new BadRequestException(
        "OTP has expired. Please request a new one.",
      );
    }

    if (record.otp !== otp) {
      throw new BadRequestException("Invalid OTP.");
    }

    this.otpStore.delete(email);

    return {
      success: true,
      message: "OTP verified successfully.",
    };
  }
}