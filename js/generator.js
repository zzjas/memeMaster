import * as button from './button.js';
import * as share from './share.js';
import * as db from './firebase.js';


const B2C = (33.46/40);
const defaultF2C = (5.12/40);

// firebase init
let firebase = app_firebase;
let uid = null;

let containerSize = localStorage['containerSize'] || 500;

let F2C = defaultF2C;
localStorage.setItem('F2C', F2C);


const defaultInfo = {
    imgURL: './img/doge.jpeg',
    title: '',
    key: '',
    imgSize: 451,
    top: {
        fontSize: defaultF2C * containerSize,
        pos: 0,
        text: 'Upper Text'
    },
    bot: {
        fontSize: defaultF2C * containerSize,
        pos: B2C * containerSize,
        text: 'Lower Text'
    }
};

let info = (localStorage['info']) ? JSON.parse(localStorage['info']) : defaultInfo;

let imgRatio = info.imgSize/containerSize;


function main() {
    // handle login & logout
    firebase.auth().onAuthStateChanged(checkSignIn);

    handleResize();
    renderMemeContainer();
    initTextBoxes();

    window.addEventListener('resize', ()=>{
        handleResize();
        renderMemeContainer();
    });



    let p = document.createElement('p');
    p.innerHTML = `Raw: <a href="${info.imgURL}" target="_blank">${info.imgURL}</a>`;
    document.body.appendChild(p);
    
    // Set up the UploadCare widget
    let upload = uploadcare.Widget('#uploadButton');
    document.querySelectorAll('#uploadButton + div button')[0].innerHTML = 'Upload Picture To Make Meme';
    upload.onUploadComplete(uploadHandleComplete);

    let acquire = uploadcare.Widget('#acquireButton');
    document.querySelectorAll('#acquireButton + div button')[0].innerHTML = 'Upload Meme To Account';
    document.querySelectorAll('#acquireButton + div button')[0].parentNode.style.marginLeft = '10%';
    document.querySelectorAll('#acquireButton + div button')[0].parentNode.style.marginRight = '10%';
    acquire.onUploadComplete(acquireHandleComplete);

    // Render the image
    document.querySelector('#generateButton').addEventListener('click', handleGenerate);
}
window.addEventListener('load', ()=> main() );



/******************************* Helpers ************************************/
/**
 * Render the meme and two text boxes according to the current info and containerSize
 * 
 * Would change imgRatio
 *  */
function renderMemeContainer() {
    let memeContainer = document.querySelector('#memeContainer');
    let memeImg = memeContainer.querySelector('#memeImg');

    if(memeImg.src != info.imgURL) {
        memeImg.crossOrigin = 'anonymous';
        memeImg.src = info.imgURL;
    }
    
    imgRatio = info.imgSize/containerSize;

    ['#topText', '#bottomText'].forEach(qs => {
        const T = (qs == '#topText');
        let textContainer = document.querySelector(qs);
        let text = textContainer.querySelector('textarea');
        text.setAttribute('maxlength', `${(23/500) * containerSize}`);
        console.log(`containerSize is ${containerSize}`);
        console.log(`maxlength is: ${(30/500) * containerSize}`);
        text.style.fontSize = T ? info.top.fontSize : info.bot.fontSize;
        text.value = T ? info.top.text : info.bot.text;
        text.style.top = T ? info.top.pos : info.bot.pos;
    });
}

/**
 * Update the size of current container. Will change info but will not change
 * DOM tree;
 */
function handleResize() {
    let memeContainer = document.querySelector('#memeContainer');

    let newContainerSize = memeContainer.clientWidth;
    let delta = newContainerSize / containerSize;

    imgRatio = info.imgSize/newContainerSize;
    
    //info.top.fontSize = F2C * newContainerSize;
    info.top.fontSize *= delta;
    info.top.pos *= delta;
    /*
    let a = topInfo.top;
    console.log(`${a} ==> ${topInfo.top}`);
    console.log(`${a/containerSize} ==> ${topInfo.top/newContainerSize}`);
    console.log();
    console.log('********');
    */

    //info.bot.fontSize = F2C * newContainerSize;
    info.bot.fontSize *= delta;
    info.bot.pos *= delta;

    containerSize = newContainerSize;
    localStorage.setItem('info', JSON.stringify(info));
    localStorage.setItem('containerSize', containerSize);

    //console.log(`ctnr(${containerSize}), imgSize(${imgSize}), ratio(${imgRatio}))`);
}



/**
 * Initialize the event handlers for the text boxes. Should be run after renderring
 * the text boxes.
 */
