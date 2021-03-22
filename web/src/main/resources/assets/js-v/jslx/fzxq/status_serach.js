//机动装备装备实力选择url

var vm = new Vue({
    el: '#app',
    data: {
        //过滤文本
        keyWords: '',
        //中间表格数据
        centerTableData: [],
        currentPage: 1,
        showCount:-1,
        pageSize: 20,
        currentTotal: 0,
        //中间表格当前选择数据
        centerSelection: [],
        templateRadio: false,
        tblHeight:getTblHeight(42)-50,
        WZKC_ID:'',
        type:'',
        page: [],
        varList:[],
        //加载状态
        loading: false, 
    },

    methods: {
        //初始执行
        init() {
            //获取JHID用来跟计划主表关联查询
            //复选框控制全选,全不选
            $('#zcheckbox').click(function () {
                if (this.checked) {
                    $("input[name='ids']").prop("checked", true);
                } else {
                    $("input[name='ids']").prop("checked", false);
                }
            });
            this.getList();
        },
        //获取列表数据
        getList: function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'statusAnalysis/list?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
                data: {
                    keyWords: this.keyWords
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        //分页
                        vm.page = data.page;
                        vm.varList = data.varList;

                    } else if ("exception" == data.result) {
                        showException("文件分析列表", data.exception);
                    }
                }
            }).done().fail(function () {
            });
        },

        handleSizeChange(val) {
            this.pageSize = val;
            this.getList();
        },

        //单选方法，返回选中的表格行
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getList();
        },

        //中间表格数据选择事件
        centerSelectionChange(val) {
            this.centerSelection = val;
        },
        //生成需求分析
        makeStatusResult() {
            var str = '';
            for (var i = 0; i < document.getElementsByName('ids').length; i++) {
                if (document.getElementsByName('ids')[i].checked) {
                    if (str == '') str += document.getElementsByName('ids')[i].value;
                    else str += ',' + document.getElementsByName('ids')[i].value;
                }
            }
            if(str=='' || str.length==0){
                return  message('warning', '请选择文件数据!', 1000);
            }
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "修改类型";
            diag.URL = '../../jslx/fzxq/status_make.html?ID_=' + str;
            diag.Width = 400;
            diag.Height = 150;
            diag.Modal = true;
            diag.ShowMaxButton = false;
            diag.ShowMinButton = false;
            diag.CancelEvent = function () {
                var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
                if (varSon != null && varSon.style.display == 'none') {
                    vm.getList();
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
        //重置
        rest() {
            vm.keyWords = '';
            vm.getList();
        },
        //预览
        goView(data){
            alert(data.url);
            window.location.href = data.url;
           // window.open (data.url)
        },
        //下载文件
        downFile: function(data){
            this.$confirm('确定要下载文件吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                window.location.href = httpurl + 'statusAnalysis/downFile?file_id='+data.id;
        }).catch(() => {

            });
        },
    },

    //初始化创建
    mounted() {
        this.init();
    },
})

// ElementUI懒加载
// var dom = document.querySelector(".el-table__body-wrapper");
// dom.addEventListener("scroll",function(){
//     const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight;
//     if(scrollDistance <= 0){
//         if(vm.currentPage*vm.pageSize<vm.currentTotal){
//             vm.getList("lazy");
//         }
//
//     }
// })
