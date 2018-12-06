//var app_firebase = {};
/*
function aasdasd(){
    // Initialize Firebase
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
}
*/


export function storeNewMeme(uid, fileName, raw, rendered, top, bottom, offset, editable, date) {
    let title = '';
    // Generate a title by count
    return 1;
}

export function updateMeme(uid, title, rendered, top, bottom, offset, date) {

}

export function getAllMemes(uid) {
    // return a list of {title, rendered, editable, date}

    // Fake data for testing
    let memeList = [];
    for(let i = 0; i < 10; i++) {
        let d = new Date();
        memeList.push({
            url: 'https://ucarecdn.com/5aefa9c4-c57a-4208-af28-1cdbc89146b5/',
            date: d
        });
    }
    return memeList;
}

export function getSingleMeme(uid, title) {
    return {
        rendered: '',
        top: '',
        bottom: '',
        offset: ''
    };
}