function initTextBoxes() {
    document.getElementById('memeImg').ondragstart = function() { return false; };

    ['#topText', '#bottomText'].forEach(qs => {

        let textContainer = document.querySelector(qs);
        let text = textContainer.querySelector('textarea');
        let drag = textContainer.querySelector('.dragLayer');
        let lastHeight = text.scrollHeight;

        let handleKeyup = ()=>{
            let newInfo = (qs == '#topText') ? info.top : info.bot;
            newInfo.text = text.value;

            console.log(`Change Font Size: lastHeight(${lastHeight}) ==> currHeight(${text.scrollHeight})`);

            while(text.scrollHeight > lastHeight && newInfo.fontSize > 0) {
                newInfo.fontSize -= 1;
                text.setAttribute('style', `font-size: ${newInfo.fontSize}px;`);
            }

            F2C = newInfo.fontSize / containerSize;
            localStorage.setItem('F2C', F2C);
            if(qs == '#topText') { info.top = newInfo; }
            else { info.bot = newInfo; }
            localStorage.setItem('info', JSON.stringify(info));
            //renderMemeContainer();
        };

        let handleDragStart = (e)=>{
            let newInfo = (qs == '#topText') ? info.top : info.bot;
            newInfo.pos = e.screenY;
            let uploadB = document.querySelector('#uploadButton + div');
            uploadB.style.visibility = 'hidden';
            let acquireB = document.querySelector('#acquireButton + div');
            acquireB.style.visibility = 'hidden';
            console.log(`Start::::::::::pos(${newInfo.pos})::real(${textContainer.style.top})`);
            if(qs == '#topText') { info.top = newInfo; }
            else { info.bot = newInfo; }
            localStorage.setItem('info', JSON.stringify(info));
            renderMemeContainer();
        };

        let handleDrag = (e)=>{
            let newInfo = (qs == '#topText') ? info.top : info.bot;
            e.preventDefault();
            let d = e.screenY - newInfo.pos;
            let newPos = newInfo.top + d;
            //console.log(`newPos(${newPos}) = e.screenY(${e.screenY}) - info.pos(${info.pos}) + info.top(${info.top})`);
            newInfo.pos = e.screenY;

            if(newPos > 0 && newPos < B2C * containerSize) {
                info.top = newPos;
            } else { /* console.error('Out of bounds'); */ }
            textContainer.style.top = newInfo.top+'px';
            //console.log(`d(${d}) ==> newPos(${newPos}) ==> top(${info.top}) ==> real(${textContainer.style.top})`);
            if(qs == '#topText') { info.top = newInfo; }
            else { info.bot = newInfo; }
            localStorage.setItem('info', JSON.stringify(info));
            renderMemeContainer();
        };
        text.addEventListener('keyup', handleKeyup);
        drag.addEventListener('dragstart', handleDragStart);
        drag.addEventListener('darg', handleDrag);
    });

}


/**
 * Render the image with canvas
 */
function handleGenerate() {
    document.querySelector('#generateButton').innerHTML = 'Generating...';

    let img = document.querySelector('#memeImg');
    let c = document.querySelector('#myCanvas');
    let ctx = c.getContext('2d');

    ctx.canvas.width = img.naturalWidth;
    ctx.canvas.height = img.naturalHeight;

    ctx.drawImage(img,0,0);
    ctx.textAlign = 'center';

    let tt = (info.top.pos/containerSize) * ctx.canvas.height + info.top.fontSize * imgRatio;
    let bt = (info.bot.pos/containerSize) * ctx.canvas.height + info.bot.fontSize * imgRatio;

    ctx.font = `${info.top.fontSize * imgRatio}px Impact`;
    drawStroked(ctx, info.top.text, ctx.canvas.width * 0.5, tt, info.top.fontSize);

    ctx.font = `${info.bot.fontSize * imgRatio}px Impact`;
    drawStroked(ctx, info.bot.text, ctx.canvas.width * 0.5, bt, info.bot.fontSize);

    let newImgDataURI = c.toDataURL('image/png');
    var w = window.open("");
    w.document.write(`<img src="${newImgDataURI}">`);
    //uploadRenderedImg(newImgDataURI);
}






/**
 * Helper function for drawing text on image. 
 * @param {Canvas context} ctx 
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 */
function drawStroked(ctx, text, x, y, fs) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = (7/45) * fs * imgRatio;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
}


/**
 * Turn the data uri to a file-like object in Javascript and upload it to
 * uploadcare.
 * @param {Data URI} newImgDataURI 
 */
