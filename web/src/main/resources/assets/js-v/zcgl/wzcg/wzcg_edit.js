/*资产管理-物资采购URL*/

//创建vue
var vm = new Vue({
    el: '#app',

    data:{
        //主键ID
        WZCG_ID: '',
        //存放字段参数
        pd: {CGDH: '', CGBC: '', SSBMNM: '', NZR:'',SSBM : '',CGSL : '',CGJE : '',CGRQ:''},
        //定义请求的url的后缀
        msg:'add'
    },

    methods: {

        //初始执行
        init() {
            //当接收过来的FID不为null时,表示此页面是修改进来的
            var FID = getUrlKey('FID');
            if(null != FID){
                //将msg设置为edit
                this.msg = 'edit';
                this.edit = true;
                //定义的FID赋值给当物资采购主键id
                this.WZCG_ID = FID;
                //遍历数据
                this.getData();
            } else {
                //采购单号
                $("#CGDH").val('CGDH' + jhhDateTime());
                //拟制时间
                $("#NZSJ").val(initDateTime());
                //获取当前登录用户
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl + 'wzcg/getUser',
                    data: {tm: new Date().getTime()},
                    dataType: "json",
                    success: function (data) {
                        if ("success" == data.result) {
                            vm.pd.NZR = data.SQRMC;
                            vm.pd.SSBM = data.SQDWMC;
                            vm.pd.SSBMNM = data.SQDWNM;
                            //采购名称
                            $("#CGMC").val(vm.pd.SSBM + initApplyDate() +'采购单');
                        }
                    }
                });
            }
        },

        /**
         * 点击取消按钮时返回
         */
        cancel: function () {
            //返回首页
            location.href = '../../zcgl/wzcg/wzcg_list.html';
        },

        /**
         * 保存物资采购数据
         * @returns {boolean}
         */
        save: function (){
            //调用保存时表单校验方法，如果校验不通过返回false
            if (!validateForm()) {
                return false;
            }

            //采购单号 采购名称 拟制时间 采购数量 采购金额 采购日期 赋值
            this.pd.CGDH = $("#CGDH").val();
            this.pd.CGMC = $("#CGMC").val();
            this.pd.NZSJ = $("#NZSJ").val();
            this.pd.CGSL = $("#CGSL").val();
            this.pd.CGJE = $("#CGJE").val();
            this.pd.CGRQ = $("#CGRQ").val();


            $("#showform").hide();
            $("#jiazai").show();
            if(this.msg=='edit'){
                document.getElementById("treeFrame").contentWindow.vm.emptyVarList();
            }
            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'wzcg/'+this.msg,
                data: {
                    WZCG_ID:this.WZCG_ID,
                    CGDH:this.pd.CGDH,
                    CGMC:this.pd.CGMC,
                    SSBM:this.pd.SSBM,
                    SSBMNM:this.pd.SSBMNM,
                    CGSL:this.pd.CGSL,
                    CGJE:this.pd.CGJE,
                    CGRQ:this.pd.CGRQ,
                    NZSJ:this.pd.NZSJ,
                    NZR:this.pd.NZR,
                    ZT:this.pd.ZT,
                    BZ:this.pd.BZ,
                    tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                 /*   if ("edit" == data.result) {
                        if (vm.edit == false) {
                            vm.edit = true;
                        }
                        vm.msg = data.result;
                        $("#jiazai").hide();
                        $("#showform").show();
                    }else*/ if("success" == data.result){
                        message('success', '保存成功', 1000);
                        location.href = '../../zcgl/wzcg/wzcg_list.html';
                    }else if ("exception" == data.result){
                        //显示异常
                        showException("物资采购",data.exception);
                        $("#showform").show();
                        $("#jiazai").hide();
                    }else if ("edit" == data.result) {
                        vm.pd = data.pd;
                        vm.msg = data.result;
                        vm.WZCG_ID = data.pd.WZCG_ID;
                        $("#showform").show();
                        $("#jiazai").hide();
                    }
                }

            }).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                $("#showform").show();
                $("#jiazai").hide();
            });
        },

        /**
         * 提交物资采购
         * @returns {boolean}
         */

        flowSubmit: function () {
            //调用保存时表单校验方法，如果校验不通过返回false
            if (!validateForm()) {
                return false;
            }
            //采购单号 采购名称 拟制时间 采购数量 采购金额 采购日期 赋值
            this.pd.CGDH = $("#CGDH").val();
            this.pd.CGMC = $("#CGMC").val();
            this.pd.NZSJ = $("#NZSJ").val();
            this.pd.CGSL = $("#CGSL").val();
            this.pd.CGJE = $("#CGJE").val();
            this.pd.CGRQ = $("#CGRQ").val();
            //调用修理计划中的emptyVarList方法 如果flag==false 就是没有明细
            var flag = document.getElementById("treeFrame").contentWindow.vm.emptyVarList();

            if (flag == false) {
                message('warning', '物资名称、单价（元）、数量、金额、计量单位为必填项', 1000);
                return;
            }else if(flag == "noData"){
                return;
            } else {
                $("#showform").hide();
                $("#jiazai").show();
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl + 'wzcg/flowSubmit',
                    data: {
                        WZCG_ID:this.WZCG_ID,
                        CGDH:this.pd.CGDH,
                        CGMC:this.pd.CGMC,
                        SSBM:this.pd.SSBM,
                        SSBMNM:this.pd.SSBMNM,
                        CGSL:this.pd.CGSL,
                        CGJE:this.pd.CGJE,
                        CGRQ:this.pd.CGRQ,
                        NZSJ:this.pd.NZSJ,
                        NZR:this.pd.NZR,
                        ZT:this.pd.ZT,
                        BZ:this.pd.BZ,
                        tm: new Date().getTime()
                    },
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        if ("success" == data.result) {
                            if (data.pd != null) {
                                vm.msg = 'edit';
                                $("#showform").show();
                                $("#jiazai").hide();
                                var ID_ = data.pd.ID_;
                                var PROC_INST_ID_ = data.pd.PROC_INST_ID_;
                                //JHID:申请计划的主表id    LCZT:流程进度的状态   JHIDMC:申请计划主表id的字段名    LCZTMC:流程进度状态的字段名  TABLENAME:申请计划主表的表名
                                setDelegate('JHID=' + vm.WZCG_ID+'&LCZT=0&JHIDMC=WZCG_ID&LCZTMC=ZT&TABLENAME=ZCGL_WZCG',ID_, PROC_INST_ID_);
                            }
                        } else if ("exception" == data.result) {
                            //显示异常
                            showException("资产管理-物资采购", data.exception);
                            $("#showform").show();
                            $("#jiazai").hide();
                        } else if ("edit" == data.result) {
                            vm.pd = data.pd;
                            vm.msg = data.result;
                            vm.WZCG_ID = data.pd.WZCG_ID;
                            $("#showform").show();
                            $("#jiazai").hide();
                        }
                    }
                }).done().fail(function () {
                    message('warning', '请求服务器无响应，稍后再试!', 1000);
                    $("#showform").show();
                    $("#jiazai").hide();
                });
            }
        },

        /**
         * 根据物资采购主键ID获取数据
         */
        getData: function(){
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'wzcg/goEdit',
                data: {WZCG_ID:this.WZCG_ID,tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        //参数map
                        vm.pd = data.pd;
                        $("#WZCG").val(data.pd.WZCG_ID);
                        $("#CGMC").val(data.pd.CGMC);
                        $("#CGDH").val(data.pd.CGDH);
                        $("#NZSJ").val(data.pd.NZSJ);
                        $("#CGRQ").val(data.pd.CGRQ);
                    }else if ("exception" == data.result){
                        //显示异常
                        showException("资产管理-物资采购",data.exception);
                        $("#showform").show();
                        $("#jiazai").hide();
                    }
                }
            }).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                $("#showform").show();
                $("#jiazai").hide();
            });
        },


    },
    //初始化方法
    mounted(){
        this.init();
    }
})
