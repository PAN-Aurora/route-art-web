//自定义url
var jhUrl;
//装备目录setting
var setting = {
    //异步加载
    async: {
        //异步加载为true
        enable: true,
        //获取加载数据url
        url: httpurl + 'zbsl/listLazyXzzbTree',
        //异步方式
        type: "post",
        //异步加载参数
        autoParam: ["JDZBZBML_ID"],
        //跨域
        xhrFields: {
            withCredentials: true
        },
    },
    //zTree数据封装
    data: {
        key: {
            //树节点名称字段
            name: "NAME"
        },
        simpleData: {
            //简单模式（列表模式）
            enable: true,
            //节点数据中保存唯一标识的属性名称
            idKey: "JDZBZBML_ID",
            //节点数据中保存其父节点唯一标识的属性名称
            pIdKey: "PARENT_ID",
            //用于修正根节点父节点数据，即pidKey指定的属性值
            rootPId: 0
        }
    },
    view: {
        //节点展开、折叠时的动画速度
        expandSpeed: "",
        //设置是否显示节点的图标
        showIcon:true
    },
    //回调函数，实现展开功能
    callback: {

        //异步加载成功的事件
        onAsyncSuccess: onAsyncSuccess,
        //异步加载错误的事件
        onAsyncError: onAsyncError,
        //树节点点击事件
        //onClick:onClick
    }
};

/**
 * 用于捕获异步加载成功的事件回调函数
 * @param event    js event对象
 * @param treeId  zTree 的treeID，便于用户操控
 * @param treeNode 进行异步加载的父节点JSON数据对象
 * @param msg  异步获取的节点数据字符串，主要便于用户调试使用
 */
function onAsyncSuccess(event, treeId, treeNode, msg) {
    curAsyncCount--;
    if (curStatus == "expand") {
        expandNodes(treeNode.children);
    } else if (curStatus == "async") {
        asyncNodes(treeNode.children);
    }

    if (curAsyncCount <= 0) {
        if (curStatus != "init" && curStatus != "") {
            asyncForAll = true;
        }
        curStatus = "";
    }

    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    var nodes = treeObj.getNodes();
    if(nodes.length>0){
        for (var i = 0; i<nodes.length; i++){
            //默认展开一级目录
            treeObj.expandNode(nodes[i],true,false,false);
            treeObj.selectNode(nodes[0]);
        }
        $("#treeFrame").attr("src",jhUrl+"&JDZBZBML_ID="+nodes[0].JDZBZBML_ID);
    }
}

/**
 * 用于捕获异步加载错误的事件回调函数
 * @param event  js event对象
 * @param treeId   zTree 的treeID，便于用户操控
 * @param treeNode   进行异步加载的父节点JSON数据对象
 * @param XMLHttpRequest  XMLHttpRequest对象
 * @param textStatus   请求状态 success，error
 * @param errorThrown   只有当异常发生时才会被传递
 */
function onAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
    curAsyncCount--;

    if (curAsyncCount <= 0) {
        curStatus = "";
        if (treeNode!=null) asyncForAll = true;
    }
}

var curStatus = "init", curAsyncCount = 0, asyncForAll = false,
    goAsync = false;



//展开指定的节点
function expandNodes(nodes) {
    if (!nodes) return;
    curStatus = "expand";
    var zTree = $.fn.zTree.getZTreeObj("leftTree");
    for (var i=0, l=nodes.length; i<l; i++) {
        zTree.expandNode(nodes[i], true, false, false);
        if (nodes[i].isParent && nodes[i].zAsync) {
            expandNodes(nodes[i].children);
        } else {
            goAsync = true;
        }
    }
}

function asyncAll() {
    if (!check()) {
        return;
    }
    var zTree = $.fn.zTree.getZTreeObj("leftTree");
    if (asyncForAll) {
    } else {
        asyncNodes(zTree.getNodes());
        if (!goAsync) {
            curStatus = "";
        }
    }
}
function asyncNodes(nodes) {
    if (!nodes) return;
    curStatus = "async";
    var zTree = $.fn.zTree.getZTreeObj("leftTree");
    for (var i=0, l=nodes.length; i<l; i++) {
        if (nodes[i].isParent && nodes[i].zAsync) {
            asyncNodes(nodes[i].children);
        } else {
            goAsync = true;
            zTree.reAsyncChildNodes(nodes[i], "refresh", true);
        }
    }
}


function check() {
    if (curAsyncCount > 0) {
        return false;
    }
    return true;
}

//加载页面的高宽样式
function treeFrameT() {
    var hmainT = document.getElementById("treeFrame");
    var bheightT = document.documentElement.clientHeight;
    hmainT.style.width = '100%';
    hmainT.style.height = (bheightT - 26) + 'px';
}

//页面滚动加载treeFrameT
$(window).resize(function(){
    treeFrameT();
})

//加载zTree
function initTree(){
    //获取传来JHID值
    var JHID = getUrlKey("JHID");
    //获取列表传来的装备实力ids
    var ZBSLIDS = getUrlKey("ZBSLIDS");
    //获取传来计划类型
    var type = getUrlKey("type");
    jhUrl = "../../sys/jhtree/zbsl_xlxzjhsq.html?JHID="+JHID+"&type="+type+"&ZBSLIDS="+ZBSLIDS;
    //$.fn.zTree.init($("#leftTree"), setting);
    $.fn.zTree.init($("#leftDwTree"), dwSetting);
    //fuzzySearch('leftTree','#key',null,true);
    fuzzySearch('leftDwTree','#dwKey',null,true);
}

//页面初始化方法
$(document).ready(function () {
    treeFrameT();
    //加载zTree
    initTree();
});

