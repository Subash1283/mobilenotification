import { Injectable, InternalServerErrorException } from "@nestjs/common";
import admin from "../config/firebase.config"; 
import { sendNotificationDto1 } from "../dto/token.dto";
import { BatchResponse } from "firebase-admin/messaging";

@Injectable()
export class SendNotificationService {

  async sendNotification(dto: sendNotificationDto1): Promise<BatchResponse> {
    try {
      //change muticast message for single notification
      const message: admin.messaging.MulticastMessage = {
        notification: {
          title: dto.title,
          body: dto.body,
        },
        tokens: dto.token,
      };

     return await admin.messaging().sendEachForMulticast(message);

    } catch (error) {
      throw new InternalServerErrorException("Failed to send message");
    }
  }
}
