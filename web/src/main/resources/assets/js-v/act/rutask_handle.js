
var vm = new Vue({
    el: '#app',
    data: {
        //后台地址
        serverurl: '',
        //历史任务节点列表
        hitaskList: [],
        //流程实例ID
        PROC_INST_ID_: '',
        //任务ID
        ID_: '',
        //审批意见-初始默认同意
        OPINION: '同意',
        //待办人
        ASSIGNEE_: '',
        //作废缘由
        messagetext: '',
        //流程图文件名ID
        FILENAME: '',
        //流程图base64数据
        imgSrc: '',
        //驳回按钮权限
        Reject: false,
        //作废按钮权限
        Abolish: false,
        //指定下一办理人按钮权限
        NextASSIGNEE_: false,
        //判断是否从办理任务进入
        msg: true,
        //判断是否输入文本
        CONNULL: false,
        //加载状态
        loading: false,
        //计划Id
        jhid: '',
        //当前申请任务
        ACT_NAME_: '',
        //当前申请提交用户
        ZDDLR: '',
        //委派对象
        DELEGATE_TAG_: ''
    },

    methods: {
        //初始执行
        init() {
            var msg = getUrlKey('msg');
            if (null != msg) {
                this.msg = false;
            }
            this.serverurl = httpurl;
            this.PROC_INST_ID_ = getUrlKey('PROC_INST_ID_');
            this.ID_ = getUrlKey('ID_');
            this.FILENAME = getUrlKey('FILENAME');
            this.getData();
            this.hasButton();
        },

        //进入页面获取数据
        getData: function () {
            this.loading = true;
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'rutask/getHandleData',
                data: {
                    PROC_INST_ID_: this.PROC_INST_ID_,
                    ID_: this.ID_,
                    FILENAME: this.FILENAME,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.hitaskList = data.hitaskList;
                        vm.imgSrc = data.imgSrc;
                        vm.loading = false;
                        //获取跳转路径，提交用户和指定代理人
                        var tzUrl = data.tzUrl;
                        //计划id
                        vm.jhid = data.JHID;
                        //计划类型
                        vm.ACT_NAME_ = data.hitaskList[1].ACT_NAME_;
                        //申请提交用户
                        vm.ZDDLR = data.ZDDLR;
                        if (tzUrl != null && tzUrl != '') {
                            sessionStorage.setItem("dataSj", JSON.stringify(data));
                            $('#bizform').attr("src", tzUrl);
                        }
                        //委派标识
                        vm.DELEGATE_TAG_ = data.DELEGATE_TAG_;
                        //委派对象
                        vm.ASSIGNEE_ = data.ASSIGNEE_;
                    } else if ("exception" == data.result) {
                        showException("流程信息", data.exception);
                        $("#showform").show();
                        $("#jiazai").hide();
                    }
                }
            }).done().fail(function () {
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                $("#showform").show();
                $("#jiazai").hide();
            });
        },

        //查看用户
        viewUser: function (USERNAME) {
            if ('admin' == USERNAME) {
                message('warning', '不能查看admin用户!', 1000);
                return;
            }
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "资料";
            diag.URL = '../../sys/user/user_view.html?USERNAME=' + USERNAME;
            diag.Width = 600;
            diag.Height = 500;
            diag.Modal = true;
            diag.CancelEvent = function () {
                diag.close();
				// 显示遮罩层
                if($(top.window.document).find("div[id^='_DialogDiv']").length>0){
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
                }
            };
            diag.show();
        },

        //审批意见详情页
        details: function (htmlId) {
            var content = $("#" + htmlId).val().split(',fh,');
            top.vm.handleDetails(content[1]);
            var diag = new top.Dialog();
            diag.Modal = true;
            diag.Drag = true;
            diag.Title = "审批意见";
            diag.ShowMaxButton = true;
            diag.ShowMinButton = true;
            diag.URL = '../../act/rutask/handle_details.html';
            diag.Width = 760;
            diag.Height = 500;
            diag.CancelEvent = function () {
                diag.close();
				// 显示遮罩层
                if($(top.window.document).find("div[id^='_DialogDiv']").length>0){
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
                }
            };
            diag.show();
        },

        //选择办理人
        getUser: function () {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "选择办理人";
            diag.URL = '../user/window_user_list.html';
            diag.Width = 900;
            diag.Height = 700;
            diag.Modal = true;
            diag.ShowMaxButton = true;
            diag.ShowMinButton = true;
            diag.CancelEvent = function () {
                var USERNAME = diag.innerFrame.contentWindow.document.getElementById('USERNAME').value;
                if ("" != USERNAME) {
                    vm.ASSIGNEE_ = USERNAME;
                }
                diag.close();
				// 显示遮罩层
                if($(top.window.document).find("div[id^='_DialogDiv']").length>0){
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
                }
            };
            diag.show();
        },

        //选择角色
        getRole: function () {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "选择角色";
            diag.URL = '../role/window_role_list.html';
            diag.Width = 900;
            diag.Height = 600;
            diag.Modal = true;
            diag.ShowMaxButton = true;
            diag.ShowMinButton = true;
            diag.CancelEvent = function () {
                var ROLE_NAME = diag.innerFrame.contentWindow.document.getElementById('ROLE_NAME').value;
                if ("" != ROLE_NAME) {
                    vm.ASSIGNEE_ = ROLE_NAME;
                }
                diag.close();
				// 显示遮罩层
                if($(top.window.document).find("div[id^='_DialogDiv']").length>0){
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
                }
            };
            diag.show();
        },

        //清空下一任务对象
        clean: function () {
            vm.ASSIGNEE_ = '';
        },

        //办理任务
        handle: function (msg) {
            if ('' == vm.OPINION) {
                $("#YJ").tips({
                    side: 1,
                    msg: '请输入内容',
                    bg: tipsColor,
                    time: 3
                });
            } else {
                vm.CONNULL = true;
            }
            if (this.CONNULL) {
                $("#showform").hide();
                $("#jiazai").show();
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl + 'rutask/handle',
                    data: {
                        msg: msg,
                        ID_: this.ID_,
                        ASSIGNEE_: this.ASSIGNEE_,
                        PROC_INST_ID_: this.PROC_INST_ID_,
                        OPINION: this.OPINION,
                        DELEGATE_TAG_: this.DELEGATE_TAG_,
                        tm: new Date().getTime()
                    },
                    dataType: 'json',
                    success: function (data) {
                        if ("success" == data.result) {
                            // if ('null' != data.ASSIGNEE_) {
                            //     //websocket即时通讯用于给待办人发送新任务消息 ，fhtaskmsg()函数 在 WebRoot\assets\js-v\zbts_gjgz.js
                            //     top.vm.fhtaskmsg(data.ASSIGNEE_);
                            // }
                            // if (undefined != data.FHSMS) {
                            //     //websocket即时通讯用于给待办人发送站内信消息 ，fhsmsmsg()函数 WebRoot\assets\js-v\zbts_gjgz.js
                            //     top.vm.fhsmsmsg(data.FHSMS);
                            // }
                            //审批后的操作
                            console.info(vm.ACT_NAME_);
                            //物资采购
                            if (vm.ACT_NAME_.toString().indexOf("物资采购") > -1) {
                                vm.wzcgHandle(msg);
                            }
                            //退役报废
                            if (vm.ACT_NAME_.toString().indexOf("退役报废") > -1) {
                                vm.tybfHandle(msg);
                            }
                            //物资交接
                            if (vm.ACT_NAME_.toString().indexOf("物资交接") > -1) {
                                vm.wzjjHandle(msg);
                            }
                            message('success', '审批完成', 1000);
                            setTimeout(function () {
                                top.Dialog.close();
                            }, 1000);
                        } else if ("exception" == data.result) {
                            showException("提交审批", data.exception);
                            $("#showform").show();
                            $("#jiazai").hide();
                        }
                    }
                }).done().fail(function () {
                    message('warning', '请求服务器无响应，稍后再试!', 1000);
                    $("#showform").show();
                    $("#jiazai").hide();
                });
            }
        },

        //是否作废
        isDel: function () {
            $("#showform").hide();
        },
        
        //取消作废
        wclose: function () {
            $("#showform").show();
        },

        //关闭弹窗
        twclose: function () {
            top.Dialog.close();
        },
        //判断按钮权限，用于是否显示按钮
        hasButton: function () {
            var keys = 'Reject,Abolish,NextASSIGNEE_';
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'head/hasButton',
                data: {keys: keys, tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        //驳回按钮权限
                        vm.Reject = data.Reject;
                        //作废按钮权限
                        vm.Abolish = data.Abolish;
                        //指定下一办理人按钮权限
                        vm.NextASSIGNEE_ = data.NextASSIGNEE_;
                    } else if ("exception" == data.result) {
                        showException("按钮权限", data.exception);
                    }
                }
            })
        },
        //物资采购
        wzcgHandle: function (msg) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzcg/handle',
                data: {
                    id: this.jhid,
                    msg: msg,
                    username: this.ZDDLR,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.loading = false;
                    } else if ("exception" == data.result) {
                        showException("作废流程", data.exception);
                    }
                }
            });
        },
        //退役报废
        tybfHandle: function (msg) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'tybf/handle',
                data: {
                    id: this.jhid,
                    msg: msg,
                    username: this.ZDDLR,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.loading = false;
                    } else if ("exception" == data.result) {
                        showException("作废流程", data.exception);
                    }
                }
            });
        },
        //物资交接
        wzjjHandle: function (msg) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzjj/handle',
                data: {
                    id: this.jhid,
                    msg: msg,
                    username: this.ZDDLR,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.loading = false;
                    } else if ("exception" == data.result) {
                        showException("作废流程", data.exception);
                    }
                }
            });
        },
        goWord: function(){
            document.getElementById("bizform").contentWindow.vm.goWord();
        },

        formatDate: function (time) {
            var date = new Date(time);
            return formatDateUtil(date, "yyyy-MM-dd hh:mm:ss");
        },
    },

    //初始化创建
    mounted() {
        this.init();
    }
})
