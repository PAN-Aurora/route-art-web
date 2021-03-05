/*资产管理-物资采购URL*/

//创建vue
var vm = new Vue({
    el: '#app',

    data: {
        //遍历资产管理-物资采购list数据
        varList: [],
        //查询下拉框
        selList: [{selId: 'false', selName: '未登记'}, {selId: 'true', selName: '完成登记'}],
        //分页类
        page: [],
        //检索条件,关键词
        keyWords: '',
        //每页显示条数
        showCount: -1,
        //当前页码
        currentPage: 1,
        //增加数据权限
        add: false,
        //删除数据权限
        del: false,
        //修改数据权限
        edit: false,
        //导出到excel权限
        toExcel: false,
        //用来存数据pd
        pd: [],
        //加载状态
        loading: false,
        //状态 已完成
        ZT: '2',
        //登记状态
        DJZT:'false'
    },

    methods: {

        //初始执行
        init() {

            //复选框控制全选,全不选
            // $('#zcheckbox').click(function () {
            //     if (this.checked) {
            //         $("input[name='ids']").prop("checked", true);
            //     } else {
            //         $("input[name='ids']").prop("checked", false);
            //     }
            // });
            this.getList();
        },

        /**
         * 获取资产管理-物资采购数据列表
         */
        getList: function () {
            //加载状态变为true
            this.loading = true;
            //获取开始时间、结束时间和状态
            this.pd.startTime = $("#startTime").val();
            this.pd.endTime = $("#endTime").val();
            //状态
            this.DJZT = $("#selZt").val();
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzcg/list?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
                data: {
                    keyWords: this.keyWords,
                    ZT: this.ZT,
                    DJZT: this.DJZT,
                    startTime: this.pd.startTime,
                    endTime: this.pd.endTime,
                    BS: 'WZDJ',
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        //回显list遍历数据
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
                        showException("资产管理—物资采购", data.exception);
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
         * 新增资产管理-物资采购数据
         */
        goAdd: function () {
            location.href = '../../zcgl/wzcg/wzcg_edit.html';
        },

        /**
         * 修改资产管理-物资登记
         * @param id  资产管理-物资采购ID
         */
        goEdit: function (id,zt) {
            if (zt==0) {
                //ajax请求拆分采购明细数据插入物资登记表 更新状态
                //加载状态变为true
                this.loading = true;
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl + 'wzdj/generateData',
                    data: {
                        WZCG_ID: id,
                        tm: new Date().getTime()
                    },
                    dataType: "json",
                    success: function (data) {
                        if ("success" == data.result) {
                            //跳转物资顶级list页面
                            location.href = '../../zcgl/wzdj/wzdjmx_list.html?WZCG_ID=' + id;
                        } else if ("exception" == data.result) {
                            //显示异常
                            showException("资产管理—物资登记程序异常", data.exception);
                            //刷新数据
                            vm.getList();
                        }
                    }
                }).done().fail(function () {
                    message('warning', '请求服务器无响应，稍后再试!', 1000);
                    setTimeout(function () {
                        window.location.href = "../../login.html";
                    }, 2000);
                });
            }else{
                //跳转物资顶级list页面
                location.href = '../../zcgl/wzdj/wzdjmx_list.html?WZCG_ID=' + id;
            }

        },

        /**
         * 查看机资产管理-物资采购视图页面
         * @param id 资产管理-物资采购id
         */
        goView: function (id) {
            //跳转物资顶级list页面
            location.href = '../../zcgl/wzdj/wzdjmx_view.html?WZCG_ID=' + id;
        },

        /**
         * 删除资产管理-物资采购数据
         * @param id  资产管理-物资采购ID
         */
        goDel: function (id) {
            this.$confirm('确定要删除吗', '提示', {
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
                url: httpurl + 'wzcg/delete',
                data: {WZCG_ID: id, tm: new Date().getTime()},
                dataType: 'json',
                success: function (data) {
                    if ("success" == data.result) {
                        message('success', '已经从列表中删除!', 1000);
                    }
                    vm.getList();
                }
            });
        });
        },

        /**
         * 批量操作资产管理-物资采购数据
         * @param msg  确定要删除选中的数据吗?
         */
        makeAll: function (msg) {
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                var str = '';
            for (var i = 0; i < document.getElementsByName('ids').length; i++) {
                if (document.getElementsByName('ids')[i].checked) {
                    if (str == '') str += document.getElementsByName('ids')[i].value;
                    else str += ',' + document.getElementsByName('ids')[i].value;
                }
            }
            if (str == '') {
                $("#cts").tips({
                    side: 2,
                    msg: '点这里全选',
                    bg: tipsColor,
                    time: 3
                });
                message('warning', '您没有选择任何内容!', 1000);
                return;
            } else {
                if (msg == '确定要删除选中的数据吗?') {
                    this.loading = true;
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: "POST",
                        url: httpurl + 'wzcg/deleteAll?tm=' + new Date().getTime(),
                        data: {DATA_IDS: str},
                        dataType: 'json',
                        success: function (data) {
                            if ("success" == data.result) {
                                message('success', '已经从列表中删除!', 1000);
                            }
                            vm.getList();
                        }
                    });
                }
            }
        }).catch(() => {

            });
        },

        /**
         * 判断按钮权限，用于是否显示按钮
         */
        hasButton: function () {
            var keys = 'wzcg:add,wzcg:del,wzcg:edit,toExcel';
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
                        vm.add = data.wzcgfhadminadd;
                        //删除权限
                        vm.del = data.wzcgfhadmindel;
                        //修改权限
                        vm.edit = data.wzcgfhadminedit;
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

            var str = '';
            for (var i = 0; i < document.getElementsByName('ids').length; i++) {
                if (document.getElementsByName('ids')[i].checked) {
                    if (str == '') str += document.getElementsByName('ids')[i].value;
                    else str += ',' + document.getElementsByName('ids')[i].value;
                }
            }
            if (str == '') {
                this.$confirm('确定要导出所有数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'el-button--info',
                }).then(() => {
                    window.location.href = httpurl + 'wzcg/excel?keyWords=' + this.keyWords + '&startTime=' + this.pd.startTime + '&endTime=' + this.pd.endTime + '&ZT=' + this.ZT;
            }).catch(() => {

                });
            } else {
                this.$confirm('确定要导出选中数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'el-button--info',
                }).then(() => {
                    window.location.href = httpurl + 'wzcg/excel?keyWords=' + this.keyWords + '&startTime=' + this.pd.startTime + '&endTime=' + this.pd.endTime + '&ZT=' + this.ZT + '&DATA_IDS=' + str;
            }).catch(() => {

                });
            }
        },

        /**
         * 重置检索条件方法
         */
        rest: function () {
            //检索条件清空
            vm.keyWords = '';
            $("#startTime").val('');
            $("#endTime").val('');
            $("#endTime").datepicker('setStartDate', null);
            $("#startTime").datepicker('setEndDate', null);
            $("#selZt").val(null).trigger("change");
            //分页跳转至第一页
            this.nextPage(1);
            //遍历全部数据
            vm.getList();
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
