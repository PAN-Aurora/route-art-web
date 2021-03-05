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
        //物资分类内码
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


            //光标默认放在扫码文本框内
            $("#qcode").focus();

            //调用查询物资登记数据方法
            this.getList();
        },

        //选择办理人
        getUser: function (index){
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
                var DEPT_ID = diag.innerFrame.contentWindow.document.getElementById('DEPT_ID').value;
                var DEPT_NAME = diag.innerFrame.contentWindow.document.getElementById('DEPT_NAME').value;
                if("" != NAME){
                    //刷新行
                    vm.$set(vm.varList[index],'ZRR' ,NAME);
                    vm.$set(vm.varList[index],'ZRRNM' ,USER_ID);
                    //用户所属部门为空时 默认当前用户所在部门
                    // if (vm.varList[index].SSBMNM==undefined ||vm.varList[index].SSBM==undefined ) {
                        //所属单位赋值
                        vm.$set(vm.varList[index],'SSBM' ,DEPT_NAME);
                        vm.$set(vm.varList[index],'SSBMNM' ,DEPT_ID);
                    // }
                    //更新行
                    vm.editWzdj(index);
                }
                diag.close();
            };
            diag.show();
        },

        //选择部门
        getSsbm: function (index) {
            //调用公共页面跳转方法 回调获取单位名称
            oudwTreeSelect(0, function (e) {
                if (e != null) {
                    //刷新行
                    vm.$set(vm.varList[index],'SSBM' , e.dwmc);
                    vm.$set(vm.varList[index],'SSBMNM' ,e.dwnm);
                    //更新行
                    vm.editWzdj(index);
                }
            });
        },

        //单元格点击后，显示input，并让input 获取焦点
        handleCellClick: function (a_id,b_id) {
            document.getElementById(a_id).style.display = "block";
            document.getElementById(a_id).focus();
            document.getElementById(b_id).style.display = "none";
        },

        //input框失去焦点事件
        handleInputBlur: function (index,a_id,b_id) {
            document.getElementById(a_id).style.display = "block";
            document.getElementById(b_id).style.display = "none";
            //当失去焦点时进行修改操作
            this.editWzdj(index);
        },


        //修改物资登记数据
        editWzdj: function (index) {
            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzdj/edit',
                data: {
                    WZDJ_ID: this.varList[index].WZDJ_ID,
                    ZRR: this.varList[index].ZRR,
                    ZRRNM: this.varList[index].ZRRNM,
                    SSBM: this.varList[index].SSBM,
                    SSBMNM: this.varList[index].SSBMNM,
                    BZ: this.varList[index].BZ,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {

                    } else if ("exception" == data.result) {
                        //保存失败，将span置空
                        showException("物资登记", data.exception);
                        $("#showform").show();
                        $("#jiazai").hide();
                    } else {
                        //刷新数据
                        vm.getList();
                        message('warning', '数据更新失败!', 1000);
                    }
                }
            }).done().fail(function () {
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                $("#showform").show();
                $("#jiazai").hide();
            });
        },

        //完成登记
        goEdit: function (WZDJ_ID,row) {
            //物资编号验证
            if(row.WZBH == null || row.WZBH == '' || row.WZBH == undefined ){
                message('warning', '物资编号未填写!', 1000);
                return;
            }
            //责任人验证
            if( row.ZRR == null || row.ZRR == '' || row.ZRR == undefined){
                message('warning', '责任人未填写!', 1000);
                return
            }
            //发送 post 请求提交保存
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzdj/goEdit',
                data: {
                    WZDJ_ID: WZDJ_ID,
                    tm: new Date().getTime()
                },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        message('success', '登记成功！', 1000);
                        vm.getList();
                    } else if ("exception" == data.result) {
                        showException("物资登记", data.exception);
                        $("#showform").show();
                        $("#jiazai").hide();
                    }
                }
            }).done().fail(function () {
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                $("#showform").show();
                $("#jiazai").hide();
            });
        },


        /**
         * 非空校验
         */
        validateData: function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzdj/validateData?tm=' + new Date().getTime(),
                //data参数
                data: {WZCG_ID: this.WZCG_ID},
                dataType: 'json',
                //ajax回调函数
                success: function (data) {
                    if (data.result) {
                        //完成登记
                        vm.complete();
                    } else if (!data.result) {
                       return  message('warning', '物资编号、责任人、所属部门为必填项', 1000);
                    } else if ("exception" == data.result) {
                        showException("物资登记", data.exception);
                    }
                }
            }).done().fail(function () {
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                $("#showform").show();
                $("#jiazai").hide();
            });

        },

        /**
         * 完成登记
         */
        complete: function () {
                //设置loading为true
                this.loading = true;
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl + 'wzdj/complete?tm=' + new Date().getTime(),
                    //data参数
                    data: {WZCG_ID: this.WZCG_ID},
                    dataType: 'json',
                    //ajax回调函数
                    success: function (data) {
                        if ("success" == data.result) {
                            message('success', '登记成功', 1000);
                            location.href = '../../zcgl/wzdj/wzdj_list.html';
                        } else if ("exception" == data.result) {
                            showException("物资登记", data.exception);
                            $("#showform").show();
                            $("#jiazai").hide();
                        }
                    }
                }).done().fail(function () {
                    swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                    $("#showform").show();
                    $("#jiazai").hide();
                });

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
            //物资分类
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
                      $("input[name='ids']").prop("checked", false);
                        $("input[id='zcheckbox']").prop("checked", false);
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

        // 显示二维码信息
        showMxCode: function (mxid,mxmc) {
            var img = "<img src='" + httpurl + "wzdj/getWzdjmxCode?MXID=" + mxid +'&MXMC='+ mxmc + "' />";
            layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                anim: 5,
                area: ['200px','200px'],
                skin: 'layui-layer-nobg',
                shadeClose: true,
                content: img,
            });
        },

      /*  showQRCode: function () {
            //遍历选中的数据
            var strData = '';
            for (var i = 0; i < document.getElementsByName('ids').length; i++) {
                if (document.getElementsByName('ids')[i].checked) {

                    if (strData == '') {
                        strData += vm.varList[i].WZDJ_ID;
                        strData += ',' + vm.varList[i].WZMC;
                    }else{
                        strData += '|' + vm.varList[i].WZDJ_ID;
                        strData += ',' + vm.varList[i].WZMC;
                    }
                }
            }

            //如果数据为空，提示
            if (strData == '') {
                //message提示框
                message('warning', '您没有选择任何内容!', 1000);
                return;
            } else {
                var diag = new top.Dialog();
                //传值
                sessionStorage.setItem("param", strData);
                diag.Drag=true;
                diag.Title ="二维码图片列表";
                diag.URL = '../../zcgl/wzdj/wzdj_qrcode.html';
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
                    //删除生成二维码图片
                    vm.deleteQrCode();
                    diag.close();
                };
                diag.show();
            }
        },*/

      showQRCode: function () {

          if(document.getElementsByName('ids').length>100){
              //message提示框
              message('warning', '二维码数据生成条数不得高于100条', 1000);
              return;
            }

            //遍历选中的数据
            var strData = '';
            for (var i = 0; i < document.getElementsByName('ids').length; i++) {
                if (document.getElementsByName('ids')[i].checked) {

                    if (strData == '') {
                        strData += vm.varList[i].WZDJ_ID;
                        strData += ',' + vm.varList[i].WZMC;
                    }else{
                        strData += '|' + vm.varList[i].WZDJ_ID;
                        strData += ',' + vm.varList[i].WZMC;
                    }
                }
            }

            //如果数据为空，提示
            if (strData == '') {
                //message提示框
                message('warning', '您没有选择任何内容!', 1000);
                return;
            } else {

                var img = "<img src='" + httpurl + "wzdj/generateQRCodeByCgid?param=" + strData + "'/>";
                layer.open({
                    title:'二维码',
                    type: 1,
                    // closeBtn: 1,
                    // anim: 5,
                    area: ['300px', '345px'],
                    skin: 'layui-layer-nobg',
                    shadeClose: true,
                    content: img,
                    cancel: function (index, layero) {
                        // vm.deleteQrCode();
                    }
                });

                //     var diag = new top.Dialog();
                //     //传值
                //     sessionStorage.setItem("param", strData);
                //     diag.Drag=true;
                //     diag.Title ="二维码图片列表";
                //     diag.URL = '../../zcgl/wzdj/wzdj_qrcode.html';
                //     diag.Width = 1200;
                //     diag.Height = 695;
                //     //有无遮罩窗口
                //     diag.Modal = true;
                //     //最大化按钮
                //     diag. ShowMaxButton = true;
                //     //最小化按钮
                //     diag.ShowMinButton = true;
                //     //关闭事件
                //     diag.CancelEvent = function(){
                //         //删除生成二维码图片
                //         vm.deleteQrCode();
                //         diag.close();
                //     };
                //     diag.show();
                // }
            }
        },

        //批量修改
        editAll: function () {
            //遍历选中的数据
            var strData = '';
            for (var i = 0; i < document.getElementsByName('ids').length; i++) {
                if (document.getElementsByName('ids')[i].checked) {

                    if (strData == '') {
                        strData += vm.varList[i].WZDJ_ID;
                    }else{
                        strData += ',' + vm.varList[i].WZDJ_ID;
                    }
                }
            }

            //如果数据为空，提示
            if (strData == '') {
                //message提示框
                message('warning', '您没有选择任何内容!', 1000);
                return;
            } else {

                //传值
                sessionStorage.setItem("IDS", strData);
                var diag = new top.Dialog();
                diag.Drag=true;
                diag.Title ="批量修改";
                diag.URL = '../../zcgl/wzdj/wzdj_edit_all.html';
                diag.Width = 800;
                diag.Height = 180;
                //关闭事件
                diag.CancelEvent = function(){
                    var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
                    if(varSon != null && varSon.style.display == 'none'){
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
            }
        },

        //窗口关闭时删除生成的二维码图片
        deleteQrCode: function () {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzdj/deleteQrCode',
            })
        },

        /**
         * 返回按钮
         */
        goBack: function () {
            window.location.href = '../../zcgl/wzdj/wzdj_list.html';
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

        //扫码自动加载数据
        handKey: function (e) {
            var evt = window.event || e;
            if (evt.keyCode == "13") {
                vm.onEnter();
            }
        },

        //扫码数据
        onEnter: function () {

            if (this.param == null || this.param == '' || this.param == undefined) {
                message('warning', '无数据!', 1000);
                return;
            }

            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzdj/qrCodeUpload',
                data: {param: this.param},
                dataType: "json",
                success: function (data) {
                    if (data.msg == "success") {
                        //刷新列表
                        vm.getList();
                        vm.param = '';
                        message('success', "扫码登记完成", 1000);
                    } else {
                        message('warning', "二维码扫描异常", 1000);
                    }
                }
            });
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
