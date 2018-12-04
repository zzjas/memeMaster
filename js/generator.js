function main() {
    let imgURL = localStorage['currMeme'] || './img/doge.jpg'; 
    document.querySelector('#meme').src= imgURL;

    let p = document.createElement('p');
    p.innerHTML = imgURL;
    document.body.appendChild(p);
    
    let upload = uploadcare.Widget('[role="uploadcare-uploader"]');
    upload.onChange(uploadOnChange);
    upload.onUploadComplete(uploadOnComplete);

    function uploadOnChange(file) {
        document.querySelector('button.uploadcare--widget__button_type_open').innerHTML = 'Uploading...';
    }
    

    function uploadOnComplete(info) {
        imgURL = info.cdnUrl;
        localStorage.setItem('currMeme', imgURL);
        window.location.href = window.location.href;
    }
}



window.addEventListener('load', ()=>{main();});