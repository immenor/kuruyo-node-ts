import { NotificationSender } from "../src/components/IOSNotificationSender"

export class FakeNotificationSender implements NotificationSender {

  sendNotification_deviceToken:string = ""

  sendNotification( deviceToken:string, completion: {():void} ):void {
    this.sendNotification_deviceToken = deviceToken
  }
}
