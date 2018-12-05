export function downloadImage(url) {
    let c = document.querySelector('#myCanvas');
    let ctx = c.getContext('2d');
    let background = new Image();
    background.crossOrigin = 'anonymous';
    background.src = url; 
    background.onload = () => {
        ctx.drawImage(background,0,0);
        let newImgDataURI = c.toDataURL('image/png');
        let a = document.createElement('a');
        a.download = '';
        a.href = newImgDataURI;
        a.click();
    };
}


export function gotoURL(url) {
    return function t() {
        window.location.href = url;
    };
}