
var vm = new Vue({
	el: '#app',
	data:{
        //部署ID
		DEPLOYMENT_ID_: '',
        //图片名称
		FILENAME: '',
        //图片地址 base64格式
		imgSrc: ''
    },

    methods: {
    	//初始执行
        init() {
            //链接参数
        	this.DEPLOYMENT_ID_ = getUrlKey('DEPLOYMENT_ID_');
        	this.FILENAME = getUrlKey('FILENAME');
        	this.getdata();
        },

        //获取数据
        getdata: function (){
        	$.ajax({
        		xhrFields: {
                    withCredentials: true
                },
        		type: "POST",
        		url: httpurl+'procdef/getViewPng',
            	data: {DEPLOYMENT_ID_:this.DEPLOYMENT_ID_,FILENAME:this.FILENAME,tm:new Date().getTime()},
        		dataType:'json',
        		success: function(data){
        			if("success" == data.result){
        			  $("#jiazai").hide();
        			 	vm.imgSrc = data.imgSrc;
        			 }else if ("exception" == data.result){
                      	showException("Png预览",data.exception);
                     }
        		}
        	}).done().fail(function(){
                message('warning', '请求服务器无响应，稍后再试!', 1000);
            });
        },

    },

	//初始化创建
	mounted(){
	    this.init();
	}
})
