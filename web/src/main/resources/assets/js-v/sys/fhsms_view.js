


var vm = new Vue({
	el: '#app',
	
	data:{
		FHSMS_ID: '',
		TYPE: '',
		SANME_ID: '',
		STATUS: '',
		pd: [],			//map
		CONTENT: ''
    },
    
	methods: {
		
        //初始执行
        init() {
        	var FHSMS_ID = getUrlKey('FHSMS_ID');	//链接参数
        	var TYPE = getUrlKey('TYPE');
        	var SANME_ID = getUrlKey('SANME_ID');
        	var STATUS = getUrlKey('STATUS');
        	if(null != FHSMS_ID){
        		this.FHSMS_ID = FHSMS_ID;
        		this.TYPE = TYPE;
        		this.SANME_ID = SANME_ID;
        		this.STATUS = STATUS;
        		this.getData();
        	}
        },
        
    	//根据主键ID获取数据
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'fhsms/goView',
		    	data: {FHSMS_ID:this.FHSMS_ID,TYPE:this.TYPE,SANME_ID:this.SANME_ID,STATUS:this.STATUS,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                     	vm.pd = data.pd;						//参数map
                     	
                     	vm.CONTENT = data.pd.CONTENT.split('../../plugins/ueditor').join(httpurl+'plugins/ueditor');
                     	
                     }else if ("exception" == data.result){
                     	showException("站内信",data.exception);	//显示异常
                     }
                  }
			}).done().fail(function(){
                  message('warning', '请求服务器无响应，稍后再试!', 1000);
               });
    	},
	},
	
	mounted(){
        this.init();
    }
})
