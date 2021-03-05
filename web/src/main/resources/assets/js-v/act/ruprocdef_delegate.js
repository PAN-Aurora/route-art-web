var vm = new Vue({
    el: '#app',
    data: {
        //流程ID
        ID_: '',
        TAG: '',
        //代理人
        ASSIGNEE_: '',
        WPDX_NAME: '',
        PROC_INST_ID_:'',
        //审批标识 用户user/角色role/单位dept
        DELEGATE_TAG_: ''

    },

    methods: {
        //初始执行
        init() {
            //链接参数
            var ID_ = getUrlKey('ID_');
            this.PROC_INST_ID_ = getUrlKey('PROC_INST_ID_');
            this.TAG = getUrlKey('TAG');
            if (null != ID_) {
                this.ID_ = ID_;
            }
        },

        //去保存
        save: function () {
            if (this.WPDX_NAME == '') {
                $("#WPDX_NAME").tips({
                    side: 3,
                    msg: '请选择委派对象',
                    bg: tipsColor,
                    time: 2
                });
                this.WPDX_NAME = '';
                this.$refs.WPDX_NAME.focus();
                return false;
            }

            $("#showform").hide();
            $("#jiazai").show();

            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'ruprocdef/delegate',
                data: {
                    ID_: this.ID_,
                    PROC_INST_ID_: this.PROC_INST_ID_,
                    TAG: this.TAG,
                    ASSIGNEE_: this.ASSIGNEE_,
                    DELEGATE_TAG_: this.DELEGATE_TAG_,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        //websocket即时通讯用于给待办人发送新任务消息 ，fhtaskmsg()函数 在 WebRoot\assets\js-v\zbts_gjgz.js
                        // top.vm.fhtaskmsg(data.ASSIGNEE_);
                        $("#ASSIGNEE_").tips({
                            side: 3,
                            msg: '保存成功',
                            bg: tipsColor,
                            time: 2
                        });
                        setTimeout(function () {
                            //将选择数据放在session中，在父页面中调用
                            sessionStorage.setItem("rutask", "save");
                            top.Dialog.close();
                        }, 200);
                    } else if ("exception" == data.result) {
                        alert("委任异常" + data.exception);
                        $("#showform").show();
                        $("#jiazai").hide();
                    }
                }
            }).done().fail(function () {
                alert("登录失效!请求服务器无响应,稍后再试");
                $("#showform").show();
                $("#jiazai").hide();
            });
        },

        //选择办理人
        getUser: function () {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "选择办理人";
            diag.URL = '../user/window_user_list.html?TYPE=Delegate';
            diag.Width = 1000;
            diag.Height = 660;
            diag.Modal = true;
            diag.ShowMaxButton = true;
            diag.ShowMinButton = true;
            diag.CancelEvent = function () {
                var USERNAME = diag.innerFrame.contentWindow.document.getElementById('USERNAME').value;
                var NAME = diag.innerFrame.contentWindow.document.getElementById('NAME').value;
                if ("" != USERNAME) {
                    vm.ASSIGNEE_ = USERNAME;
                    vm.WPDX_NAME = NAME;
                    vm.DELEGATE_TAG_ = 'user';
                }
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

        //选择角色
        getRole: function () {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "选择角色";
            diag.URL = '../role/window_role_list.html?TYPE=Delegate';
            diag.Width = 1000;
            diag.Height = 660;
            diag.Modal = true;
            diag.ShowMaxButton = true;
            diag.ShowMinButton = true;
            diag.CancelEvent = function () {
                var RNUMBER = diag.innerFrame.contentWindow.document.getElementById('RNUMBER').value;
                var ROLE_NAME = diag.innerFrame.contentWindow.document.getElementById('ROLE_NAME').value;
                if ("" != RNUMBER) {
                    vm.ASSIGNEE_ = RNUMBER;
                    vm.WPDX_NAME = ROLE_NAME;
                    vm.DELEGATE_TAG_ = 'role';
                }
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
        //选择单位
        getDept: function () {
            //调用公共页面跳转方法 回调获取单位名称
            oudwTreeSelect(vm.ASSIGNEE_, function (e) {
                if (e != null) {
                    //单位名称内码
                    vm.ASSIGNEE_ = e.dwnm;
                    vm.WPDX_NAME = e.dwmc;
                    vm.DELEGATE_TAG_ = 'dept';
                }
            }, 'delegate');
        },

        close: function () {
            sessionStorage.setItem("rutask", "");
            top.Dialog.close()
        }

    },

    //初始化创建
    mounted() {
        this.init();
    }
})
