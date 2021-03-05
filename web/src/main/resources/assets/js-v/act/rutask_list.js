
var vm = new Vue({
	el: '#app',
	data:{
        //list
		varList: [],
        //分页类
		page: [],
        //检索条件
		keyWords: '',
        //每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		showCount: -1,
        //当前页码
		currentPage: 1,
        //办理权限
		edit:false,
        //加载状态
		loading:false
    },

	methods: {
        //初始执行
        init() {
    		this.getList();
        },

        //获取列表
        getList: function(){
        	this.loading = true;
        	var startTime = $("#startTime").val();
        	var endTime = $("#endTime").val();
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'rutask/list?showCount='+this.showCount+'&currentPage='+this.currentPage,
        		data: {keyWords:this.keyWords,startTime:startTime,endTime:endTime,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.page = data.page;
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("待办任务",data.exception);
                 }
        		}
        	}).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        },

    	//委派
    	setDelegate: function (ID_,PROC_INST_ID_){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="委派对象";
            diag.URL = '../../act/ruprocdef/ruprocdef_delegate.html?TAG=second&ID_='+ID_+'&PROC_INST_ID_='+PROC_INST_ID_;
    		 diag.Width = 600;
    		 diag.Height = 180;
            //关闭事件
    		 diag.CancelEvent = function(){
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

    	//办理任务
    	handle: function (PROC_INST_ID_,ID_,FILENAME){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="办理任务";
    		 diag.URL = '../../act/rutask/rutask_handle.html?PROC_INST_ID_='+PROC_INST_ID_+"&ID_="+ID_+'&FILENAME='+encodeURI(encodeURI(FILENAME));
    		 diag.Width = 1100;
    		 diag.Height = 750;
    		 diag.Modal = true;
    		 diag. ShowMaxButton = true;
    	     diag.ShowMinButton = true;
    		 diag.CancelEvent = function(){
    			 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
     			 if(varSon != null && varSon.style.display == 'none'){

    				 // $("#simple-table").tips({
    					// 	side:3,
    			     //        msg:'审批完毕',
    			     //        bg:tipsColor,
    			     //        time:6
    			     // });
                     //刷新顶部任务列表
    				 // top.vm.topTask();
    			}
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
        /**
         * 查询单位信息
         * @param id 单位id
         */
        viewDept: function (id) {
            if ('a6c6695217ba4a4dbfe9f7e9d2c06730' == id) {
                message('warning', '不能查看组织机构单位!', 1000);
                return;
            }
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "查看单位信息";
            diag.URL = '../../sys/dept/dept_view.html?DEPT_ID=' + id;
            diag.Width = 1000;
            diag.Height = 500;
            diag.CancelEvent = function () {
                vm.getList();
                diag.close();
                // 显示遮罩层
                if ($(top.window.document).find("div[id^='_DialogDiv']").length > 0) {
                    var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("display", "block");
                    $(top.window.document).find("div[id='_DialogBGDiv']").css("z-index", strIndex);
                }
            };
            diag.show();
        },
    	//判断按钮权限，用于是否显示按钮
        hasButton: function(){
        	var keys = 'rutask:edit';
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
                     //办理权限
        			vm.edit = data.rutaskfhadminedit;
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
            vm.keyWords = '';
            //开始时间清空
            $("#startTime").val('');
            $("#startTime").datepicker('setEndDate',null);
            //结束时间清空
            $("#endTime").val('');
            $("#endTime").datepicker('setStartDate',null);
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
