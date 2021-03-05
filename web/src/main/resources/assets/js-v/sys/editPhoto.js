


var vm = new Vue({
	el: '#app',

	data:{
		serverurl: '',	//后台地址
		curl:'',		//当前地址
		iframe:false	//是否显示mainFrame
    },

    methods: {
    	//初始执行
        init() {
    		this.serverurl = httpurl;
    		this.curl= window.location.href;
    		var userPhoto = getUrlKey('userPhoto');//链接参数
        	if(null != userPhoto){
				message('success', '修改成功!', 1000);

            	setTimeout(function(){
            		top.location.reload(); 				//头像编辑完后，刷新整个页面
                },1000);
        	}else{
        		this.iframe = true;
        	}
        },
    },

	mounted(){
        this.init();
    }
})
