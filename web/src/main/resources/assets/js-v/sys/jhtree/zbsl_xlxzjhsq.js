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
        tblHeight:getTblHeight(42),
        ZBMLNM:'',
        DEPT_ID:'',
        JHID:'',
        type:'',
        ZBSLIDS:[]
    },

    methods: {
        //初始执行
        init() {
            //获取装备目录内码用于查询列表
            this.ZBMLNM = getUrlKey('JDZBZBML_ID');
            //获取单位ID用于查询列表
            this.DEPT_ID = getUrlKey('DEPT_ID');
            //获取JHID用来跟计划主表关联查询
            this.JHID = getUrlKey('JHID');
            //获取是计划类型
            this.type = getUrlKey('type');
            //获取列表传来的装备实力ids
            this.ZBSLIDS = getUrlKey('ZBSLIDS');
            this.getData();
        },
        //获取列表数据
        getData: function (isLazy) {
            if(isLazy=="lazy"){
                this.currentPage+=1;
            }else{
                this.currentPage=1;
            }
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'zbsl/listBytck' ,
                data: {
                    ZBMLNM : this.ZBMLNM,
                    DEPT_ID : this.DEPT_ID,
                    ZBSLIDS : this.ZBSLIDS,
                    keyWords: this.keyWords,
                    pageSize: this.pageSize,
                    currentPage: this.currentPage
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        if(isLazy=="lazy"){
                            data.varList.forEach(element => {
                                vm.centerTableData.push(element)
                            });
                        }else{
                            vm.centerTableData = data.varList;
                        }
                        vm.currentTotal = data.total;
                    } else if ("exception" == data.result) {
                        showException("装备实力", data.exception);
                    }
                }
            }).done().fail(function () {
            });
        },

        handleSizeChange(val) {
            this.pageSize = val;
            this.getData();
        },

        //单选方法，返回选中的表格行
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getData();
        },

        //中间表格数据选择事件
        centerSelectionChange(val) {
            this.centerSelection = val;
        },

        //保存表格数据
        saveSelectData() {
            if (this.centerSelection.length <= 0) {
                vm.$message.warning('请至少选择一条数据');
                return;
            }
            //调用父页面显示遮罩层方法
            parent.xszzc();
            var ZBSLIDS = [];
            var ZBSLID;
            for (var i = 0; i < this.centerSelection.length; i++) {
                //将装备实力IDpush到ZBSLIDS中
                ZBSLIDS.push(this.centerSelection[i].ZBSL_ID);
            }
            //将数组转换为逗号分割字符串
            ZBSLID = ZBSLIDS.join(',');
            //修理计划批量保存明细
            if(this.type=='xljh'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'xljhmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
                //保养计划批量保存明细
            }else if(this.type=='byjh'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'byjhmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
                //测试计划批量保存明细
            }else if(this.type=='csjh'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'dmzbjcjhmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
                //批量新增化验计划明细
            }else if(this.type=='hyjh'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'hyjhmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
                //批量新增巡检计划明细
            }else if(this.type=='xjjh'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'xjjhmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
                //批量新增装备维修申请明细
            }else if(this.type=='wxsq'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'zbwxsqmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
                //批量新增装备保养申请明细
            }else if(this.type=='bysq'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'zbbysqmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
                //批量新增动用使用申请明细
            }else if(this.type=='dysysq'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'dysysqmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
            }else if(this.type=='zdxx'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'zdxx/plAdd',
                    //ajax中data参数
                    data: {
                        ZBSL_ID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
            }else if(this.type=='qlsq'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'qcqlsqzb/plAdd',
                    //ajax中data参数
                    data: {
                        QCQLSQ_ID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
            }else if(this.type=='tybfjh'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'tybfmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:ZBSLID,
                        tm: new Date().getTime()
                    },
                    //data类型
                    dataType: "json",
                    //成功回调函数
                    success: function (data) {
                        message('success', '保存成功', 1000);
                        setTimeout(function () {
                            top.Dialog.close();//关闭弹窗
                        }, 1000);
                    }
                }).done().fail(function () {
                });
            }
        },
        //重置
        rest() {
            vm.keyWords = '';
            vm.getData();
        },
    },

    //初始化创建
    mounted() {
        this.init();
    },
})

// ElementUI懒加载
var dom = document.querySelector(".el-table__body-wrapper");
dom.addEventListener("scroll",function(){
    const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight;
    if(scrollDistance <= 0){
        if(vm.currentPage*vm.pageSize<vm.currentTotal){
            vm.getData("lazy");
        }

    }
})
