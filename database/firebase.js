import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAWU3M_UgykIIOoiVI5JhpEtyGXSvVE60s",
  authDomain: "eyemetrix-274d6.firebaseapp.com",
  databaseURL: "https://eyemetrix-274d6.firebaseio.com",
  projectId: "eyemetrix-274d6",
  storageBucket: "eyemetrix-274d6.appspot.com",
  messagingSenderId: "658586210153",
  appId: "1:658586210153:web:7cf2a2d2cacfa15c7277f8",
  measurementId: "G-P8L9QRT51B"
};
  
  firebase.initializeApp(firebaseConfig);
  export default firebase;