
// setTimeout(function(){alert("recent:"+ document.getElementsByClassName("time-recent")[0].innerHTML +"\n"+"all:"+document.getElementsByClassName("time-all")[0].innerHTML.substring(1))},5000);

var flagPlus;
var url;


//pause 5s to execute
setTimeout(function () { start() }, 5000);
function start() {
    flagPlus = true;
    //get time-all
    var time_all = document.getElementsByClassName("time-all")[0].innerHTML.substring(1);
    console.log("time-all-raw:" + time_all);
    time_all = timeToSecond(time_all);
    //将时间转换化为秒
    var time_recent = document.getElementsByClassName("time-recent")[0].innerHTML;
    console.log("time-recent-raw:" + time_recent);
    time_recent = timeToSecond(time_recent);
    var time_pause = 600;
    console.log("time-all:" + time_all);
    console.log("time-recent:" + time_recent);
    //get URL
    var url = document.URL;
    console.log("URL:" + url);





    //v1
    // //网页会卡死
    // while(1){
    //     //获取当前播放时间并转化为秒数
    //     time_recent = timeToSecond(document.getElementsByClassName("time-recent")[0].innerHTML);
    //     // 时间到
    //     if(time_all<time_recent+time_pause){
    //         //输出文字覆盖原页面
    //         document.body.innerHTML = "毛主席教导我们要好好学习，天天向上！";
    //         //或跳转到指定页面
    //         // window.location.href="https://www.baidu.com";
    //     }
    // }

    //v2
    // setTimeout(function(){ 
    //     //输出文字覆盖原页面
    //     document.body.innerHTML = "毛主席教导我们要好好学习，天天向上！";
    //     //或跳转到指定页面
    //     // window.location.href="https://www.baidu.com";
    // },(time_all-time_recent-time_pause)*1000);

    //v3  setInterval执行的函数不能带参数
    //在JS中无论是setTimeout还是setInterval，在使用函数名作为调用句柄时都不能带参数
    //使用匿名函数包装
    // setInterval(function () {
    //     judge(time_all, time_recent, time_pause)
    // }, 2000);

    //查询剧目是否在本地存储中  返回当前观看的集数  -1表示没有添加到本地

    //改进 返回当前剧目对应本地存储的value，NULL表示本地存储中没有记录
    var videotitle = document.getElementById("widget-videotitle").innerHTML.split("第");
    chrome.runtime.sendMessage({ dramaName: videotitle[0] }, function (response) {
        // console.log(videotitle[0] + "详情:" + response.dramaDetail );
        //有剧
        var dramaValue = response.dramaDetail;
        var time_pause = parseInt(getSuspenseTime(dramaValue));
        var episode_max = getEpisodeNumMax(dramaValue);
        var episode_num = getEpisodeNum(dramaValue);
        var episode_now = videotitle[1].split("集")[0];
        if (dramaValue != "NULL") {
            console.log(videotitle[0] + ":" + getEpisodeNum(dramaValue) + " " + getEpisodeNumOnce(dramaValue) + " " + getEpisodeNumMax(dramaValue) + " " + getSuspenseTime(dramaValue) + " " + getLastDate(dramaValue));
            //getSuspenseTime()返回的值为string类型，需要使用parseInt()才能做数值加法 
            //是否需要刷新 3个小时到了 又可以看剧了
            //消息传递机制有问题 不能使用同一个监听
            // if(timeOverInterval(getDate(),getLastDate(dramaValue )) == true){
            //     console.log("timeOverInterval &本地:"+getEpisodeNum(dramaValue)+" 当前："+videotitle[1].split("集")[0]+" 一次可看集数："+getEpisodeNumOnce(dramaValue));
            // }

            if (timeOverInterval(getDate(), getLastDate(dramaValue)) == true && getEpisodeNum(dramaValue) < videotitle[1].split("集")[0] + getEpisodeNumOnce(dramaValue)) {
                chrome.runtime.sendMessage({ dramaUpate: videotitle[0] }, function (response) {
                    dramaValue = response.dramaDetail;
                    console.log("New dramaDetail after update max epispdenum:" + dramaValue);
                });
            }

			if (videotitle[1].split("集")[0] < getEpisodeNumMax(dramaValue) - getEpisodeNumOnce(dramaValue) || videotitle[1].split("集")[0] > getEpisodeNumMax(dramaValue)) {

                //+更新可观看集数  可能还会被绕过限制
                // confirm("上次看到第"+getEpisodeNum(dramaValue) + "集,是否更新数据?");

                //Error in event handler for (unknown): TypeError: Cannot read property 'create' of undefined
                // var opt = {
                //     type: 'basic',
                //     title: "提示",
                //     message: "上次看到第" + getEpisodeNum(dramaValue) + ",不要错过精彩剧情哟！"
                // };
                //     chrome.notifications.create('', opt,function (id) {});
                alert("温馨提示：上次看到第" + getEpisodeNum(dramaValue) + "集!")
            }




            // console.log("PAUSE:"+time_pause);
            //最大可观看集数=<当前集数时
            // console.log("当前的集数第：" + videotitle[1].split("集")[0]+"集");
            var int = setInterval(function () {
                judge(int, time_all, time_pause, episode_max, episode_now, episode_num, episode_num)
            }, 2000);
        }
    });

    // if (time_all - time_recent == 90) {
    //     chrome.runtime.sendMessage({ episodeNum:"plus"},function(response){
    //         console.log(response.status);
    //     });
}

