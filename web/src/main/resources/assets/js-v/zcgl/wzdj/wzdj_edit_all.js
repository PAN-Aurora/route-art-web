var vm = new Vue({
    el: '#app',
    data: {
        //流程ID
        IDS: '',
        //责任人
        ZRR: '',
        //责任人内码
        ZRRNM:'',
        //所属部门
        SSBM: '',
        //所属部门内码
        SSBMNM: ''
    },

    methods: {
        //初始执行
        init() {
            this.IDS = sessionStorage.getItem("IDS");
        },

        //去保存
        save: function () {
            $("#showform").hide();
            $("#jiazai").show();

            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzdj/editAll',
                data: {
                    IDS: this.IDS,
                    ZRR: this.ZRR,
                    ZRRNM: this.ZRRNM,
                    SSBM: this.SSBM,
                    SSBMNM: this.SSBMNM,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {

                        setTimeout(function () {
                            //将选择数据放在session中，在父页面中调用
                            sessionStorage.setItem("rutask", "save");
                            top.Dialog.close();
                        }, 200);
                    } else if ("exception" == data.result) {
                        alert("批量修改失败" + data.exception);
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
            diag.Title = "选择责任人";
            diag.URL = '../user/window_user_list.html';
            diag.Width = 1000;
            diag.Height = 660;
            diag.Modal = true;
            diag.ShowMaxButton = true;
            diag.ShowMinButton = true;
            diag.CancelEvent = function () {
                var NAME = diag.innerFrame.contentWindow.document.getElementById('NAME').value;
                var USER_ID = diag.innerFrame.contentWindow.document.getElementById('USER_ID').value;
                var DEPT_ID = diag.innerFrame.contentWindow.document.getElementById('DEPT_ID').value;
                var DEPT_NAME = diag.innerFrame.contentWindow.document.getElementById('DEPT_NAME').value;
                if ("" != NAME) {
                    vm.ZRR = NAME;
                    vm.ZRRNM = USER_ID;
                }

                //用户所属部门为空时 默认当前用户所在部门
                // if (vm.SSBM==undefined || vm.SSBM==''||vm.SSBMNM==undefined ||vm.SSBMNM=='') {
                    //所属单位赋值
                    vm.SSBM = DEPT_NAME;
                    vm.SSBMNM = DEPT_ID;
                // }

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

        //选择部门
        getDept: function () {
            //调用公共页面跳转方法 回调获取单位名称
            oudwTreeSelect(0, function (e) {
                if (e != null) {
                    //单位名称内码
                    vm.SSBMNM = e.dwnm;
                    vm.SSBM = e.dwmc;
                }
            });
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
