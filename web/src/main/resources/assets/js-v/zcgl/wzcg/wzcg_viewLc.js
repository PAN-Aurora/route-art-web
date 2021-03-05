var vm = new Vue({
    el: '#app',
    data: {
        //主键ID
        WZCG_ID: '',
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
            this.ZDDLR = dataSj.ZDDLR;
            this.TJYH = dataSj.TJYH;
            sessionStorage.removeItem("dataSj");
            if (null != dataSj) {
                this.msg = 'edit';
                this.edit = true;
                this.WZCG_ID = dataSj.JHID;
                //根据主键ID获取数据
                this.getData();
                //获取明细列表
                this.getList();
            }
        },

        //根据主键ID获取数据
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

        //获取明细列表
        getList: function () {
            //loading为true
            this.loading = true;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                //ajax类型
                type: "POST",
                //ajax 的url
                url: httpurl + 'wzcgmx/list?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
                //传给后台的data参数
                data: {
                    keyWords: this.keyWords,
                    WZCG_ID:this.WZCG_ID,
                    tm: new Date().getTime()
                },
                //传值的类型
                dataType: "json",
                //成功回调函数
                success: function (data) {
                    if ("success" == data.result) {
                        //将data中的参数赋值给vm中参数
                        vm.varList = data.varList;
                        vm.page = data.page;
                        vm.loading = false;
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("物资采购明细", data.exception);
                    }
                }
            }).done().fail(function () {
                //弹出提示框
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                //延迟方法
                setTimeout(function () {
                    window.location.href = "../../login.html";
                }, 2000);
            });
        },

        //导出word
        goWord: function (WZCG_ID) {
            this.$confirm('确定要导出吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                window.location.href = httpurl + 'wzcg/word?WZCG_ID='+WZCG_ID;
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

    //页面加载 最先执行方法
    mounted() {
        this.init();
    }
})
