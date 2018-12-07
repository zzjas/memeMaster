import * as button from './button.js';
import * as share from './share.js';
import * as db from './firebase.js';

let imgURL = localStorage['currMeme'] || './img/doge.jpeg'; 
let firebase = app_firebase;
let uid = null;
let imgSize = 500;
let topInfo = {
    top: 0, fontSize: 64, text: 'Upper Meme', pos: 0
};
let bottomInfo = {
    top: 417, fontSize: 64, text: 'Lower Meme', pos: 0
};

function main() {
    // handle login & logout

    firebase.auth().onAuthStateChanged(checkSignIn);


    // Put default or last meme as placeholder
    let memeImg = document.querySelector('#memeImg');
    memeImg.crossOrigin = 'anonymous';
    memeImg.src= imgURL;

    let p = document.createElement('p');
    p.innerHTML = `Raw: <a href="${imgURL}" target="_blank">${imgURL}</a>`;
    document.body.appendChild(p);
    
    // Set up the UploadCare widget
    let upload = uploadcare.Widget('#uploadButton');
    document.querySelectorAll('#uploadButton + div button')[0].innerHTML = 'Upload Picture To Make Meme';
    upload.onUploadComplete(uploadHandleComplete);

    let acquire = uploadcare.Widget('#acquireButton');
    document.querySelectorAll('#acquireButton + div button')[0].innerHTML = 'Upload Meme To Account';
    acquire.onUploadComplete(acquireHandleComplete);



    createTextBox('#topText', topInfo);
    createTextBox('#bottomText', bottomInfo);

    // Render the image
    document.querySelector('#generateButton').addEventListener('click', handleGenerate);
}



window.addEventListener('load', ()=> main() );

function createTextBox(qs, info) {
    document.getElementById('memeImg').ondragstart = function() { return false; };
    let textContainer = document.querySelector(qs);
    let text = textContainer.querySelector('textarea');
    text.setAttribute('maxlength', '24');
    let lastHeight = text.scrollHeight;
    let drag = textContainer.querySelector('.dragLayer');

    text.addEventListener('keyup', ()=>{
        info.text = text.value;
        while(text.scrollHeight > lastHeight && info.fontSize > 0) {
            info.fontSize -= 1;
            text.setAttribute('style', `font-size: ${info.fontSize}px;`);
        }
    });

    drag.addEventListener('dragstart', (e)=>{
        info.pos = e.screenY;
    });

    drag.addEventListener('drag', (e)=>{
        e.preventDefault();
        let d = e.screenY - info.pos;
        info.pos = e.screenY;
        let newPos = info.top + d;
        if(newPos >=0 && newPos < 417) {
            info.top = newPos;
        }
        textContainer.style.top = info.top+'px';
    });

}





/******************************* Helpers ************************************/
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

    //ctx.drawImage(background,0,0);
    ctx.drawImage(img,0,0);
    ctx.textAlign = 'center';

    let p1 = 500;
    let tt = (topInfo.top/p1) * ctx.canvas.height + topInfo.fontSize;
    let bt = (bottomInfo.top/p1) * ctx.canvas.height + topInfo.fontSize;

    ctx.font = `${topInfo.fontSize}px Impact`;
    drawStroked(ctx, topInfo.text, ctx.canvas.width * 0.5, tt, topInfo.fontSize);

    ctx.font = `${bottomInfo.fontSize}px Impact`;
    drawStroked(ctx, bottomInfo.text, ctx.canvas.width * 0.5, bt, bottomInfo.fontSize);

    let newImgDataURI = c.toDataURL('image/png');
    uploadRenderedImg(newImgDataURI);
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
    newImgBlob.name = 'newImg.png';

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
    share.initShare(shareButton, shareResult);


    dialog.querySelector('#succSaveButton').addEventListener('click', ()=>{
    });
    dialog.querySelector('#succDiscardButton').addEventListener('click', discard);

    function discard() {
        let d = document.querySelector('dialog');
        d.parentElement.removeChild(d);
    }
    document.querySelector('#generateButton').innerHTML = 'Generate';
    document.body.appendChild(dialog);
}




/**
 * Check whether user has signed in and render different buttons on screen
 * accordingly.
 * @param {string} user 
 */
function checkSignIn(user) {
    let accountButton = document.querySelector('#accountButton');
    let myMemeButton = document.querySelector('#myMemeButton');
    let logoutButton = document.querySelector('#logoutButton');
    let signupButton = document.querySelector('#signupButton');
    let loginButton = document.querySelector('#loginButton');

    if(user) {
        uid = user;
        accountButton.style.display = '';
        myMemeButton.style.display = '';
        logoutButton.style.display = '';
        signupButton.style.display = 'none';
        loginButton.style.display = 'none';

        myMemeButton.addEventListener('click', button.generateGoToURLHandler('./myMeme.html'));
        logoutButton.addEventListener('click', ()=>{
            firebase.auth().signOut();
            window.location.href = window.location.href;
        });
    }
    else {
        // Not signed in
        uid = null;
        if(accountButton.style.display !== 'none') accountButton.style.display = 'none';
        if(myMemeButton.style.display !== 'none') myMemeButton.style.display = 'none';
        if(logoutButton.style.display !== 'none') logoutButton.style.display = 'none';
        signupButton.style.display = '';
        loginButton.style.display = '';
        
        signupButton.addEventListener('click', button.generateGoToURLHandler('./login.html'));
        loginButton.addEventListener('click', button.generateGoToURLHandler('./login.html'));
    }
}




/******************************* Canvas  ************************************/
/**
 * Helper function for drawing text on image. 
 * @param {Canvas context} ctx 
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 */
function drawStroked(ctx, text, x, y, fs) {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 0.109 * fs;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
}
/****************************** UploadCare **********************************/
/**
 * Store the URL of uploaded image into local storage and refresh the page to take effect
 * @param {object} info 
 */
function uploadHandleComplete(info) {
    imgURL = info.cdnUrl;
    imgURL += `-/resize/${imgSize}x${imgSize}/`;
    localStorage.setItem('currMeme', imgURL);
    window.location.href = window.location.href;
}

function acquireHandleComplete(info) {
    window.open(info.cdnUrl);
    window.location.href = './myMeme.html';
}
