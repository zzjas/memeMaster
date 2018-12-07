import * as button from './button.js';
import * as share from './share.js';
import * as db from './firebase.js';

let imgURL = localStorage['currMeme'] || './img/doge.jpeg'; 
let firebase = app_firebase;
let uid = null;
let imgSize = 1000;
let fontSize = 60;
let maxFontSize  = 60;

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

    // Allow user to change the text by double clicking on the text
    document.querySelector('#topText').addEventListener('dblclick', textHandleDblclick('top'));
    document.querySelector('#bottomText').addEventListener('dblclick', textHandleDblclick('bottom'));
    
    // Render the image
    document.querySelector('#generateButton').addEventListener('click', handleGenerate);
}



window.addEventListener('load', ()=> main() );













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
    ctx.font = '8em Impact';
    let upper = document.querySelector('#topText').innerHTML;
    let lower = document.querySelector('#bottomText').innerHTML;
    drawStroked(ctx, upper, ctx.canvas.width * 0.46, img.naturalHeight * 0.14);
    drawStroked(ctx, lower, ctx.canvas.width * 0.46, img.naturalHeight * 0.93);
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
 * When user double clicks the text, add an input field to allow user to change
 * the text. After losing the focus, changed input will be stored in the text
 * box.
 */
function textHandleDblclick(pos) {
    let textBox = document.querySelector(`#${pos}Text`);

    return function handler() {
        let tmp = textBox.cloneNode(true);
        tmp.setAttribute('style',
            `background-color: rgba(192,192,192, 0.5);
             border: 2px dashed black;`);

        let input = document.createElement('textarea');
        input.value = tmp.innerHTML;

        function inputHandleComplete() {
            tmp.removeChild(input);
            tmp.innerHTML = input.value;
            tmp.addEventListener('dblclick', textHandleDblclick('top'));
            tmp.setAttribute('style',
                `background-color: transparent;
                 border: 1px dashed gray;`);
        }

        input.addEventListener('blur', inputHandleComplete);
        /*
        input.addEventListener('keypress', (e)=>{
            if(e.keyCode === 13) input.blur();
        });
        */

        let lastHeight = 0;
        input.addEventListener('keydown', (e)=> {
            lastHeight = input.scrollHeight;
        })
        input.addEventListener('keyup', (e)=> {
            if(input.scrollHeight > lastHeight) {
                fontSize -= 4;
                document.querySelector('textarea').style.fontSize = `${fontSize}px`;
                input.scrollHeight = lastHeight; 
            }
        });



        tmp.innerHTML = '';
        tmp.appendChild(input);
        document.querySelector('#memeContainer').replaceChild(tmp, textBox);

        let len = input.innerHTML.length;
        input.setSelectionRange(len, len);
    };
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
function drawStroked(ctx, text, x, y) {
    ctx.textAlign = 'center';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 7;
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


let detectResize = (function() {
  
    function detectResize(id, intervall, callback) {
        this.id = id;
        this.el = document.getElementById(this.id);
        this.callback = callback || function(){};
      
        if (this.el) {
            var self = this;
            this.width = this.el.clientWidth;
            this.height = this.el.clientHeight;
        
            this.el.addEventListener('mouseup', function() {
                self.detectResize();
            });
        
            this.el.addEventListener('keypress', function() {
                self.detectResize();
            });
          
            if(intervall) setInterval(function() {
                self.detectResize();
            }, intervall);
        
        }
        return null;
    }
  
    detectResize.prototype.detectResize = function() {
        if (this.width != this.el.clientWidth || this.height != this.el.clientHeight) {
            this.callback(this);
            this.width = this.el.clientWidth;
            this.height = this.el.clientHeight;
        }
    };
  
    return detectResize;
  
})();

