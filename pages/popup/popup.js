
function click(e) {
   document.getElementById("msg").innerHTML="哈哈，你关不掉我的！";
} 

document.addEventListener('DOMContentLoaded', function () {
  
       var disable_drama_killer = document.querySelector('div');
       disable_drama_killer.addEventListener('click',click)
});

