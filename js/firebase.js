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

export function saveToAccount(raw, rendered, top, bottom, offset) {
    return 1;
}

export function getAllMemes(uid) {
    // return rendered

    // Fake data for testing
    let memeList = [];
    for(let i = 0; i < 10; i++) {
        let d = new Date();
        memeList.push({
            url: 'https://ucarecdn.com/02b365a4-c292-4329-92a8-97b49240ab26/',
            date: d
        });
    }
    return memeList;
}

export function getSingleMeme(uid, rendered) {
    return {
        raw: AudioDestinationNode,
        rendered: ANGLE_instanced_arrays,
        top: asdasfda,
        bottom: dasasdad,
        offset: dasdasdad
    };
}