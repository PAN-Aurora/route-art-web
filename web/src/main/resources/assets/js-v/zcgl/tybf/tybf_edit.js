var vm = new Vue({
	el: '#app',
	
	data:{
        //退役报废主键ID
		TYBF_ID: '',
        //存放字段参数
        pd: {SSBM: '', SSBMNM: '',SQR:''},
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
                //定义的FID赋值给当前机动装备-修理计划主键id
        		this.TYBF_ID = FID;
        		this.getData();
        	}else{
                //申请单号
                $("#SQDH").val('SQDH' + jhhDateTime());
                //申请日期
                $("#SQRQ").val(initDateTime());
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
                            vm.pd.SQR = data.SQRMC;
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
            location.href = '../../zcgl/tybf/tybf_list.html';
        },

        /**
         * 保存资产管理-退役报废计划数据
         * @returns {boolean}
         */
    	save: function (){
            //调用保存时表单校验方法，如果校验不通过返回false
            if (!validateForm()) {
                return false;
            }

            //计划号 计划名称 拟制时间 赋值
            this.pd.SQDH = $("#SQDH").val();
            this.pd.SQRQ = $("#SQRQ").val();
            // this.pd.JHMC = $("#JHMC").val();
            //退役类型下拉框赋值
    		$("#showform").hide();
    		$("#jiazai").show();

            if(this.msg=='edit'){
                document.getElementById("treeFrame").contentWindow.vm.tybffxs();
            }
            //发送 post 请求提交保存
            $.ajax({
	            	xhrFields: {
	                    withCredentials: true
	                },
					type: "POST",
					url: httpurl+'tybf/'+this.msg,
			    	data: {TYBF_ID:this.TYBF_ID,
				    SQDH:this.pd.SQDH,
                    CJ:this.pd.CJ,
                    XH:this.pd.XH,
                    SQRQ:this.pd.SQRQ,
				    SQR:this.pd.SQR,
				    SSBM:this.pd.SSBM,
				    SSBMNM:this.pd.SSBMNM,
				    CJR:this.pd.CJR,
				    CJSJ:this.pd.CJSJ,
				    XGR:this.pd.XGR,
				    XGSJ:this.pd.XGSJ,
				    BZ:this.pd.BZ,
				    ZT:this.pd.ZT,
                    BFYY:this.pd.BFYY,
			    	tm:new Date().getTime()},
					dataType:"json",
					success: function(data){
                        if("success" == data.result){
                            message('success', '保存成功', 1000);
                            location.href = '../../zcgl/tybf/tybf_list.html';
                        }else if ("exception" == data.result){
                            //显示异常
                        	showException("退役报废计划",data.exception);
                        	$("#showform").show();
                    		$("#jiazai").hide();
                        }else if("edit" == data.result){
                        	vm.pd = data.pd;
                        	vm.msg = data.result;
                        	vm.TYBF_ID = data.pd.TYBF_ID;
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
         * 保存提交资产管理-退役报废计划数据
         * @returns {boolean}
         */
        tjsave: function (){
            //调用保存时表单校验方法，如果校验不通过返回false
            if (!validateForm()) {
                return false;
            }

            //计划号 计划名称 拟制时间 赋值
            this.pd.SQDH = $("#SQDH").val();
            this.pd.SQRQ = $("#SQRQ").val();

            //调用地面装备检测计划明细中的emptyVarList方法 如果flag==false 就是没有明细
            var flag = document.getElementById("treeFrame").contentWindow.vm.emptyVarList();
            if (flag == false) {
                message('warning', '您没有添加明细，不能提交!', 1000);
            } else {
                $("#showform").hide();
                $("#jiazai").show();
                //发送 post 请求提交保存
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl+'tybf/tjsave',
                    data: {TYBF_ID:this.TYBF_ID,
                        SQDH:this.pd.SQDH,
                        SQRQ:this.pd.SQRQ,
                        CJ:this.pd.CJ,
                        XH:this.pd.XH,
                        SQR:this.pd.SQR,
                        SSBM:this.pd.SSBM,
                        SSBMNM:this.pd.SSBMNM,
                        CJR:this.pd.CJR,
                        CJSJ:this.pd.CJSJ,
                        XGR:this.pd.XGR,
                        XGSJ:this.pd.XGSJ,
                        BZ:this.pd.BZ,
                        ZT:this.pd.ZT,
                        BFYY:this.pd.BFYY,
                        tm:new Date().getTime()},
                    dataType:"json",
                    success: function(data){
                        if("success" == data.result){
                            vm.msg = 'edit';
                            $("#showform").show();
                            $("#jiazai").hide();
                            var ID_ = data.pd.ID_;
                            var PROC_INST_ID_ = data.pd.PROC_INST_ID_;
                            //JHID:申请计划的主表id    LCZT:流程进度的状态   JHIDMC:申请计划主表id的字段名    LCZTMC:流程进度状态的字段名  TABLENAME:申请计划主表的表名
                            setDelegate('JHID=' + vm.TYBF_ID+'&LCZT=0&JHIDMC=TYBF_ID&LCZTMC=ZT&TABLENAME=ZCGL_TYBF',ID_, PROC_INST_ID_);
                        }else if ("exception" == data.result){
                            //显示异常
                            showException("退役报废计划",data.exception);
                            $("#showform").show();
                            $("#jiazai").hide();
                        }else if("edit" == data.result){
                            vm.pd = data.pd;
                            vm.msg = data.result;
                            vm.TYBF_ID = data.pd.TYBF_ID;
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
         * 根据资产管理-退役报废计划主键ID获取数据
         */
    	getData: function(){
    		//发送 post 请求
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
				type: "POST",
				url: httpurl+'tybf/goEdit',
		    	data: {TYBF_ID:this.TYBF_ID,tm:new Date().getTime()},
				dataType:"json",
				success: function(data){
                     if("success" == data.result){
                         //参数map
                     	vm.pd = data.pd;
                         $("#SQDH").val(data.pd.SQDH);
                         $("#SQRQ").val(data.pd.SQRQ);
                         $("#SQR").val(data.pd.SQR);
                         $("#CJ").val(data.pd.CJ);
                         $("#XH").val(data.pd.XH);
                         $("#SSBM").val(data.pd.SSBM);
                         $("#XGSJ").val(data.pd.XGSJ);
                         $("#BFYY").val(data.pd.BFYY)
                     }else if ("exception" == data.result){
                         //显示异常
                     	showException("退役报废计划",data.exception);
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