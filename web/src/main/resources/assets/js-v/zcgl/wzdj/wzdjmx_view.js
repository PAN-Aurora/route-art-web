/*资产管理-物资登记URL*/

//创建vue对象
var vm = new Vue({
    el: '#app',
    data: {
        WZCG_ID: '',
        //查询下拉框
        selList: [{selId: '0', selName: '未登记'}, {selId: '1', selName: '完成登记'}],
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
        //物资分类
        WZFLNM:'',
        //二维码登记数据
        param:'',
        //导出数据IDS
        DATA_IDS:'',
        //物资分类
        wzfl_options: []
    },

    methods: {
        //初始执行
        init() {

            this.WZCG_ID = getUrlKey('WZCG_ID');

            //复选框控制全选,全不选
            // $('#zcheckbox').click(function () {
            //     if (this.checked) {
            //         $("input[name='ids']").prop("checked", true);
            //     } else {
            //         $("input[name='ids']").prop("checked", false);
            //     }
            // });
            //构造数据字典方法
            setTimeout(function () {
                getDict('ZCGL_WZFL', function (e) {
                    vm.wzfl_options = e;
                });
            }, 200);
            //调用查询物资登记数据方法
            this.getList();
        },

        /**
         * 获取物资登记列表
         */
        getList: function () {
            //加载状态变为true
            this.loading = true;
            //开始时间赋值
            this.pd.startTime = $("#startTime").val();
            //结束时间赋值
            this.pd.endTime = $("#endTime").val();
            //状态
            this.WZFLNM = $("#WZFLNM").val();
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzdj/list?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
                data: {
                    keyWords: this.keyWords,
                    startTime: this.pd.startTime,
                    endTime: this.pd.endTime,
                    WZFLNM: this.WZFLNM,
                    WZCG_ID: this.WZCG_ID,
                    tm: new Date().getTime()
                },
                dataType: "json",
                /**
                 * 成功回调函数
                 * @param data 返回数据
                 */
                success: function (data) {
                    if ("success" == data.result) {
                        //回调物资登记的遍历数据
                        vm.varList = data.varList;
                        //分页
                        vm.page = data.page;
                        //判断按钮权限，用于是否显示按钮
                        vm.hasButton();
                        //加载状态
                        vm.loading = false;
                        // $("input[name='ids']").prop("checked", false);
                        // $("input[id='zcheckbox']").prop("checked", false);
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("资产管理-物资登记", data.exception);
                    }
                }
            }).done().fail(function () {
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                    window.location.href = "../../login.html";
                }, 2000);
            });
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
                // window.location.href = httpurl + 'wzdj/excel?keyWords=' + this.keyWords + '&startTime=' + this.pd.startTime + '&endTime=' + this.pd.endTime + '&ZT=' + this.ZT;
            }).catch(() => {

                });
            } else {
                this.$confirm('确定要导出选中数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'el-button--info',
                }).then(() => {
                    vm.formSubmit();
                // window.location.href = httpurl + 'wzdj/excel?keyWords=' + this.keyWords + '&startTime=' + this.pd.startTime + '&endTime=' + this.pd.endTime + '&DATA_IDS=' + str + '&ZT=' + this.ZT;
            }).catch(() => {

                });
            }
        },

        formSubmit: function () {
            //设置action
            var exportForm = document.getElementById("myForm");
            exportForm.action = httpurl + 'wzdj/excel';
            exportForm.submit();
        },

        /**
         * 重置检索条件方法
         */
        reset: function () {
            //关键词清空
            vm.keyWords = '';
            //开始时间清空
            $("#startTime").val('');
            $("#startTime").datepicker('setEndDate',null);
            //结束时间清空
            $("#endTime").val('');
            $("#endTime").datepicker('setStartDate',null);
            $("#WZFLNM").val(null).trigger("change");
            //分页跳转至第一页;
            this.nextPage(1);
            //遍历全部数据
            vm.getList();
        },

        /**
         * 返回按钮
         */
        goBack: function () {
            window.location.href = '../../zcgl/wzdj/wzdj_list.html';
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

        toTZ: function (){
            var toPaggeVlue = document.getElementById("toGoPage").value;
            if(toPaggeVlue == ''){document.getElementById("toGoPage").value=1;return;}
            if(isNaN(Number(toPaggeVlue))){document.getElementById("toGoPage").value=1;return;}
            this.nextPage(toPaggeVlue);
        }
        //-----分页必用----end

    },
    //初始化的创建
    mounted() {
        this.init();
    }
})
