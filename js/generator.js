function main() {
    // Put default or last meme as placeholder
    let imgURL = localStorage['currMeme'] || './img/doge.jpg'; 
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
}



window.addEventListener('load', ()=> main() );





/**
 * When user double clicks the text, add an input field to allow user to change
 * the text. After losing the focus, changed input will be stored in the text
 * box.
 */
function textHandleDblclick(pos) {
    let textBox = document.querySelector(`#${pos}Text`);

    return function handler(e) {
        let tmp = textBox.cloneNode(true);
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('value', tmp.innerHTML);

        function inputHandleComplete() {
            tmp.removeChild(input);
            tmp.innerHTML = input.value;
            tmp.addEventListener('dblclick', textHandleDblclick('top'));
        };

        input.addEventListener('blur', inputHandleComplete); 
        input.addEventListener('keypress', (e)=>{
            if(e.keyCode === 13) input.blur();
        });
        tmp.innerHTML = '';
        tmp.appendChild(input);
        document.querySelector('#memeContainer').replaceChild(tmp, textBox);
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
