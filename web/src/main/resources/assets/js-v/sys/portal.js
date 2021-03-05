//在线管理地址
var onlineAdress = "";
//用于即时通讯（ 当前登录用户）
var user = "FH";
//姓名
var uname = "";
//站内信提示音效
var fhsmsSound = '1';
var fwebsocket = null;

var vm = new Vue({
    el: '#app',
    data: {
        // 系统名称
        sysName: '装备管理信息系统',
        // 菜单List
        menuList: [],
        // 子系统数据字典List
        subSystemDicList: [],
        // 每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
        showCount: -1,
        // 当前页码
        currentPage: 1,
        // 检索条件 关键词
        KEYWORDS_LC: '',
        // 用户风格设置
        SKIN: 'pcoded-navbar navbar-image-3,navbar pcoded-header navbar-expand-lg navbar-light header-dark,',
        // 隐藏系统设置
        systemset: false,
        // 用户头像
        userPhoto: '../../../assets/images/user/avatar-2.jpg',
        // 用户姓名
        user_name: '',
        // 站内信总数
        fhsmsCount: 0,
        // 审批详情
        hdcontent: '',
        // 菜单图标颜色开关状态
        iconColored: false,
        // 菜单固定开关状态
        menuFixed: true,
        // 总体居中开关状态
        boxlayouts: false,
        // 待办任务列表
        ruTaskList: [],
        // 已办任务列表
        hiTaskList: [],
        id: '',
        // 系统时间
        datetime: '',
        // 快速入口菜单
        menus: [{url: '../../jdzb/dysy/dysy_list.html?type=mh', text: '动用使用'},
            {url: '../../jdzb/whby/whby_list.html?type=mh', text: '维护保养'}],
        // 分子系统
        groups: [
            {
                text: '业务管理',
                apps: [
                    {
                        text: '物资采购',
                        url: 'index.html?appid=wzcg',
                        img: '../../../assets/images/widget/shape1.png'
                    },
                    // {
                    //     text: '物资登记',
                    //     url: 'index.html?appid=wzdj',
                    //     img: '../../../assets/images/widget/shape1.png'
                    // },
                    // {
                    //     text: '退役报废',
                    //     url: 'index.html?appid=tybf',
                    //     img: '../../../assets/images/widget/shape1.png'
                    // },
                    // {
                    //     text: '物资交接',
                    //     url: 'index.html?appid=wzjj',
                    //     img: '../../../assets/images/widget/shape1.png'
                    // }
                    ]
            },{
                text: '系统应用',
                apps: [{text: '系统管理', url: 'index.html?appid=sys', img: '../../../assets/images/widget/shape1.png'}]
            }

        ],
    },

    methods: {

        // 初始化方法
        index: function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'main/index',
                data: {tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        // 基础资料
                        vm.getInfo();
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException('初始', data.exception);
                    } else {
                        message('warning', '请求服务器无响应，稍后再试!', 1000);
                        setTimeout(function () {
                            vm.goOut('0');
                        }, 2000);
                    }
                }
            }).done().fail(function () {
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                    vm.goOut('0');
                }, 2000);
            });
        },

        // 获取登录用户基础信息
        getInfo: function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'head/getInfo',
                data: {tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        // 非admin隐藏系统设置
                        if ('admin' == data.USERNAME) vm.systemset = true;
                        // 用户姓名
                        vm.user_name = data.NAME;
                        // 系统名称
                        vm.sysName = data.sysName
                        // 在线管理地址
                        onlineAdress = data.onlineAdress;
                        // 即时聊天地址
                        wimadress = data.wimadress;
                        // 用户名
                        user = data.USERNAME;
                        // 用户姓名
                        uname = data.NAME;
                        // 加入在线列表
                        vm.online();
                        // 刷新待办任务
                        vm.topTask();
                        // 查询待办任务
                        vm.ruTask(vm.id);
                        // 查询已办任务
                        vm.hiTask(vm.id);
                        vm.fhsmsCount = Number(data.fhsmsCount);
                        // 站内信提示音效
                        fhsmsSound = data.fhsmsSound;
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException('基础信息', data.exception);
                    }
                }
            });
        },


        //加入在线列表
        online: function () {
            if (window.WebSocket) {
                fwebsocket = new WebSocket(encodeURI('ws://' + onlineAdress));
                fwebsocket.onopen = function () {
                    // 连接成功
                    fwebsocket.send('[join]' + user);
                };
                fwebsocket.onerror = function () {
                    // 连接失败
                };
                fwebsocket.onclose = function () {
                    // 连接断开
                };
                // 消息接收
                fwebsocket.onmessage = function (message) {
                    var message = JSON.parse(message.data);
                    if (message.type == 'goOut') {
                        $("body").html("");
                        vm.goOut(message.type);
                    } else if (message.type == 'thegoout') {
                        $("body").html("");
                        vm.goOut(message.type);
                    } else if (message.type == 'senFhsms') {
                        vm.fhsmsCount = Number(vm.fhsmsCount) + 1;
                        if ('0' != fhsmsSound) {
                            $("#fhsmsobj").html('<audio style="display: none;" id="fhsmstsy" src="../../../assets/sound/' + fhsmsSound + '.mp3" autoplay controls></audio>');
                        }
                    }
                };
            }
        },

        // 查询待办任务
        topTask: function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'rutask/getList?tm=' + new Date().getTime(),
                data: encodeURI(""),
                dataType: 'json',
                success: function (data) {
                    var taskCount = Number(data.taskCount);
                    //待办任务总数
                    $("#taskCount").html(Number(taskCount));
                    if (taskCount == 0) {
                        $("#myTask").html('<li class="notification"><div class="media"><div class="media-body"><p>没有需要办理的任务</p></div></div></li>');
                    }
                    $("#myTask").html('<li></li>');
                    $.each(data.list, function (i, list) {
                        // 拼接待办任务
                        $("#myTask").append('<li class="notification"><div class="media"><div class="media-body"><p>' + (i + 1) + ' . ' + list.PNAME_ + '(' + list.NAME_ + ')</p></div></div></li>');
                    });
                    if (taskCount > 0) {
                        $("#taskCount").tips({
                            side: 3,
                            msg: '您有任务需要办理',
                            bg: tipsColor,
                            time: 30
                        });
                    }
                    if ("exception" == data.result) {
                        //显示异常
                        showException("待办任务", data.exception);
                    }
                }
            });
        },

        // 待办、已办任务关键字查询
        kwChange: function () {
            if ($("#dbrw").hasClass("slt")) {
                // 根据关键字查询待办任务
                this.ruTask();
            } else if ($("#ybrw").hasClass("slt")) {
                // 根据关键字查询已办任务
                this.hiTask();
            }
        },

        // 查询待办任务
        ruTask: function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'rutask/getRuList',
                data: {
                    KEYWORDS: this.KEYWORDS_LC,
                    tm: new Date().getTime(),
                    id: vm.id
                },
                dataType: 'json',
                success: function (data) {
                    // 给待办任务赋值
                    vm.ruTaskList = data.list;
                    if ("exception" == data.result) {
                        //显示异常
                        showException("待办任务", data.exception);
                    }
                }
            });
        },

        // 查询已办任务
        hiTask: function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'hitask/getList',
                data: {
                    KEYWORDS: this.KEYWORDS_LC,
                    tm: new Date().getTime(),
                    id: vm.id
                },
                dataType: "json",
                success: function (data) {
                    // 给已办任务赋值
                    vm.hiTaskList = data.list;

                    if ("exception" == data.result) {
                        //显示异常
                        showException("已办任务", data.exception);
                    }
                }
            });
        },

        // 单击待办任务打开办理弹窗
        handle: function (PROC_INST_ID_, ID_, FILENAME, PROC_DEF_ID_) {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "办理任务";
            diag.URL = '../../act/rutask/rutask_handle.html?PROC_INST_ID_=' + PROC_INST_ID_ + '&PROC_DEF_ID_=' + PROC_DEF_ID_ + "&ID_=" + ID_ + '&FILENAME=' + encodeURI(encodeURI(FILENAME));
            diag.Width = 1100;
            diag.Height = 750;
            // 有无遮罩窗口
            diag.Modal = true;
            // 最大化按钮
            diag.ShowMaxButton = true;
            // 最小化按钮
            diag.ShowMinButton = true;
            // 关闭事件
            diag.CancelEvent = function () {
                var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
                if (varSon != null && varSon.style.display == 'none') {
                    $("#simple-table").tips({
                        side: 3,
                        msg: '审批完毕',
                        bg: tipsColor,
                        time: 6
                    });
                }
                diag.close();
                // 显示遮罩层
                if ($(top.window.document).find("div[id^='_DialogDiv']").length > 0) {
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display", "block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index", strIndex);
                }
                // 刷新顶部任务列表
                top.vm.topTask();
                // 刷新待办列表
                vm.ruTask();
                // 刷新已办列表
                vm.hiTask();
            };
            diag.show();
        },

        // 单击已办任务打开查看弹窗
        view: function (PROC_INST_ID_, ID_, FILENAME) {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "流程信息";
            diag.URL = '../../act/hiprocdef/hiprocdef_view.html?PROC_INST_ID_=' + PROC_INST_ID_ + "&ID_=" + ID_ + '&FILENAME=' + encodeURI(encodeURI(FILENAME));
            diag.Width = 1200;
            diag.Height = 600;
            // 有无遮罩窗口
            diag.Modal = true;
            // 最大化按钮
            diag.ShowMaxButton = true;
            // 最小化按钮
            diag.ShowMinButton = true;
            // 关闭事件
            diag.CancelEvent = function () {
                diag.close();
                // 显示遮罩层
                if ($(top.window.document).find("div[id^='_DialogDiv']").length > 0) {
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display", "block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index", strIndex);
                }
            };
            diag.show();
        },

        // 退出系统
        logout: function () {
            this.$confirm('确定要退出系统吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                this.goOut('0');
            }).catch(() => {
            });
        },

        // 下线
        goOut: function (msg) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'main/logout',
                data: {tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    window.location.href = "../../login.html?msg=" + msg;
                },
                error: function (data) {
                    window.location.href = "../../login.html?msg=" + 0;
                }
            })
        },

        // 修改个人资料
        goEditMyInfo: function () {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "个人资料";
            diag.URL = '../user/user_edit.html?fx=head';
            diag.Width = 800;
            diag.Height = 600;
            // 有无遮罩窗口
            diag.Modal = true;
            // 最大化按钮
            diag.ShowMaxButton = false;
            // 最小化按钮
            diag.ShowMinButton = true;
            // 关闭事件
            diag.CancelEvent = function () {
                diag.close();
                // 显示遮罩层
                if ($(top.window.document).find("div[id^='_DialogDiv']").length > 0) {
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display", "block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index", strIndex);
                }
            };
            diag.show();
        },

        // 系统设置
        sysSet: function () {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "系统设置";
            diag.URL = '../index/sysSet.html';
            diag.Width = 650;
            diag.Height = 481;
            diag.Modal = true;
            // 最大化按钮
            diag.ShowMaxButton = true;
            // 最小化按钮
            diag.ShowMinButton = true;
            // 关闭事件
            diag.CancelEvent = function () {
                diag.close();
                // 显示遮罩层
                if ($(top.window.document).find("div[id^='_DialogDiv']").length > 0) {
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display", "block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index", strIndex);
                }
            };
            diag.show();
        },

        //用于子窗口获取父页面中的参数(应用于流程信息审批详情内容)
        handleDetails: function (value) {
            if (value != '') {
                this.hdcontent = value;
            } else {
                return this.hdcontent;
            }
        },
        showdatetime: function () {
            this.datetime = formatDateUtil(new Date(), 'yyyy-MM-dd hh:mm:ss')
            // 定时刷新系统时间
            setInterval(function () {
                vm.datetime = formatDateUtil(new Date(), 'yyyy-MM-dd hh:mm:ss')
            }, 1000);
        },

        //初始执行
        init() {
            this.index();
            this.showdatetime();
        },

        // 快速入口单击事件
        goQui: function (MENU_URL, MENU_NAME) {
            // this.$router.push({name:"main.html",params:{id:MENU_URL}});
            var tempForm = document.createElement("form");
            tempForm.id = "tempForm";
            tempForm.method = "GET";
            tempForm.action = "main.html";
            tempForm.target = "_blank";
            // tempForm.target=MENU_NAME;

            var hideInput = document.createElement("input");
            hideInput.type = "hidden";
            hideInput.name = "id";
            hideInput.value = MENU_URL;

            tempForm.appendChild(hideInput);
            tempForm.addEventListener("onsubmit", function () {
                window.open("about:blank", MENU_NAME);
            })
            document.body.appendChild(tempForm);
            // tempForm.fireEvent("onsubmit");
            tempForm.submit();
            document.body.removeChild(tempForm);
            // tempForm.addEventListener("submit",function(){},false);
            // window.open("main.html?id="+MENU_URL,MENU_URL);
        }
    },

    mounted() {
        this.init();
    }

})


