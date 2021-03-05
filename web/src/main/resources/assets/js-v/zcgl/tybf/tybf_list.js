var vm = new Vue({
	el: '#app',
	
	data:{
        //查询下拉框
        selList: [{selId: '', selName: '--请选择--'}, {selId: '0', selName: '未提交'}, {
            selId: '1',
            selName: '审批中'
        }, {selId: '2', selName: '已完成'}, {selId: '3', selName: '已作废'}],
        //遍历资产管理——退役报废list数据
		varList: [],
        //分页类
		page: [],
		pd:[],
        //检索条件,关键词
        keyWords:'',
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
        //加载状态
		loading:false,
        //状态 提交/未提交
        ZT: '0',
    },
    
	methods: {
		
        //初始执行
        init() {
        	//复选框控制全选,全不选 
    		// $('#zcheckbox').click(function(){
	    	// 	 if($(this).is(':checked')){
	    	// 		 $("input[name='ids']").click();
	    	// 	 }else{
	    	// 		$("input[name='ids']").prop("checked", false);
	    	// 	 }
    		// });
    		this.getList();
        },

        /**
         * 获取资产管理-退役报废数据列表
         */
        getList: function(){
            this.loading = true;
            //获取开始时间、结束时间和状态
            this.pd.startTime = $("#startTime").val();
            this.pd.endTime = $("#endTime").val();
            this.ZT = $("#selZt").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'tybf/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {
        			keyWords:this.keyWords,
                    ZT: this.ZT,
                    startTime: this.pd.startTime,
                    endTime: this.pd.endTime,
					tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
                     //回显list遍历数据
        			 vm.varList = data.varList;
                     //分页
        			 vm.page = data.page;
                     //判断按钮权限，用于是否显示按钮
        			 vm.hasButton();
                     //加载状态
        			 vm.loading = false;
        			// $("input[name='ids']").prop("checked", false);
                    //  $("input[id='zcheckbox']").prop("checked", false);
        		 }else if ("exception" == data.result){
                     //显示异常
                 	showException("退役报废计划",data.exception);
                 }
        		}
        	}).done().fail(function(){
                swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },

        /**
         * 新增资产管理-退役报废计划数据
         */
    	goAdd: function (){
            location.href = '../../zcgl/tybf/tybf_edit.html';
    	},

        /**
         * 查看资产管理-退役报废计划视图页面
         */
        goView: function (id) {
            location.href = '../../zcgl/tybf/tybf_view.html?FID=' + id;
        },

        /**
         * 修改资产管理-退役报废计划数据
         * @param id  资产管理-退役报废计划ID
         */
    	goEdit: function(id){
            location.href = '../../zcgl/tybf/tybf_edit.html?FID=' + id;
    	},

        /**
         * 删除资产管理-退役报废计划数据
         * @param id  资产管理-退役报废计划ID
         */
    	goDel: function (id){
            this.$confirm('确定要删除吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then((willDelete) => {
                	this.loading = true;
                	$.ajax({
                		xhrFields: {
                            withCredentials: true
                        },
            			type: "POST",
            			url: httpurl+'tybf/delete',
            	    	data: {TYBF_ID:id,tm:new Date().getTime()},
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

       /**
        *  导出word
        *  */
        goWord: function (TYBF_ID) {
            window.location.href = httpurl + 'tybf/word?TYBF_ID='+TYBF_ID;
        },
        /**
         * 批量操作资产管理-退役报废计划数据
         * @param msg  确定要删除选中的数据吗?
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
    							url: httpurl+'tybf/deleteAll?tm='+new Date().getTime(),
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
        	var keys = 'tybf:add,tybf:del,tybf:edit,toExcel';
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
        			vm.add = data.tybffhadminadd;
                     //删除权限
        			vm.del = data.tybffhadmindel;
                     //修改权限
        			vm.edit = data.tybffhadminedit;
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
                    window.location.href = httpurl + 'tybf/excel?keyWords=' + this.keyWords + '&startTime=' + this.pd.startTime + '&endTime=' + this.pd.endTime + '&ZT=' + this.ZT;
                }).catch(() => {

                });
            } else {
                this.$confirm('确定要导出选中数据吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    cancelButtonClass: 'el-button--info',
                }).then(() => {
                    window.location.href = httpurl + 'tybf/excel?keyWords=' + this.keyWords + '&startTime=' + this.pd.startTime + '&endTime=' + this.pd.endTime + '&ZT=' + this.ZT + '&DATA_IDS=' + str;
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
    //初始化的创建
	mounted(){
        this.init();
    }
})