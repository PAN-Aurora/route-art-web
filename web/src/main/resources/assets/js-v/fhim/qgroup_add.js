


var vm = new Vue({
	el: '#app',

	data:{
		varList: [],	//list
		keywords: '',	//检索关键词
		httpurl: '',
		loading:false			//加载状态
    },

	methods: {

        //初始执行
        init() {
        	$("#keywords").tips({
				side:3,
	            msg:'群名',
	            bg:tipsColor,
	            time:2
	        });
        	this.httpurl = httpurl;
        },

        //获取列表
        getList: function(){
        	this.loading = true;
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'qgroup/search',
        		data: {fcount:11,keywords:this.keywords,tm:new Date().getTime()},
        		dataType:"json",
        		success: function(data){
        		 if("success" == data.result){
        			 vm.varList = data.varList;
        			 vm.loading = false;
        		 }else if ("exception" == data.result){
                 	showException("群检索",data.exception);//显示异常
                 }
        		}
        	}).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                	window.location.href = "../../login.html";
                }, 2000);
            });
        }

	},

	mounted(){
        this.init();
    }
})

//点击群的头像
var cache = {}; //用于临时记录请求到的数据
layui.use(['layim', 'flow'], function(){
	  var layim = layui.layim
	  ,layer = layui.layer
	  ,laytpl = layui.laytpl
	  ,$ = layui.jquery
	  ,flow = layui.flow;
	  //操作
	  var active = {
		agree: function(othis){
			var li = othis.parents('li')
		      ,uid = li.data('uid')
		      ,from_group = li.data('fromGroup')
		      ,username = li.data('username')
		      ,avatar = li.data('avatar')

			layim.add({
				  type: 'group' 			//friend：申请加好友、group：申请加群
				  ,groupname: username 		//好友昵称，若申请加群，参数为：groupname
				  ,avatar: avatar		 	//头像
				  ,submit: function(group, remark, index){
				    console.log(remark); 	//获取附加信息
				    layer.close(index); 	//关闭改面板
					$.ajax({
						xhrFields: {
		                    withCredentials: true
		                },
						type: "POST",
						url: httpurl+'iminterface/addQGroup',	//添加群接口
				    	data: {QGROUP_ID:uid,BZ:remark,tm:new Date().getTime()},
						dataType:'json',
						success: function(data){
							if('01' == data.result){
								message('success', '申请成功!等待群主同意', 1000);
								top.applyQgroup(uid);	//申请加群消息发送给群主，此函数在 WebRoot\assets\js-v\fhim.js页面中
							}else{
								message('warning', '您已经在此群了,无需再申请!', 1000);

							}
						}
					});
				  }
				});
		}
	  };
	  $('body').on('click', '.layui-fh', function(){
		    var othis = $(this), type = othis.data('type');
		    active[type] ? active[type].call(this, othis) : '';
		});
});
