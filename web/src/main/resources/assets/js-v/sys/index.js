var ids = "";			//id中转
var fmid = "fhindex";	//菜单点中状态
var mid = "fhindex";	//菜单点中状态
var onlineAdress = "";	//在线管理地址
var user = "FH";		//用于即时通讯（ 当前登录用户）
var uname = "";			//姓名
var fhsmsSound = '1';	//站内信提示音效

var vm = new Vue({
    el: '#app',

    data: {
        //样式版本
        version: version,
        sysName: '资产管理',	//系统名称
        menuList: [],		//菜单List
        SKIN: 'pcoded-navbar navbar-image-3,navbar pcoded-header navbar-expand-lg navbar-light header-dark header-img,',	//用户风格设置
        systemset: false,	//隐藏系统设置
        userPhoto: '../../../assets/images/user/avatar-2.jpg',	//用户头像
        user_name: '',		//用户姓名
        fhsmsCount: 0,		//站内信总数
        hdcontent: '',		//审批详情
        iconColored: false,	//菜单图标颜色开关状态
        menuFixed: true,		//菜单固定开关状态
        boxlayouts: false,	//总体居中开关状态
        currentIndex: 0,
        datetime: '',
    },

    methods: {

        // 浏览器窗口大小变化时调用
        cmainFrame: function () {
            var hmain = document.getElementById("mainFrame");
            var bheight = document.documentElement.clientHeight;
            hmain.style.width = '100%';
            hmain.style.height = (bheight - 100) + 'px';
            document.getElementById("FHSKIN1").style.height = (bheight - 100) + 'px';
        },

        // 点击菜单，刷新主页面
        siMenu: function (id, fid, MENU_NAME, MENU_URL) {
            ids.replace(id + ',', '');
            ids += id + ',';
            if (id != mid) {
                $("#" + mid).attr("class", "");
                mid = id;
            }
            if (fid != fmid) {
                if (fmid != 'fhindex') $("#" + fmid).attr("class", "nav-item pcoded-hasmenu");
                fmid = fid;
            }
            $("#" + id).attr("class", "active");
            $("#" + fid).attr("class", "nav-item pcoded-hasmenu active pcoded-trigger");

            top.mainFrame.vm.tabAddHandler(id, MENU_NAME, MENU_URL);
        },

        // 加载首页数据
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
                        vm.getInfo();					//基础资料
                        vm.menuList = data.menuList;	//菜单List
                        vm.SKIN = data.SKIN;			//样式风格class
                        if (vm.SKIN.split(',')[0].indexOf('icon-colored') >= 0) { //菜单图标颜色开关状态
                            vm.iconColored = true;
                        } else {
                            vm.iconColored = false;
                        }
                        if (vm.SKIN.split(',')[0].indexOf('menupos-static') >= 0) { //菜单固定开关状态
                            vm.menuFixed = false;
                        } else {
                            vm.menuFixed = true;
                        }
                        if (vm.SKIN.split(',')[2].indexOf('container box-layout') >= 0) { //总体居中开关状态
                            vm.boxlayouts = true;
                        } else {
                            vm.boxlayouts = false;
                        }

                        document.getElementsByTagName("body")[0].className = data.SKIN.split(',')[2];
                        setTimeout(function () {
                            $("#pcoded").pcodedmenu({
                                MenuTrigger: 'click',
                                SubMenuTrigger: 'click',
                            });
                        }, 0);
                    } else if ("exception" == data.result) {
                        showException('初始', data.exception);//显示异常
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
                        if ('admin' == data.USERNAME) vm.systemset = true;	//非admin隐藏系统设置
                        vm.user_name = data.NAME;							//用户姓名
                        onlineAdress = data.onlineAdress;					//在线管理地址
                        user = data.USERNAME;								//用户名
                        uname = data.NAME;									//用户姓名
                        // 加入在线列表
                        vm.online();
                        fhsmsSound = data.fhsmsSound;						//站内信提示音效
                    } else if ("exception" == data.result) {
                        showException('基础信息', data.exception);						//显示异常
                    }
                }
            });
        },

        gohome: function () {
            top.mainFrame.vm.tabAddHandler('', '首页', '../../../views/zcgl/homepage/homepage_list.html');
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

        // 退出系统
        logout: function () {
            this.$confirm('确定要退出系统吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                this.goOut('0')
            }).catch(() => {
            });
        },


        //下线
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
            });
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
            // 设置窗体大小
            this.cmainFrame();
            // 加载首页数据
            this.index();

            this.showdatetime();
        }
    },

    mounted() {
        this.init();
    }

})
//窗口宽度高度变化事件
window.onresize = function () {
    vm.cmainFrame();
};

//菜单收缩突变变换事件
$(".pcoded-navbar .mobile-menu .icon-chevrons-left").on('click', function () {
    if ($(".pcoded-navbar .mobile-menu i.feather").hasClass("icon-chevrons-left")) {
        $(".pcoded-navbar .mobile-menu i.feather").removeClass("icon-chevrons-left").addClass("icon-chevrons-right");
    } else if ($(".pcoded-navbar .mobile-menu i.feather").hasClass("icon-chevrons-right")) {
        $(".pcoded-navbar .mobile-menu i.feather").removeClass("icon-chevrons-right").addClass("icon-chevrons-left");
    }
})
