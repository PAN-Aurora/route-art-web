


var vm = new Vue({
	el: '#app',

	data:{
		varList: [],	//list
		page: [],		//分页类
		msg: '',		//编辑器类型
		TYPE: '',		//模版类型
		FTLNMAME: '',	//模版文件名
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		cha:false,
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
			var msg = this.getUrlKey('msg');			//编辑器类型
			var TYPE = this.getUrlKey('TYPE');			//模版类型
			var FTLNMAME = this.getUrlKey('FTLNMAME');	//模版文件名
        	if(null != msg && null != TYPE && null != FTLNMAME){
        		this.msg = msg;
        		this.TYPE = TYPE;
        		this.FTLNMAME = FTLNMAME;
        		this.getList();
        	}
        },

        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'codeeditor/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {TYPE:this.TYPE,FTLNMAME:this.FTLNMAME,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        			$("input[name='ids']").prop("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("历史模版",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },

		//还原
		reduction: function (CODEEDITOR_ID){
			this.$confirm('确定要还原吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {

                	this.loading = true;
        			var msg = "fromHistory";
        			$.ajax({
        				xhrFields: {
                            withCredentials: true
                        },
        				type: "POST",
        				url: httpurl+'codeeditor/reduction',
        		    	data: {msg:msg,CODEEDITOR_ID:CODEEDITOR_ID,type:this.TYPE,ftlNmame:this.FTLNMAME,tm:new Date().getTime()},
        				dataType:'json',
        				success: function(data){
        					vm.loading = false;
        					if("success" == data.result){
        					  $("#msg").val("yes");
							  message('success', '还原成功!', 1000);
							  setTimeout(function(){
                           		top.Dialog.close();//关闭弹窗
                               },1000);
        					 }
        				}
        			});

            });
		},

		//查看
		view: function view(Id){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="历史编辑";
			 diag.URL = '../../tools/codeeditor/codeeditor_view'+this.msg+'.html?CODEEDITOR_ID='+Id;
			 diag.Width = 900;
			 diag.Height = 600;
			 diag.Modal = true;				//有无遮罩窗口
			 diag. ShowMaxButton = true;	//最大化按钮
		     diag.ShowMinButton = true;		//最小化按钮
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

    	//删除
    	goDel: function (id){
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
            			url: httpurl+'codeeditor/delete',
            	    	data: {CODEEDITOR_ID:id,tm:new Date().getTime()},
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
    							url: httpurl+'codeeditor/deleteAll?tm='+new Date().getTime(),
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
        	var keys = 'codeeditor:cha,codeeditor:del,codeeditor:edit';
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
        			vm.cha = data.codeeditorfhadmincha;
        			vm.del = data.codeeditorfhadmindel;
        			vm.edit = data.codeeditorfhadminedit;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },

      	//根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
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
