


var vm = new Vue({
	el: '#app',

	data: {
		varList: [],	//好友list
		page: [],		//分页类
		keywords: '',	//检索条件
		httpurl: '',
		QGROUP_ID: '',	//群ID
		showCount: -1,	//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		currentPage: 1,	//当前页码
		loading: false	//加载状态
	},

	methods: {
		//初始执行
		init() {
			//复选框控制全选,全不选
$('#zcheckbox').click(function () {
    if (this.checked) {
        $("input[name='ids']").prop("checked", true);
    } else {
        $("input[name='ids']").prop("checked", false);
    }
});

			var FID = this.getUrlKey('QGROUP_ID');	//链接参数
			if (null != FID) {
				this.QGROUP_ID = FID;
				this.getList();
			}
			this.httpurl = httpurl;
		},

		//获取列表
		getList: function () {
			this.loading = true;
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl + 'qgroup/groupMembers?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
				data: { keywords: this.keywords, QGROUP_ID: this.QGROUP_ID, tm: new Date().getTime() },
				dataType: "json",
				success: function (data) {
					if ("success" == data.result) {
						vm.varList = data.varList;
						vm.page = data.page;
						vm.loading = false;
						$("input[name='ids']").attr("checked", false);
					} else if ("exception" == data.result) {
						showException("群组成员管理", data.exception);//显示异常
					}
				}
			}).done().fail(function () {
				message('warning', '请求服务器无响应，稍后再试!', 1000);
				setTimeout(function () {
					window.location.href = "../../login.html";
				}, 2000);
			});
		},

		//踢出群
		goDel: function (USERNAME) {
			this.$confirm('确定要踢出群吗?', '提示', {
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
					url: httpurl + 'qgroup/kickout',
					data: { QGROUP_ID: this.QGROUP_ID, USERNAME: USERNAME, tm: new Date().getTime() },
					dataType: 'json',
					success: function (data) {
						if ("success" == data.result) {
							top.kickoutQgroup(USERNAME, vm.QGROUP_ID); 	//通知被踢出的成员，发送个提醒消息，此函数在 WebRoot\assets\js-v\fhim.js页面中
							message('success', '已经从列表中删除!', 1000);
						}
						vm.getList();
					}
				});
			}).catch(() => {
				
			});
		},

		//批量操作
		makeAll: function (msg) {
			this.$confirm(msg, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				cancelButtonClass: 'el-button--info',
			}).then(() => {
				var str = '';
				for (var i = 0; i < document.getElementsByName('ids').length; i++) {
					if (document.getElementsByName('ids')[i].checked) {
						if (str == '') str += document.getElementsByName('ids')[i].value;
						else str += ',' + document.getElementsByName('ids')[i].value;
					}
				}
				if (str == '') {
					$("#cts").tips({
						side: 2,
						msg: '点这里全选',
						bg: tipsColor,
						time: 3
					});
					message('warning', '您没有选择任何内容!', 1000);
					return;
				} else {
					if (msg == '确定要把选中的成员踢出群吗?') {
						this.loading = true;
						var arrid = str.split(',');
						for (var n = 0; n < arrid.length; n++) {
							var USERNAME = arrid[n];
							top.kickoutQgroup(USERNAME, this.QGROUP_ID); 	//通知被踢出的成员，发送个提醒消息，此函数在WebRoot\assets\js-v\fhim.js页面中
							$.ajax({
								xhrFields: {
									withCredentials: true
								},
								type: "POST",
								url: httpurl + 'qgroup/kickout?tm=' + new Date().getTime(),
								data: { QGROUP_ID: this.QGROUP_ID, USERNAME: USERNAME },
								dataType: 'json',
								success: function (data) {
									if (n == arrid.length) {
										if ("success" == data.result) {
											message('success', '已经从列表中删除!', 1000);
										}
										vm.getList();
									}
								}
							});
						}
					}
				}
			}).catch(() => {
				
			});
		},

		//根据url参数名称获取参数值
		getUrlKey: function (name) {
			return decodeURIComponent(
				(new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
		},

		//-----分页必用----start
		nextPage: function (page) {
			this.currentPage = page;
			this.getList();
		},
		changeCount: function (value) {
			this.showCount = value;
			this.getList();
		},
		toTZ: function () {
			var toPaggeVlue = document.getElementById("toGoPage").value;
			if (toPaggeVlue == '') { document.getElementById("toGoPage").value = 1; return; }
			if (isNaN(Number(toPaggeVlue))) { document.getElementById("toGoPage").value = 1; return; }
			this.nextPage(toPaggeVlue);
		}
		//-----分页必用----end

	},

	mounted() {
		this.init();
	}
})