function uploadRenderedImg(newImgDataURI) {
    let blobBin = atob(newImgDataURI.split(',')[1]);
    let a = [];
    for(let i = 0; i < blobBin.length; i++) {
        a.push(blobBin.charCodeAt(i));
    }
    let newImgBlob = new Blob([new Uint8Array(a)], {type: 'image/png'});
    newImgBlob.lastModifiedDate = new Date();
    newImgBlob.name = 'new-meme.png';

    let newImg = uploadcare.fileFrom('object', newImgBlob);

    newImg.done((fileInfo)=>{
        let p = document.createElement('p');
        p.innerHTML = `Rendered: <a href='${fileInfo.cdnUrl}' target='_blank'>${fileInfo.cdnUrl}</a>`;
        document.body.appendChild(p);

        openDialog(fileInfo.cdnUrl);
    }).fail(()=>{
        console.error('Upload Failed');
    });
}






/**
 * Open a success dialog to ask for user's next operation.
 * @param {string} url 
 */
function openDialog(url) {
    let t= document.getElementsByTagName('template')[0];
    let dialog = t.content.querySelector('dialog').cloneNode(true);
    let meme = dialog.querySelector('img'); 
    meme.setAttribute('src', url);
    meme.addEventListener('load', ()=>{ dialog.showModal(); });

    dialog.querySelector('#succDownloadButton').addEventListener('click', button.generateDownloadHandler(url));

    let shareButton = dialog.querySelector('#succShareButton');
    let shareResult = dialog.querySelector('#shareResult');
    share.initShare(shareButton, shareResult, url);


    dialog.querySelector('#succSaveButton').addEventListener('click', ()=>{
    });
    dialog.querySelector('#succDiscardButton').addEventListener('click', discard);

    function discard() {
        let d = document.querySelector('dialog');
        d.parentElement.removeChild(d);
    }
    document.querySelector('#generateButton').innerHTML = 'Generate';
    document.body.appendChild(dialog);
    dialog.querySelector('#succShareButton').style.display = '';
}




/**
 * Check whether user has signed in and render different buttons on screen
 * accordingly.
 * @param {string} user 
 */
function checkSignIn(user) {
    let changePasswordButton = document.querySelector('#changePasswordButton');
    let myMemeButton = document.querySelector('#myMemeButton');
    let logoutButton = document.querySelector('#logoutButton');
    let signupButton = document.querySelector('#signupButton');
    let loginButton = document.querySelector('#loginButton');

    if(user) {
        uid = user.uid;
        changePasswordButton.style.display = '';
        myMemeButton.style.display = '';
        logoutButton.style.display = '';
        signupButton.style.display = 'none';
        loginButton.style.display = 'none';

        myMemeButton.addEventListener('click', button.generateGoToURLHandler('./myMeme.html'));
        changePasswordButton.addEventListener('click', button.generateGoToURLHandler('./changepw.html'));
        logoutButton.addEventListener('click', ()=>{
            firebase.auth().signOut();
            window.location.href = window.location.href;
        });
    }
    else {
        // Not signed in
        uid = null;
        if(changePasswordButton.style.display !== 'none') changePasswordButton.style.display = 'none';
        if(myMemeButton.style.display !== 'none') myMemeButton.style.display = 'none';
        if(logoutButton.style.display !== 'none') logoutButton.style.display = 'none';
        signupButton.style.display = '';
        loginButton.style.display = '';
        
        signupButton.addEventListener('click', button.generateGoToURLHandler('./login.html'));
        loginButton.addEventListener('click', button.generateGoToURLHandler('./login.html'));
    }
}




/******************************* Canvas  ************************************/

/****************************** UploadCare **********************************/
/**
 * Store the URL of uploaded image into local storage and refresh the page to take effect
 * @param {object} info 
 */
function uploadHandleComplete(file) {
    info.imgURL = file.cdnUrl;
    let r = /(?:crop\/)[0-9]*/;
    //console.log(imgURL);
    let t = info.imgURL.match(r);
    if(t) {
        r = /\d+/;
        info.imgSize = parseInt(t[0].match(r)[0]);
    }
    else {
        info.imgSize = info.originalImageInfo.width;
    }
    //console.warn('Resize after upload');
    handleResize();


    localStorage.setItem('info', JSON.stringify(info));
    window.location.href = window.location.href;
}

function acquireHandleComplete(file) {
    window.open(file.cdnUrl);
    window.location.href = './myMeme.html';
}
