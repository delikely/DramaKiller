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
            for (var i = localStorage.length - 1; i >= 0; i--) {
                var value = localStorage.getItem(request.dramaUpate);
                var episode_status = value.split("-")[5];
                var episode_once = value.split("-")[1];
                var data = parseInt(value.split("-")[1]) + parseInt(value.split("第")[1].split("集")[0]);
                if (episode_status == 0) {
                    data += 1;
                }
                var valuNew = value.split("-")[0] + "-" + value.split("-")[1] + "-" + data + "-" + value.split("-")[3] + "-" + value.split("-")[4] + "-" + value.split("-")[5];
                localStorage.setItem(request.dramaUpate, valuNew);
                sendResponse({ dramaDetail: localStorage.getItem(request.dramaUpate) });
                return;
            }
        }
        if (request.dramaDateUpate) {
            var data = getDate();
            var value = localStorage.getItem(request.dramaDateUpate);
            setTimeout(function () {
                var valuNew = value.split("-")[0] + "-" + value.split("-")[1] + "-" + value.split("-")[2] + "-" + value.split("-")[3] + "-" + data + "-" + value.split("-")[5];
                localStorage.setItem(request.dramaDateUpate, valuNew);
                sendResponse({ dramaDetail: localStorage.getItem(request.dramaDateUpate) });
            }, 1000);

            return;
        }
        if (request.episodePlus) {
            var value = localStorage.getItem(request.episodePlus);
            var episodeNum = parseInt(value.split("集")[0].split("第")[1]) + 1;
            var valuNew = "第" + episodeNum + "集" + "-" + value.split("-")[1] + "-" + value.split("-")[2] + "-" + value.split("-")[3] + "-" + value.split("-")[4] + "-" + value.split("-")[5];
            localStorage.setItem(request.episodePlus, valuNew);
            sendResponse({ dramaDetail: localStorage.getItem(request.episodePlus) });
            return;
        }
        if (request.dramaStatusUpdate) {
            var value = localStorage.getItem(request.dramaStatusUpdate.split("-")[0]);
            var data = "1";
            if (request.dramaStatusUpdate.split("-")[1] == "0") {
                data = "0";
            }
            var valuNew = value.split("-")[0] + "-" + value.split("-")[1] + "-" + value.split("-")[2] + "-" + value.split("-")[3] + "-" + value.split("-")[4] + "-" + data;
            localStorage.setItem(request.dramaStatusUpdate.split("-")[0], valuNew);
            sendResponse({ dramaDetail: localStorage.getItem(request.dramaStatusUpdate.split("-")[0]) });
            return;
        }
    });

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