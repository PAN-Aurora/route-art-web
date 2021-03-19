var vm = new Vue({
    el: '#app',
    data: {
        //主键ID
        pd: {"projectNo":1,"starttime":''},
        projectId: '',
        method: 'save',
        mjmc_options: []
    },
    methods: {
        //初始执行
        init() {
            //当接收过来的FID不为null时,表示此页面是修改进来的
            var FID = getUrlKey('FID');
            if (null != FID) {
                this.method = 'edit';
                this.projectId = FID;
                this.getData();
            } else {
                //初始化ID
                //this.projectId = newGuid32();
                //自动生成文档编号
                this.pd.projectNo = 'PM' + jhhDateTime();

                //开始时间 默认当前时间
                $("#startTime").val(initDateTime());
                //结束时间 默认当前时间
                $("#endTime").val(initDateTime());

            }
        },

        /**
         * 取消
         */
        cancel: function () {
            //关闭弹窗
            // top.Dialog.close();
            window.history.back(-1);
        },

        /**
         * 保存
         * @returns {boolean}
         */
        save: function () {
            //调用保存时表单校验方法，如果校验不通过返回false
            if (!validateForm()) {
                return false;
            }

            //编制时间 密级名称 赋值
            //this.pd.BZSJ = $("#BZSJ").val();

            $("#showform").hide();
            $("#showform2").hide();
            $("#jiazai").show();
            //开始时间赋值
            this.pd.startTime = $("#startTime").val();
            //结束时间赋值
            this.pd.endTime = $("#endTime").val();

            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'project/' + this.method,
                data: {
                    projectId: this.projectId,
                    projectNo: this.pd.projectNo,
                    projectName: this.pd.projectName,
                    projectTheme: this.pd.projectTheme,
                    projectDesc: this.pd.projectDesc,
                    projectSponsor: this.pd.projectSponsor,
                    startTime: this.pd.startTime,
                    endTime: this.pd.endTime,
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
                        showException("项目管理", data.exception);
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
         * 根据主键ID获取项目管理信息
         */
        getData: function () {
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'project/goEdit',
                data: {projectId: this.projectId, tm: new Date().getTime()},
                dataType: "json",
                //成功回调函数
                success: function (data) {
                    if ("success" == data.result) {
                        //参数map
                        vm.pd = data.pd;
                        //开始时间 默认当前时间
                        $("#startTime").val(data.pd.startTime);
                        //结束时间 默认当前时间
                        $("#endTime").val(data.pd.endTime);

                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("项目管理失败", data.exception);
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

    },

    //初始化
    mounted() {
        this.init();
    }
});
