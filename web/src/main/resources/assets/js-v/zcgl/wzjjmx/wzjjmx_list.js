/*资产管理-物资交接明细列表URL*/

//创建物资交接明细vue
var vm = new Vue({
	el: '#app',
	
	data:{
        //物资交接主键id
        WZJJ_ID:'',
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
        //判断是view还是edit的type
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
            //当接收过来的WZJJ_ID不为null时,表示此页面是修改进来的
            var FID = getUrlKey('WZJJ_ID');
            if (null != FID) {
                this.WZJJ_ID = FID;
            }
            //接收view或者edit页面传来的值
            this.type = getUrlKey('type');
        	//复选框控制全选,全不选
    		$('#zcheckbox').click(function(){
                if (this.checked) {
                    $("input[name='ids']").prop("checked", true);
	    		 }else{
	    			$("input[name='ids']").prop("checked", false);
	    		 }
    		});
            //构造数据字典方法
            setTimeout(function () {
                getDict('JCXX_JLDW', function (e) {
                    vm.jldw_options = e;
                });
            }, 200);
            //调用查询资产管理-物资交接明细数据方法
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

        //选择办理人
        getUser: function (index){
            var diag = new top.Dialog();
            diag.Drag=true;
            diag.Title ="选择接收人";
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
                    vm.$set(vm.varList[index],'JJZRR' ,NAME);
                    vm.$set(vm.varList[index],'JJZRRNM' ,USER_ID);

                    //用户所属部门为空时 默认当前用户所在部门
                    // if (vm.varList[index].JJSSBMNM==undefined ||vm.varList[index].JJSSBM==undefined ) {
                        //所属单位赋值
                        vm.$set(vm.varList[index],'JJSSBM' ,DEPT_NAME);
                        vm.$set(vm.varList[index],'JJSSBMNM' ,DEPT_ID);
                    // }
                    //更新行
                    vm.updateRow(vm.varList[index]);
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
                    vm.$set(vm.varList[index],'JJSSBM' , e.dwmc);
                    vm.$set(vm.varList[index],'JJSSBMNM' ,e.dwnm);
                    //更新行
                    vm.updateRow(vm.varList[index]);
                }
            });
        },

        /**
         * 获取物资交接明细列表
         */
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'wzjjmx/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {
        			keyWords:this.keyWords,
                    WZJJ_ID:this.WZJJ_ID,
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
                 	showException("物资交接明细",data.exception);
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
         * 新增物资交接明细
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
                diag.URL = '../../zcgl/xzwz/zcgl_xzwz.html?JHID=' + this.WZJJ_ID+'&type=wzjj'+'&WZKCIDS='+WZKCIDS;
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
         * 删除物资交接明细
         * @param id 物资交接id
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
            			url: httpurl+'wzjjmx/delete',
            	    	data: {WZJJMX_ID:id,tm:new Date().getTime()},
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

        //交接日期改变事件
        onChange: function (obj, row) {

            setTimeout(function () {
                var jjsj =  obj.target.value;
                if( jjsj!=''&& jjsj!=undefined && row.DJRQ.substr(0,10) > jjsj ){
                   $('#'+obj.target.id).tips({
                        side: 3,
                        msg: "交接日期必须大于登记日期",
                        bg: tipsColor,
                        time: 2
                    });
                    $('#'+obj.target.id).focus();
                    obj.target.value = "";
                    return;
                }else{
                    row.JJRQ = jjsj;
                }
                vm.updateRow(row);
            }, 200);
        },

        //自动保存方法
        updateRow: function (row) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzjjmx/updateRow',
                data: row,
                dataType: 'json',
                success: function (data) {
                    if ("success" == data.result) {
                        // vm.getList();
                    }
                }
            });
        },

        /**
         * 批量操作物资交接明细
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
    							url: httpurl+'wzjjmx/deleteAll?tm='+new Date().getTime(),
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
        
      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'wzjjmx:add,wzjjmx:del,wzjjmx:edit,toExcel';
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
        			vm.add = data.wzjjmxfhadminadd;
                     //删除权限
        			vm.del = data.wzjjmxfhadmindel;
                     //修改权限
        			vm.edit = data.wzjjmxfhadminedit;
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
         * 导出物资交接明细到excel
         */
		goExcel: function (){
            this.$confirm('确定要导出到excel吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                	window.location.href = httpurl+'wzjjmx/excel';
            }).catch(() => {

            });
		},

        // 父页面调用 用于判断是否存在明细数据
        emptyVarList: function () {
            //判断是否有明细数据
            var flag = vm.varList[0] != null;
            // 如果有明细数据
            if(flag != false){
                //循环获取
                for (var i = 0; i < vm.varList.length; i++) {
                    // 判断交接责任人是否为空，如果为空，提示
                    if(vm.varList[i].JJZRR==null || vm.varList[i].JJZRR == ''){
                        $("#JJZRR"+i).tips({
                            side:3,
                            msg:'交接责任人不能为空',
                            bg:tipsColor,
                            time:2
                        });
                        //交接责任人为空，不可提交
                        flag = false;
                    }
                    // 判断交接责任人是否为空，如果为空，提示
                    if(vm.varList[i].JJSSBM==null || vm.varList[i].JJSSBM == ''){
                        $("#JJSSBM"+i).tips({
                            side:3,
                            msg:'交接部门不能为空',
                            bg:tipsColor,
                            time:2
                        });
                        //交接责任人为空，不可提交
                        flag = false;
                    }
                    // 判断交接日期是否为空，如果为空，提示
                    if(vm.varList[i].JJRQ==null || vm.varList[i].JJRQ == ''){
                        $("#JJRQ"+i).tips({
                            side:3,
                            msg:'交接日期不能为空',
                            bg:tipsColor,
                            time:2
                        });
                        //交接日期为空，不可提交
                        flag = false;
                    }
                }
            } else {
                message('warning', '您没有添加明细，不能提交!', 1000);
            }
            return flag;
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

       //-----分页必用----end
		
	},
	
    //初始化
	mounted(){
        this.init();
    }
})