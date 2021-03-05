
//根据ID删除所有附件
function delFilesByids(ids, httpurl) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        url: httpurl + 'filelib/delbyids',
        type: 'POST',
        data: { IDS: ids },
        dataType: 'json',
        success: function (data) {
            console.log(data);
        }
    });
}

/**
 * 回车查询分页input框中内容
 */
function keyupfy(){
    if(event.keyCode==13){
        vm.toTZ();
    }
}

/**
 * 单位选择（单选）
 * @param {*} id  回显选中ID
 * @param {*} callback  回调函数
 */
function oudwTreeSelect(id, callback,tag) {
    var url;
    //申请委派单位选择
    if (tag == "delegate") {
        url = '../../sys/common/delegate_select.html?id=' + id;
    } else {
        url = '../../sys/common/dept_select.html?id=' + id;
    }
    var diag = new top.Dialog();
    diag.Drag = true;
    diag.Title = "选择部门";
    diag.URL = url;
    diag.Width = 420;
    diag.Height = 500;
    //最大化按钮
    diag.ShowMaxButton = true;
    //最小化按钮
    diag.ShowMinButton = true;
    //关闭事件
    diag.CancelEvent = function () {
        //从session获取单位名称和内码信息
        var data = sessionStorage.getItem("oudw");
        // 回调返回单位信息
        callback(JSON.parse(data));
        //移除session
        sessionStorage.removeItem("oudw");
        diag.close();
				// 显示遮罩层
                if($(top.window.document).find("div[id^='_DialogDiv']").length>0){                      
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
                }
    };
    diag.show();
}

/**
 * 软件选择（单选）
 * @param {*} id  回显选中ID
 * @param {*} callback  回调函数
 */
function ourjTreeSelect(id, callback) {
    var diag = new top.Dialog();
    diag.Drag = true;
    diag.Title = "选择软件";
    diag.URL = '../../sys/common/rj_select.html?id='+id;
    diag.Width = 400;
    diag.Height = 500;
    //最大化按钮
    diag.ShowMaxButton = true;
    //最小化按钮
    diag.ShowMinButton = true;
    //关闭事件
    diag.CancelEvent = function () {
        //从session获取单位名称和内码信息
        var data = sessionStorage.getItem("ourj");
        // 回调返回单位信息
        callback(JSON.parse(data));
        //移除session
        sessionStorage.removeItem("ourj");
        diag.close();
        // 显示遮罩层
        if($(top.window.document).find("div[id^='_DialogDiv']").length>0){
            var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
            $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
            $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
        }
    };
    diag.show();
}

/**
 * 模块选择（单选）
 * @param {*} id  回显选中ID
 * @param {*} callback  回调函数
 */
function oumkTreeSelect(id, callback) {
    var diag = new top.Dialog();
    diag.Drag = true;
    diag.Title = "选择模块";
    diag.URL = '../../sys/common/mk_select.html?id='+id;
    diag.Width = 400;
    diag.Height = 500;
    //最大化按钮
    diag.ShowMaxButton = true;
    //最小化按钮
    diag.ShowMinButton = true;
    //关闭事件
    diag.CancelEvent = function () {
        //从session获取单位名称和内码信息
        var data = sessionStorage.getItem("ourj");
        // 回调返回单位信息
        callback(JSON.parse(data));
        //移除session
        sessionStorage.removeItem("ourj");
        diag.close();
        // 显示遮罩层
        if($(top.window.document).find("div[id^='_DialogDiv']").length>0){
            var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
            $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
            $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
        }
    };
    diag.show();
}

/**
 * 库房选择（单选）
 * @param {*} id  回显选中ID
 * @param {*} callback  回调函数
 */
function oukfTreeSelect(id, callback) {
    var diag = new top.Dialog();
    diag.Drag = true;
    diag.Title = "选择库房";
    diag.URL = '../../sys/common/kf_select.html?id='+id;
    diag.Width = 400;
    diag.Height = 500;
    //最大化按钮
    diag.ShowMaxButton = true;
    //最小化按钮
    diag.ShowMinButton = true;
    //关闭事件
    diag.CancelEvent = function () {
        //从session获取库房名称和内码信息
        var data = sessionStorage.getItem("oukf");
        // 回调返回库房信息
        callback(JSON.parse(data));
        //移除session
        sessionStorage.removeItem("oukf");
        diag.close();
				// 显示遮罩层
                if($(top.window.document).find("div[id^='_DialogDiv']").length>0){                      
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
                }
    };
    diag.show();
}

/**
 * 区域选择（单选）
 * @param {*} callback  回调函数
 */
function ouqyTreeSelect(id,callback) {
    var diag = new top.Dialog();
    diag.Drag = true;
    diag.Title = "选择区域";
    diag.URL = '../../sys/common/qy_select.html?id='+id;
    diag.Width = 400;
    diag.Height = 500;
    //最大化按钮
    diag.ShowMaxButton = true;
    //最小化按钮
    diag.ShowMinButton = true;
    //关闭事件
    diag.CancelEvent = function () {
        //从session获取区域名称和内码信息
        var data = sessionStorage.getItem("ouqy");
        // 回调返回区域信息
        callback(JSON.parse(data));
        //移除session
        sessionStorage.removeItem("ouqy");
        diag.close();
				// 显示遮罩层
                if($(top.window.document).find("div[id^='_DialogDiv']").length>0){                      
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
                }
    };
    diag.show();
}

/*echarts字体自适应*/
function adapSize(res){
    var docEl = document.documentElement;
    var clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if(!clientWidth)return;
    var fontSize = clientWidth / 1920;
    return res*fontSize;
}