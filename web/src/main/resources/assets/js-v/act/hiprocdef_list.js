
var vm = new Vue({
	el: '#app',
	data:{
        //list
		varList: [],
        //分页类
		page: [],
        //检索条件
		KEYWORDS: '',
        //每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		showCount: -1,
        //当前页码
		currentPage: 1,
		cha: false,
        //删除按钮权限
		del:false,
        //加载状态
		loading:false
    },

	methods: {
        //初始执行
        init() {
        	//复选框控制全选,全不选
    		$('#zcheckbox').click(function(){
    		 if($(this).is(':checked')){
    			 $("input[name='ids']").click();
    		 }else{
    			$("input[name='ids']").prop("checked", false);
    		 }
    		});
    		this.getList();
        },

        //获取列表
        getList: function(){
        	this.loading = true;
        	var STRARTTIME = $("#STRARTTIME").val();
        	var ENDTIME = $("#ENDTIME").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'hiprocdef/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,STRARTTIME:STRARTTIME,ENDTIME:ENDTIME,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        			$("input[name='ids']").prop("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("历史流程",data.exception);
                 }
        		}
        	}).done().fail(function(){
				message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },

    	//删除
    	goDel: function (Id){
    		this.$confirm("确定要删除吗？", '提示', {
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
					url: httpurl+'hiprocdef/delete',
					data: {PROC_INST_ID_:Id,tm:new Date().getTime()},
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

    	//批量操作
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
    						$.ajax({
    							xhrFields: {
    	                            withCredentials: true
    	                        },
    							type: "POST",
    							url: httpurl+'hiprocdef/deleteAll?tm='+new Date().getTime(),
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

    	//流程信息
    	view: function (PROC_INST_ID_,ID_,FILENAME){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="流程信息";
    		 diag.URL = '../../act/hiprocdef/hiprocdef_view.html?PROC_INST_ID_='+PROC_INST_ID_+"&ID_="+ID_+'&FILENAME='+encodeURI(encodeURI(FILENAME));
    		 diag.Width = 1200;
    		 diag.Height = 600;
    		 diag.Modal = true;
    		 diag. ShowMaxButton = true;
    	     diag.ShowMinButton = true;
    		 diag.CancelEvent = function(){
    			diag.close();
				// 显示遮罩层
                if($(top.window.document).find("div[id^='_DialogDiv']").length>0){
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
                }
    		 };
    		 diag.show();
    	},

		//查看用户
		viewUser: function (USERNAME){
			if('admin' == USERNAME){
				message('warning', '不能查看admin用户!', 1000);
				return;
			}
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="资料";
			 diag.URL = '../../sys/user/user_view.html?USERNAME='+USERNAME;
			 diag.Width = 600;
			 diag.Height = 500;
			 diag.Modal = true;
			 diag.CancelEvent = function(){
				diag.close();
				// 显示遮罩层
                if($(top.window.document).find("div[id^='_DialogDiv']").length>0){
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display","block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index",strIndex);
                }
			 };
			 diag.show();
		},

    	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'hiprocdef:del,hiprocdef:cha';
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
        			vm.del = data.hiprocdeffhadmindel;
        			vm.cha = data.hiprocdeffhadmincha;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);
                 }
        		}
        	})
        },

        formatDate: function (time){
        	var date = new Date(time);
            return formatDateUtil(date, "yyyy-MM-dd hh:mm:ss");
        },

        /**
         * 重置检索条件方法
         */
        rest: function () {
            //关键词清空
            vm.KEYWORDS = '';
            //开始时间清空
            $("#STRARTTIME").val('');
            $("#STRARTTIME").datepicker('setEndDate',null);
            //结束时间清空
            $("#ENDTIME").val('');
            $("#ENDTIME").datepicker('setStartDate',null);
            //分页跳转至第一页
            this.nextPage(1);
            //遍历全部数据
            vm.getList();
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
        }
       //-----分页必用----end
	},

	//初始化创建
	mounted(){
        this.init();
    }
})
