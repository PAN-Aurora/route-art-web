
var vm = new Vue({
    el: '#app',
    data: {
        //主键ID
        JSZL_ID: '',
        //存放字段参数（生成单位）
        pd: {LSDWMC: '', LSDWNM: '',WDBH:''},
        MJNM: '',
        msg: 'add',
        //密级名称
        mjmc_options: []

    },
    methods: {

        //初始执行
        init() {
            //当接收过来的FID不为null时,表示此页面是修改进来的
            var FID = getUrlKey('FID');
            if (null != FID) {
                this.msg = 'edit';
                this.JSZL_ID = FID;
                this.getData();
            } else {
                //初始化ID
                this.JSZL_ID = newGuid32();
                //自动生成文档编号
                this.pd.WDBH = 'WDBH' + jhhDateTime();
                //默认当前时间
                $("#BZSJ").val(initDateTime());
            }

            //接收list页面传来的type参数来判断是view还是edit
            var type = getUrlKey('type');
            //传递文件上传方法
            fileurl = '../../../../views/sys/com/fileupload.html?biz=jdzb_filelib&type=jdzbFile&id=' + this.JSZL_ID + '&viewFlag=' + type+'&fileNo='+this.pd.WDBH;
            $("#jdzbFile").attr("src", fileurl);

            //字典方法
            setTimeout(function () {
                //密级
                getDict('JSZL_MJ', function (e) {
                    vm.mjmc_options = e;
                });
            }, 200);
        },

        /**
         * 取消机动装备技术资料
         */
        cancel: function () {
            //判断是否新增页面
            if (null == getUrlKey('FID')) {
                //如果是新增页面，没有点击保存，删除附件
                delFilesByids(vm.JSZL_ID, httpurl);
            }
            //关闭弹窗
            // top.Dialog.close();
            window.history.back(-1);
        },

        /**
         * 保存机动装备技术资料
         * @returns {boolean}
         */
        save: function () {
            //调用保存时表单校验方法，如果校验不通过返回false
            if (!validateForm()) {
                return false;
            }

            //编制时间 密级名称 赋值
            this.pd.BZSJ = $("#BZSJ").val();
            this.pd.MJMC = $("#MJNM option:selected").text().trim();

            $("#showform").hide();
            $("#showform2").hide();
            $("#jiazai").show();

            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wjgl/' + this.msg,
                data: {
                    JSZL_ID: this.JSZL_ID,
                    WDBH: this.pd.WDBH,
                    WDMC: this.pd.WDMC,
                    BBH: this.pd.BBH,
                    LSDWNM: this.pd.LSDWNM,
                    LSDWMC: this.pd.LSDWMC,
                    MJNM: this.pd.MJNM,
                    MJMC: this.pd.MJMC,
                    BJRMC: this.pd.BJRMC,
                    BZSJ: this.pd.BZSJ,
                    CJSJ: this.pd.CJSJ,
                    CJRNM: this.pd.CJRNM,
                    CJRXM: this.pd.CJRXM,
                    XGSJ: this.pd.XGSJ,
                    XGRNM: this.pd.XGRNM,
                    XGRXM: this.pd.XGRXM,
                    BZ: this.pd.BZ,
                    ZT: this.pd.ZT,
                    tm: new Date().getTime()
                },
                dataType: "json",
                //成功回调函数
                success: function (data) {
                    if ("success" == data.result) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            //关闭弹窗
                            // top.Dialog.close();
                            window.history.back(-1);
                        }, 1000);
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("技术资料管理", data.exception);
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
         * 根据主键ID获取机动装备技术资料数据
         */
        getData: function () {
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wjgl/goEdit',
                data: {JSZL_ID: this.JSZL_ID, tm: new Date().getTime()},
                dataType: "json",
                //成功回调函数
                success: function (data) {
                    if ("success" == data.result) {
                        //参数map
                        vm.pd = data.pd;
                        $("#BZSJ").val(data.pd.BZSJ);
                        $("#CJSJ").val(data.pd.CJSJ);
                        $("#XGSJ").val(data.pd.XGSJ);
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("技术资料管理", data.exception);
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
         * 生成单位弹出框
         */
        selectScdw: function () {
            //调用公共页面跳转方法 回调获取单位名称
            oudwTreeSelect(vm.pd.LSDWNM, function (e) {
                if (e != null) {
                    //单位名称内码
                    vm.pd.LSDWMC = e.dwmc;
                    vm.pd.LSDWNM = e.dwnm;
                }
            });
        },
    },

    //初始化
    mounted() {
        this.init();
    }
})
