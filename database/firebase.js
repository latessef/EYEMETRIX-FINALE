import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyB9q2r23bTYYgtUAukwLFmlGx6rMGU0Hsk",
      authDomain: "influx-aea76.firebaseapp.com",
      databaseURL: "https://influx-aea76.firebaseio.com",
      projectId: "influx-aea76",
      storageBucket: "influx-aea76.appspot.com",
      messagingSenderId: "1089509037498",
      appId: "1:1089509037498:web:fff90159bcde4b163b7983",
      measurementId: "G-2XLF5GR2PH"
  };
  
  firebase.initializeApp(firebaseConfig);

  export default firebase;