//页面滚动加载treeFrameT
window.onresize = function () {
    treeFrameT();
};

//显示本页面遮罩层
function xszzc(){
    $("#app").hide();
    $("#jiazai").show();
}

/***********************************************单位目录数据**********************************************************/
//单位目录setting
var dwSetting = {
    //异步加载
    async: {
        //异步加载为true
        enable: true,
        //获取加载数据url
        url: httpurl + 'dept/listLazyxzdwTree',
        //异步方式
        type: "post",
        //异步加载参数
        autoParam: ["DEPT_ID"],
        //跨域
        xhrFields: {
            withCredentials: true
        },
    },
    //zTree数据封装
    data: {
        key: {
            //树节点名称字段
            name: "NAME"
        },
        simpleData: {
            //简单模式（列表模式）
            enable: true,
            //节点数据中保存唯一标识的属性名称
            idKey: "DEPT_ID",
            //节点数据中保存其父节点唯一标识的属性名称
            pIdKey: "PARENT_ID",
            //用于修正根节点父节点数据，即pidKey指定的属性值
            rootPId: 0
        }
    },
    view: {
        //节点展开、折叠时的动画速度
        expandSpeed: "",
        //设置是否显示节点的图标
        showIcon:true
    },
    //回调函数，实现展开功能
    callback: {
        //异步加载之前的事件
        beforeAsync: dwBeforeAsync,
        //异步加载成功的事件
        onAsyncSuccess: dwOnAsyncSuccess,
        //异步加载错误的事件
        onAsyncError: dwOnAsyncError,
        //树节点点击事件
        onClick:onDwClick
    }
};

//用于单位捕获异步加载之前的事件回调函数
function dwBeforeAsync() {
    curAsyncCount++;
}

//单位点击事件
function onDwClick(event, treeId, treeNode, msg){
    var treeObjDw = $.fn.zTree.getZTreeObj("leftDwTree");
    var nodesDw = treeObjDw.getSelectedNodes();
    var DWDEPT_ID = nodesDw[0].DEPT_ID;
    $("#treeFrame").attr("src",jhUrl+"&DEPT_ID="+DWDEPT_ID);
}

/**
 * 用于捕获单位异步加载成功的事件回调函数
 * @param event    js event对象
 * @param treeId  zTree 的treeID，便于用户操控
 * @param treeNode 进行异步加载的父节点JSON数据对象
 * @param msg  异步获取的节点数据字符串，主要便于用户调试使用
 */
function dwOnAsyncSuccess(event, treeId, treeNode, msg) {
    curAsyncCount--;
    if (curStatus == "expand") {
        dwExpandNodes(treeNode.children);
    } else if (curStatus == "async") {
        dwAsyncNodes(treeNode.children);
    }

    if (curAsyncCount <= 0) {
        if (curStatus != "init" && curStatus != "") {
            asyncForAll = true;
        }
        curStatus = "";
    }

    var treeObj = $.fn.zTree.getZTreeObj(treeId);
    var nodes = treeObj.getNodes();
    if(nodes.length>0){
        for (var i = 0; i<nodes.length; i++){
            //默认展开一级目录
            treeObj.expandNode(nodes[i],true,false,false);
            treeObj.selectNode(nodes[0]);
        }
        $("#treeFrame").attr("src",jhUrl+"&DEPT_ID="+nodes[0].DEPT_ID);
    }
}

/**
 * 用于捕获异步加载错误的事件回调函数
 * @param event  js event对象
 * @param treeId   zTree 的treeID，便于用户操控
 * @param treeNode   进行异步加载的父节点JSON数据对象
 * @param XMLHttpRequest  XMLHttpRequest对象
 * @param textStatus   请求状态 success，error
 * @param errorThrown   只有当异常发生时才会被传递
 */
function dwOnAsyncError(event, treeId, treeNode, XMLHttpRequest, textStatus, errorThrown) {
    curAsyncCount--;

    if (curAsyncCount <= 0) {
        curStatus = "";
        if (treeNode!=null) asyncForAll = true;
    }
}

var curStatus = "init", curAsyncCount = 0, asyncForAll = false,
    goAsync = false;



//展开指定的节点
function dwExpandNodes(nodes) {
    if (!nodes) return;
    curStatus = "expand";
    var zTree = $.fn.zTree.getZTreeObj("leftDwTree");
    for (var i=0, l=nodes.length; i<l; i++) {
        zTree.expandNodes(nodes[i], true, false, false);
        if (nodes[i].isParent && nodes[i].zAsync) {
            dwExpandNodes(nodes[i].children);
        } else {
            goAsync = true;
        }
    }
}

function asyncAll() {
    if (!check()) {
        return;
    }
    var zTree = $.fn.zTree.getZTreeObj("leftDwTree");
    if (asyncForAll) {
    } else {
        dwAsyncNodes(zTree.getNodes());
        if (!goAsync) {
            curStatus = "";
        }
    }
}
function dwAsyncNodes(nodes) {
    if (!nodes) return;
    curStatus = "async";
    var zTree = $.fn.zTree.getZTreeObj("leftDwTree");
    for (var i=0, l=nodes.length; i<l; i++) {
        if (nodes[i].isParent && nodes[i].zAsync) {
            dwAsyncNodes(nodes[i].children);
        } else {
            goAsync = true;
            zTree.reAsyncChildNodes(nodes[i], "refresh", true);
        }
    }
}

//收缩全部节点
function dwReset() {
    if (!check()) {
        return;
    }
    asyncForAll = false;
    goAsync = false;
    $.fn.zTree.init($("#leftDwTree"), dwSetting);
}

//根据url参数名称获取参数值
function getUrlKey(name) {
    return decodeURIComponent(
        (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}