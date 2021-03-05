
var vm = new Vue({
    el: '#app',
    data: {

    },
    methods: {
    }
});

var setting = {
    //异步加载
    async: {
        //异步加载为true
        enable: true,
        //获取加载数据url
        url: httpurl + 'menu/listLazyTree?TREEURL=menu_list.html',
        //异步方式
        type: "post",
        //异步加载参数
        autoParam: ["MENU_ID"],
        //跨域
        xhrFields: {
            withCredentials: true
        },
    },
    //zTree数据封装
    data: {
        key: {
            //树节点名称字段
            name: "MENU_NAME"
        },
        simpleData: {
            //简单模式（列表模式）
            enable: true,
            //节点数据中保存唯一标识的属性名称
            idKey: "MENU_ID",
            //节点数据中保存其父节点唯一标识的属性名称
            pIdKey: "PARENT_ID",
            //根节点标示值（用于修正根节点父节点数据，即pidKey指定的属性值）
            rootPId: 0
        }
    },
    view: {
        //节点展开、折叠时的动画速度
        expandSpeed: "",
        //设置是否显示节点的图标
        showIcon: true
    },
    //回调函数，实现展开功能
    callback: {
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
        if (treeNode != null) asyncForAll = true;
    }
}

//当前状态、异步加载次数、异步模式
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

function asyncAll() {
    if (!check()) {
        return;
    }
    //获取当前树
    var zTree = $.fn.zTree.getZTreeObj("leftTree");
    if (asyncForAll) {
    } else {
        asyncNodes(zTree.getNodes());
        if (!goAsync) {
            curStatus = "";
        }
    }
}

//展开指定的节点
function expandNodes(nodes) {
    //如果nodes为null，则return
    if (!nodes) return;
    //将状态设置为 expand
    curStatus = "expand";
    //获取当前树
    var zTree = $.fn.zTree.getZTreeObj("leftTree");
    //循环展开节点
    for (var i = 0, l = nodes.length; i < l; i++) {
        zTree.expandNode(nodes[i], true, false, false);
        //递归，如果子节点是父节点则进行递归操作
        if (nodes[i].isParent && nodes[i].zAsync) {
            expandNodes(nodes[i].children);
        } else {
            goAsync = true;
        }
    }
}

function asyncNodes(nodes) {
    //如果nodes为null，则return
    if (!nodes) return;
    //将状态设置为 async
    curStatus = "async";
    //获取当前树
    var zTree = $.fn.zTree.getZTreeObj("leftTree");
    for (var i = 0, l = nodes.length; i < l; i++) {
        //递归，如果子节点是父节点则进行递归操作
        if (nodes[i].isParent && nodes[i].zAsync) {
            asyncNodes(nodes[i].children);
        } else {
            goAsync = true;
            zTree.reAsyncChildNodes(nodes[i], "refresh", true);
        }
    }
}

//刷新选中节点
function refreshNode() {
    /*根据 treeId 获取 zTree 对象*/
    var zTree = $.fn.zTree.getZTreeObj("leftTree"),
        type = "refresh",
        silent = false,
        /*获取 zTree 当前被选中的节点数据集合*/
        nodes = zTree.getSelectedNodes();
    /*强行异步加载父节点的子节点。[setting.async.enable = true 时有效]*/
    zTree.reAsyncChildNodes(nodes[0], type, silent);
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
    //如果异步加载次数 >0 返回false
    if (curAsyncCount > 0) {
        return false;
    }
    //否则返回true
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
$(window).resize(function () {
    treeFrameT();
})

//加载zTree
function initTree() {
    //初始化zTree（zTree容器，参数配置）
    $.fn.zTree.init($("#leftTree"), setting);
    fuzzySearch('leftTree', '#key', null, true);
    //刷新右侧页面
    document.getElementById("treeFrame").src = "menu_list.html?MENU_ID=0";
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
