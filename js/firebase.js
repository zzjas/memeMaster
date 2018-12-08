//var app_firebase = {};
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







export var app_main = {};
export var item = [];
export var count = 0;
(() => {
    function messageHandler(err) {
        /*
        if(err) {
            console.log(err);
        } else {
            console.log("success");
        }
        */
    }

    // time issue here
    function retriveData(uid){
        app_firebase.database().ref('users/' + uid).on('value', function(snapshot) {
            item = [];
            count = 0;
            snapshot.forEach(childSnapShot => {
                if(childSnapShot.key == 'count') {
                    count = childSnapShot.val();
                }
                else {
                    let temp = childSnapShot.val();
                    //console.log(`Retrived ==> ${JSON.stringify(temp)}`);
                    let t = {
                        key: childSnapShot.key,
                        title: temp.title,
                        raw: temp.raw,
                        rendered: temp.rendered,
                        date: new Date(temp.date),
                        editable: temp.editable,
                        imgSize: temp.imgSize,
                        lastContainerSize: temp.lastContainerSize,
                        top: {
                            fontSize: temp.top.fontSize,
                            pos: temp.top.pos,
                            text: temp.top.text
                        },
                        bot: {
                            fontSize: temp.bot.fontSize,
                            pos: temp.bot.pos,
                            text:temp.bot.text
                        }
                    };
                    item.push(t);
                }
            });
        });       
    }


    // create a meme
    function fnCreateMeme(uid,currentCount,info){
        var path = "users/" + uid;
        var data = {
            title: info.title,
            raw: info.raw,
            rendered: info.rendered,
            date: info.date.toISOString(),
            editable: info.editable,
            imgSize: info.imgSize,
            lastContainerSize: info.lastContainerSize,
            top: {
                fontSize: info.top.fontSize,
                pos: info.top.pos,
                text: info.top.text
            },
            bot: {
                fontSize: info.bot.fontSize,
                pos: info.bot.pos,
                text: info.bot.text
            }
        };
        app_firebase.databaseApi.update(path, {count:currentCount+1}, messageHandler);  
        app_firebase.database().ref(path).push(data);
    }


    // update a meme
    function fnUpdateMeme(uid, info){
        var path = "users/" + uid + "/" + info.key;
        var data = {
            rendered: info.rendered,
            date: info.date.toISOString(),
            lastContainerSize: info.lastContainerSize,
            top: {
                fontSize: info.top.fontSize,
                pos: info.top.pos,
                text: info.top.text
            },
            bot: {
                fontSize: info.bot.fontSize,
                pos: info.bot.pos,
                text: info.bot.text
            }
        }
        app_firebase.databaseApi.update(path, data, messageHandler);        
    }

    // deleta a meme
    function fnDeleteMeme(uid, key, cb){
        var path = "users/" + uid + "/" + key;
        app_firebase.databaseApi.delete(path, cb);
    }




    // create a user
    /*
    function fnCreateUser(uid){
        var path = "users/" + uid;
        var data = {
            count: 0
        }
        if(uid && !fnReadUser(uid)) {
            app_firebase.databaseApi.create(path, data, messageHandler);
        }
    }

    // check whether user exists
    function fnReadUser(uid){
        var path = "users/" + uid;
        app_firebase.databaseApi.read(path, successFn, messageHandler);
        function successFn(snapshot) {
            if(snapshot && snapshot.val()) {
                return true;
            } else {
                return false;
            }
        }
    }
    */

    // return the count of the user
    // function fnReadCount(uid){
    //     var path = "users/" + uid;
    //     // console.log(uid);
    //     // return new Promise(resolve => {
    //     //     function successFn(snapshot) {
    //     //         if(snapshot && snapshot.val()) {
    //     //             resolve(snapshot.val().count);
    //     //         }
    //     //     }
    //     //     app_firebase.databaseApi.read(path, successFn, messageHandler);
    //     // });
    //     app_firebase.databaseApi.read(path, successFn, messageHandler);
    //     console.log(app_firebase.database().ref().child('count'));
    //     function successFn(snapshot) {
    //         if(snapshot && snapshot.val()) {
    //             return snapshot.val().count;
    //         }
    //     }
    // }    


    // return all meme
    // function fnReadAllMeme(uid){
    //     var path = "users/" + uid + "/memes/";
    //     app_firebase.databaseApi.read(path, successFn, messageHandler);
    //     function successFn(snapshot) {
    //         if(snapshot && snapshot.val()) {
    //             return snapshot.val();
    //         }
    //     }
    // }

    // return a meme
    // function fnReadAMeme(uid,key){
    //     var path = "users/" + uid + "/memes/" + key;
    //     app_firebase.databaseApi.read(path, successFn, messageHandler);
    //     function successFn(snapshot) {
    //         if(snapshot && snapshot.val()) {
    //             return snapshot.val();
    //         }
    //     }
    // }



    // app_main.createUser = fnCreateUser;
    // app_main.readUser = fnReadUser;
    // app_main.readCount = fnReadCount;        
    // app_main.readAllMeme = fnReadAllMeme;
    // app_main.readAMeme = fnReadAMeme;

    app_main.createMeme = fnCreateMeme;
    app_main.updateMeme = fnUpdateMeme;
    app_main.deleteMeme = fnDeleteMeme;
    app_main.retriveData = retriveData;
})();
