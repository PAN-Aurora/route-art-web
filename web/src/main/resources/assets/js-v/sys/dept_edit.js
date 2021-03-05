

var vm = new Vue({
    el: '#app',

    data: {
        PARENT_ID: '',				//上级ID
        DEPT_ID: '',	//主键ID
        pd: {SSQYMC: [], SSQYNM: [], LXMC: [], LXNM: []},						//存放字段参数
        pds: [],
        msg: 'add'
    },

    methods: {

        //初始执行
        init() {
            var FID = getUrlKey('DEPT_ID');	//链接参数
            var P_ID = getUrlKey('PARENT_ID');

            //接收传来的zqmc
            var zqmc = getUrlKey('zqmc');
            //接收传来的zqnm
            var zqnm = getUrlKey('zqnm');
            if (zqnm != null) {
                this.pd.ZQNM = zqnm;
                this.pd.ZQMC = zqmc;
                //将选择数据放在session中
                sessionStorage.setItem("zqnm", zqnm);
                sessionStorage.setItem("zqmc", zqmc);
            }
            this.PARENT_ID = P_ID;
            if (null != FID) {
                this.msg = 'edit';
                this.DEPT_ID = FID;
                this.getData();
            } else {
                this.getGoAdd();
            }
        },

        //去保存
        save: function () {
            //调用保存时表单校验方法，如果校验不通过返回false
            if (!validateForm()) {
                return false;
            }

            if (  this.pd.TEL != undefined &&  this.pd.TEL!= '') {
                var gysIphone = /^(\+\d{2}-)?(\d{2,3}-)?([1][3,4,5,7,8][0-9]\d{8})$/.test(this.pd.TEL);
                if(!gysIphone){
                    $("#TEL").tips({
                        side:3,
                        msg:'格式错误'+'<br>' + '手机:11位',
                        bg:tipsColor,
                        time:2
                    });
                    return false;
                }
            }

            $("#showform").hide();
            $("#jiazai").show();

            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'dept/' + this.msg,
                data: {
                    DEPT_ID: this.DEPT_ID,
                    PARENT_ID: this.PARENT_ID,
                    NAME: this.pd.NAME,
                    SSQYMC: this.pd.SSQYMC,
                    SSQYNM: this.pd.SSQYNM,
                    BIANMA: this.pd.BIANMA,
                    BZ: this.pd.BZ,
                    HEADMAN: this.pd.HEADMAN,
                    TEL: this.pd.TEL,
                    FUNCTIONS: this.pd.FUNCTIONS,
                    ADDRESS: this.pd.ADDRESS,
                    ZT: this.pd.ZT,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    } else if ("exception" == data.result) {
                        showException("组织机构", data.exception);//显示异常
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
                url: httpurl + 'dept/goEdit',
                data: {DEPT_ID: this.DEPT_ID, tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.pd = data.pd;							//参数map
                        vm.pds = data.pds;
                    } else if ("exception" == data.result) {
                        showException("组织机构", data.exception);	//显示异常
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

        //根据主键ID获取数据(新增时)
        getGoAdd: function () {
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'dept/goAdd',
                data: {DEPT_ID: this.PARENT_ID, tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.pds = data.pds;
                    } else if ("exception" == data.result) {
                        showException("组织机构", data.exception);	//显示异常
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

        /**
         * 所属区域弹出框
         */
        selectSsqy: function () {
            //调用公共页面跳转方法 回调获取单位名称
            ouqyTreeSelect(vm.pd.SSQYNM, function (e) {
                if (e != null) {
                    //所属区域名称内码
                    vm.pd.SSQYMC = e.qymc;
                    vm.pd.SSQYNM = e.qynm;
                }
            });
        }

    },

    mounted() {
        this.init();
    }
})