function timeToSecond(time) {
    var timeSplit = time.split(':');
    //时间不含小时 如40:30
    if (timeSplit.length == 2) {
        return Number(timeSplit[0] * 60) + Number(timeSplit[1]);
    }
    //时间含小时部分 如1:20:32
    if (timeSplit.length == 3) {
        return Number(timeSplit[0] * 3600) + Number(timeSplit[1] * 60) + Number(timeSplit[2]);
    }
}

function judge(int,time_all, time_pause, episode_max, episode_now, episode_num) {
    //当URL发生变化是重新执行主函数 从第1集到第2集的情况
    if (url != document.URL) {
        url = document.URL;
        int = window.clearInterval(int);
        setTimeout(function () { start() }, 5000);
    }
    time_recent = timeToSecond(document.getElementsByClassName("time-recent")[0].innerHTML);
    console.log("Now:" + time_recent + "  Pause:" + time_pause + "  All:" + time_all);
	//防止剧集跳过
    if (episode_max < episode_now) {
        window.open(chrome.extension.getURL("pages/message.html"), "_self");
    }
	
    // 时间到 集数到
    if (time_all < time_recent + time_pause && episode_max <= episode_now) {
        //输出文字覆盖原页面
        // document.body.innerHTML = "毛主席教导我们要好好学习，天天向上！";
        //或跳转到指定页面
        // window.location.href="https://www.baidu.com";
        //在当前窗口打开提示消息

        //解决异步问题
        // dramaValue="";

        //更新时间
        chrome.runtime.sendMessage({ closeDramaDateUpate: document.getElementById("widget-videotitle").innerHTML.split("第")[0] }, function (response) {
            dramaValue = response.dramaDetail;
            console.log("New dramaDetail after closeDramaDateUpate :" + dramaValue);
        });

        //解决异步问题 关闭窗口早与修改数据
        //卡死
        // while(dramaValue==""){
        //    var wait="" ;
        // }

        //超时1000ms 可能会出差  由于设置的background.js中getDate()也是1000ms
        setTimeout(function () { window.open(chrome.extension.getURL("index.html"), "_self") }, 1500);
        // window.open(chrome.extension.getURL("index.html"), "_self");
    }

    //会一直+1 
    //解决方法1 从本地存储中取得episode_num  则+1后，episode_num ！= episode_now  存在异步问题需要解决，例如使用延时
    //解决方法2 设置一个全局变量 使+1只执行一次
    // if (time_all < time_recent + time_pause && episode_max > episode_now) {
    //     //  console.log(episode_num + "+++++++++" + episode_now);
    //     if (episode_num == episode_now) {
    //         chrome.runtime.sendMessage({ episodePlus: document.getElementById("widget-videotitle").innerHTML.split("第")[0] }, function (response) {
    //             dramaValue = response.dramaDetail;
    //             console.log("New dramaDetail after episode +1 :" + dramaValue);
    //             return;
    //         });
    //     }

    //v1.1
    // var episode_num;
    //         chrome.runtime.sendMessage({ episodeNum: document.getElementById("widget-videotitle").innerHTML.split("第")[0] }, function (response) {
    //             episode_num = response.episodeNum;
    //             console.log("get episode_num record:" + episode_num);
    //         });
    // if (time_all < time_recent + time_pause && episode_max > episode_now) {
    //     if (episode_num == episode_now) {
    //         chrome.runtime.sendMessage({ episodePlus: document.getElementById("widget-videotitle").innerHTML.split("第")[0] }, function (response) {
    //             dramaValue = response.dramaDetail;
    //             console.log("New dramaDetail after episode +1 :" + dramaValue);
    //             return;
    //         });
    //     }
    // }
    console.log("local episode_num:" + episode_num + "------NOW:" + episode_now);
    if (time_all < time_recent + time_pause && episode_max > episode_now && flagPlus) {
        console.log("更新信息，即将进入下一集。");
        if (episode_num == episode_now) {
            chrome.runtime.sendMessage({ episodePlus: document.getElementById("widget-videotitle").innerHTML.split("第")[0] }, function (response) {
                dramaValue = response.dramaDetail;
                console.log("New dramaDetail after episode +1 :" + dramaValue);
                flagPlus = false;
                //不添加可能会导致 查看下一集时episode_max重新计算   最好关闭窗口，或者url切换时记录一下（存储）时间
                chrome.runtime.sendMessage({ closeDramaDateUpate: document.getElementById("widget-videotitle").innerHTML.split("第")[0] }, function (response) {
                    dramaValue = response.dramaDetail;
                    console.log("New dramaDetail after closeDramaDateUpate :" + dramaValue);
                });
                return;
            });
        }
    }
}
// 无法执行 overstackflow 有人说contentscript里面不能用tabs,可以通过消息机制传递
// chrome.tabs.getCurrent(function(tab){  
//  alert("begin");
//  console.log(tab.title);  
//  alert(tab.url);
//  alert(tab.title);
//  console.log(tab.url);  
//  })

// setTimeout(function(){time_all = document.getElementsByClassName("time-all")[0].innerHTML.substring(1)},5000);
// alert("all:"+time_all);

//无法获取到时间 为空
// setTimeout(function(){getTimeAll()},5000);
// alert("all-time:"+time_all); //为空   先于getTimeAll()执行
// function getTimeAll()
// {
//     time_all = document.getElementsByClassName("time-all")[0].innerHTML.substring(1);
//     alert("all:"+time_all);
// }


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

function timeOverInterval(now, pass) {
    //时间格式 1970/01/01 08:00:00
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