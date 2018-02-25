import apn = require('apn')
import { APNCONFIG } from "../../apn-config"

export interface NotificationSender {
  sendNotification( deviceToken: string, completion: {(): void} ):void
}

export class IOSNotificationSender implements NotificationSender {
  sendNotification( deviceToken:string, completion: {():void} ):void {
    let apnConfig = new APNCONFIG()

    let options = {
      token: {
        key: apnConfig.keyPath,
        keyId: apnConfig.keyId,
        teamId: apnConfig.teamId
      },
      production: false
    }

    var apnProvider = new apn.Provider(options)

    let note = new apn.Notification()

    note.expiry = Math.floor(Date.now() / 1000) + 3600
    note.badge = 3
    note.alert = "Your bus is three stops away"
    note.payload = {'busLine':'恵32'}
    note.topic = "com.johnnylinnert.busping"

    apnProvider.send(note, deviceToken).then( (result) => {
      console.log('Result of push notification request', result)
      completion()
    })

  }
}


// Setup APN
