
var vm = new Vue({
    el: '#app',
    data: {
        //list
        varList: [],
        //分页类
        page: [],
        //检索条件 关键词
        keyWords: '',
        //主键ID
        DEPT_ID: '0',
        //上级ID
        PARENT_ID: '0',
        //每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
        showCount: -1,
        //当前页码
        currentPage: 1,
        add: false,
        del: false,
        edit: false,
        toExcel: false,
        //加载状态
        loading: false,
        //用来判断页面上是否显示新增
        isViews: false
    },

    methods: {
        //初始执行
        init() {
            //链接参数, 从树点过来
            var id = getUrlKey('id');
            if (null != id) {
                this.DEPT_ID = id;
            }
            this.getList(this.DEPT_ID);
            //判断接收到的id是否为0 为0则不显示页面上返回按钮
            if (id != 'a6c6695217ba4a4dbfe9f7e9d2c06730') {
                this.isViews = 'false';
            } else {
                this.isViews = 'true';
            }
        },

        //获取列表
        getList: function (F_ID) {
            this.DEPT_ID = F_ID;
            this.loading = true;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'dept/list?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
                data: {DEPT_ID: this.DEPT_ID, keyWords: this.keyWords, tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.varList = data.varList;
                        vm.page = data.page;
                        vm.PARENT_ID = data.PARENT_ID;
                        // if(vm.PARENT_ID == 0){
                        //     vm.isViews = 'true';
                        // }
                        if(vm.DEPT_ID != 0){
                            vm.isViews = 'false';
                        }
                        vm.hasButton();
                        vm.loading = false;
                    } else if ("exception" == data.result) {
                        showException("组织机构", data.exception);
                    }
                }
            }).done().fail(function () {
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                    window.location.href = "../../login.html";
                }, 2000);
            });
        },

        //新增
        goAdd: function (DEPT_ID) {
            //从session中获取mc和nm
            var zqmc = sessionStorage.getItem("zqmc");
            var zqnm = sessionStorage.getItem("zqnm");
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "新增机构";
            diag.URL = '../../sys/dept/dept_edit.html?PARENT_ID=' + DEPT_ID+'&zqmc='+zqmc+'&zqnm='+zqnm;
            diag.Width = 1000;
            diag.Height = 400;
            diag.CancelEvent = function () {
                var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
                if (varSon != null && varSon.style.display == 'none') {
                    vm.getList(vm.DEPT_ID);
                    //刷新父页面
                    parent.initTree();
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
            sessionStorage.removeItem("zqmc");
            sessionStorage.removeItem("zqnm");
        },

        //修改
        goEdit: function (DEPT_ID) {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "编辑机构";
            diag.URL = '../../sys/dept/dept_edit.html?PARENT_ID=' + this.PARENT_ID + '&DEPT_ID=' + DEPT_ID;
            diag.Width = 1000;
            diag.Height = 400;
            diag.CancelEvent = function () {
                var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
                if (varSon != null && varSon.style.display == 'none') {
                    vm.getList(vm.DEPT_ID);
                    //刷新父页面
                    parent.initTree();
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
        goDel: function (Id) {
            this.$confirm("确定要删除吗?", '提示', {
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
                        url: httpurl + 'dept/delete',
                        data: {DEPT_ID: Id, tm: new Date().getTime()},
                        dataType: 'json',
                        success: function (data) {
                            if ("success" == data.result) {
                                message('success', '已经从列表中删除!', 1000);
                                vm.getList(vm.DEPT_ID);
                                //刷新父页面
                                parent.initTree();
                            } else if ("error" == data.result) {
                                message('warning', '删除失败！请先删除子级或删除占用资源!', 1000);
                                vm.loading = false;
                            }
                        }
                    });
                }).catch(() => {
                    
                });
        },

        //导出excel
        goExcel: function () {
            this.$confirm('确定要导出到excel吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',             
            }).then(() => {
                window.location.href = httpurl + 'dept/excel?keyWords=' + this.keyWords+ '&DEPT_ID=' + this.DEPT_ID;
            }).catch(() => {
            });
        },

        //判断按钮权限，用于是否显示按钮
        hasButton: function () {
            var keys = 'dept:add,dept:del,dept:edit,toExcel';
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
                        vm.add = data.deptfhadminadd;
                        vm.del = data.deptfhadmindel;
                        vm.edit = data.deptfhadminedit;
                        vm.toExcel = data.toExcel;
                    } else if ("exception" == data.result) {
                        showException("按钮权限", data.exception);
                    }
                }
            })
        },

        //打开上传excel页面
        getExcel: function () {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "从EXCEL导入到系统";
            diag.URL = '../dept/dept_excel.html';
            diag.Width = 600;
            diag.Height = 130;
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

        //重置方法
        rest: function () {
            //关键词清空
            vm.keyWords = '';
            //分页跳转至第一页
            this.nextPage(1);
            //遍历全部数据
            this.getList(vm.DEPT_ID);
        },
        //-----分页必用----start
        nextPage: function (page) {
            this.currentPage = page;
            this.getList(this.DEPT_ID);
        },
        changeCount: function (value) {
            this.showCount = value;
            this.getList(this.DEPT_ID);
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

    //初始化创建
    mounted() {
        this.init();
    }

})
