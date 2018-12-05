// UploadCare Settings
UPLOADCARE_PUBLIC_KEY = 'dbaeb1c5c17601cbf134';
UPLOADCARE_EFFECTS = 'crop,rotate,mirror,flip,enhance,sharp,blur,grayscale,invert';
UPLOADCARE_IMAGES_ONLY = true;
UPLOADCARE_PREVIEW_STEP = true; 


//Firebase Settings
var config = {
    apiKey: 'AIzaSyD6xIsrbAiwYJ9hDJBO7xjvLZsUo0tL1Tg',
    authDomain: 'meme-master-177fb.firebaseapp.com',
    databaseURL: 'https://meme-master-177fb.firebaseio.com',
    projectId: 'meme-master-177fb',
    storageBucket: 'meme-master-177fb.appspot.com',
    messagingSenderId: '1043399803617'
};
var app_firebase = {};
firebase.initializeApp(config);
app_firebase = firebase;