


var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		pd: [],			//map
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		fhSms:false,
		loading:false	//加载状态
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
    		this.pd.STATUS = 2;
    		this.pd.TYPE = 1;
    		this.getList();
        },
        
        getListByType: function(TYPE){
        	this.pd.TYPE = TYPE;
        	this.getList();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
        	this.pd.STRARTTIME = $("#STRARTTIME").val();
           	this.pd.ENDTIME = $("#ENDTIME").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'fhsms/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.pd.KEYWORDS,STRARTTIME:this.pd.STRARTTIME,ENDTIME:this.pd.ENDTIME,STATUS:this.pd.STATUS,TYPE:this.pd.TYPE,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.pd = data.pd;
        			 vm.hasButton();
        			 vm.loading = false;
        			$("input[name='ids']").prop("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("站内信",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
		//发站内信
		sendFhsms: function (USERNAME){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="站内信";
			 diag.URL = '../fhsms/send_fhsms.html?USERNAME='+USERNAME;
			 diag.Width = 700;
			 diag.Height = 619;
			 diag.Modal = true;			//有无遮罩窗口
			 diag.CancelEvent = function(){ //关闭事件
				vm.getList();
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
		
		//删除
		goDel: function (ztid,STATUS,type,Id,SANME_ID){
			this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                	this.loading = true;
	            	if(type == "1" && STATUS == '2' && $("#"+ztid).html() == '<span class="badge badge-warning">未读</span> <!---->'){
						top.vm.readFhsms();//读取站内信时减少未读总数  <!-- readFhsms()函数在 assets\js-v\index.js中 -->
					}
	            	$.ajax({
	            		xhrFields: {
                            withCredentials: true
                        },
	        			type: "POST",
	        			url: httpurl+'fhsms/delete',
	        	    	data: {FHSMS_ID:Id,tm:new Date().getTime()},
	        			dataType:'json',
	        			success: function(data){
	        				 if("success" == data.result){
								message('success', '已经从列表中删除', 1000);
								 
	        				 }
	        				 vm.getList();
	        			}
	        		});
                
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
	            	var username = '';
	    			for(var i=0;i < document.getElementsByName('ids').length;i++){
	    				  if(document.getElementsByName('ids')[i].checked){
	    				  	if(str=='') str += document.getElementsByName('ids')[i].value;
	    				  	else str += ',' + document.getElementsByName('ids')[i].value;
	    				  	if(username=='') username += document.getElementsByName('ids')[i].title;
						  	else username += ';' + document.getElementsByName('ids')[i].title;
	    				  }
	    			}
	    			if(str=='' && msg != '确定要发站内信吗?'){
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
								url: httpurl+'fhsms/deleteAll?tm='+new Date().getTime(),
						    	data: {DATA_IDS:str},
								dataType:'json',
								success: function(data){
									 if("success" == data.result){
										 top.vm.getFhsmsCount();//更新未读站内信
	    	        					 message('success', '已经从列表中删除', 1000);
	    	        				 }
									 vm.getList();
								}
							});
						}else if(msg == '确定要发站内信吗?'){
							this.sendFhsms(username);
						}
	    			}
                
            });
		},
		
		//查看信件
		viewx: function (ztid,STATUS,type,Id,SANME_ID){
			if(type == "1" && STATUS == '2' && $("#"+ztid).html() == '<span class="badge badge-warning">未读</span> <!---->'){
				$("#"+ztid).html('<span class="badge badge-success">已读</span>');
				top.vm.readFhsms();//读取站内信时减少未读总数<!-- readFhsms()函数在 assets\js-v\index.js中 -->
			}
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="站内信";
			 diag.URL = '../fhsms/fhsms_view.html?FHSMS_ID='+Id+'&TYPE='+type+'&SANME_ID='+SANME_ID+'&STATUS='+STATUS;
			 diag.Width = 800;
			 diag.Height = 500;
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮 
		     diag.Modal = true;			//有无遮罩窗口
			 diag.CancelEvent = function(){ //关闭事件
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
			 diag.URL = '../user/user_view.html?USERNAME='+USERNAME;
			 diag.Width = 600;
			 diag.Height = 319;
			 diag.Modal = true;			//有无遮罩窗口
			 diag.CancelEvent = function(){ //关闭事件
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
        	var keys = 'fhSms';
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
        			vm.fhSms = data.fhSms;			//站内信按钮权限		
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
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
	
	mounted(){
        this.init();
    }
})
