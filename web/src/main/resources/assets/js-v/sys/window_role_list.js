


var vm = new Vue({
	el: '#app',
	
	data:{
		varList: [],	//list
		page: [],		//分页类
		RNUMBER: '',	//编码
        ROLE_NAME: '',  //角色名称
		keyWords:'',	//检索关键词
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		loading:false,	//加载状态
        TYPE:''	        //选择标识
    },
    
	methods: {
		
        //初始执行
        init() {
            this.TYPE = getUrlKey('TYPE');
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
        		url: httpurl+'role/roleListWindow?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {keyWords:this.keyWords,ROLE_ID:1,TYPE:this.TYPE,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.roleList;
        			 vm.page = data.page;
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("选择角色",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },
        
    	//选定角色
    	setRole: function (RNUMBER,ROLE_NAME){
    		this.RNUMBER = RNUMBER;
    		this.ROLE_NAME = ROLE_NAME;
    		this.roleBinding();
    	},
    	
    	//选择角色
    	roleBinding: function (){
    		if('' == this.RNUMBER){
    			$("#fhadminth").tips({
    				side:3,
    	            msg:'没有选择任何角色',
    	            bg:tipsColor,
    	            time:2
    	        });
    		}else{
    			$("#RNUMBER").val(this.RNUMBER);
    			$("#ROLE_NAME").val(this.ROLE_NAME);
    			top.Dialog.close();
    		}
    	},

        //重置检索条件
        rest: function () {
            vm.keyWords = '';
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
