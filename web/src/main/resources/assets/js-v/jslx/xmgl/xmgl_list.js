/*资产管理-物资登记URL*/

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
        keyWords: '',
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
         * 获取物资登记列表
         */
        getList: function () {

            //开始时间赋值
            this.startTime = $("#startTime").val();
            //结束时间赋值
            this.endTime = $("#endTime").val();
            //物资分类
            this.WZFLNM = $("#WZFLNM").val();
            //加载状态变为true
            this.loading = true;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'project/list?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
                data: {
                    WZFLNM:this.WZFLNM,
                    keyWords: this.keyWords,
                    SSBMNM: this.SSBMNM,
                    ZRR: this.ZRR,
                    ZRRNM: this.ZRRNM,
                    startTime: this.startTime,
                    endTime: this.endTime,
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
                        showException("资产管理-统计查询", data.exception);
                    }
                }
            }).done().fail(function () {
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                    window.location.href = "../../login.html";
                }, 2000);
            });
        },
        //生成路线图
        makerRouteFile: function(data){
            this.loading = true;
        	$.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'project/markRouteXmind',
                data: {
                    keyWords: data.WZKC_ID
                },
                dataType: "json",
                /**
                 * 成功回调函数
                 * @param data 返回数据
                 */
                success: function (data) {
                    if ("success" == data.result) {
                        //物资统计查询数据
                        message('info', '生成路线图成功!', 1000);
                        //判断按钮权限，用于是否显示按钮
                        vm.hasButton();
                        //加载状态
                        vm.loading = false;
                        $("input[name='ids']").prop("checked", false);
                        $("input[id='zcheckbox']").prop("checked", false);
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("项目管理-生成技术路线图", data.exception);
                    }
                }
            }).done().fail(function () {
                message('warning', '请求服务器无响应，稍后再试!', 1000);
            });
        },
        //新增
        goAdd: function(){

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
         * 查看历史数据
         */
        goView: function (row) {
            //创建物资IDS数组
            var diag = new top.Dialog();
            diag.Drag=true;
            diag.Title ="选择物资";
            diag.URL = '../../zcgl/tjcx/zcgl_wzlog.html?WZKC_ID=' + row.WZKC_ID;
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
            };
            diag.show();
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
            //关键词清空
            vm.keyWords = '';
            vm.ZRR = '';
            vm.ZRRNM = '';
            $("#startTime").val('');
            $("#endTime").val('');
            $("#startTime").datepicker('setEndDate', null);
            $("#endTime").datepicker('setStartDate', null);
            $("#WZFLNM").val(null).trigger("change");
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
