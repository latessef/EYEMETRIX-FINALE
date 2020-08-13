import firebase from '../database/firebase';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import {Vibration, Platform} from "react-native";
import Constants from 'expo-constants';

export const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      console.log('token',token);
      //this.setState({ expoPushToken: token });
      firebase.database().ref('users/'+firebase.auth().currentUser.uid).update({ 
        token: token
      });
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  
  export const _handleNotification = notification => {
    Vibration.vibrate();
    console.log(notification);
   // this.setState({ notification: notification });
  };

  const getId = () => {
    var counterRef = firebase.database().ref('counter');
    return counterRef.transaction(function(currentId) {
      return currentId + 1;
    });
  };

  export  const AddNotification = (body, type,date) => {
   getId().then(function(transactionResult) {
    var newId = transactionResult.snapshot.val();
    //console.log(newId);
    firebase.database().ref(`projects/` +firebase.auth().currentUser.uid+`/Notification/`+newId).set({
      body: body,
      type: type,
      date: date,
    });
  });   
  }

  export const getCurrentDate =() => {
    date= new Date();
    return (date.getDate()+ '/'+ (date.getMonth()+1) + '/' + date.getFullYear() + ' ' +
            date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()).toString();
  }


  export const sendPushNotification = async (to) => {
    ///console.log('HI 1');
      const message = {
        to: to,
        sound: 'default',
        title: 'Rapport',
        body: 'rapport téléchargé',
        data: { data: 'goes here' },
        _displayInForeground: true,
      };
      //console.log('HI 2');
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
       Vibration.vibrate();
      // console.log('HI 3');
      // AddNotification(message.body,'compte',getCurrentDate())
      // console.log('HI 4');
   // console.log('token: ',this.state.expoPushToken)
  };

 // export default Notifunction;