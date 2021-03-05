
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
		//添加权限
		add:false,
		//删除权限
		del:false,
		//修改权限
		edit:false,
		cha:false,
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
        		url: httpurl+'procdef/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
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
                 	showException("流程管理",data.exception);
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
    	goDel: function (id){
    		this.$confirm("确定要删除吗?它所关联的所有数据,包括任务和历史流程全部会被删除", '提示', {
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
            			url: httpurl+'procdef/delete',
            	    	data: {DEPLOYMENT_ID_:id,tm:new Date().getTime()},
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
    							url: httpurl+'procdef/deleteAll?tm='+new Date().getTime(),
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

    	//激活 or 挂起
    	onoff: function (ID_,STATUS,ofid,VSID){
    		this.loading = true;
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'procdef/onoffPro?tm='+new Date().getTime(),
    	    	data: {ID_:ID_,STATUS:STATUS},
    			dataType:'json',
    			success: function(data){
    				vm.loading = false;
    				if("success" == data.result){
    					 if(STATUS == '1'){
    						 $("#"+ofid).tips({
    								side:3,
    					            msg:'激活成功',
    					            bg:tipsColor,
    					            time:2
    					        });
    						 $("#offing1"+VSID).hide();
    						 $("#oning1"+VSID).show();
    						 $("#STATUS"+VSID).html('<font color="#87B87F">已激活</font><div class="spinner-grow spinner-grow-sm" style="padding-top:-2px;" role="status"><span class="sr-only">..</span></div>');
    					 }else{
    						 $("#"+ofid).tips({
    								side:3,
    					            msg:'已经挂起',
    					            bg:tipsColor,
    					            time:2
    					        });
    						 $("#offing1"+VSID).show();
    						 $("#oning1"+VSID).hide();
    						 $("#STATUS"+VSID).html('<font color="red">已挂起</font>');
    					 }
    				 }
    			}
    		});
    	},

    	//映射模型
    	addModel: function (processDefinitionId,czid){
    		this.loading = true;
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'fhmodel/saveModelFromPro?tm='+new Date().getTime(),
    	    	data: {processDefinitionId:processDefinitionId},
    			dataType:'json',
    			success: function(data){
    				vm.loading = false;
    				if("success" == data.result){
    					 $("#"+czid).tips({
    							side:3,
    				            msg:'映射成功,可以去模型列表查看',
    				            bg:tipsColor,
    				            time:2
    				        });
    				 }else{
    					 $("#"+czid).tips({
    							side:3,
    				            msg:'映射失败!',
    				            bg:tipsColor,
    				            time:2
    				        });
    				 }
    			}
    		});
    	},

    	//预览Xml
    	goViewXml: function (DEPLOYMENT_ID_,FILENAME){
    		var diag = new top.Dialog();
    		diag.Drag=true;
    		diag.Title ="预览XML";
    		diag.URL = '../../act/procdef/xml_view.html?DEPLOYMENT_ID_='+DEPLOYMENT_ID_+'&FILENAME='+encodeURI(encodeURI(FILENAME));
    		diag.Width = 1000;
    		diag.Height = 608;
    		diag.Modal = true;
    		diag.ShowMinButton = true;
    		diag. ShowMaxButton = true;
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

    	//预览Png
    	goViewPng: function (DEPLOYMENT_ID_,FILENAME){
    		var diag = new top.Dialog();
    		diag.Drag=true;
    		diag.Title ="预览流程图";
    		diag.URL = '../../act/procdef/png_view.html?DEPLOYMENT_ID_='+DEPLOYMENT_ID_+'&FILENAME='+encodeURI(encodeURI(FILENAME));
    		diag.Width = 800;
    		diag.Height = 460;
    		diag.Modal = true;
    		diag.ShowMinButton = true;
    		diag. ShowMaxButton = true;
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

    	//导入流程
    	uploadPro: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="导入流程";
    		 diag.URL = '../../act/procdef/procdef_upload.html';
    		 diag.Width = 600;
    		 diag.Height = 168;
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

      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'procdef:add,procdef:del,procdef:edit,procdef:cha';
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
        			vm.add = data.procdeffhadminadd;
        			vm.del = data.procdeffhadmindel;
        			vm.edit = data.procdeffhadminedit;
        			vm.cha = data.procdeffhadmincha;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);
                 }
        		}
        	})
        },

        //下载
        downloadModel: function (DEPLOYMENT_ID_){
			this.$confirm('确定要下载模型文件吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				cancelButtonClass: 'el-button--info',
			}).then(() => {
				window.location.href = httpurl + 'procdef/download?DEPLOYMENT_ID_='+DEPLOYMENT_ID_;
			}).catch(() => {
			});
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
            //结束时间清空
            $("#ENDTIME").val('');
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
