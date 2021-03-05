/*资产管理退役报废计划明细列表URL*/

//创建退役报废计划明细vue
var vm = new Vue({
	el: '#app',
	
	data:{
        //退役报废主键id
        TYBF_ID:'',
		varList: [],
        //分页类
		page: [],
        //检索条件,关键词
        keyWords:'',
        //每页显示条数
		showCount: -1,
        //当前页码
		currentPage: 1,
        //添加权限
        add: false,
        //删除权限
        del: false,
        //修改权限
        edit: false,
        //导出到excel权限
        toExcel: false,
        //加载状态
        loading: false,
        // 用来判断是view还是edit传值
        type: '',
    },
    watch: {
        varList() {
            this.initDateControl();
        }
    },
	methods: {

        //初始执行
        init() {
            //当接收过来的TYBF_ID不为null时,表示此页面是修改进来的
            var FID = getUrlKey('TYBF_ID');
            if (null != FID) {
                this.TYBF_ID = FID;
            }

            //当接收过来的type不为null时,表示此页面是view页面
            var type = getUrlKey('type');
            if (null != type) {
                this.type = type;
            }

        	//复选框控制全选,全不选
    		$('#zcheckbox').click(function(){
                if (this.checked) {
                    $("input[name='ids']").prop("checked", true);
	    		 }else{
	    			$("input[name='ids']").prop("checked", false);
	    		 }
    		});
    		this.getList();
        },

        //初始化时间控件
        initDateControl: function () {
            setTimeout(function () {
                $(".date-picker").each(function () {
                    $(this).datepicker({
                        format: "yyyy-mm-dd",
                        language: 'zh-CN',
                        autoclose: true,
                        todayHighLight: "linked"
                    });
                });
            }, 200);
        },

        /**
         * 用来判断遮罩层是否显示
         */
        tybffxs: function () {
            $("#app").hide();
            $("#jiazai").show();
        },

        /**
         * 获取退役报废计划明细列表
         */
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'tybfmx/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {
        			keyWords:this.keyWords,
                    TYBF_ID:this.TYBF_ID,
					tm:new Date().getTime()},
        		dataType:"json",
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
                 	showException("退役报废明细",data.exception);
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
         * 新增退役报废计划明细
         */
        goAdd: function () {
            //创建物资IDS数组
            var WZKCIDS = [];
            //将本页面的物资ID放到物资ids数组中
            for (var i = 0; i < this.varList.length; i++) {
                WZKCIDS.push(this.varList[i].WZKC_ID);
            }
            var diag = new top.Dialog();
            diag.Drag=true;
            diag.Title ="选择物资";
            diag.URL = '../../zcgl/xzwz/zcgl_xzwz.html?JHID=' + this.TYBF_ID+'&type=tybf'+'&WZKCIDS='+WZKCIDS;
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
                vm.getList();
                diag.close();
            };
            diag.show();
        },

        /**
         * 批量操作退役报废计划明细
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
                    bg: tipsColor,
                    time:3
                });
                message('warning', '您没有选择任何内容!', 1000);
                return;
            }else{
                if(msg == '确定要删除选中的数据吗?'){
                    this.loading = true;
                    $.ajax({
                        xhrFields: {
                            withCredentials: true
                        },
                        type: "POST",
                        url: httpurl+'tybfmx/deleteAll?tm='+new Date().getTime(),
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
         * 删除退役报废计划明细
         * @param id 退役报废计划id、
         */
    	goDel: function (id){
            this.$confirm('确定要删除吗?', '提示', {
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
            			url: httpurl+'tybfmx/delete',
            	    	data: {TYBFMX_ID:id,tm:new Date().getTime()},
            			dataType:'json',
            			success: function(data){
            				 if("success" == data.result){
                                 message('success', '已经从列表中删除!', 1000);
            				 }
            				 vm.getList();
            			}
            		});
            });
    	},


        //自动保存方法
        updateRow: function (bs,row) {
            if (bs == 'wzbh') {
                //赋值物资编号
                row.WZBH = $("#WZBH option:selected").text().trim();
            }

            if (bs == 'wzmc') {
                //赋值物资名称
                row.WZMC = $("#WZMC option:selected").text().trim();
            }

            if(bs == 'jldw') {
                //赋值计量单位
                row.JLDW = $("#JLDW option:selected").text().trim();
            }
            if(bs == 'zrr') {
                //赋值责任人
                row.ZRR = $("#ZRR option:selected").text().trim();
            }
            // if(bs == 'bfyy') {
            //     //赋值报废原因
            //     row.BFYY = $("#BFYY option:selected").text().trim();
            // }
            if(bs == 'bfrq') {
                //赋值报废日期
                row.BFRQ = $("#BFRQ option:selected").text().trim();
            }
            if(bs == 'djrq') {
                //赋值登记日期
                row.DJRQ = $("#DJRQ option:selected").text().trim();
            }


            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'tybfmx/updateRow',
                data: row,
                dataType: 'json',
                success: function (data) {
                    if ("success" == data.result) {
                        // vm.getList();
                    }
                }
            });
        },

        //报废日期改变事件
        onChange: function (obj, row) {
            setTimeout(function () {
                row.BFRQ = obj.target.value;
                vm.updateRow('', row);
            }, 200);
        },



        //判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'tybfmx:add,tybfmx:del,tybfmx:edit,toExcel';
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
        			vm.add = data.tybfmxfhadminadd;
                     //删除权限
        			vm.del = data.tybfmxfhadmindel;
                     //修改权限
        			vm.edit = data.tybfmxfhadminedit;
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
         * 导出退役报废计划明细到excel
         */
		goExcel: function (){
            this.$confirm('确定要导出到excel吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                	window.location.href = httpurl+'tybfmx/excel';
            }).catch(() => {

            });
		},
        
        //-----分页必用----start
        nextPage: function (page){
        	this.currentPage = page;
        	this.getList();
        },
        changeCount: function (value){
            this.currentPage = 1;
        	this.showCount = value;
        	this.getList();
        },
        toTZ: function (){
        	var toPaggeVlue = document.getElementById("toGoPage").value;
        	if(toPaggeVlue == ''){document.getElementById("toGoPage").value=1;return;}
        	if(isNaN(Number(toPaggeVlue))){document.getElementById("toGoPage").value=1;return;}
        	this.nextPage(toPaggeVlue);
        },

        /**
         * 父页面调用 用于判断是否存在明细数据
         * @returns {boolean}
         */
        emptyVarList: function () {
            var flag = vm.varList[0] != null;
            return flag;
        },
       //-----分页必用----end
		
	},
	
    //初始化
	mounted(){
        this.init();
    }
})