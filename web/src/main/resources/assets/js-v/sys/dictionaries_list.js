

var vm = new Vue({
	el: '#app',
	
	data:{
        //数据字典遍历
		varList: [],
        //分页类
		page: [],
        //检索条件 关键词
		keyWords: '',
        //主键ID
		DICTIONARIES_ID: '0',
        //下拉检索用, 当为''时是全部检索
		ALL_ID:	'0',
        //上级ID
		PARENT_ID: '0',
        //操作类型，检索or上级点击进入 1or2
		TYPE: 1,
        //每页显示条数
		showCount: -1,
        //当前页码
		currentPage: 1,
		//权限标识
		add:false,
		del:false,
		edit:false,
        //加载状态
		loading:false
    },
    
	methods: {
		
        //初始执行
        init() {
            //链接参数, 从树点过来
        	var id = getUrlKey('id');
        	if(null != id){
        		this.DICTIONARIES_ID = id;
        	}
    		this.getList(this.DICTIONARIES_ID,1);
        },
        
        
        //获取列表
        getList: function(DICTIONARIES_ID,TYPE){
        	this.loading = true;
        	this.TYPE = TYPE;
        	if(TYPE == 1){
        		this.DICTIONARIES_ID = DICTIONARIES_ID;
        	}else if('' == this.ALL_ID){
            	this.DICTIONARIES_ID = '';
        	}
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'dictionaries/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {DICTIONARIES_ID:this.DICTIONARIES_ID,keyWords:this.keyWords,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 if(TYPE == 1 || '' != vm.ALL_ID){
        				 	vm.PARENT_ID = data.PARENT_ID;
               			 	vm.ALL_ID = vm.DICTIONARIES_ID;
             	     }else{
             	    	vm.DICTIONARIES_ID = '0';
         	        	vm.PARENT_ID = '0';
             	     }
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("数据字典",data.exception);//显示异常
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
            var id = getUrlKey('id');
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="新增数据字典";
			 diag.URL = '../dictionaries/dictionaries_edit.html?PARENT_ID='+id;
			 diag.Width = 800;
			 diag.Height = 600;
            //关闭事件
			 diag.CancelEvent = function(){
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList(vm.DICTIONARIES_ID,1);
                     //刷新父页面
                     parent.initTree();
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
		
		//修改
		goEdit: function (DICTIONARIES_ID){
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="编辑数据字典";
			 diag.URL = '../dictionaries/dictionaries_edit.html?PARENT_ID='+this.DICTIONARIES_ID+'&DICTIONARIES_ID='+DICTIONARIES_ID;
			 diag.Width = 800;
			 diag.Height = 500;
            //关闭事件
			 diag.CancelEvent = function(){
				 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList(vm.DICTIONARIES_ID,1);
                     //刷新父页面
                     parent.initTree();
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
		goDel: function (Id){
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
	        			url: httpurl+'dictionaries/delete',
	        	    	data: {DICTIONARIES_ID:Id,tm:new Date().getTime()},
	        			dataType:'json',
	        			success: function(data){
	        				 if("success" == data.result){
	        					 message('success', '已经从列表中删除!', 1000);
	        					 vm.getList(vm.DICTIONARIES_ID,1);
                                 //刷新父页面
                                 parent.initTree();
	        				 }else if("error" == data.result){
	        					message('warning', '删除失败！请先删除子级或删除占用资源!', 1000);
	        					vm.loading = false;
	        				 }else{
								message('warning', '删除失败！排查表不存在或其表中没有BIANMA字段!', 1000);
								
	        					vm.loading = false;
	        				 }
	        			}
	        		});
				}).catch(() => {

                });
		},

      	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'dictionaries:add,dictionaries:del,dictionaries:edit';
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
        			vm.add = data.dictionariesfhadminadd;
        			vm.del = data.dictionariesfhadmindel;
        			vm.edit = data.dictionariesfhadminedit;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },

	    //-----分页必用----start
	    nextPage: function (page){
	    	this.currentPage = page;
	    	this.getList(this.DICTIONARIES_ID,this.TYPE);
	    },
	    changeCount: function (value){
            this.currentPage = 1;
	    	this.showCount = value;
	    	this.getList(this.DICTIONARIES_ID,this.TYPE);
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
