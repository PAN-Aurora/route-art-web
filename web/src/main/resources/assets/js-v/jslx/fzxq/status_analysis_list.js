/*领域技术现状分析*/

//创建vue对象
var vm = new Vue({
    el: '#app',
    data: {
        //查询下拉框
        selList: [{selId: '3', selName: '退役报废'}],
        //遍历物资登记的数据
        varList: [],
        //分页类
        page: [],
        //检索条件,关键词
        analysisResult: '',
        projectName: '',
        //每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
        showCount: -1,
        //当前页码
        currentPage: 1,
        //增加的数据权限
        add: false,
        //删除数据的权限
        del: false,
        //修改数据的权限
        edit: false,
        //导出到excel权限
        toExcel: false,
        //加载状态
        loading: false,
        //存放字段参数的map、
        pd: [],
        //状态：退役报废
        ZT: '',
        //所属部门内码
        SSBMNM:'',
        //所属部门
        SSBM:'',
        //责任人
        ZRR:'',
        //责任人内码
        ZRRNM:'',
        //开始时间
        startTime: '',
        //结束时间
        endTime:'',
        //物资分类
        wzfl_options: [],
        //物资分类
        WZFLNM:'',
        //导出数据IDS
        DATA_IDS:''
    },

    methods: {
        //初始执行
        init() {
            //链接参数, 从树点过来 部门ID
            this.SSBMNM = getUrlKey('id');

            //复选框控制全选,全不选
            $('#zcheckbox').click(function () {
                if (this.checked) {
                    $("input[name='ids']").prop("checked", true);
                } else {
                    $("input[name='ids']").prop("checked", false);
                }
            });

            //构造数据字典方法
            setTimeout(function () {
                getDict('ZCGL_WZFL', function (e) {
                    vm.wzfl_options = e;
                });
            }, 200);
            //数据汇总查询
            this.getList();
        },

        /**
         * 获取列表
         */
        getList: function () {

            //加载状态变为true
            this.loading = true;
            
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'statusAnalysis/getDatalist?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
                data: {
                    analysisResult: this.analysisResult,
                    projectName: this.projectName,
                    tm: new Date().getTime()
                },
                dataType: "json",
                /**
                 * 成功回调函数
                 * @param data 返回数据
                 */
                success: function (data) {
                    if ("success" == data.result) {
                        //物资统计查询数据
                        vm.varList = data.varList;
                        //分页
                        vm.page = data.page;
                        //判断按钮权限，用于是否显示按钮
                        vm.hasButton();
                        //加载状态
                        vm.loading = false;
                        $("input[name='ids']").prop("checked", false);
                        $("input[id='zcheckbox']").prop("checked", false);
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("领域技术现状分析-统计查询", data.exception);
                    }
                }
            }).done().fail(function () {
                message('warning', '请求服务器无响应，稍后再试!', 1000);
//                setTimeout(function () {
//                    window.location.href = "../../login.html";
//                }, 2000);
            });
        },
        downFile: function(data){
            this.$confirm('确定要下载路线图文件吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                window.location.href = httpurl + 'statusAnalysis/downFile?file_id='+data.file_id;
        }).catch(() => {

            });
        },
        //选择办理人
        getUser: function (){
            var diag = new top.Dialog();
            diag.Drag=true;
            diag.Title ="选择责任人";
            diag.URL = '../user/window_user_list.html';
            diag.Width = 1000;
            diag.Height = 660;
            diag.Modal = true;
            diag. ShowMaxButton = true;
            diag.ShowMinButton = true;
            diag.CancelEvent = function(){
                var NAME = diag.innerFrame.contentWindow.document.getElementById('NAME').value;
                var USER_ID = diag.innerFrame.contentWindow.document.getElementById('USER_ID').value;
                if("" != NAME){
                    //刷新行
                    vm.ZRR = NAME;
                    vm.ZRRNM = USER_ID;
                }
                diag.close();
            };
            diag.show();
        },

        /**
         * 判断按钮权限，用于是否显示按钮
         */
        hasButton: function () {
            var keys = 'wzdj:add,wzdj:del,wzdj:edit,toExcel';
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
                        //新增权限
                        vm.add = data.wzdjfhadminadd;
                        //删除权限
                        vm.del = data.wzdjfhadmindel;
                        //修改权限
                        vm.edit = data.wzdjfhadminedit;
                        //导出到excel权限
                        vm.toExcel = data.toExcel;
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("按钮权限", data.exception);
                    }
                }
            })
        },

        /**
         * 文件分析
         */
        goView: function () {
            //创建物资IDS数组
            var diag = new top.Dialog();
            diag.Drag=true;
            diag.Title ="文件分析";
            diag.URL = '../../jslx/fzxq/status_serach.html';
            diag.Width = 1200;
            diag.Height = 695;
            //有无遮罩窗口
            diag.Modal = true;
            //最大化按钮
            diag. ShowMaxButton = true;
            //最小化按钮
            diag.ShowMinButton = true;
            //关闭事件
            diag.CancelEvent = function(){
                diag.close();
                vm.getList();
            };
            diag.show();
        },
        /**
         * 预览文件
         * @param data
         * @param index
         * @returns {*}
         */
        showFile(data,index){
            var fileId = data.analysisBase.split(',');
            if(data!=null && data!=''){
                window.open("../../../plugins/pdfjs/web/viewer.html?file="+httpurl + "statusAnalysis/showFile/"+fileId[index]);
            }else{
                return  message('warning', '无法预览!', 1000);
            }
        },
        /**
         * 鼠标悬浮事件 显示项目名称和所属岗位保养内容完整信息
         * @param XX 项目名称保养内容所属岗位
         * @param ID 项目名称保养内容所属岗位ID
         */
        mouseoverXf: function (XX, ID) {
            if (XX != undefined) {
                $("#" + ID).tips({
                    side: 3,
                    msg: XX,
                    color: '#000000',
                    bg: 'white',
                    //悬浮
                    time: 'xf',
                    x: 3,
                    y: 0,
                });
                $("#" + ID).focus();
            }
        },

        /**
         * 重置检索条件方法
         */
        rest: function () {
            this.analysisResult = '';
            this.projectName = '';
            //分页跳转至第一页;
            this.nextPage(1);
            //遍历全部数据
            vm.getList();
        },

        /**
         * 导出excel
         */
        goExcel: function () {

            if (vm.varList.length == 0) {
                return  message('warning', '无数据!', 1000);
            }
            var str = '';
            for (var i = 0; i < document.getElementsByName('ids').length; i++) {
                if (document.getElementsByName('ids')[i].checked) {
                    if (str == '') str += document.getElementsByName('ids')[i].value;
                    else str += ',' + document.getElementsByName('ids')[i].value;
                }
            }
            this.DATA_IDS = str;
            if (str == '') {
                this.$confirm('确定要导出所有数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'el-button--info',
                }).then(() => {
                    vm.formSubmit();
            }).catch(() => {});
            } else {
                this.$confirm('确定要导出选中数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'el-button--info',
                }).then(() => {
                    vm.formSubmit();
            }).catch(() => {});
            }
        },

        formSubmit: function () {
            //设置action
            var exportForm = document.getElementById("myForm");
            exportForm.action = httpurl + 'tjcx/excel';
            exportForm.submit();
        },
        //选择几条数据制造评论信息
        makeReport:function(){
        	 if (vm.varList.length == 0) {
                 return  message('warning', '请选择数据!', 1000);
             }
             var str = '';
             for (var i = 0; i < document.getElementsByName('ids').length; i++) {
                 if (document.getElementsByName('ids')[i].checked) {
                     if (str == '') str += document.getElementsByName('ids')[i].value;
                     else str += ',' + document.getElementsByName('ids')[i].value;
                 }
             }
             
             
        },
        //删除
        goDel: function(data){
        	 //加载状态变为true

            this.$confirm('确定要删除选择的数据吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {

                vm.loading = true;
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl + 'statusAnalysis/deleteAnalysisById',
                    data: {
                        id:data.id
                    },
                    dataType: "json",
                    success: function (data) {
                        if ("success" == data.result) {
                                    vm.getList();
                                    //加载状态
                                    vm.loading = false;
                                    $("input[name='ids']").prop("checked", false);
                                    $("input[id='zcheckbox']").prop("checked", false);

                                } else if ("exception" == data.result) {
                                    //显示异常
                                    showException("操作失败", data.exception);
                                }
                            }
                        }).done().fail(function () {
                            message('warning', '请求服务器无响应，稍后再试!', 1000);
                        });

                      }).catch(() => {});

        },

        //-----分页必用----start
        nextPage: function (page) {
            this.currentPage = page;
            localStorage.setItem("currentPage", this.currentPage);
            this.getList();
        },
        changeCount: function (value) {
            this.showCount = value;
            localStorage.setItem("showCount", this.showCount);
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
    //初始化的创建
    mounted() {
        this.init();
    }
})
