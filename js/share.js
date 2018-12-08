export function initShare(shareButton, dialog, url){
    if (navigator.share !== undefined) {
        let mobileHandler = (ev) => {
            // Get the canonical URL from the link tag
            var shareUrl = document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : window.location.href;

            // Share it!
            navigator.share({
                title: document.title,
                url: shareUrl
            }).then(() => console.warn('Successful share'))
                .catch((error) => console.warn('Error sharing:', error));

            ev.preventDefault();
        };
        shareButton.addEventListener('click', mobileHandler);
    }
    let secondHandler = ()=>{
        const el = document.createElement('textarea');
        el.value = url;
        dialog.appendChild(el);
        el.select();
        document.execCommand('copy');
        dialog.removeChild(el);
        shareButton.innerHTML = 'Copied!';
    };
    let firstHandler = ()=>{
        shareButton.innerHTML = 'Copy Link';
        shareButton.removeEventListener('click', firstHandler);
        shareButton.addEventListener('click', secondHandler);
    };

    shareButton.addEventListener('click', firstHandler);
}