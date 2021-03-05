
var vm = new Vue({
	el: '#app',
	data:{
		PARENT_ID: '',		//上级ID
		DICTIONARIES_ID: '',//主键ID
		checked:false,
		msg:'add',
		pds: [],
		pd: []
    },

	methods: {
        //初始执行
        init() {
        	var FID = getUrlKey('DICTIONARIES_ID');
        	var P_ID = getUrlKey('PARENT_ID');
        	this.PARENT_ID = P_ID;
        	if(null != FID){
        		this.msg = 'edit';
        		this.DICTIONARIES_ID = FID;
        		this.getData();
        	}else{
        		this.getGoAdd();
			}

			/*图片*/
			imgurl = '../com/imgupload.html?biz=sys_dictionaries&type=tp&id=' + this.DICTIONARIES_ID;
			$("#tp").attr("src", imgurl);
        },
        //取消
        cancel:function(){
            //判断是否是新增页面
            if(null == getUrlKey("FID")){
                //如果是新增页面，没有点击保存，删除附件
                delFilesByids(vm.DICTIONARIES_ID,httpurl);
            }
            top.Dialog.close();
        },
        //去保存
    	save: function (){
            if (!validateForm()) {
                return false;
            }

			if(this.checked){
				this.pd.YNDEL = 'yes';
			}else{
				this.pd.YNDEL = 'no';
			}

    		$("#showform").hide();
    		$("#jiazai").show();

            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'dictionaries/'+this.msg,
			    	data: {PARENT_ID:this.PARENT_ID,DICTIONARIES_ID:this.DICTIONARIES_ID,NAME:this.pd.NAME,NAME_EN:this.pd.NAME_EN,BIANMA:this.pd.BIANMA,ORDER_BY:this.pd.ORDER_BY,BZ:this.pd.BZ,TBSNAME:this.pd.TBSNAME,TBFIELD:this.pd.TBFIELD,YNDEL:this.pd.YNDEL,tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                        	message('success', '保存成功', 1000);
                        	setTimeout(function(){
                        		top.Dialog.close();
                            },1000);
                        }else if ("exception" == data.result){
                        	showException("数据字典",data.exception);
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }else if ("error" == data.result) {
                            message('warning', '编码或标识重复!', 1000);
                            $("#showform").show();
                            $("#jiazai").hide();
                        }
                    }
				}).done().fail(function(){
                   message('warning', '请求服务器无响应，稍后再试!', 1000);
                   $("#showform").show();
           		   $("#jiazai").hide();
                });
    	},

    	//根据主键ID获取数据(新增时)
    	getGoAdd: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'dictionaries/goAdd',
		    	data: {DICTIONARIES_ID:this.PARENT_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                       if("success" == data.result){
                       	 	vm.pds = data.pds;
                       }else if ("exception" == data.result){
	                       	showException("数据字典",data.exception);
	                       	$("#showform").show();
	                   		$("#jiazai").hide();
                       }
                   }
			}).done().fail(function(){
                  message('warning', '请求服务器无响应，稍后再试!', 1000);
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
    	},

    	//根据主键ID获取数据(修改时)
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'dictionaries/goEdit',
		    	data: {DICTIONARIES_ID:this.DICTIONARIES_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                    	vm.pds = data.pds;
                     	vm.pd = data.pd;
                     }else if ("exception" == data.result){
                     	showException("数据字典",data.exception);
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
                  }
			}).done().fail(function(){
                  message('warning', '请求服务器无响应，稍后再试!', 1000);
                  $("#showform").show();
          		   $("#jiazai").hide();
               });
    	},

    	//判断编码是否存在
		hasBianma: function (){
			var BIANMA = this.pd.BIANMA;
			if("" == BIANMA)return;
			$.ajax({
				xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'dictionaries/hasBianma',
		    	data: {BIANMA:BIANMA,tm:new Date().getTime()},
				dataType:'json',
				success: function(data){
					 if("success" == data.result){
					 }else if ("exception" == data.result){
	                     	showException("数据字典",data.exception);
	                     	$("#showform").show();
	                 		$("#jiazai").hide();
	                 }else{
						$("#BIANMA").tips({
							side:1,
				            msg:'编码'+BIANMA+'已存在,重新输入',
				            bg:tipsColor,
				            time:5
				        });
						vm.pd.BIANMA = '';
					 }
				}
			});
		},
	},

	//初始化创建
	mounted(){
        this.init();
    }
})
