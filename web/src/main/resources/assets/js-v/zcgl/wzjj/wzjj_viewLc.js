Vue.component('treeselect', VueTreeselect.Treeselect);
var vm = new Vue({
    el: '#app',
    data:{
        //主键ID
        WZJJ_ID: '',
        //存放字段参数
        pd: [],
        //编辑状态
        edit: false,
        msg:'add',
        treeset:[],
        //指定代理人
        ZDDLR:'',
        //提交用户
        TJYH:'',
        varList:[],
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
            var dataSj= JSON.parse(sessionStorage.getItem("dataSj"));
            this.ZDDLR =dataSj.ZDDLR;
            this.TJYH =dataSj.TJYH;
            sessionStorage.removeItem("dataSj");
            if (null != dataSj) {
                this.msg = 'edit';
                this.edit = true;
                this.WZJJ_ID = dataSj.JHID;
                //根据主键ID获取数据
                this.getData();
                //获取明细列表
                this.getList();
            }
            this.getsj();
        },

        //根据主键ID获取数据
        getData: function(){
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'wzjj/goEdit',
                data: {WZJJ_ID:this.WZJJ_ID,tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        vm.pd = data.pd;
                        $("#JJDH").val(data.pd.JJDH);
                        $("#SSBM").val(data.pd.SSBM);
                        $("#SQSJ").val(data.pd.SQSJ);
                        $("#CJSJ").val(data.pd.CJSJ);
                        $("#XGSJ").val(data.pd.XGSJ);
                    }else if ("exception" == data.result){
                        showException("物资交接",data.exception);
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

        //获取列表
        getList: function(){
            this.loading = true;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'wzjjmx/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
                data: {
                    keyWords:this.keyWords,
                    WZJJ_ID: this.WZJJ_ID,
                    tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        vm.varList = data.varList;
                        vm.page = data.page;
                        vm.loading = false;
                      $("input[name='ids']").prop("checked", false);
                    }else if ("exception" == data.result){
                        //显示异常
                        showException("物资交接明细",data.exception);
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
        goWord: function (WZJJ_ID) {
            this.$confirm('确定要导出吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                window.location.href = httpurl + 'wzjj/word?WZJJ_ID='+WZJJ_ID;
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
    mounted(){
        this.init();
    }
})
