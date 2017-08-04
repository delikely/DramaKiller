(function () {

    window.onload = init;

    function init() {
        chrome.windows.getAll({ populate: true }, function (windows) {
            windows.forEach(function (window) {
                //获取所有标签页的标题，并提取出视频网站的title添加到下拉框中
                $("#dramaList option").remove();
                window.tabs.forEach(function (tab) {
                    // console.log(tab.title+":"+tab.url);

                    //添加title 会先于isCorrectUrl(tab.url)执行 于是正确的也不会添加到下拉框（异步）
                    // options.js:38 TEST1:http://www.iqiyi.com/v_19rr700mq0.html#curid=695225500_668225dc23ae29d4e6b071f72a482f2e
                    // 22:08:42.736 options.js:20 ERROR:http://www.iqiyi.com/v_19rr700mq0.html#curid=695225500_668225dc23ae29d4e6b071f72a482f2e
                    // 22:08:42.744 options.js:20 ERROR:https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=93093789_hao_pg&…=1&rsv_sug3=2&rsv_sug1=2&rsv_sug7=100&rsv_sug2=0&inputT=1483&rsv_sug4=1482
                    // 22:08:42.747 options.js:20 ERROR:http://tool.oschina.net/regex/
                    // 22:08:42.750 options.js:20 ERROR:https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=js%E6%98%AF%E5%BC…sv_sug7=100&bs=js%20%E8%BF%94%E5%9B%9E%E5%80%BC%E5%B8%83%E5%B0%94%E5%9E%8B
                    // 22:08:42.767 jquery.js:9566 XHR finished loading: GET "http://www.iqiyi.com/v_19rr700mq0.html#curid=695225500_668225dc23ae29d4e6b071f72a482f2e".
                    // 22:08:42.769 options.js:44 PASS:http://www.iqiyi.com/v_19rr700mq0.html#curid=695225500_668225dc23ae29d4e6b071f72a482f2e
                    // if (isCorrectUrl(tab.url) == true) {
                    //     console.log(tab.url);
                    //     $("#dramaList").append("<option value='" + i + "'>" + tab.title + "</option>");
                    //     i++;
                    // }
                    // else{
                    //         console.log("ERROR:"+tab.url);
                    //     }
                    setDramaList(tab.url, tab.title);
                });
            });
        })

        //获取设置本地的剧目 下拉框 展示
        getLocalDrama();
        // console.log($("#dramaList  option:selected").text());
        //存储格式 剧名 集数-连续观看集数-可观看的最大集数(0+连续观看集数)-悬链时间（单位为秒）- 窗口关闭时间
        $("#btn-addItem").click(function () {
            var value = "";
            //有剧
            if ($("#dramaList option:selected").text() != "") {
                value = "";
                //时间有效
                console.log("悬念时长：" + $("#killer-time").val());
                if ($("#killer-time").val() > 120 && $("#killer-time").val() < 7200) {
                    value += $("#dramaList option:selected").val() + '-' + $("#episodeNum option:selected").val() + "-" + $("#episodeNum option:selected").val() + "-" + $("#killer-time").val() + "-" + "1970/01/01 00:00:00";
                    localStorage.setItem($("#dramaList option:selected").text(), value);

                    message('Ok,添加成功！');
                    $("#dramaListLocal option").remove();
                    getLocalDrama();
                }
                else {
                    message("悬念时间输入无效，请重新输入(120-7200之间)！输入的时间单位为秒，如300，表示5分钟。", "error");
                }
            }
            else {
                message('浏览器没有打开任何剧目，请打开后刷新此页面。', 'error');
            }
        });

        $("#btn-delItem").click(function () {
            localStorage.removeItem($("#dramaListLocal option:selected").text());
            message('Ok,删除成功！');
            $("#dramaListLocal option").remove();
            getLocalDrama();
        });
    }

    //关闭了options页面后 content script页面会出现 
    // Error in event handler for (unknown): TypeError: Cannot read property 'episodeNum' of undefined
    //即不能响应请求option.js没有在后台运行
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

    //Ctrl + K + F and Ctrl + K + D  vscode增加缩进 减少缩进 
    //Alt + Shift + F 自动调整格式 自动缩进
    //     function isCorrectUrl(URL) {
    //         //判断是否是爱奇艺的正确的URL 进行过滤 以防御引入XSS
    //         var iqiyReg = "(http|https)://[a-zA-z0-9]*.iqiyi[^\s]*";
    //         var re = new RegExp(iqiyReg);
    //         // console.log("TEST0："+URL);
    //         if (re.test(URL)) {
    //             console.log("TEST1:"+URL);
    //             $.ajax({
    //                 url: URL,
    //                 type: 'GET',
    //                 complete: function (response) {
    //                     if (response.status == 200) {
    //                         console.log("PASS:"+URL);
    //                         return true;
    //                     } else {
    //                         return false;
    //                     }
    //                 }
    //             });
    //         }
    //     }
    // }())

    function getLocalDrama() {
        if (localStorage.length == 0) {
            $("#dramaListLocal").append("<option value='0'>" + "无" + "</option>");
        }
        for (var i = localStorage.length - 1; i >= 0; i--) {
            // console.log('第'+ (i+1) +'条数据的键值为：' + localStorage.key(i) +'，数据为：' + localStorage.getItem(localStorage.key(i)));
            //    console.log(localStorage.getItem(localStorage.key(i)).indexOf("第"));
            if (localStorage.getItem(localStorage.key(i)).indexOf("第") == 0) {
                $("#dramaListLocal").append("<option value='" + localStorage.getItem(localStorage.key(i)) + "'>" + localStorage.key(i) + "</option>");
            }
        }
    }
    function setDramaList(URL, title) {
        //判断是否是爱奇艺的正确的URL 进行过滤 以防御引入XSS
        var iqiyReg = "(http|https)://[a-zA-z0-9]*.iqiyi[^\s]*";
        var re = new RegExp(iqiyReg);
        var DramaListValue = 0;
        // console.log("TEST0："+URL);
        if (re.test(URL)) {
            console.log("TEST1:" + URL);
            $.ajax({
                url: URL,
                type: 'GET',
                complete: function (response) {
                    if (response.status == 200) {
                        console.log("PASS:" + URL);
                        var titleArray = title.split("-");
                        if (titleArray[1] == "电视剧") {
                            var temp = titleArray[0].split("第")
                            $("#dramaList").append("<option value='第" + temp[1] + "'>" + temp[0] + "</option>");
                            DramaListValue++;
                            return true;
                        }
                        //暂未支持
                        if (titleArray[1] == "电影") {
                            $("#dramaList").append("<option value='0'>" + titleArray[0] + "</option>");
                            DramaListValue++;
                            return true;
                        }
                        return false;
                    } else {
                        return false;
                    }
                }
            });
        }
    }

    function message(text, type) {
        var msgType = type || 'success',
            msgClass = 'alert-' + msgType;
        $('#msg').html('<div class="alert ' + msgClass + '">' + text + '</div>');
        setTimeout(function () {
            $('div.alert').hide(500);
        }, 1500);
    }
}())