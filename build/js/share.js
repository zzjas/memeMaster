export function initShare(e,n,t){if(void 0!==navigator.share){let n=e=>{var n=document.querySelector("link[rel=canonical]")?document.querySelector("link[rel=canonical]").href:window.location.href;navigator.share({title:document.title,url:n}).then(()=>console.warn("Successful share")).catch(e=>console.warn("Error sharing:",e)),e.preventDefault()};e.addEventListener("click",n)}let r=()=>{const r=document.createElement("textarea");r.value=t,n.appendChild(r),r.select(),document.execCommand("copy"),n.removeChild(r),e.innerHTML="Copied!"},c=()=>{e.innerHTML="Copy Link",e.removeEventListener("click",c),e.addEventListener("click",r)};e.addEventListener("click",c)};
