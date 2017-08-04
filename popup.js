
function click(e) {
  // chrome.tabs.executeScript(null,{code:"document.body.style.backgroundColor='" + e.target.id + "'"});
 
  //   chrome.tabs.query({active: true}, function (tabs) {
  //   if (tabs.length > 1)
  //     document.getElementById("text").value="ok";
  //       // document.getElementById("text").value=tabs[0].id;
  // });
  // window.close();
   document.getElementById("msg").innerHTML="哈哈，你关不掉我的！";

} 


document.addEventListener('DOMContentLoaded', function () {
  // document.getElementById("text").value=localStorage.getItem(localStorage.key(1));
  // document.getElementById("id").options[i].selected=true;
  // var divs = document.querySelectorAll('div');
  // for (var i = 0; i < divs.length; i++) {
  //   divs[i].addEventListener('click', click);
  // }
       var disable_drama_killer = document.querySelector('div');
       disable_drama_killer.addEventListener('click',click)
});

    //同理 关闭了popup页面后 content script页面会出现 
    // Error in event handler for (unknown): TypeError: Cannot read property 'episodeNum' of undefined
    //即不能响应请求popup.js没有在后台运行
    // chrome.runtime.onMessage.addListener(
    //     function (request, sender, sendResponse) {
    //         console.log("request:" + request.dramaName);
    //         for (var i = localStorage.length - 1; i >= 0; i--) {
    //             if (localStorage.key(i) == request.dramaName) {
    //                 sendResponse({ episodeNum:localStorage.getItem(localStorage.key(i)).split("-")[0] });
    //                 break;
    //             }
    //         }
    //         sendResponse({ episodeNum: "-1" });
    //     });

