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
        JHID:'',
        type:'',
        WZKCIDS:[]
    },

    methods: {
        //初始执行
        init() {
            //获取JHID用来跟计划主表关联查询
            this.JHID = getUrlKey('JHID');
            //获取是计划类型
            this.type = getUrlKey('type');
            //获取列表传来的物资库存ids
            this.WZKCIDS = getUrlKey('WZKCIDS');
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
                url: httpurl + 'wzdj/getWzkcList' ,
                data: {
                    WZKCIDS : this.WZKCIDS,
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
                        showException("物资库存", data.exception);
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
            var WZKCIDS = [];
            var WZKCID;
            for (var i = 0; i < this.centerSelection.length; i++) {
                //将物资IDpush到WZKCIDS中
                WZKCIDS.push(this.centerSelection[i].WZKC_ID);
            }
            //将数组转换为逗号分割字符串
            WZKCID = WZKCIDS.join(',');
            //退役报废批量保存明细
            if(this.type=='tybf'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    url: httpurl + 'tybfmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:WZKCID,
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
            } else if(this.type=='wzjj'){
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    //ajax 类型
                    type: "POST",
                    //ajax url
                    url: httpurl + 'wzjjmx/plAdd',
                    //ajax中data参数
                    data: {
                        JHID:this.JHID,
                        DATA_IDS:WZKCID,
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
