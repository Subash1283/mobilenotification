// import { Body, Injectable } from "@nestjs/common";
// import { sendNotificationDto } from "src/dto/firebase.dto";
// import { sendNotificationService } from "src/service/notification.service";

// @Injectable()
// export class NotificationController{
//     constructor(
//         private readonly service:sendNotificationService
//     ){}

//     async send(@Body()sendDto:sendNotificationDto){
//         const message = await this.notificationService.sendNotification(sendDto);
//         return{
//             suuccess:true,
//             message:message
//         }
//     }

// }