
var vm = new Vue({
	el: '#app',
	data: {
		//list
		varList: [],
		//分页类
		page: [],
		//检索条件
		keyWords: '',
		//模型分类
		category: '',
		//每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
		showCount: -1,
		//当前页码
		currentPage: 1,
		//添加权限
		add: false,
		//删除权限
		del: false,
		//修改权限
		edit: false,
		cha: false,
		//加载状态
		loading: false
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
			this.getList();
			this.getDic();
		},

		//获取列表
		getList: function () {
			this.loading = true;
			this.category = null == $("#category").val() ? '' : $("#category").val();
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl + 'fhmodel/list?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
				data: { keyWords: this.keyWords, category: this.category, tm: new Date().getTime() },
				dataType: "json",
				success: function (data) {
					if ("success" == data.result) {
						vm.varList = data.varList;
						vm.page = data.page;
						vm.hasButton();
						vm.loading = false;
						$("input[name='ids']").attr("checked", false);
					} else if ("exception" == data.result) {
						showException("模型管理", data.exception);
					}
				}
			}).done().fail(function () {
				message('warning', '请求服务器无响应，稍后再试!', 1000);
				setTimeout(function () {
					window.location.href = "../../login.html";
				}, 2000);
			});
		},

		//打开流程设计器
		editor: function (modelId) {
			var diag = new top.Dialog();
			diag.Drag = true;
			diag.Title = "流程设计器";
			diag.URL = '../../act/fhmodel/editor.html?modelId=' + modelId;
			diag.Width = 1230;
			diag.Height = 700;
			diag.Modal = true;
			diag.ShowMaxButton = true;
			diag.ShowMinButton = true;
			diag.CancelEvent = function () {
				vm.getList();
				diag.close();
				// 显示遮罩层
				if ($(top.window.document).find("div[id^='_DialogDiv']").length > 0) {
					var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
					$(top.window.document).find("div[id='_DialogBGDiv']").css("display", "block");
					$(top.window.document).find("div[id='_DialogBGDiv']").css("z-index", strIndex);
				}
			};
			diag.show();
		},

		//新增
		goAdd: function () {
			var diag = new top.Dialog();
			diag.Drag = true;
			diag.Title = "新增模型";
			diag.URL = '../../act/fhmodel/fhmodel_add.html';
			diag.Width = 650;
			diag.Height = 400;
			diag.Modal = true;
			diag.CancelEvent = function () {
				var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
				if (varSon != null && varSon.style.display == 'none') {
					var sunval = diag.innerFrame.contentWindow.document.getElementById('sunval').value;
					//打开流程编辑器
					vm.editor(sunval);
					vm.getList();
				}
				diag.close();
				// 显示遮罩层
				if ($(top.window.document).find("div[id^='_DialogDiv']").length > 0) {
					var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
					$(top.window.document).find("div[id='_DialogBGDiv']").css("display", "block");
					$(top.window.document).find("div[id='_DialogBGDiv']").css("z-index", strIndex);
				}
			};
			diag.show();
		},

		//打开修改类型页面
		goEditType: function (ID_) {
			var diag = new top.Dialog();
			diag.Drag = true;
			diag.Title = "修改类型";
			diag.URL = '../../act/fhmodel/fhmodel_type.html?ID_=' + ID_;
			diag.Width = 400;
			diag.Height = 150;
			diag.Modal = true;
			diag.ShowMaxButton = false;
			diag.ShowMinButton = false;
			diag.CancelEvent = function () {
				var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
				if (varSon != null && varSon.style.display == 'none') {
					vm.getList();
				}
				diag.close();
				// 显示遮罩层
				if ($(top.window.document).find("div[id^='_DialogDiv']").length > 0) {
					var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
					$(top.window.document).find("div[id='_DialogBGDiv']").css("display", "block");
					$(top.window.document).find("div[id='_DialogBGDiv']").css("z-index", strIndex);
				}
			};
			diag.show();
		},

		//删除
		goDel: function (id) {
			this.$confirm("确定要删除吗?", '提示', {
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
					url: httpurl + 'fhmodel/delete',
					data: { ID_: id, tm: new Date().getTime() },
					dataType: 'json',
					success: function (data) {
						if ("success" == data.result) {
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
					if (msg == '确定要删除选中的数据吗?') {
						this.loading = true;
						$.ajax({
							xhrFields: {
								withCredentials: true
							},
							type: "POST",
							url: httpurl + 'fhmodel/deleteAll?tm=' + new Date().getTime(),
							data: { DATA_IDS: str },
							dataType: 'json',
							success: function (data) {
								if ("success" == data.result) {
									message('success', '已经从列表中删除!', 1000);
								}
								vm.getList();
							}
						});
					}
				}
			}).catch(() => {

			});
		},

		//部署流程定义
		deployment: function (modelId, id) {
			this.loading = true;
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl + 'fhmodel/deployment?tm=' + new Date().getTime(),
				data: { modelId: modelId },
				dataType: 'json',
				success: function (data) {
					vm.loading = false;
					if ("error" == data.result) {
						$("#" + id).tips({
							side: 2,
							msg: '部署失败! 检查下流程图画的是否正确?',
							bg: '#F50100',
							time: 15
						});
					} else {
						$("#" + id).tips({
							side: 2,
							msg: '部署成功! 可到流程管理中查看',
							bg: '#87B87F',
							time: 15
						});
					}
				}
			});
		},

		//预览
		view: function (modelId, id) {
			this.loading = true;
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl + 'fhmodel/isCanexportXml?tm=' + new Date().getTime(),
				data: { modelId: modelId },
				dataType: 'json',
				success: function (data) {
					vm.loading = false;
					if ("error" == data.result) {
						$("#" + id).tips({
							side: 2,
							msg: '预览失败! 检查下流程图画的是否正确?',
							bg: '#F50100',
							time: 8
						});
					} else {
						var diag = new top.Dialog();
						diag.Drag = true;
						diag.Title = "预览XML";
						diag.URL = '../../act/fhmodel/xml_view.html?modelId=' + modelId;
						diag.Width = 1000;
						diag.Height = 608;
						diag.Modal = true;
						diag.ShowMaxButton = true;
						diag.ShowMinButton = true;
						diag.CancelEvent = function () {
							diag.close();
							// 显示遮罩层
							if ($(top.window.document).find("div[id^='_DialogDiv']").length > 0) {
								var strIndex = $(top.window.document).find("div[id^='_DialogDiv']").css("z-index") - 1;
								$(top.window.document).find("div[id='_DialogBGDiv']").css("display", "block");
								$(top.window.document).find("div[id='_DialogBGDiv']").css("z-index", strIndex);
							}
						};
						diag.show();
					}
				}
			});
		},

		//导出模型xml
		exportXml: function (modelId, id) {
			this.$confirm('确定要导出模型xml吗?', '提示', {
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
					url: httpurl + 'fhmodel/isCanexportXml?tm=' + new Date().getTime(),
					data: { modelId: modelId },
					dataType: 'json',
					success: function (data) {
						this.loading = true;
						if ("error" == data.result) {
							$("#" + id).tips({
								side: 2,
								msg: '导出失败! 检查下流程图画的是否正确?',
								bg: '#F50100',
								time: 8
							});
						} else {
							window.location.href = httpurl + 'fhmodel/exportXml?modelId=' + modelId;
						}
					}
				});
			}).catch(() => {
			});
		},

		//调用数据字典(模型分类)
		getDic: function () {
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl + 'dictionaries/getLevels',
				//act001 为工作流分类
				data: { DICTIONARIES_ID: 'act001', tm: new Date().getTime() },
				dataType: 'json',
				success: function (data) {
					$("#category").html('<option value="" >请选择分类</option>');
					$.each(data.list, function (i, dvar) {
						$("#category").append("<option value=" + dvar.BIANMA + ">" + dvar.NAME + "</option>");
					});
					vm.getList();
				}
			});
		},

		//判断按钮权限，用于是否显示按钮
		hasButton: function () {
			var keys = 'fhmodel:add,fhmodel:del,fhmodel:edit,fhmodel:cha';
			$.ajax({
				xhrFields: {
					withCredentials: true
				},
				type: "POST",
				url: httpurl + 'head/hasButton',
				data: { keys: keys, tm: new Date().getTime() },
				dataType: "json",
				success: function (data) {
					if ("success" == data.result) {
						vm.add = data.fhmodelfhadminadd;
						vm.del = data.fhmodelfhadmindel;
						vm.edit = data.fhmodelfhadminedit;
						vm.cha = data.fhmodelfhadmincha;
					} else if ("exception" == data.result) {
						showException("按钮权限", data.exception);
					}
				}
			})
		},

		formatDate: function (time) {
			var date = new Date(time);
			return formatDateUtil(date, "yyyy-MM-dd hh:mm:ss");
		},

        /**
         * 重置检索条件方法
         */
		rest: function () {
			//关键词清空
			vm.keyWords = '';
			//开始时间清空
			$("#STRARTTIME").val('');
			//结束时间清空
			$("#ENDTIME").val('');
			//分页跳转至第一页
			this.nextPage(1);
			//遍历全部数据
			vm.getDic();
		},

		//-----分页必用----start
		nextPage: function (page) {
			this.currentPage = page;
			this.getList();
		},
		changeCount: function (value) {
			this.currentPage = 1;
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

	//初始化创建
	mounted() {
		this.init();
	}
})
