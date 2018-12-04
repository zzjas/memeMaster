function main() {
    // Put default or last meme as placeholder
    let imgURL = localStorage['currMeme'] || './img/doge.jpeg'; 
    document.querySelector('#memeImg').src= imgURL;

    let p = document.createElement('p');
    p.innerHTML = imgURL;
    document.body.appendChild(p);
    
    // Set up the UploadCare widget
    let upload = uploadcare.Widget('[role="uploadcare-uploader"]');
    upload.onChange(uploadHandleChange);
    upload.onUploadComplete(uploadHandleComplete);

    // Allow user to change the text by double clicking on the text
    document.querySelector('#topText').addEventListener('dblclick', textHandleDblclick('top'));
    document.querySelector('#bottomText').addEventListener('dblclick', textHandleDblclick('bottom'));
    
    // Render the image
    document.querySelector('#generateButton').addEventListener('click', handleGenerate);
}



window.addEventListener('load', ()=> main() );


function drawStroked(ctx, text, x, y) {
	ctx.textAlign = "center";
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 7;
    ctx.strokeText(text, x, y);
    ctx.fillStyle = 'white';
    ctx.fillText(text, x, y);
}

/**
 * Render the image with canvas
 */
function handleGenerate() {
    let tt = document.querySelector('#topText');
    let children = tt.childNodes[0];

    console.log(children.offsetLeft);
    let bt = document.querySelector('#bottomText');
    let img = document.querySelector('#memeImg');
    let topTextOffset = {
        top: tt.offsetTop - img.offsetTop,
        left: tt.offsetLeft - img.offsetLeft
    }
    let bottomTextOffset = {
        top: bt.offsetTop - img.offsetTop,
        left: bt.offsetLeft - img.offsetLeft
    }
    console.log(topTextOffset);
    console.log(bottomTextOffset);

    var c = document.getElementsByTagName('canvas')[0];
    var ctx = c.getContext("2d");

    var background = new Image();
    background.crossOrigin = 'anonymous';
    background.src = "https://ucarecdn.com/0e3489a6-2c12-4b9f-b4c1-e0c136b90686/-/crop/500x500/175,0/-/preview/";

    background.onload = function(){
        ctx.drawImage(background,0,0);
        ctx.font = "4em Impact";
        drawStroked(ctx, "Upper Meme", 250, 65);
        drawStroked(ctx, "Lower Meme", 250, 420);
        var d=c.toDataURL("image/png");
        console.log(d);
    }
}

/**
 * When user double clicks the text, add an input field to allow user to change
 * the text. After losing the focus, changed input will be stored in the text
 * box.
 */
function textHandleDblclick(pos) {
    let textBox = document.querySelector(`#${pos}Text`);
    return function handler(e) {
        let tmp = textBox.cloneNode(true);
        tmp.setAttribute('style',
        `background-color: rgba(192,192,192, 0.5);
         border: 2px dashed black;`);

        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('value', tmp.innerHTML);

        function inputHandleComplete() {
            tmp.removeChild(input);
            tmp.innerHTML = input.value;
            tmp.addEventListener('dblclick', textHandleDblclick('top'));
            tmp.setAttribute('style',
                `background-color: transparent;
                 border: 1px dashed gray;`);
        };

        input.addEventListener('blur', inputHandleComplete); 
        input.addEventListener('keypress', (e)=>{
            if(e.keyCode === 13) input.blur();
        });
        tmp.innerHTML = '';
        tmp.appendChild(input);
        document.querySelector('#memeContainer').replaceChild(tmp, textBox);

        let len = input.value.length;
        input.setSelectionRange(len, len);
    };
}

/**
 * Change the text on button while uploading
 * @param {object} file 
 */
function uploadHandleChange(file) {
    document.querySelector('button.uploadcare--widget__button_type_open').innerHTML = 'Uploading...';
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
