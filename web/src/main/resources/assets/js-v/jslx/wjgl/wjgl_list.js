/*机动装备技术资料URL*/

//创建机动装备vue对象
var vm = new Vue({
    el: '#app',
    data:{
        //机动装备技术资料list
        varList: [],
        //分页类
        page: [],
        //检索条件,关键词
        keyWords:'',
        //每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
        showCount: -1,
        //当前页码
        currentPage: 1,
        //增加权限
        add:false,
        //删除权限
        del:false,
        //修改权限
        edit:false,
        //导出到excel权限
        toExcel:false,
        //加载状态
        loading:false,
        //用来存放数据pd
        pd:[]
    },
    methods: {

        //初始执行
        init() {
            //复选框控制全选,全不选
            $('#zcheckbox').click(function () {
                //判断是否选中多个复选框
                if ($(this).is(':checked')) {
                    $("input[name='ids']").prop("checked", true);
                } else {
                    $("input[name='ids']").prop("checked", false);
                }
            });

            this.getPage();

            //调用查询机动装备技术资料数据方法
            this.getList();
        },

        /**
         * 获取机动装备技术资料列表
         */
        getList: function(){
            this.loading = true;
            this.pd.startTime = $("#startTime").val();
            this.pd.endTime = $("#endTime").val();
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'wjgl/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
                data: {keyWords:this.keyWords,startTime: this.pd.startTime,
                    endTime: this.pd.endTime,tm:new Date().getTime()},
                dataType:"json",
                //成功回调函数
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
                        showException("技术资料管理",data.exception);
                    }
                }
            }).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                    window.location.href = "../../login.html";
                }, 2000);
            });
        },

        /**
         * 新增机动装备技术资料
         */
        goAdd: function (){
            window.location.href = '../../jslx/wjgl/wjgl_edit.html';
        },

        /**
         * 修改机动装备技术资料
         * @param id 技术资料id
         */
        goEdit: function(id){
            window.location.href = '../../jslx/wjgl/wjgl_edit.html?FID='+id+'&type=edit';
        },

        /**
         * 删除机动装备技术资料
         * @param id 技术资料id
         */
        goDel: function (id){
             this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
                }).then(() => {
                    this.loading = true;
                    //删除附件
                   delFilesByids(id,httpurl);
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: "POST",
                        url: httpurl+'wjgl/delete',
                        data: {JSZL_ID:id,tm:new Date().getTime()},
                        dataType:'json',
                        success: function(data){
                            if("success" == data.result){
                                message('success', '已经从列表中删除!', 1000);
                            }
                            vm.getList();
                        }
                    });
                }).catch(() => {

                });
        },

        /**
         * 批量操作删除机动装备技术资料
         * @param msg 确认删除选中的数据吗？
         */
        makeAll: function (msg){
            this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                 type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                    var str = '';
                    for(var i=0;i < document.getElementsByName('ids').length;i++){
                        if(document.getElementsByName('ids')[i].checked){
                            if(str=='') str += document.getElementsByName('ids')[i].value;
                            else str += ',' + document.getElementsByName('ids')[i].value;
                        }
                    }
                    if(str==''){
                        $("#cts").tips({
                            side:2,
                            msg:'点这里全选',
                            bg:tipsColor,
                            time:3
                        });
                        message('warning', '您没有选择任何内容!', 1000);
                        return;
                    }else{
                        if(msg == '确定要删除选中的数据吗?'){
                            this.loading = true;
                            //删除附件
                            delFilesByids(str,httpurl);
                            $.ajax({
                                xhrFields: {
                                    withCredentials: true
                                },
                                type: "POST",
                                url: httpurl+'wjgl/deleteAll?tm='+new Date().getTime(),
                                data: {DATA_IDS:str},
                                dataType:'json',
                                success: function(data){
                                    if("success" == data.result){
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
        hasButton: function(){
            var keys = 'wjgl:add,wjgl:del,wjgl:edit,toExcel';
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'head/hasButton',
                data: {keys:keys,tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        //新增权限
                        vm.add = data.jszlfhadminadd;
                        //删除权限
                        vm.del = data.jszlfhadmindel;
                        //修改权限
                        vm.edit = data.jszlfhadminedit;
                        //导出到excel权限
                        vm.toExcel = data.toExcel;
                    }else if ("exception" == data.result){
                        //显示异常
                        showException("按钮权限",data.exception);
                    }
                }
            })
        },

        /**
         * 导出机动装备技术资料到excel
         */
        goExcel: function (){

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
                    window.location.href = httpurl + 'wjgl/excel?keyWords=' + this.keyWords + '&startTime=' + this.pd.startTime + '&endTime=' + this.pd.endTime;
                }).catch(() => {

                });
            } else {
                this.$confirm('确定要导出选中数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'el-button--info',
                }).then(() => {
                    window.location.href = httpurl + 'wjgl/excel?keyWords=' + this.keyWords + '&startTime=' + this.pd.startTime + '&endTime=' + this.pd.endTime + '&DATA_IDS=' + str;
                }).catch(() => {

                });
            }
        },

        /**
         * 查看机动装备技术资料视图页面
         * @param id 技术资料id
         */
        goView: function (id) {
            window.location.href = '../../jslx/wjgl/wjgl_view.html?FID=' + id+'&type=view';
        },

        /**
         * 机动装备技术资料重置方法
         */
        rest: function () {
            vm.keyWords = '';
            $("#startTime").val('');
            $("#endTime").val('');
            $("#endTime").datepicker('setStartDate',null);
            $("#startTime").datepicker('setEndDate',null);
            //分页跳转至第一页
            this.nextPage(1);
            vm.getList();
        },

        getPage: function () {
            this.showCount = localStorage.getItem("showCount") ? localStorage.getItem("showCount") : -1;
            this.currentPage = localStorage.getItem("currentPage") ? localStorage.getItem("currentPage") : -1;
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

    //初始化
    mounted(){
        this.init();
    }
})
