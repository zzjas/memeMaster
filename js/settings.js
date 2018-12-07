// UploadCare Settings
UPLOADCARE_PUBLIC_KEY = 'dbaeb1c5c17601cbf134';
UPLOADCARE_EFFECTS = 'crop,rotate,mirror,flip,enhance,sharp,blur,grayscale,invert';
UPLOADCARE_IMAGES_ONLY = true;
UPLOADCARE_PREVIEW_STEP = true; 

<<<<<<< HEAD
var app_firebase = {};
(() => {
	//Firebase Settings
	var config = {
	    apiKey: 'AIzaSyD6xIsrbAiwYJ9hDJBO7xjvLZsUo0tL1Tg',
	    authDomain: 'meme-master-177fb.firebaseapp.com',
	    databaseURL: 'https://meme-master-177fb.firebaseio.com',
	    projectId: 'meme-master-177fb',
	    storageBucket: 'meme-master-177fb.appspot.com',
	    messagingSenderId: '1043399803617'
	};
	firebase.initializeApp(config);
	app_firebase = firebase;

	function fnCreate(path, body, callBack) {
		if(!path || !body) return;
		app_firebase.database().ref(path).set(body, callBack);
	}

	function fnRead(path, successFunction, errorFunction) {
		if(!path || !successFunction || !errorFunction) return;
		app_firebase.database().ref(path).once('value').then(successFunction, errorFunction);
	}

	function fnUpdate(path, body, callBack) {
		if(!path || !body) return;
		app_firebase.database().ref(path).update(body, callBack);
	}

	function fnDelete(path, callBack) {
		if(!path) return;
		app_firebase.database().ref(path).remove(callBack);
	}  

	app_firebase.databaseApi ={
		create: fnCreate,
		read: fnRead,
		update: fnUpdate,
		delete: fnDelete,
	}
})();
=======

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
app_firebase['haha'] = ()=>{
    console.log('From setting');
};
>>>>>>> 3c260876c4f605fad0763e04bea318df30fc2b63
