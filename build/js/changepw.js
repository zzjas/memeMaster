document.getElementById("submitButton").addEventListener("click",()=>{email=document.getElementById("email"),currPw=document.getElementById("currentPassword"),newPw=document.getElementById("newPassword"),firebase.auth().signInWithEmailAndPassword(email.value,currPw.value).then(function(e){firebase.auth().currentUser.updatePassword(newPw.value).then(function(){window.location.href="./login.html"}).catch(function(e){alert("Your new password is not in format")})}).catch(function(e){alert("Your current password is incorrect")})}),document.getElementById("cancelButton").addEventListener("click",()=>{window.location.href="./login.html"});
