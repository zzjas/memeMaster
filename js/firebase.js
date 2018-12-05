var app_firebase = {};
(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyD6xIsrbAiwYJ9hDJBO7xjvLZsUo0tL1Tg",
    authDomain: "meme-master-177fb.firebaseapp.com",
    databaseURL: "https://meme-master-177fb.firebaseio.com",
    projectId: "meme-master-177fb",
    storageBucket: "meme-master-177fb.appspot.com",
    messagingSenderId: "1043399803617"
  };
  firebase.initializeApp(config);
  app_firebase = firebase;
})()