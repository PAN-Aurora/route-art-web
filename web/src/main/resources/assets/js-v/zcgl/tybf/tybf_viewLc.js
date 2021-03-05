Vue.component('treeselect', VueTreeselect.Treeselect);
var vm = new Vue({
    el: '#app',
    data:{
        //主键ID
        TYBF_ID: '',
        //存放字段参数 用来放查询参数
        pd: [],
        //编辑状态
        edit: false,
        //添加状态
        msg: 'add',
        //指定代理人
        ZDDLR: '',
        //提交用户
        TJYH: '',
        //测试计划数据集合
        varList: [],
        //分页类
        page: [],
        //检索条件,关键词
        keyWords: '',
        //每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
        showCount: -1,
        //当前页码
        currentPage: 1,
        //加载状态
        loading: false
    },

    methods: {

        //初始执行
        init() {
            //获取跳转路径，计划id，提交用户和指定代理人
            var dataSj = JSON.parse(sessionStorage.getItem("dataSj"));
            console.info(dataSj.JHID)
            this.ZDDLR = dataSj.ZDDLR;
            this.TJYH = dataSj.TJYH;
            sessionStorage.removeItem("dataSj");
            if (null != dataSj) {
                this.msg = 'edit';
                this.edit = true;
                this.TYBF_ID = dataSj.JHID;
                //根据主键ID获取数据
                this.getData();
                //获取明细列表
                this.getList();
            }
            console.info(this.TYBF_ID)
        },
        getData: function(){
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'tybf/goEdit',
                data: {TYBF_ID:this.TYBF_ID,tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        //参数map
                        vm.pd = data.pd;
                        $("#SQDH").val(data.pd.SQDH);
                        $("#SQRQ").val(data.pd.SQRQ);
                        $("#SQR").val(data.pd.SQR);
                        $("#SSBM").val(data.pd.SSBM);
                        $("#XGSJ").val(data.pd.XGSJ);
                        $("#BFYY").val(data.pd.BFYY)
                    }else if ("exception" == data.result){
                        //显示异常
                        showException("退役报废计划",data.exception);
                        $("#showform").show();
                        $("#jiazai").hide();
                    }
                }
            }).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                $("#showform").show();
                $("#jiazai").hide();
            });
        },

        /**
         * 获取退役报废计划明细列表
         */
        getList: function(){
            this.loading = true;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'tybfmx/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
                data: {
                    keyWords:this.keyWords,
                    TYBF_ID:this.TYBF_ID,
                    tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        vm.varList = data.varList;
                        vm.page = data.page;
                        vm.hasButton();
                        vm.loading = false;
                        $("input[name='ids']").prop("checked", false);
                        $("input[id='zcheckbox']").prop("checked", false);
                    }else if ("exception" == data.result){
                        //显示异常
                        showException("退役报废明细",data.exception);
                    }
                }
            }).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                    window.location.href = "../../login.html";
                }, 2000);
            });
        },

        //导出excel
        goWord: function (TYBF_ID) {
            this.$confirm('确定要导出吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                window.location.href = httpurl + 'tybf/word?TYBF_ID='+TYBF_ID;
        }).catch(() => {

            });
        },

        //-----分页必用----start
        nextPage: function (page){
            this.currentPage = page;
            localStorage.setItem("currentPage", this.currentPage);
            this.getList();
        },
        changeCount: function (value){
            this.currentPage = 1;
            this.showCount = value;
            localStorage.setItem("showCount", this.showCount);
            this.getList();
        },
        toTZ: function (){
            var toPaggeVlue = document.getElementById("toGoPage").value;
            if(toPaggeVlue == ''){document.getElementById("toGoPage").value=1;return;}
            if(isNaN(Number(toPaggeVlue))){document.getElementById("toGoPage").value=1;return;}
            this.nextPage(toPaggeVlue);
        }
        //-----分页必用----end

    },

    mounted(){
        this.init();
    }
})
