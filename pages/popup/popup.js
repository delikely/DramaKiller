
function click(e) {
   document.getElementById("msg").innerHTML="别看剧了，去寻找诗和远方吧！";
} 

document.addEventListener('DOMContentLoaded', function () {
  
       var disable_drama_killer = document.querySelector('div');
       disable_drama_killer.addEventListener('click',click)
});

