/*资产管理物资采购明细URL*/

//创建资产管理物资采购明细vue
var vm = new Vue({
    el: '#app',
    data: {
        //物资采购id
        WZCG_ID: '',
        //物资采购明细list
        varList: [],
        //分页类
        page: [],
        //检索条件,关键词
        keyWords: '',
        //每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
        showCount: -1,
        //当前页码
        currentPage: 1,
        //增加物资采购明细权限
        add: false,
        //删除物资采购明细权限
        del: false,
        //修改物资采购明细权限
        edit: false,
        //导出物资采购明细到excel权限
        toExcel: false,
        //加载物资采购明细状态
        loading: false,
        // 用来判断是view还是edit传值
        type: '',
        pd:{CGSL:'',CGJE:''},
        //计量单位
        jldw_options: [],
        //物资分类
        wzfl_options: [],
    },

    methods: {

        //初始执行
        init() {
            //当接收过来的WZCG_ID不为null时,查询指定
            var FID = getUrlKey('WZCG_ID');
            if (null != FID) {
                this.WZCG_ID = FID;
            }

            //当接收过来的type不为null时,表示此页面是view页面
            var type = getUrlKey('type');
            if (null != type) {
                this.type = type;
            }

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
                getDict('JCXX_JLDW', function (e) {
                    vm.jldw_options = e;
                });

                getDict('ZCGL_WZFL', function (e) {
                    vm.wzfl_options = e;
                });
            }, 200);

            //调用查询资产管理-物资采购明细数据方法
            this.getList();
            this.getData();
        },

        /**
         * 获取维护物资采购列表
         */
        getList: function () {
            //loading为true
            this.loading = true;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                //ajax类型
                type: "POST",
                //ajax 的url
                url: httpurl + 'wzcgmx/list?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
                //传给后台的data参数
                data: {
                    keyWords: this.keyWords,
                    WZCG_ID: this.WZCG_ID,
                    tm: new Date().getTime()
                },
                //传值的类型
                dataType: "json",
                //成功回调函数
                success: function (data) {
                    if ("success" == data.result) {
                        //将data中的参数赋值给vm中参数
                        vm.varList = data.varList;
                        vm.page = data.page;
                        vm.hasButton();
                        vm.loading = false;
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("物资采购明细", data.exception);
                    }
                }
            }).done().fail(function () {
                //弹出提示框
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                //延迟方法
                setTimeout(function () {
                    window.location.href = "../../login.html";
                }, 2000);
            });
        },


        /**
         * 根据物资采购主键ID获取数据
         */
        getData: function(){
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl+'wzcg/goEdit',
                data: {WZCG_ID:this.WZCG_ID,tm:new Date().getTime()},
                dataType:"json",
                success: function(data){
                    if("success" == data.result){
                        //参数map
                        vm.pd = data.pd;
                    }else if ("exception" == data.result){
                        //显示异常
                        showException("资产管理-物资采购",data.exception);
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

        /**
         * 新增物资采购明细
         */
        goAdd: function () {
            //遍历物资信息
            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                //ajax类型
                type: "POST",
                //ajax url
                url: httpurl + 'wzcgmx/add',
                //传给后台的参数
                data: {
                    WZCGMX_ID: newGuid32(),
                    WZCG_ID: this.WZCG_ID,
                    WZMC: this.WZMC,
                    JLDW: this.JLDW,
                    SL: 1,
                    DJ: 1,
                    JE: 1,
                    tm: new Date().getTime()
                },
                //data类型
                dataType: "json",
                //成功后的回调函数
                success: function (data) {
                    if ("success" == data.result) {
                        vm.getList();
                        vm.getData();
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("物资采购明细", data.exception);
                        //id为showform的控件设置为show
                        $("#showform").show();
                        //id为加载的控件设置为hide
                        $("#jiazai").hide();
                    }
                }
            }).done().fail(function () {
                //message弹出框
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                //id为showform的控件设置为show
                $("#showform").show();
                //id为加载的控件设置为hide
                $("#jiazai").hide();
            });
        },

        // 父页面调用 用于判断是否存在明细数据
        emptyVarList: function () {
            var flag;
            // 当前页数据校验
            if(vm.varList.length>0){
                //循环获取修理类别
                for (var i = 0; i < vm.varList.length; i++) {
                    // 判断物资名称是否为空，如果为空，提示
                    if(vm.varList[i].WZMC==null || vm.varList[i].WZMC == ''){
                        $("#WZMC"+i).tips({
                            side:3,
                            msg:'物资名称不能为空',
                            bg:tipsColor,
                            time:2
                        });
                        //物资名称为空，不可提交
                        return false;
                    }
                    // 判断物资分类是否为空，如果为空，提示
                    if(vm.varList[i].WZFLNM==null || vm.varList[i].WZFLNM == ''){
                        $("#WZFLNM"+i).tips({
                            side:3,
                            msg:'请选择物资分类',
                            bg:tipsColor,
                            time:2
                        });
                        //物资分类为空，不可提交
                        return false;
                    }
                    // 判断单价是否为空，如果为空，提示
                    if(vm.varList[i].DJ==null || vm.varList[i].DJ == ''){
                        $("#DJ"+i).tips({
                            side:3,
                            msg:'单价不能为空',
                            bg:tipsColor,
                            time:2
                        });
                        //单价为空，不可提交
                        return false;
                    }
                    // 判断数量是否为空，如果为空，提示
                    if(vm.varList[i].SL==null || vm.varList[i].SL == ''){
                        $("#SL"+i).tips({
                            side:3,
                            msg:'数量不能为空',
                            bg:tipsColor,
                            time:2
                        });
                        //数量为空，不可提交
                        return false;
                    }
                    // 判断计量单位是否为空，如果为空，提示
                    if(vm.varList[i].JLDW==null || vm.varList[i].JLDW == ''){
                        $("#JLDW"+i).tips({
                            side:3,
                            msg:'请选择计量单位',
                            bg:tipsColor,
                            time:2
                        });
                        //计量单位为空，不可提交
                       return false;
                    }
                }
                //当前页校验后判断是否含有第二页数据 含有第二页数据时后台校验
                return vm.validateData();

            } else {
                message('warning', '您没有添加明细，不能提交!', 1000);
                return "noData";
            }
        },

        //采购明细数据校验
        validateData: function () {
            var flag;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                async:false,
                type: "POST",
                url: httpurl + 'wzcg/validateData',
                //传给后台的data参数
                data: {WZCG_ID: this.WZCG_ID, tm: new Date().getTime()},
                //传值的类型
                dataType: "json",
                //成功回调函数
                success: function (data) {
                    flag= data.result;
                }
            });
            return flag;
        },

        /**
         * 删除物资采购明细
         * @param id 物资采购明细id
         */
        goDel: function (id, index) {
            //confirm提示框
            this.$confirm('确定要删除吗?', '提示', {
                //提示框确定按钮
                confirmButtonText: '确定',
                //提示框取消按钮
                cancelButtonText: '取消',
                //提示框类型
                type: 'warning',
                //提示框cancelButtonText css样式
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                this.loading = true;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzcgmx/delete',
                //传给后台参数 维护保养id  当前时间
                data: {WZCGMX_ID: id, tm: new Date().getTime()},
                dataType: 'json',
                //成功的回调函数
                success: function (data) {
                    //如果data.result为success，成功
                    if ("success" == data.result) {
                        message('success', '已经从列表中删除!', 1000);
                        // vm.getList();
                    }
                    //加载物资采购明细列表页面
                    vm.getList();
                }
            });
        })
        },

        //表格单价、数量键盘抬起事件
        onkeyup: function (id,row) {

            //数量正则校验
            var slReg = /^-?[1-9]\d*$/;
            if (!slReg.test(row.SL)) {
                $("#"+id).tips({
                    side:3,
                    msg:'数量必须为数字！',
                    bg:tipsColor,
                    time:2
                });
                return;
            }

            //数量位数控制 最高9999
            if (row.SL>9999) {
                $("#"+id).tips({
                    side:3,
                    msg:'数量最大可填写9999',
                    bg:tipsColor,
                    time:2
                });
                row.SL = 9999;
                return;
            }

            var djReg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/;

            if (!djReg.test(row.DJ)) {
                $("#"+id).tips({
                    side:3,
                    msg:'单价必须为数字！',
                    bg:tipsColor,
                    time:2
                });
                row.DJ = 1;
            }

            var num = row.SL * row.DJ;
            row.JE = num.toFixed(2);

            //后台更新行
            this.updateRow('',row);
        },


        //自动保存方法
        updateRow: function (bs ,row,index) {

            if (bs == 'wzfl') {
                this.wzfl_options.forEach(function (item) {
                    if (row.WZFLNM == item.dictionaries_ID) {
                        row.WZFL = item.name;
                    }
                });
            }
            if(bs == 'wzmc'){
                var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
                    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                var regKg = /\s/;
                if (regKg.test(row.WZMC)) {
                    $("#WZMC"+index).tips({
                        side:3,
                        msg:'物资名称不能有空格！',
                        bg:tipsColor,
                        time:2
                    });
                    this.getList();
                    return false;
                }
                if (regEn.test(row.WZMC) || regCn.test(row.WZMC)) {
                    $("#WZMC"+index).tips({
                        side:3,
                        msg:'物资名称不能输入特殊字符！',
                        bg:tipsColor,
                        time:2
                    });
                    this.getList();
                    return false;
                }
            }else if (bs == 'sccj') {
                var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
                    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
                var regKg = /\s/;
                if (regKg.test(row.SCCJ)) {
                    $("#SCCJ").tips({
                        side:3,
                        msg:'生产厂家不能有空格！',
                        bg:tipsColor,
                        time:2
                    });
                    this.getList();
                    return false;
                }
                if (regEn.test(row.SCCJ) || regCn.test(row.SCCJ)) {
                    $("#SCCJ").tips({
                        side:3,
                        msg:'生产厂家不能输入特殊字符！',
                        bg:tipsColor,
                        time:2
                    });
                    this.getList();
                    return false;
                }
            }

            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzcgmx/updateRow',
                data: row,
                dataType: 'json',
                success: function (data) {
                    if ("success" == data.result) {
                        vm.getData();
                    }else{
                        message('warning', '数据自动更新失败', 1000);
                        vm.getList();
                    }
                }
            });
        },

        /**
         * 判断按钮权限，用于是否显示按钮
         */
        hasButton: function () {
            var keys = 'wzcgmx:add,wzcgmx:del,wzcgmx:edit,toExcel';
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'head/hasButton',
                //传给后台的data参数
                data: {keys: keys, tm: new Date().getTime()},
                //传值的类型
                dataType: "json",
                //成功回调函数
                success: function (data) {
                    //设置data.result为success 成功
                    if ("success" == data.result) {
                        //新增权限
                        vm.add = data.wzcgmxfhadminadd;
                        //删除权限
                        vm.del = data.wzcgmxfhadmindel;
                        //修改权限
                        vm.edit = data.wzcgmxfhadminedit;
                        //导出到excel权限
                        vm.toExcel = data.toExcel;
                    } else if ("exception" == data.result) {
                        //显示异常
                        showException("按钮权限", data.exception);
                    }
                }
            });
        },

        //-----分页必用----start
        nextPage: function (page) {
            this.currentPage = page;
            this.getList();
        },
        changeCount: function (value) {
            this.showCount = value;
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
        },
        //-----分页必用----end
    },

    //初始化
    mounted() {
        this.init();
    }
})
