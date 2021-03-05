


var vm = new Vue({
	el: '#app',

	data:{
		varList: [],	//好友list
		groupList:[],	//分组列表
		page: [],		//分页类
		pd: [],			//map
		FGROUP_ID: '',	//分组ID
		httpurl:'',
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		del:false,
		edit:false,
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
        	this.httpurl = httpurl;
        	this.getGroupList();
    		this.getList();
        },

        //获取列表
        getList: function(){
        	this.loading = true;
        	this.pd.lastStart = $("#lastStart").val();
           	this.pd.lastEnd = $("#lastEnd").val();
           	this.FGROUP_ID = $("#FGROUP_ID").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'friends/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {keywords:this.pd.keywords,lastStart:this.pd.lastStart,lastEnd:this.pd.lastEnd,FGROUP_ID:this.FGROUP_ID,tm:new Date().getTime()},
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
                 	showException("好友管理",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },

        //分组列表
        getGroupList: function(){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'fgroup/getFgroup',
            	data: {tm:new Date().getTime()},
        		dataType:'json',
        		success: function(data){
        			vm.groupList = data.list;
        		}
        	});
        },

    	//修改
    	goEdit: function(id){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="编辑";
    		 diag.URL = '../../fhim/friends/friends_edit.html?FRIENDS_ID='+id;
    		 diag.Width = 399;
    		 diag.Height = 155;
    		 diag.Modal = true;				//有无遮罩窗口
    		 diag.CancelEvent = function(){ //关闭事件
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
    	},

    	//删除
    	goDel: function (Id,FUSERNAME){
    		this.$confirm("确定要删除吗?", '提示', {
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
    					url: httpurl+'friends/deletefromlist',
    			    	data: {FRIENDS_ID:Id,tm:new Date().getTime()},
    					dataType:'json',
    					success: function(data){
    						 if("success" == data.result){
    							 top.removeFriendByI(FUSERNAME); 		//从自己好友栏移除  此方法在WebRoot\assets\js-v\fhim.js页面中
    							 top.removeFriendFromMobile(FUSERNAME);	//从自己手机好友栏里面删除对方
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
    				var nstr = '';
    				for(var i=0;i < document.getElementsByName('ids').length;i++){
    					if(document.getElementsByName('ids')[i].checked){
    					  	if(str=='') str += document.getElementsByName('ids')[i].value;
    					  	else str += ',' + document.getElementsByName('ids')[i].value;
    					  	if(nstr=='') nstr += document.getElementsByName('ids')[i].title;
    					  	else nstr += ',' + document.getElementsByName('ids')[i].title;
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
    						var arrid = nstr.split(',');
    						for(var n=0;n<arrid.length;n++){
    							top.removeFriendByI(arrid[n]); //从自己好友栏移除  此方法在WebRoot\assets\js-v\fhim.js页面中
    						}
    						$.ajax({
    							xhrFields: {
    	                            withCredentials: true
    	                        },
    							type: "POST",
    							url: httpurl+'friends/deleteAll?tm='+new Date().getTime(),
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

    	//拉黑
    	pullblack: function (Id,FUSERNAME){
			this.$confirm('确定要拉黑吗?拉黑后也会在对方好友栏删除您', '提示', {
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
    					url: httpurl+'friends/pullblackfromlist',
    			    	data: {FRIENDS_ID:Id,FUSERNAME:FUSERNAME,tm:new Date().getTime()},
    					dataType:'json',
    					success: function(data){
    						 if("success" == data.result){
    							 top.removeFriendByI(FUSERNAME); 		//从自己好友栏移除  此方法在WebRoot\assets\js-v\fhim.js页面中
    							 top.removeIFromFriend(FUSERNAME);		//从对方好友栏里面删除自己
    							 top.removeFriendFromMobile(FUSERNAME);	//从自己手机好友栏里面删除对方

								 message('success', '拉黑成功!已经从列表中删除!', 1000);
    						 }
    						 vm.getList();
    					}
    				});

    	    });
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
        	var keys = 'friends:del,friends:edit';
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
        			vm.del = data.friendsfhadmindel;
        			vm.edit = data.friendsfhadminedit;
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
