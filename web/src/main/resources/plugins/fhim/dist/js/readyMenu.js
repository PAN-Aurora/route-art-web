
layui.define(['jquery', 'contextMenu'], function (exports) {
	var contextMenu = layui.contextMenu;
	var $ = layui.jquery;
	var ext = {
		init: function () {//定义右键操作
			$(".layim-list-friend >li > ul > li").contextMenu({
				width: 140, // width
				itemHeight: 30, // 菜单项height
				bgColor: "#fff", // 背景颜色
				color: "#333", // 字体颜色
				fontSize: 15, // 字体大小
				hoverBgColor: "#009bdd", // hover背景颜色
				hoverColor: "#fff", // hover背景颜色
				target: function (ele) { // 当前元素
					$(".ul-context-menu").attr("data-id", ele.find("b").html());
					$(".ul-context-menu").attr("data-name", ele.find("span").html());
					$(".ul-context-menu").attr("data-img", ele.find("img").attr('src'));
				},
				menu: [
					{ // 菜单项
						text: "删除好友",
						icon: "&#xe640;",
						callback: function (ele) {
							var othis = ele.parent();
							del("null", othis[0].dataset.id, othis[0].dataset.name);

						}
					},
					{
						text: "拉黑名单",
						icon: "&#xe612;",
						callback: function (ele) {
							var othis = ele.parent();
							pullblack("null", othis[0].dataset.id, othis[0].dataset.name);
						}
					},
					{
						text: "转移分组",
						icon: "&#xe66b;",
						callback: function (ele) {
							var othis = ele.parent();
							moveGroup(othis[0].dataset.id);
						}
					},
					{
						text: "查看资料",
						icon: "&#xe66e;",
						callback: function (ele) {
							var othis = ele.parent();
							viewUser(othis[0].dataset.id);
						}
					}
				]
			});
		}
	}
	exports('readyMenu', ext);
});

//删除
function del(Id, FUSERNAME, NAME) {
	this.$confirm('确认要删除' + NAME + '吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
		cancelButtonClass: 'el-button--info',
	}).then(() => {
		removeFriendByI(FUSERNAME); 		//从自己好友栏移除  此方法在im.jsp页面中
		removeFriendFromMobile(FUSERNAME);	//从自己手机好友栏里面删除对方
		$.ajax({
			xhrFields: {
				withCredentials: true
			},
			type: "POST",
			url: httpurl + 'friends/delete',
			data: { FRIENDS_ID: Id, FUSERNAME: FUSERNAME, tm: new Date().getTime() },
			dataType: 'json',
			success: function (data) {
				if ("success" == data.result) {
					message('success', '删除成功，已经从好友列表中删除!', 1000);

				}
			}
		});

	});
}

//拉黑
function pullblack(Id, FUSERNAME, NAME) {
	this.$confirm('确认要把' + NAME + '拉入黑名单吗?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
		cancelButtonClass: 'el-button--info',
	}).then(() => {
		removeFriendByI(FUSERNAME); 		//从自己好友栏移除  此方法在im.jsp页面中
		removeIFromFriend(FUSERNAME);		//从对方好友栏里面删除自己
		removeFriendFromMobile(FUSERNAME);	//从自己手机好友栏里面删除对方
		$.ajax({
			xhrFields: {
				withCredentials: true
			},
			type: "POST",
			url: httpurl + 'friends/pullblack',
			data: { FRIENDS_ID: Id, FUSERNAME: FUSERNAME, tm: new Date().getTime() },
			dataType: 'json',
			success: function (data) {
				if ("success" == data.result) {
					message('success', '拉黑成功，已经从互相好友列表中删除!', 1000);
				}
			}
		});

	});
}

//转移分组
function moveGroup(FUSERNAME) {
	var diag = new top.Dialog();
	diag.Drag = true;
	diag.Title = "转移分组";
	diag.URL = '../../fhim/friends/friends_edit.html?FRIENDS_ID=null&FUSERNAME=' + FUSERNAME
	diag.Width = 399;
	diag.Height = 155;
	diag.Modal = true;				//有无遮罩窗口
	diag.CancelEvent = function () { //关闭事件
		var varSon = diag.innerFrame.contentWindow.document.getElementById('showform');
		if (varSon != null && varSon.style.display == 'none') {
			window.location.reload();
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
}

//查看用户资料
function viewUser(USERNAME) {
	if ('admin' == USERNAME) {
		message('warning', '禁止查看，不能查看admin用户!', 1000);

		return;
	}
	var diag = new Dialog();
	diag.Drag = true;
	diag.Title = "好友资料";
	diag.URL = '../user/user_view.html?USERNAME=' + USERNAME;
	diag.Width = 600;
	diag.Height = 319;
	diag.CancelEvent = function () { //关闭事件
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



//作者 f h- admin QQ 3 135 9 6790
