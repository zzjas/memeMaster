var shareButton = document.getElementById('shareButton');
var supported = document.getElementById('support');

// export function share(shareButton, support){
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
	    }).then(() => console.log('Successful share'))
	      .catch((error) => console.log('Error sharing:', error));

	    ev.preventDefault();
	  } else {
	    supported.innerHTML = "Unfortunately, this feature is not supported on your browser";
	  }
	});
// }