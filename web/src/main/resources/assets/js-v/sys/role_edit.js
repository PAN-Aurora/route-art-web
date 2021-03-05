

var vm = new Vue({
    el: '#app',

    data: {
        ROLE_ID: '',			//主键ID
        ROLE_NAME: '',			//名称
        PARENT_ID: '',			//上级ID
        msg: 'add',
      /*  isok: 'error',*/
        pd:[]
    },

    methods: {

        //初始执行
        init() {
            var FID = getUrlKey('ROLE_ID');	//当接收过来的FID不为null时,表示此页面是修改进来的
            if (null != FID) {
                this.msg = 'edit';
                this.ROLE_ID = FID;
                this.getData();
            } else {
                this.PARENT_ID = getUrlKey('PARENT_ID');
            }
        },


        //去保存
        save: function () {
            if (!validateForm()) {
                return false;
            }
      /*      if (flag != 'success') {
                $("#ROLE_NAME").tips({
                    side: 3,
                    msg: '用户名已存在!',
                    bg: tipsColor,
                    time: 2
                });
                this.ROLE_NAME = '';
                this.$refs.ROLE_NAME.focus();
                return false;

            }*/

            $("#showform").hide();
            $("#jiazai").show();

            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'role/' + this.msg,
                data: {
                    ROLE_ID: this.ROLE_ID,
                    ROLE_NAME: this.ROLE_NAME,
                    PARENT_ID: this.PARENT_ID,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        $("#fok").tips({
                            side: 2,
                            msg: '保存成功',
                            bg: tipsColor,
                            time: 2
                        });
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);

                    } else if ("exception" == data.result) {
                        showException("按钮模块", data.exception);//显示异常
                        $("#showform").show();
                        $("#jiazai").hide();
                    }
                }
            }).done().fail(function () {
                alert("登录失效!请求服务器无响应，稍后再试");
                $("#showform").show();
                $("#jiazai").hide();
            });
        },

        //校验用户名
        hasRole: function () {
            //用户名代号为空时 不进行校验
            if (this.ROLE_NAME == null || this.ROLE_NAME == undefined || this.ROLE_NAME == '') {
                return;
            }
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'role/hasRole',
                data: {ROLE_ID: this.ROLE_ID, ROLE_NAME: this.ROLE_NAME, tm: new Date().getTime()},
                dataType: 'json',
                success: function (data) {
                    if ("success" != data.result) {
                        vm.flag = false;
                        $("#ROLE_NAME").tips({
                            side: 3,
                            msg: '用户名已存在',
                            bg: tipsColor,
                            time: 3
                        });
                        vm.ROLE_NAME = '';
                        vm.$refs.ROLE_NAME.focus();
                    }
                }
            });
        },
    /*    //判断用户名是否存在
        hasRole: function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'role/hasRole',
                data: {ROLE_NAME: this.ROLE_NAME, tm: new Date().getTime()},
                dataType: 'json',
                // async: false,	//加这句，ajax为同步
                success: function (data) {
                    vm.isok = data.result;
                    vm.save(vm.isok);
                }
            });
        },*/

        //根据主键ID获取数据
        getData: function () {
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'role/toEdit',
                data: {ROLE_ID: this.ROLE_ID, tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.ROLE_NAME = data.pd.ROLE_NAME;			//名称
                        vm.parent_id = data.pd.parent_id;			//上级ID
                    } else if ("exception" == data.result) {
                        alert("角色模块异常" + data.exception);	 	//显示异常
                        $("#showform").show();
                        $("#jiazai").hide();
                    }
                }
            }).done().fail(function () {
                alert("登录失效!请求服务器无响应，稍后再试");
                $("#showform").show();
                $("#jiazai").hide();
            });
        },

    },

    mounted() {
        this.init();
    }
})
