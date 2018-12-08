export function generateDownloadHandler(url, name) {
    return function () {
        let c = document.querySelector('#downloadCanvas');
        let ctx = c.getContext('2d');
        let background = new Image();
        background.crossOrigin = 'anonymous';
        background.src = url; 
        background.onload = () => {
            ctx.canvas.width = background.naturalWidth;
            ctx.canvas.height = background.naturalHeight;
            ctx.drawImage(background,0,0);
            let newImgDataURI = c.toDataURL('image/png');
            let a = document.createElement('a');
            a.download = name;
            a.href = newImgDataURI;
            a.click();
        };
    };
}

export function generateEditHandler(info) {
    return function () {
        localStorage.setItem('edit', JSON.stringify({
            imgURL: info.raw,
            imgSize: info.size,
            fontSize: info.fontSize,
            
        }));
    };
}


export function generateGoToURLHandler(url) {
    return function t() {
        window.location.href = url;
    };
}

export function createButton(name) {
    let b = document.createElement('button');
    b.setAttribute('class', name);
    let i = new Image();
    i.setAttribute('class', 'icon');
    i.src = `./img/${name}.svg`;
    b.appendChild(i);
    return b;
}


export function startLoading() {
    let b = document.createElement('div');
    b.id = 'loadingBG';

    let l = new Image();
    l.src = './img/loading.svg';
    b.appendChild(l);

    document.body.appendChild(b);
}

export function endLoading() {
    let b = document.querySelector('#loadingBG');
    document.body.removeChild(b);
}