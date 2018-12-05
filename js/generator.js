let imgURL = localStorage['currMeme'] || './img/doge.jpeg'; 

function main() {
    // Put default or last meme as placeholder
    document.querySelector('#memeImg').src= imgURL;

    let p = document.createElement('p');
    p.innerHTML = `Raw: <a href="${imgURL}" target="_blank">${imgURL}</a>`;
    document.body.appendChild(p);
    
    // Set up the UploadCare widget
    let upload = uploadcare.Widget('[role="uploadcare-uploader"]');
    //upload.onChange(uploadHandleChange);
    upload.onUploadComplete(uploadHandleComplete);

    // Allow user to change the text by double clicking on the text
    document.querySelector('#topText').addEventListener('dblclick', textHandleDblclick('top'));
    document.querySelector('#bottomText').addEventListener('dblclick', textHandleDblclick('bottom'));
    
    // Render the image
    document.querySelector('#generateButton').addEventListener('click', handleGenerate);
}



window.addEventListener('load', ()=> main() );









/**
 * Render the image with canvas
 */
function handleGenerate() {
    document.querySelector('#generateButton').innerHTML = 'Generating...';
    let c = document.querySelector('#myCanvas');
    let ctx = c.getContext('2d');
    ctx.canvas.width = 500;
    ctx.canvas.height = 500;
    let background = new Image();
    background.crossOrigin = 'anonymous';
    background.src = imgURL; 

    background.onload = () => {
        ctx.drawImage(background,0,0);
        ctx.font = '4em Impact';
        drawStroked(ctx, 'Upper Meme', 230, 70);
        drawStroked(ctx, 'Lower Meme', 230, 430);
        let newImgDataURI = c.toDataURL('image/png');
        uploadRenderedImg(newImgDataURI);
    };
}








/******************************* Helpers ************************************/

/**
 * Open a success dialog to ask for user's next operation.
 * @param {string} url 
 */
function openDialog(url) {
    let t= document.getElementsByTagName('template')[0];
    let dialog = t.content.querySelector('dialog').cloneNode(true);
    //console.warn(dialog);
    console.warn(dialog.querySelector('img'));
    let meme = dialog.querySelector('img'); 
    meme.setAttribute('src', url);
    meme.addEventListener('load', ()=>{ dialog.showModal(); });

    dialog.querySelector('#succSaveButton').addEventListener('click', ()=>{
        let save = document.querySelector('#succSaveButton');
    });
    dialog.querySelector('#succDiscardButton').addEventListener('click', ()=>{
        let d = document.querySelector('dialog');
        d.parentElement.removeChild(d);
    });
    document.body.appendChild(dialog);
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
        document.querySelector('#generateButton').innerHTML = 'Generate';
        openDialog(fileInfo.cdnUrl);
    }).fail(()=>{
        console.error('Upload Failed');
    });
}


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
        input.addEventListener('keypress', (e)=>{
            if(e.keyCode === 13) input.blur();
        });
        input.addEventListener('keyup', ()=>{
            input.style.height = '1px';
            let old = input.style.height;
            input.style.height = (25+input.scrollHeight)+'px';
            if(old !== input.style.height) {
                tmp.style.height = (25+input.scrollHeight)+'px';
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
 * Store the URL of uploaded image into local storage and refresh the page to take effect
 * @param {object} info 
 */
function uploadHandleComplete(info) {
    imgURL = info.cdnUrl;
    localStorage.setItem('currMeme', imgURL);
    window.location.href = window.location.href;
}
