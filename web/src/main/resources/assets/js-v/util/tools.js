/**
 * Description：抽取的公共方法
 * Author：yufei
 * Date：2020/3/30
 */

/**
 * 根据url参数名称获取参数值
 * @param {*} name 参数名称
 */
function getUrlKey(name) {
    return decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

/**
 * 生成GUID(36)
 */
function newGuid36() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 生成GUID(32)
 */
function newGuid32() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * 判断字符串为空
 * @param {*} obj
 */
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "" || obj == 'null') {
        return true;
    } else {
        return false;
    }
}

/**
 * 初始化日期
 */
function initDate() {
    return formatDateUtil(new Date(), "yyyy-MM-dd");
}

/**
 * 初始化时间
 */
function initDateTime() {
    return formatDateUtil(new Date(), "yyyy-MM-dd hh:mm");
}

/**
 * 获取 yyyyMMddhhmmss 格式计划号
 */
function jhhDateTime() {
    return formatDateUtil(new Date(), "yyyyMMddhhmmss");
}

/**
 * 获取 yyyyMMdd 格式
 */
function initApplyDate() {
    return formatDateUtil(new Date(), "yyyyMMdd");
}

/**
 * 时间格式化
 * @param {*} date
 * @param {*} fmt
 */
function formatDateUtil(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    var o = {
        // 获取月、日、时、分、秒
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (var k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            var str = o[k] + ''
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
        }
    }

    return fmt;
}

//ElementUI的message提示框
function message(type, message, time) {
    vm.$message({
        /**success|warning|info|error**/
        type: type,
        message: message,
        duration: time
    });
}

// 回车查询
function keyDown(){
    document.getElementById("key-search").click();
}

// 控制el-table高度
function getTblHeight(cut){
    var clientHeight = document.documentElement.clientHeight;
    return clientHeight - cut - 20 +'px';
}

function delRutask(ID_, PROC_INST_ID_) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "POST",
        url: httpurl + 'rutask/delRutask',
        data: {ID_: ID_, PROC_INST_ID_: PROC_INST_ID_, tm: new Date().getTime()},
        dataType: 'json',
        success: function (data) {
        }
    });
}

/**
 * 流程提交 选择委派人页面
 * @param ID_
 * @param PROC_INST_ID_
 */
function  setDelegate(DATA,ID_, PROC_INST_ID_) {
    var diag = new top.Dialog();
    diag.Drag = true;
    diag.Title = "委派对象";
    diag.URL = '../../act/ruprocdef/ruprocdef_delegate.html?TAG=first&ID_=' + ID_+'&PROC_INST_ID_='+PROC_INST_ID_;
    diag.Width = 600;
    diag.Height = 180;
    //关闭事件
    diag.CancelEvent = function () {
        //从session获取器材信息
        var varSon = sessionStorage.getItem("rutask");
        //选择提交人之后
        if (varSon != "save" || varSon == null || varSon == "") {
            diag.close();
            $("#showform").show();
            $("#jiazai").hide();
            //删除已经提交的流程，修改状态
            vm.pd.LCZT = '0';
            //删除计划相关流程
            delRutask(ID_, PROC_INST_ID_);
            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+"ruprocdef/editSqzt?"+ DATA,
                data: {},
                dataType:"json",
                success: function(data){

                }
            }).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                $("#showform").show();
                $("#jiazai").hide();
            });
        } else {
            diag.close();
            window.history.back(-1);
            message('success', '提交成功', 1000);
        }

        //移除session
        sessionStorage.removeItem("rutask");
        // 显示遮罩层
        if ($(top.window.document).find("div[id^='_DialogDiv']").length > 0) {
            var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
            $(top.window.document).find("div[id='_DialogBGDiv']").css("display", "block");
            $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index", strIndex);
        }
    };
    diag.show();
}