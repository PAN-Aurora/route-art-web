var setting = {
    //异步加载
    async: {
        //异步加载为true
        enable: true,
        //获取加载数据url
        url: httpurl + 'dept/deptSelect',
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
        showIcon: true,
        // dblClickExpand: false
    },
    check: {
        enable: true,
        chkStyle: 'radio',
        radioType: 'all',
        autoCheckTrigger: false,
        chkboxType: {"Y": "", "N": ""}
    },
    //回调函数，实现展开功能
    callback: {
        //异步加载之前的事件
        beforeAsync: beforeAsync,
        //异步加载成功的事件
        onAsyncSuccess: onAsyncSuccess,
        //异步加载错误的事件
        onAsyncError: onAsyncError,
        //选中事件
        onCheck: zTreeOnCheck
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
    if (nodes.length > 0) {
        for (var i = 0; i < nodes.length; i++) {
            //默认展开一级目录
            treeObj.expandNode(nodes[i], true, false, false);
            treeObj.selectNode(nodes[0]);
        }
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

var curStatus = "init", curAsyncCount = 0, asyncForAll = false,
    goAsync = false;

//展开指定的节点
function expandNodes(nodes) {
    if (!nodes) return;
    curStatus = "expand";
    var zTree = $.fn.zTree.getZTreeObj("leftTree");
    for (var i = 0, l = nodes.length; i < l; i++) {
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
    for (var i = 0, l = nodes.length; i < l; i++) {
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

//加载zTree
function initTree() {
    $.fn.zTree.init($("#leftTree"), setting);
    fuzzySearch('leftTree', '#key', null, true);
}

//页面初始化方法
$(document).ready(function () {
    //加载zTree
    initTree();
});

var id = "";
var name = "";

function zTreeOnCheck(event, treeId, treeNode) {
    var treeObj = $.fn.zTree.getZTreeObj("leftTree");
    //先取消所有的选中状态
    treeObj.cancelSelectedNode();
    //将指定ID的节点选中，此处的选中指的是选中checkbox旁边的内容
    treeObj.selectNode(treeNode, true);
    //勾选指定的节点，即checkbox
    treeObj.checkNode(treeNode, true);
    //用于选中回调
    id = treeNode.DEPT_ID;
    if(undefined != treeNode.oldname){
        name = treeNode.oldname;
    }else{
        name = treeNode.NAME;
    }

}

//确定选中节点
function save() {
    if (id == "") {
        swal("请选择部门!");
        return;
    } else {
        var jsonObject = {
            dwnm: id,
            dwmc: name
        };
        sessionStorage.setItem("oudw", JSON.stringify(jsonObject));
    }
    top.Dialog.close();
}

