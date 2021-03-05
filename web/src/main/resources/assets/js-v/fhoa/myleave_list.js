var httpurl = httpurlOa;
var vm = new Vue({
	el: '#app',
	data:{
        //list
		varList: [],
        //分页类
		page: [],
        //关键词
		KEYWORDS: '',
        //类型
		TYPE: '',
        //每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		showCount: -1,
        //当前页码
		currentPage: 1,
		add:false,
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
    		this.getDic();
        },

        //获取列表
        getList: function(){
        	this.loading = true;
        	this.TYPE = null == $("#TYPE").val()?'':$("#TYPE").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'myleave/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {KEYWORDS:this.KEYWORDS,TYPE:this.TYPE,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        			$("input[name='ids']").prop("checked", false);
        		 }else if ("exception" == data.result){
                 	showException("请假管理",data.exception);
                 }
        		}
        	}).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },

    	//新增
    	goAdd: function (){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="请假申请";
    		 diag.URL = '../../fhoa/myleave/myleave_edit.html';
    		 diag.Width = 800;
    		 diag.Height = 450;
    		 diag.Modal = true;
    		 diag. ShowMaxButton = false;
    	     diag.ShowMinButton = true;
    		 diag.CancelEvent = function(){
    			 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 $("#fh-table").tips({
    						side:3,
    			            msg:'已创建请假单,请到待办任务中提交申请',
    			            bg:tipsColor,
    			            time:3
    			     });
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
            			url: httpurl+'myleave/delete',
            	    	data: {MYLEAVE_ID:id,tm:new Date().getTime()},
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
    							url: httpurl+'myleave/deleteAll?tm='+new Date().getTime(),
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

    	//调用数据字典(请假类型)
    	getDic: function(){
    		$.ajax({
    			xhrFields: {
                    withCredentials: true
                },
    			type: "POST",
    			url: httpurl+'dictionaries/getLevels',
                //请假类型
    	    	data: {DICTIONARIES_ID:'6d30b170d4e348e585f113d14a4dd96d',tm:new Date().getTime()},
    			dataType:'json',
    			success: function(data){
    				$("#TYPE").html('<option value="" >请假类型</option>');
    				 $.each(data.list, function(i, dvar){
    					 $("#TYPE").append("<option value="+dvar.NAME+">"+dvar.NAME+"</option>");
    				 });
                    //遍历全部数据
                    vm.getList();
    			}
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
        	var keys = 'myleave:add,myleave:del';
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
        			vm.add = data.myleavefhadminadd;
        			vm.del = data.myleavefhadmindel;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);
                 }
        		}
        	})
        },

        // formatDate: function (time){
        //     var date = new Date(time);
        //     return initDateTime(date);
        // },

        /**
         * 重置检索条件方法
         */
        rest: function () {
            //关键词清空
            vm.KEYWORDS = '';
            //分页跳转至第一页
            this.nextPage(1);
            vm.getDic();
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
