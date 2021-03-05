var vm = new Vue({
    el: '#app',
    data: {
        MENU_ID: '',	 //主键ID
        MENU_TYPE: '1',  //类型
        MENU_STATE: 1,	 //状态
        PARENT_ID: '',	 //上级ID
        MENU_NAME: '',	 //菜单名称
        MENU_URL: '',	 //菜单链接
        SHIRO_KEY: '(无)',//权限标识
        MENU_ORDER: '',	 //菜单序号
        pds: [],
        msg: 'add'
    },
    methods: {
        //初始执行
        init() {
            this.MENU_ID = getUrlKey('MENU_ID');
            this.msg = getUrlKey('msg');
            if (null != this.msg && 'edit' == this.msg) {
                this.getData();//修改获取数据
            } else {
                this.getGoAdd();//新增获取数据
            }
        },

        //去保存
        save: function () {
            if (this.MENU_NAME == "") {
                $("#MENU_NAME").tips({
                    side: 3,
                    msg: '请输入菜单名称',
                    bg: tipsColor,
                    time: 2
                });
                this.$refs.MENU_NAME.focus();
                return false;
            }

            if (this.MENU_URL == "") {
                this.MENU_URL = '#';
            }
            if (this.SHIRO_KEY == "") {
                this.SHIRO_KEY = '(无)';
            }
            if (this.MENU_ORDER == "") {
                $("#MENU_ORDER").tips({
                    side: 1,
                    msg: '请输入菜单序号',
                    bg: tipsColor,
                    time: 2
                });
                this.$refs.MENU_ORDER.focus();
                return false;
            }

            $("#showform").hide();
            $("#jiazai").show();

            //判断名称是否重复
            // $.ajax({
            //     xhrFields: {
            //         withCredentials: true
            //     },
            //     type: "POST",
            //     url: httpurl + 'menu/checkMenuName',
            //     data: {MENU_ID: this.MENU_ID, PARENT_ID: this.PARENT_ID, MENU_NAME: this.MENU_NAME},
            //     dataType: "json",
            //     success: function (data) {
            //         if ("success" == data.result) {
                        //发送 post 请求提交保存
                        $.ajax({
                            xhrFields: {
                                withCredentials: true
                            },
                            type: "POST",
                            url: httpurl + 'menu/' + vm.msg,
                            data: {
                                MENU_ID: vm.MENU_ID,
                                MENU_TYPE: vm.MENU_TYPE,
                                MENU_STATE: vm.MENU_STATE,
                                PARENT_ID: vm.PARENT_ID,
                                MENU_NAME: vm.MENU_NAME,
                                MENU_URL: vm.MENU_URL,
                                SHIRO_KEY: vm.SHIRO_KEY,
                                MENU_ORDER: vm.MENU_ORDER,
                                tm: new Date().getTime()
                            },
                            dataType: "json",
                            success: function (data) {
                                if ("success" == data.result) {
                                    parent.refreshNode();
                                    message('success', '保存成功', 1000);
                                    setTimeout(function () {
                                        vm.goback(vm.PARENT_ID, 'ok');
                                    }, 1000);
                                } else if ("exception" == data.result) {
                                    showException("菜单模块", data.exception);//显示异常
                                    $("#showform").show();
                                    $("#jiazai").hide();
                                }
                            }
                        }).done().fail(function () {
                            message('warning', '请求服务器无响应，稍后再试!', 1000);
                            $("#showform").show();
                            $("#jiazai").hide();
                        });
                    // } else if ("exception" == data.result) {
                    //     showException("菜单模块", data.exception);//显示异常
                    //     $("#showform").show();
                    //     $("#jiazai").hide();
                    // } else {
                    //     message('warning', '菜单名称重复!', 1000);
                    //     $("#showform").show();
                    //     $("#jiazai").hide();
                    // }
                // }
            // }).done().fail(function () {
            //     message('warning', '请求服务器无响应，稍后再试!', 1000);
            //     $("#showform").show();
            //     $("#jiazai").hide();
            // });
        },

        //根据主键ID获取数据(新增时)
        getGoAdd: function () {
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'menu/toAdd',
                data: {MENU_ID: this.MENU_ID, tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.pds = data.pds;
                        vm.PARENT_ID = vm.MENU_ID;

                    } else if ("exception" == data.result) {
                        showException("新增菜单", data.exception);	//显示异常
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

        //根据主键ID获取数据(修改时)
        getData: function () {
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'menu/toEdit',
                data: {MENU_ID: this.MENU_ID, tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.PARENT_ID = data.pd.PARENT_ID;
                        vm.pds = data.pds;						//父级菜单信息
                        vm.MENU_NAME = data.pd.MENU_NAME;		//菜单名称
                        vm.MENU_URL = data.pd.MENU_URL;			//菜单链接
                        vm.SHIRO_KEY = data.pd.SHIRO_KEY;		//权限标识
                        vm.MENU_ORDER = data.pd.MENU_ORDER;		//菜单排序
                        vm.MENU_STATE = data.pd.MENU_STATE;		//菜单状态


                    } else if ("exception" == data.result) {
                        showException("修改菜单", data.exception);	//显示异常
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

        //返回
        goback: function (MENU_ID, FMSG) {
            window.location.href = "menu_list.html?MENU_ID=" + this.PARENT_ID ;
        },
    },

    mounted() {
        this.init();
    }
})
