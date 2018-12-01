var app_firebase = {};
(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBdE6IXppJXmRPh35QgSoCVdAhoXT2n_Fg",
    authDomain: "login-3a8ce.firebaseapp.com",
    databaseURL: "https://login-3a8ce.firebaseio.com",
    projectId: "login-3a8ce",
    storageBucket: "login-3a8ce.appspot.com",
    messagingSenderId: "1000739330785"
  };
  firebase.initializeApp(config);
  app_firebase = firebase;
})()