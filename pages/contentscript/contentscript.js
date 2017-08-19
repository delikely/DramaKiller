
var flagPlus;
var url;
setTimeout(function () { start() }, 5000);
function start() {

    try {
        flagPlus = true;
        var time_all = document.getElementsByClassName("time-all")[0].innerHTML.substring(1);
        time_all = timeToSecond(time_all);
        var time_recent = document.getElementsByClassName("time-recent")[0].innerHTML;
        time_recent = timeToSecond(time_recent);
        var time_pause = 600;
        var url = document.URL;
        var videotitle = document.getElementById("widget-videotitle").innerHTML.split("第");
        chrome.runtime.sendMessage({ dramaName: videotitle[0] }, function (response) {
            var dramaValue = response.dramaDetail;
            var time_pause = parseInt(getSuspenseTime(dramaValue));
            var episode_max = getEpisodeNumMax(dramaValue);
            var episode_num = getEpisodeNum(dramaValue);
            var episode_now = videotitle[1].split("集")[0];
            var episode_once = parseInt(getEpisodeNumOnce(dramaValue));
            if (videotitle[1].split("集")[0] != getEpisodeNum(dramaValue) && flagPlus == true) {
                alert("想绕过没门!\n上次看到第" + getEpisodeNum(dramaValue) + "集,不可以跳着看哟！\n如若是误报，请忽略。")
            }
            if (dramaValue != "NULL") {
                if (timeOverInterval(getDate(), getLastDate(dramaValue)) == true) {
                    chrome.runtime.sendMessage({ dramaUpate: videotitle[0] }, function (response) {
                        dramaValue = response.dramaDetail;
                    });
                    chrome.runtime.sendMessage({ dramaDateUpate: document.getElementById("widget-videotitle").innerHTML.split("第")[0] }, function (response) {
                        dramaValue = response.dramaDetail;
                    });
                }
                setTimeout(function () {
                    if (timeOverInterval(getDate(), getLastDate(dramaValue)) == true) {
                        chrome.runtime.sendMessage({ dramaStatusUpdate: document.getElementById("widget-videotitle").innerHTML.split("第")[0] + "-1" }, function (response) {
                            dramaValue = response.dramaDetail;
                        });
                    }
                    episode_max = getEpisodeNumMax(dramaValue);
                    var int = setInterval(function () {
                        judge(int, time_all, time_pause, episode_max, episode_now, episode_num)
                    }, 2000);
                }, 3000)

            }
        });
    }
    catch (err) {
        setTimeout(function () { start() }, 5000);
    }
}

function timeToSecond(time) {
    var timeSplit = time.split(':');
    if (timeSplit.length == 2) {
        return Number(timeSplit[0] * 60) + Number(timeSplit[1]);
    }
    if (timeSplit.length == 3) {
        return Number(timeSplit[0] * 3600) + Number(timeSplit[1] * 60) + Number(timeSplit[2]);
    }
}

function judge(int, time_all, time_pause, episode_max, episode_now, episode_num) {

    var episode_judge = parseInt(episode_now) + 1;
    if (url != document.URL) {
        url = document.URL;
        int = window.clearInterval(int);
        setTimeout(function () { start() }, 5000);
    }

    time_recent = timeToSecond(document.getElementsByClassName("time-recent")[0].innerHTML);
    if (time_all < time_recent + time_pause && episode_max == episode_judge) {
        chrome.runtime.sendMessage({ dramaStatusUpdate: document.getElementById("widget-videotitle").innerHTML.split("第")[0] + "-0" }, function (response) {
            dramaValue = response.dramaDetail;
        });
        
        chrome.runtime.sendMessage({ dramaDateUpate: document.getElementById("widget-videotitle").innerHTML.split("第")[0] }, function (response) {
            dramaValue = response.dramaDetail;
        });

        setTimeout(function () { window.open(chrome.extension.getURL("pages/message.html"), "_self") }, 2000);
    }

    if (time_all < time_recent + time_pause && episode_max > episode_judge && flagPlus) {
        if (episode_num == episode_now) {
            chrome.runtime.sendMessage({ dramaDateUpate: document.getElementById("widget-videotitle").innerHTML.split("第")[0] }, function (response) {
                dramaValue = response.dramaDetail;
            });
            setTimeout(function () {
                chrome.runtime.sendMessage({ episodePlus: document.getElementById("widget-videotitle").innerHTML.split("第")[0] }, function (response) {
                    dramaValue = response.dramaDetail;
                    flagPlus = false;
                });
            }, 2000);
        }
    }

    if (episode_max < episode_judge) {
        window.open(chrome.extension.getURL("pages/message.html"), "_self");
    }
}

function getCurrentTime() {
    return document.getElementsByClassName("time-recent")[0].innerHTML;
}

function getEpisodeNum(dramaDetail) {
    return parseInt(dramaDetail.split("-")[0].split("第")[1].split("集")[0]);
}

function getEpisodeNumOnce(dramaDetail) {
    return parseInt(dramaDetail.split("-")[1]);
}

function getEpisodeNumMax(dramaDetail) {
    return parseInt(dramaDetail.split("-")[2]);
}

function getSuspenseTime(dramaDetail) {
    return parseInt(dramaDetail.split("-")[3]);
}

function getLastDate(dramaDetail) {
    return dramaDetail.split("-")[4];
}

function getPlayStatus(dramaDetail) {
    return dramaDetail.split("-")[5];
}

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

function timeOverInterval(now, pass) {
    var nowYear = parseInt(now.split("/")[0]);
    var passYear = parseInt(pass.split("/")[0]);
    if (nowYear - passYear > 1) {
        return true;
    }
    var nowMonth = parseInt(now.split("/")[1]);
    var passMonth = parseInt(pass.split("/")[1]);
    if (nowMonth - passMonth > 1) {
        return true;
    }
    var nowDay = parseInt(now.split("/")[2].split(" ")[0]);
    var passDay = parseInt(pass.split("/")[2].split(" ")[0]);
    if (nowDay - passDay > 1) {
        return true;
    }
    var nowTime = timeToSecond(now.split("/")[2].split(" ")[1]);
    var passTime = timeToSecond(pass.split("/")[2].split(" ")[1]);
    if (nowTime - passTime > 3600 * 3) {
        return true;
    }
    return false;
}