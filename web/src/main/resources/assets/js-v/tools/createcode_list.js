


var vm = new Vue({
	el: '#app',

	data:{
		varList: [],	//list
		page: [],		//分页类
		KEYWORDS: '',	//检索条件
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		add:false,
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
    		this.getList();
        },

        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'createCode/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        			$("input[name='ids']").prop("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("代码生成器",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },

    	//启动代码生成器
    	productCode: function (CREATECODE_ID){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="代码生成器";
    		 diag.URL = '../../tools/createcode/productcode.html?CREATECODE_ID='+CREATECODE_ID;
    		 diag.Width = 900;
    		 diag.Height = 800;
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
            			url: httpurl+'createCode/delete',
            	    	data: {CREATECODE_ID:id,tm:new Date().getTime()},
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
    							url: httpurl+'createCode/deleteAll?tm='+new Date().getTime(),
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
        	var keys = 'createCode:add,createCode:del,createCode:edit';
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
        			vm.add = data.createCodefhadminadd;
        			vm.del = data.createCodefhadmindel;
        			vm.edit = data.createCodefhadminedit;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },
        //重置检索条件
        rest: function () {
            vm.KEYWORDS = '';
            //分页跳转至第一页
            this.nextPage(1);
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

	mounted(){
        this.init();
    }
})
