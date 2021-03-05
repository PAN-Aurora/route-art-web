

var vm = new Vue({
    el: '#app',

    data: {
        roleList: [],	//角色list
        varList: [],	//用户list
        page: [],		//分页类
        pd: [],			//map
        ROLE_ID: '',	//角色ID
        showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
        currentPage: 1,	//当前页码
        fhSms: false,	//站内信按钮权限
        email: false,	//发邮件按钮权限
        fromExcel: false,//从excel导入权限
        toExcel: false,	//导出到excel权限
        add: false,		//新增按钮
        del: false,		//删除按钮
        edit: false,		//修改按钮
        loading: false	//加载状态
    },

    methods: {

        //初始执行
        init() {
            //复选框控制全选,全不选
$('#zcheckbox').click(function () {
    if (this.checked) {
        $("input[name='ids']").prop("checked", true);
    } else {
        $("input[name='ids']").prop("checked", false);
    }
});
            this.pd.keyWords = '';
            this.getList();
        },

        /**
         * 校验开始结束时间
         * @returns {boolean}
         */
        getJyList:function(){
            if($("#startTime").val()!="" && $("#endTime").val()!=""){
                //开始时间与结束时间的校验
                if(!validateForm()){
                    return false;
                }
            }
            //调用查询方法
            vm.getList();
        },

        //获取列表
        getList: function () {
            //加载状态变为true
            this.loading = true;
            //开始时间赋值
            this.pd.startTime = $("#startTime").val();
            //结束时间赋值
            this.pd.endTime = $("#endTime").val();
            this.ROLE_ID = $("#ROLE_ID").val();
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'user/list?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
                data: {
                    keyWords: this.pd.keyWords,
                    startTime: this.pd.startTime,
                    endTime: this.pd.endTime,
                    ROLE_ID: this.ROLE_ID,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.roleList = data.roleList;
                        vm.varList = data.userList;
                        vm.ROLE_ID = data.ROLE_ID;
                        vm.page = data.page;
                        vm.pd = data.pd;
                        vm.hasButton();
                        vm.loading = false;
                      $("input[name='ids']").prop("checked", false);
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("系统用户", data.exception);
                    }
                }
            }).done().fail(function () {
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                    window.location.href = "../../login.html";
                }, 2000);
            });
        },

        //去发送电子邮件页面
        sendEmail: function (EMAIL) {
            if (!this.email) return;
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "发送电子邮件";
            diag.URL = '../user/send_email.html?EMAIL=' + EMAIL;
            diag.Width = 1000;
            diag.Height = 800;
            //关闭事件
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

        //新增
        addUser: function () {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "新增用户资料";
            diag.URL = '../user/user_edit.html';
            diag.Width = 1000;
            diag.Height = 800;
            //有无遮罩窗口
            diag.Modal = true;
            //最大化按钮
            diag.ShowMaxButton = true;
            //最小化按钮
            diag.ShowMinButton = true;
            //关闭事件
            diag.CancelEvent = function () {
                var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
                if (varSon != null && varSon.style.display == 'none') {
                    vm.getList();
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


        //修改
        editUser: function (USER_ID) {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "编辑用户资料";
            diag.URL = '../user/user_edit.html?USER_ID=' + USER_ID;
            diag.Width = 1000;
            diag.Height = 800;
            diag.Modal = true;				//有无遮罩窗口
            diag.ShowMaxButton = true;	//最大化按钮
            diag.ShowMinButton = true;		//最小化按钮
            diag.CancelEvent = function () { //关闭事件
                var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
                if (varSon != null && varSon.style.display == 'none') {
                    vm.getList();
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

        //删除
        delUser: function (USER_ID, NAME) {
            this.$confirm('确定要删除吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                    this.loading = true;
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: "POST",
                        url: httpurl + 'user/deleteUser',
                        data: {USER_ID: USER_ID, tm: new Date().getTime()},
                        dataType: 'json',
                        success: function (data) {
                            if ("success" == data.result) {
                                message('success', '已经从列表中删除!', 1000);
                            }
                            vm.getList();
                        }
                    });
                }).catch(() => {

                });
        },

        //批量操作
        makeAll: function (msg) {
             this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                    var str = '';
                    var emstr = '';
                    var username = '';
                    for (var i = 0; i < document.getElementsByName('ids').length; i++) {
                        if (document.getElementsByName('ids')[i].checked) {
                            if (str == '') str += document.getElementsByName('ids')[i].value;
                            else str += ',' + document.getElementsByName('ids')[i].value;

                            if (emstr == '') emstr += document.getElementsByName('ids')[i].alt;
                            else emstr += ';' + document.getElementsByName('ids')[i].alt;

                            if (username == '') username += document.getElementsByName('ids')[i].title;
                            else username += ';' + document.getElementsByName('ids')[i].title;
                        }
                    }
                    if (str == '') {
                        $("#cts").tips({
                            side: 2,
                            msg: '点这里全选',
                            bg: tipsColor,
                            time: 3
                        });
                        message('warning', '您没有选择任何内容!', 1000);
                        return;
                    } else {
                        if (msg == '确定要删除选中的用户吗?') {
                            this.loading = true;
                            $.ajax({
                                xhrFields: {
                                    withCredentials: true
                                },
                                type: "POST",
                                url: httpurl + 'user/deleteAllUser?tm=' + new Date().getTime(),
                                data: {USER_IDS: str},
                                dataType: 'json',
                                success: function (data) {
                                    if ("success" == data.result) {
                                        if ("success" == data.result) {
                                            message('success', '已经从列表中删除!', 1000);
                                        }
                                        vm.getList();
                                    }
                                }
                            });
                        } else if (msg == '确定要给选中的用户发送站内信吗?') {
                            sendFhsms(username);
                        } else if (msg == '确定要给选中的用户发送邮件?') {
                            this.sendEmail(emstr);
                        }
                    }
                }).catch(() => {

                });
        },

        //导出excel
        goExcel: function () {
            var str = '';
            for (var i = 0; i < document.getElementsByName('ids').length; i++) {
                if (document.getElementsByName('ids')[i].checked) {
                    if (str == '') str += document.getElementsByName('ids')[i].value;
                    else str += ',' + document.getElementsByName('ids')[i].value;
                }
            }
            if (str == '') {
                this.$confirm('确定要导出所有数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'el-button--info',
                }).then(() => {
                    window.location.href = httpurl + 'user/excel?keyWords=' + this.pd.keyWords + '&startTime=' + this.pd.startTime + '&endTime=' + this.pd.endTime + '&ROLE_ID=' + this.ROLE_ID;
            }).catch(() => {

                });
            } else {
                this.$confirm('确定要导出选中数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'el-button--info',
                }).then(() => {
                    window.location.href = httpurl + 'user/excel?keyWords=' + this.pd.keyWords + '&startTime=' + this.pd.startTime + '&endTime=' + this.pd.endTime + '&ROLE_ID=' + this.ROLE_ID +'&DATA_IDS=' + str;
            }).catch(() => {

                });
            }
        },

        //打开上传excel页面
        getExcel: function () {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "从EXCEL导入到系统";
            diag.URL = '../user/user_excel.html';
            diag.Width = 600;
            diag.Height = 450;
            diag.CancelEvent = function () { //关闭事件
                var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
                if (varSon != null && varSon.style.display == 'none') {
                }
                vm.getList();
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

        //发站内信
        sendFhsms: function (USERNAME) {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "站内信";
            diag.URL = '../fhsms/send_fhsms.html?USERNAME=' + USERNAME;
            diag.Width = 700;
            diag.Height = 619;
            diag.CancelEvent = function () { //关闭事件
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

        //判断按钮权限，用于是否显示按钮
        hasButton: function () {
            var keys = 'user:add,user:del,user:edit,fhSms,email,fromExcel,toExcel';
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
                        vm.add = data.userfhadminadd;	//增
                        vm.del = data.userfhadmindel;	//删
                        vm.edit = data.userfhadminedit;	//改
                        vm.fhSms = data.fhSms;			//站内信按钮权限
                        vm.email = data.email;			//发邮件按钮权限
                        vm.fromExcel = data.fromExcel;	//从excel导入权限
                        vm.toExcel = data.toExcel;		//导出到excel权限
                    } else if ("exception" == data.result) {
                        showException("按钮权限", data.exception);//显示异常
                    }
                }
            })
        },
        //重置检索条件
        rest: function () {
            vm.pd.keyWords = '';
            $("#startTime").val('');
            $("#startTime").datepicker('setEndDate',null);
            $("#endTime").val('');
            $("#ROLE_ID").val(null).trigger("change");
            $("#endTime").datepicker('setStartDate',null);
            //分页跳转至第一页
            this.nextPage(1);
            vm.getList();
        },

        //-----分页必用----start
        nextPage: function (page) {
            this.currentPage = page;
            this.getList();
        },
        changeCount: function (value) {
            this.showCount = value;
            this.getList();
        },
        toTZ: function () {
            var toPaggeVlue = document.getElementById("toGoPage").value;
            if (toPaggeVlue == '') {
                document.getElementById("toGoPage").value = 1;
                return;
            }
            if (isNaN(Number(toPaggeVlue))) {
                document.getElementById("toGoPage").value = 1;
                return;
            }
            this.nextPage(toPaggeVlue);
        }
        //-----分页必用----end

    },

    mounted() {
        this.init();
    }
})