// 待办已办tab页切换
$("#page_dbrw .dbrwtop a").click(function (e) {
    // 获取单击节点的id
    vm.id = e.currentTarget.id;
    $(".dbrwtop a").removeClass("slt");
    $(this).addClass("slt");
    // 查询待办任务
    vm.ruTask();
})

$("#page_ybrw .dbrwtop a").click(function (e) {
    // 获取单击节点的id
    vm.id = e.currentTarget.id;
    $(".dbrwtop a").removeClass("slt");
    $(this).addClass("slt");
    vm.hiTask();
})

//待办、已办类型按钮鼠标悬浮事件
$(".dhlef a").mouseover(function (e) {
    // 获取单击节点的id
    var id = e.currentTarget.id;
    $(".dhlef a").removeClass("slt");
    $(this).addClass("slt");
    // 判断是否是待办任务
    if (id == 'dbrw') {
        $("#page_ybrw").css("display", "none");
        $("#page_dbrw").css("display", "block");
        $("#page_dbrw .dbrwtop a:nth-child(1)").addClass("slt");
        vm.ruTask();
    } else if (id == 'ybrw') {

        $("#page_dbrw").css("display", "none");
        $("#page_ybrw").css("display", "block");
        $("#page_ybrw .dbrwtop a:nth-child(1)").addClass("slt");
        vm.hiTask();
    }

})

//日历控件点击事件
$("#calendar").click(function (e) {
    window.open("../../sys/calendar/calendar.html");
})
