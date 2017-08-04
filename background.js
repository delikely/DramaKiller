chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.dramaName) {
            for (var i = localStorage.length - 1; i >= 0; i--) {
                if (localStorage.key(i) == request.dramaName) {
                    sendResponse({ dramaDetail: localStorage.getItem(localStorage.key(i)) });
                    return;
                }
            }
            sendResponse({ episodeNum: "NULL" });
        }

        if (request.dramaUpate) {
            // for (var i = localStorage.length - 1; i >= 0; i--) {
            //     if (localStorage.key(i) == request.dramaUpate) {
            //         var value = localStorage.getItem(localStorage.key(i));
            //         var data = parseInt(value.split("-")[1]) + parseInt(value.split("第")[1].split("集")[0]) - 1;
            //         var valuNew = value.split("-")[0] + "-" + value.split("-")[1] + "-" + data + "-" + value.split("-")[3] + "-" + value.split("-")[4];
            //         localStorage.setItem(request.dramaUpate, valuNew);
            //         sendResponse({ dramaDetail: localStorage.getItem(localStorage.key(i)) });
            //         // sendResponse({ dramaDetail: valuNew });
            //         return;
            //     }
            // }
            // sendResponse({ dramaDetail:request.dramaUpate });

            for (var i = localStorage.length - 1; i >= 0; i--) {
                var value = localStorage.getItem(request.dramaUpate);
                var data = parseInt(value.split("-")[1]) + parseInt(value.split("第")[1].split("集")[0]) - 1;
                var valuNew = value.split("-")[0] + "-" + value.split("-")[1] + "-" + data + "-" + value.split("-")[3] + "-" + value.split("-")[4];
                localStorage.setItem(request.dramaUpate, valuNew);
                sendResponse({ dramaDetail: localStorage.getItem(request.dramaUpate) });
                return;
            }
        }
        if (request.closeDramaDateUpate) {
            // var value = localStorage.getItem(request.closeDramaDateUpate);
            // var valuNew = value.split("-")[0] + "-" + value.split("-")[1] + "-" + value.split("-")[2] + "-" + value.split("-")[3] + "-" + data;
            // localStorage.setItem(request.closeDramaDateUpate, valuNew);
            // sendResponse({ dramaDetail: localStorage.getItem(request.closeDramaDateUpate) });
            //解决异步问题 延时1s 否则getDate()的值为undefined
            var data = getDate();
            var value = localStorage.getItem(request.closeDramaDateUpate);
            setTimeout(function () {
                var valuNew = value.split("-")[0] + "-" + value.split("-")[1] + "-" + value.split("-")[2] + "-" + value.split("-")[3] + "-" + data;
                localStorage.setItem(request.closeDramaDateUpate, valuNew);
                sendResponse({ dramaDetail: localStorage.getItem(request.closeDramaDateUpate) });
                // sendResponse({ dramaDetail: valuNew });
                // sendResponse({ dramaDetail: "ok" });
            }, 1000);

            return;
        }
        if (request.episodePlus) {
            var value = localStorage.getItem(request.episodePlus);
            var episodeNum = parseInt(value.split("集")[0].split("第")[1]) + 1;
            var valuNew = "第" + episodeNum + "集" + value.split("集")[1];
            localStorage.setItem(request.episodePlus, valuNew);
            sendResponse({ dramaDetail: localStorage.getItem(request.episodePlus) });
            return;
        }
        // if (request.episodeNum) {
        //     var value = localStorage.getItem(request.episodePlus);
        //     var num = parseInt(value.split("集")[0].split("第")[1]);
        //     sendResponse({ episodeNum: num });
        //     return;
        // }


    });

// chrome.runtime.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         for (var i = localStorage.length - 1; i >= 0; i--) {

//         } if (localStorage.key(i) == request.dramaUpate) {
//                 var value = localStorage.getItem(localStorage.key(i));
//                 var data = value.split("-")[2] + parseInt(value.split("第")[1].split("集")[0]);
//                 var valuNew = value.split("-")[0] + "-" + value.split("-")[1] + "-" + data + "-" + value.split("-")[3] + "-" + value.split("-")[4];
//                 localStorage.setItem(request.dramaUpate, valueNew);
//                 sendResponse({ dramaDetail: localStorage.getItem(localStorage.key(i)) });
//                 return;
//             }
//     });


//content script 与其他js页面不互通 获取时间函数复制了一份过来
//给时间<10的，添加0占位
function addZeroForTime(s) {
    return s < 10 ? '0' + s : s;
}

function getDate() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    var month = myDate.getMonth() + 1;
    var date = myDate.getDate();
    var h = myDate.getHours();
    var m = myDate.getMinutes();
    var s = myDate.getSeconds();
    return year + '/' + addZeroForTime(month) + "/" + addZeroForTime(date) + " " + addZeroForTime(h) + ':' + addZeroForTime(m) + ":" + addZeroForTime(s);
}