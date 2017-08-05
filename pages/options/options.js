(function () {
    window.onload = init;
    function init() {
        chrome.windows.getAll({ populate: true }, function (windows) {
            windows.forEach(function (window) {
                $("#dramaList option").remove();
                window.tabs.forEach(function (tab) {
                    setDramaList(tab.url, tab.title);
                });
            });
        })

        getLocalDrama();

        $("#btn-addItem").click(function () {
            var value = "";
            if ($("#dramaList option:selected").text() != "") {
                value = "";
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

    function getLocalDrama() {
        if (localStorage.length == 0) {
            $("#dramaListLocal").append("<option value='0'>" + "无" + "</option>");
        }
        for (var i = localStorage.length - 1; i >= 0; i--) {
            if (localStorage.getItem(localStorage.key(i)).indexOf("第") == 0) {
                $("#dramaListLocal").append("<option value='" + localStorage.getItem(localStorage.key(i)) + "'>" + localStorage.key(i) + "</option>");
            }
        }
    }

    function setDramaList(URL, title) {
        var iqiyReg = "(http|https)://[a-zA-z0-9]*.iqiyi[^\s]*";
        var re = new RegExp(iqiyReg);
        var DramaListValue = 0;
        if (re.test(URL)) {
            $.ajax({
                url: URL,
                type: 'GET',
                complete: function (response) {
                    if (response.status == 200) {
                        var titleArray = title.split("-");
                        if (titleArray[1] == "电视剧") {
                            var temp = titleArray[0].split("第")
                            $("#dramaList").append("<option value='第" + temp[1] + "'>" + temp[0] + "</option>");
                            DramaListValue++;
                            return true;
                        }
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