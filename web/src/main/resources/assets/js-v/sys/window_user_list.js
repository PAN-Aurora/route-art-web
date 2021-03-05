

var vm = new Vue({
	el: '#app',
	
	data:{
		roleList: [],	//角色list
		varList: [],	//用户list
		page: [],		//分页类
		pd: [],			//map
		ROLE_ID: '',	//角色ID
		USERNAME: '',	//用户名
        USER_ID: '',	//用户ID
        DEPT_ID: '',	//部门内码
        DEPT_NAME: '',	//部门名称
		NAME: '',	//姓名
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		loading:false,	//加载状态
		TYPE:''	        //选择标识
    },

	methods: {
		
        //初始执行
        init() {
            this.TYPE = getUrlKey('TYPE');
    		this.pd.keyWords = '';
    		this.getList();
    		this.choiceTips();
        },
        
        //获取列表
        getList: function(){
        	this.loading = true;
       		this.pd.STRARTTIME = $("#STRARTTIME").val();
           	this.pd.endTime = $("#endTime").val();
           	this.ROLE_ID = $("#ROLE_ID").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'user/listUsersForWindow?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {keyWords:this.pd.keyWords,STRARTTIME:this.pd.STRARTTIME,endTime:this.pd.endTime,ROLE_ID:this.ROLE_ID,TYPE:this.TYPE,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.roleList = data.roleList;
        			 vm.varList = data.userList;
        			 vm.page = data.page;
        			 vm.pd = data.pd;
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("选择用户",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
            });
        },
		
    	//选定用户
    	setUser: function (USER_ID,USERNAME,NAME,DEPT_ID,DEPT_NAME){
            this.USER_ID = USER_ID;
    		this.USERNAME = USERNAME;
            this.DEPT_ID = DEPT_ID;
            this.DEPT_NAME = DEPT_NAME;
    		this.NAME = NAME;
    		this.userBinding();
    	},

    	//绑定用户
    	userBinding: function (){
    		if('' == this.USERNAME){
    			$("#fhadminth").tips({
    				side:3,
    	            msg:'没有选择任何用户',
    	            bg:tipsColor,
    	            time:2
    	        });
    		}else{
    			$("#USERNAME").val(this.USERNAME);
    			$("#NAME").val(this.NAME);
    			$("#USER_ID").val(this.USER_ID);
    			$("#DEPT_ID").val(this.DEPT_ID);
    			$("#DEPT_NAME").val(this.DEPT_NAME);
    			top.Dialog.close();
    		}
    	},
    	
		//查看用户
		viewUser: function (USERNAME){
			if('admin' == USERNAME){
				message('warning', '不能查看admin用户!', 1000);
				return;
			}
			 var diag = new top.Dialog();
			 diag.Drag=true;
			 diag.Title ="个人资料";
			 diag.URL = '../user/user_view.html?USERNAME='+USERNAME;
			 diag.Width = 600;
			 diag.Height = 450;
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
        
    	//提示双击选择
    	choiceTips: function (){
    		$(".help").tips({
    			side:2,
    	        msg:'双击选择用户',
    	        bg:tipsColor,
				time:10
    	    });
    	},
        //重置方法
        rest: function () {
            //关键词清空
            vm.pd.keyWords = '';
            //遍历全部数据
            $("#ROLE_ID").val(null).trigger("change");
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
