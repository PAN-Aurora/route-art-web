//组织机构的URL


var setting = {
    //异步加载
    async: {
        //异步加载为true
        enable: true,
        //获取加载数据url
        url: httpurl + 'dept/deptSelect?TREEURL=tjcx_list.html',
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
            idKey: "DEPT_ID",
            pIdKey: "PARENT_ID",
            rootPId: 0
        }
    },
    view: {
        expandSpeed: "",
        showIcon:true
    },
    //回调函数，实现展开的功能
    callback:{
        //异步加载之前的事件
        beforeAsync: beforeAsync,
        //异步加载成功的事件
        onAsyncSuccess: onAsyncSuccess,
        //异步加载错误的事件
        onAsyncError: onAsyncError
    }
};

//用于捕获异步加载之前的事件回调函数
function beforeAsync() {
    curAsyncCount++;
}

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
        $("#treeFrame").attr("src","tjcx_list.html?id="+nodes[0].DEPT_ID);
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

//定义的变量
var curStatus = "init", curAsyncCount = 0, asyncForAll = false,
    goAsync = false;

//展开全部节点
function expandAll() {
    if (!check()) {
        return;
    }
    var zTree = $.fn.zTree.getZTreeObj("leftTree");
    if (asyncForAll) {
        zTree.expandAll(true);
    } else {
        expandNodes(zTree.getNodes());
        if (!goAsync) {
            curStatus = "";
        }
    }
}

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

//收缩全部节点
function reset() {
    if (!check()) {
        return;
    }
    asyncForAll = false;
    goAsync = false;
    $.fn.zTree.init($("#leftTree"), setting);
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

//加载zTree
function initTree(){
    $.fn.zTree.init($("#leftTree"), setting);
    fuzzySearch('leftTree','#key',null,true);
}

//页面初始化
$(document).ready(function () {
    //加载页面格式
    treeFrameT();
    //加载ztree
    initTree();
});
//页面滚动加载treeFrameT
$(window).resize(function(){
    treeFrameT();
})
//页面滚动加载treeFrameT
window.onresize = function () {
    treeFrameT();
};
