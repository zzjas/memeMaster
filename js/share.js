export function initShare(shareButton, support, url){
    // Listen for any clicks
    shareButton.addEventListener('click', function (ev) {
        // Check if the current browser supports the Web Share API
        if (navigator.share !== undefined) {

            // Get the canonical URL from the link tag
            var shareUrl = document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : window.location.href;

            // Share it!
            navigator.share({
                title: document.title,
                url: shareUrl
            }).then(() => console.warn('Successful share'))
                .catch((error) => console.warn('Error sharing:', error));

            ev.preventDefault();
        } 
        else {
            const el = document.createElement('input');
            el.value = url;
            support.appendChild(el);
            const cb = document.createElement('button');
            cb.innerHTML = "Copy Link";
            cb.addEventListener('click',()=>{
                el.select();
                document.execCommand('copy');
            });
            support.appendChild(cb);
            support.style.display = '';
        }
    });
}