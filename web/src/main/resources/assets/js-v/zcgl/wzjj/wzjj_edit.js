var vm = new Vue({
	el: '#app',
	
	data:{
        //物资交接主键ID
        WZJJ_ID: '',
        //存放字段参数
        pd: {SSBM: '', SSBMNM: ''},
		msg:'add',
        //编辑状态
        edit: false,
    },
	
	methods: {
		
        //初始执行
        init() {
            //当接收过来的FID不为null时,表示此页面是修改进来的
        	var FID = getUrlKey('FID');
        	if(null != FID){
                //将msg设置为edit
                this.msg = 'edit';
                this.edit = true;
                //定义的FID赋值给当前资产管理-物资交接主键id
        		this.WZJJ_ID = FID;
        		this.getData();
        	}else{
                //交接单号
                $("#JJDH").val('JJDH' + jhhDateTime());
                //申请时间(默认当前时间)
                $("#SQSJ").val(initDateTime());
                //获取当前登录用户
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl + 'wzcg/getUser',
                    data: {tm: new Date().getTime()},
                    dataType: "json",
                    success: function (data) {
                        if ("success" == data.result) {

                            vm.pd.SSBM = data.SQDWMC;
                            vm.pd.SSBMNM = data.SQDWNM;
                        }
                    }
                });
			}
        },

        /**
         * 点击取消按钮时返回
         */
        cancel: function () {
            //返回首页
            location.href = '../../zcgl/wzjj/wzjj_list.html';
        },

        /**
         * 保存资产管理-物资交接数据
         * @returns {boolean}
         */
    	save: function (){
            //调用保存时表单校验方法，如果校验不通过返回false
            if (!validateForm()) {
                return false;
            }

            //交接单号 所属部门 时间 赋值
            this.pd.JJDH = $("#JJDH").val();
            this.pd.SSBM = $("#SSBM").val();
            this.pd.SQSJ = $("#SQSJ").val();

            $("#showform").hide();
            $("#jiazai").show();

            if(this.msg=='edit'){
                document.getElementById("treeFrame").contentWindow.vm.emptyVarList();
            }
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'wzjj/'+this.msg,
			    	data: {WZJJ_ID:this.WZJJ_ID,
				    JJDH:this.pd.JJDH,
				    SQSJ:this.pd.SQSJ,
				    SSBM:this.pd.SSBM,
				    SSBMNM:this.pd.SSBMNM,
				    JJYY:this.pd.JJYY,
				    CJR:this.pd.CJR,
				    CJSJ:this.pd.CJSJ,
				    XGR:this.pd.XGR,
				    XGSJ:this.pd.XGSJ,
				    BZ:this.pd.BZ,
                    ZT:this.pd.ZT,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            message('success', '保存成功', 1000);
                            location.href = '../../zcgl/wzjj/wzjj_list.html';
                        }else if ("exception" == data.result){
                            //显示异常
                        	showException("物资交接",data.exception);
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }else if("edit" == data.result){
                        	vm.pd = data.pd;
                        	vm.msg = data.result;
                        	vm.WZJJ_ID = data.pd.WZJJ_ID;
                            $("#showform").show();
                            $("#jiazai").hide();
						}
                    }
				}).done().fail(function(){
                   swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                   $("#showform").show();
           		   $("#jiazai").hide();
                });
    	},

        /**
         * 资产管理-物资交接数据
         * @returns {boolean}
         */
        tjsave: function (){
            //调用保存时表单校验方法，如果校验不通过返回false
            if (!validateForm()) {
                return false;
            }

            //交接单号 所属部门 时间 赋值
            this.pd.JJDH = $("#JJDH").val();
            this.pd.SSBM = $("#SSBM").val();

            //调用物资交接明细中的emptyVarList方法 如果flag==false 就是没有明细
            var flag = document.getElementById("treeFrame").contentWindow.vm.emptyVarList();
            if (flag == false) {
                return false;
            } else {
                $("#showform").hide();
                $("#jiazai").show();
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl+'wzjj/tjsave',
                    data: {WZJJ_ID:this.WZJJ_ID,
                        JJDH:this.pd.JJDH,
                        SQSJ:this.pd.SQSJ,
                        SSBM:this.pd.SSBM,
                        SSBMNM:this.pd.SSBMNM,
                        JJYY:this.pd.JJYY,
                        CJR:this.pd.CJR,
                        CJSJ:this.pd.CJSJ,
                        XGR:this.pd.XGR,
                        XGSJ:this.pd.XGSJ,
                        BZ:this.pd.BZ,
                        tm:new Date().getTime()},
                    dataType:"json",
                    success: function(data){
                        if("success" == data.result){
                            if (data.pd != null) {
                                vm.msg = 'edit';
                                $("#showform").show();
                                $("#jiazai").hide();
                                var ID_ = data.pd.ID_;
                                var PROC_INST_ID_ = data.pd.PROC_INST_ID_;
                                //JHID:申请计划的主表id    LCZT:流程进度的状态   JHIDMC:申请计划主表id的字段名    LCZTMC:流程进度状态的字段名  TABLENAME:申请计划主表的表名
                                setDelegate('JHID=' + vm.WZJJ_ID+'&LCZT=0&JHIDMC=WZJJ_ID&LCZTMC=ZT&TABLENAME=ZCGL_WZJJ',ID_, PROC_INST_ID_);
                            }
                        }else if ("exception" == data.result){
                            //显示异常
                            showException("物资交接",data.exception);
                            $("#showform").show();
                            $("#jiazai").hide();
                        }else if("edit" == data.result){
                            vm.pd = data.pd;
                            vm.msg = data.result;
                            vm.WZJJ_ID = data.pd.WZJJ_ID;
                            $("#showform").show();
                            $("#jiazai").hide();
                        }
                    }
                }).done().fail(function(){
                    swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                    $("#showform").show();
                    $("#jiazai").hide();
                });
            }
        },
        /**
         * 根据资产管理-物资交接主键ID获取数据
         */
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'wzjj/goEdit',
		    	data: {WZJJ_ID:this.WZJJ_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                         //参数map
                     	vm.pd = data.pd;
                        $("#JJDH").val(data.pd.JJDH);
                        $("#SSBM").val(data.pd.SSBM);
						$("#SQSJ").val(data.pd.SQSJ);
						$("#CJSJ").val(data.pd.CJSJ);
						$("#XGSJ").val(data.pd.XGSJ);
                     }else if ("exception" == data.result){
                         //显示异常
                     	showException("物资交接",data.exception);
                     	$("#showform").show();
                 		$("#jiazai").hide();
                     }
                  }
			}).done().fail(function(){
                  swal("登录失效!", "请求服务器无响应，稍后再试", "warning");
                  $("#showform").show();
          		  $("#jiazai").hide();
               });
    	},
	},
	
	mounted(){
        this.init();
    }
})