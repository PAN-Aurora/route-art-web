var websocketonline;//websocke对象
var vm = new Vue({
    el: '#app',
    
    data:{
    	userList: [],		//用户List
    	userCount:0,		//在线人数
    	loading:false		//在线状态
    },
    
	methods: {

        //初始执行
        init() {
        	this.online();
        	//复选框控制全选,全不选 
    		$('#zcheckbox').click(function(){
    		 if($(this).is(':checked')){
    			 $("input[name='ids']").click();
    		 }else{
    			$("input[name='ids']").prop("checked", false);
    		 }
    		});
        },
        
        //获取在线列表
        online: function(){
    		if (window.WebSocket) {
				console.info(top.onlineAdress);
    			websocketonline = new WebSocket(encodeURI('ws://'+top.onlineAdress)); //onlineAdress在index.js文件定义
    			websocketonline.onopen = function() {
    				websocketonline.send('[QQ313596790]fhadmin');//连接成功
    			};
    			websocketonline.onerror = function() {
    				//连接失败
    			};
    			websocketonline.onclose = function() {
    				//连接断开
    			};
    			//消息接收
    			websocketonline.onmessage = function(message) {
    				var message = JSON.parse(message.data);
    				if (message.type == 'count') {
    					userCount = message.msg;
    				}else if(message.type == 'userlist'){
    					vm.userList = message.list.reverse();
    					vm.userCount = message.list.length;
    				}else if(message.type == 'addUser'){
    					vm.userList[vm.userCount] = message.user ;
    					vm.userList = vm.userList.reverse();
    					vm.userCount = vm.userList.length;
    				}
    			};
    		}
    	},
    	
    	//强制某用户下线（websocket发送）
    	goOutUser: function(theuser){
    		websocketonline.send('[goOut]'+theuser);
    	},

    	//强制某用户下线
    	goOutTUser: function(theuser){
    		theuser = theuser.replace("mobile-","");
    		if('admin' == theuser){
				message('warning', '操作失败,不能强制下线admin用户!', 1000);				
    			return;
			}
			this.$confirm('确定要强制['+theuser+']下线吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
    		
    	        	this.goOutUser(theuser);
    	        
    	    });
    	},
    	
    	//查看修改用户
    	editUser: function (USERNAME){
    		USERNAME = USERNAME.replace("mobile-","");
    		if('admin' == USERNAME){
				message('warning', '不能查看修改admin用户!', 1000);				
				
    			return;
    		}
    		 var diag = new top.Dialog();
    		 diag.Drag=true;
    		 diag.Title ="资料";
    		 diag.URL = '../user/user_edit.html?USERNAME='+USERNAME;
    		 diag.Width = 600;
    		 diag.Height = 496;
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
    	
    	//批量操作
    	makeAll: function(msg){
			this.$confirm(msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
    		    	var str = '';
    		    	$("input[name='ids']").attr("checked", false);
    				for(var i=0;i < document.getElementsByName('ids').length;i++){
    					  if(document.getElementsByName('ids')[i].checked){
    					  	if('admin' != document.getElementsByName('ids')[i].value){
    							  if(str=='') str += document.getElementsByName('ids')[i].value;
    							  else str += ',' + document.getElementsByName('ids')[i].value;
    						  }else{
    							  document.getElementsByName('ids')[i].checked  = false;
    							  $("#cts").tips({
    									side:3,
    						            msg:'admin用户不能强制下线',
    						            bg:tipsColor,
    						            time:5
    						        });
    						  }
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
    					var arField = str.split(',');
    					for(var i=0;i<arField.length;i++){
    						websocketonline.send('[goOut]'+arField[i]);
    					}
					}
            });
    	}
    },
    mounted(){
        this.init();
    }
 
})