


var vm = new Vue({
	el: '#app',

	data:{
		roleList: [],	//list 列出组(页面横向排列的一级组)
		roleList_z: [],	//list 列出此组下架角色
		pd: [],			//map
		ROLE_ID: '1',	//角色ID
		add:false,
		del:false,
		edit:false,
		loading:false	//加载状态
    },

    methods: {

    	//初始执行
        init() {
    		this.getList(this.ROLE_ID);
        },

        //获取列表
        getList: function(ROLE_ID){
        	this.loading = true;
        	this.ROLE_ID = ROLE_ID;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'role/list',
        		data: {ROLE_ID:ROLE_ID,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.roleList = data.roleList;
        			 vm.roleList_z = data.roleList_z;
        			 vm.pd = data.pd;
        			 vm.hasButton();
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("角色模块",data.exception);//显示异常
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
    	addRole: function (pid){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="新增角色";
    		 diag.URL = '../role/role_edit.html?PARENT_ID='+pid;
    		 diag.Width = 600;
    		 diag.Height = 200;
    		 diag.CancelEvent = function(){ //关闭事件
    			 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList(vm.ROLE_ID);
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
    	editRole: function (ROLE_ID){
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="编辑角色";
    		 diag.URL = '../role/role_edit.html?ROLE_ID='+ROLE_ID;
    		 diag.Width = 600;
    		 diag.Height = 130;
    		 diag.CancelEvent = function(){ //关闭事件
    			 var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
    			 if(varSon != null && varSon.style.display == 'none'){
    				 vm.getList(vm.ROLE_ID);
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
		delRole: function (ROLE_ID,msg,ROLE_NAME){
			this.$confirm('确定要删除['+ROLE_NAME+']吗?', '提示', {
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
    		       			url: httpurl+'role/delete',
    		       	    	data: {ROLE_ID:ROLE_ID,tm:new Date().getTime()},
    		       			dataType:'json',
    		       			success: function(data){
    		       				 if("success" == data.result){
									message('success', '删除成功!', 1000);
    		       					 if(msg == 'c'){
    		       						vm.getList(vm.ROLE_ID);
    								}else{
    								  setTimeout(function(){
    									window.location.href="role_list.html";
  		                            },1000);
    								}
    		       				 }else if("false" == data.result){
									   message('warning', '请先删除下级角色!', 1000);

    		       					vm.loading = false;
    		       				 }else if("false2" == data.result){
									   message('warning', '删除失败,此角色已被使用!', 1000);
    		       					vm.loading = false;
    		       				 }
    		       			}
    		       		});

               });
    	},

    	//菜单权限
    	editRights: function (ROLE_ID){
    		 var diag = new top.Dialog();
    		 diag.Drag = true;
    		 diag.Title = "菜单权限";
    		 diag.URL = '../role/menuqx.html?ROLE_ID='+ROLE_ID;
    		 diag.Width = 400;
    		 diag.Height = 500;
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

    	//按钮权限(增删改查)
    	roleButton: function (ROLE_ID,msg){
    		if(msg == 'add_qx'){
    			var Title = "授权新增权限(此角色下打勾的菜单拥有新增权限)";
    		}else if(msg == 'del_qx'){
    			Title = "授权删除权限(此角色下打勾的菜单拥有删除权限)";
    		}else if(msg == 'edit_qx'){
    			Title = "授权修改权限(此角色下打勾的菜单拥有修改权限)";
    		}else if(msg == 'cha_qx'){
    			Title = "授权查看权限(此角色下打勾的菜单拥有查看权限)";
    		}
    		 var diag = new top.Dialog();
    		 diag.Drag = true;
    		 diag.Title = Title;
    		 diag.URL = '../role/b4Button.html?ROLE_ID='+ROLE_ID+'&msg='+msg;
    		 diag.Width = 400;
    		 diag.Height = 500;
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
        	var keys = 'role:add,role:del,role:edit';
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
        			vm.add = data.rolefhadminadd;
        			vm.del = data.rolefhadmindel;
        			vm.edit = data.rolefhadminedit;
        		 }else if ("exception" == data.result){
                 	showException("按钮权限",data.exception);//显示异常
                 }
        		}
        	})
        },

    },

	mounted(){
        this.init();
    }
})
