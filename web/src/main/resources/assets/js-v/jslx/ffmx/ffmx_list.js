var vm = new Vue({
    el: '#app',
    data: {
        //list
        menuList: [],
        //主键ID
        MENU_ID: '0',
        pd: [],
        add: true,
        del: true,
        edit: true,
        //加载状态
        loading: false
    },
    methods: {
        //初始加载
        init() {
            //获取url参数
            this.MENU_ID = getUrlKey('MENU_ID');
            if (null != this.MENU_ID ) {
                this.getList();
            }
        },

        //获取列表
        getList: function () {
            this.loading = true;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'menu/list',
                data: {MENU_ID: this.MENU_ID, tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.menuList = data.menuList;
                        // vm.hasButton();
                        vm.loading = false;
                    } else if ("exception" == data.result) {
                        showException("菜单管理", data.exception);
                    }
                }
            }).done().fail(function () {
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                setTimeout(function () {
                    window.location.href = "../../login.html";
                }, 2000);
            });
        },

        //编辑菜单图标
        setIcon: function (MENU_ID) {
            var diag = new top.Dialog();
            diag.Drag = true;
            diag.Title = "编辑图标";
            diag.URL = '../jslx/ffmx/ffmx_icon.html?MENU_ID=' + MENU_ID;
            diag.Width = 800;
            diag.Height = 600;
            diag.Modal = true;
            diag.ShowMaxButton = true;
            diag.ShowMinButton = true;
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

        //编辑菜单(新增or修改)
        editMenu: function (MENU_ID, msg) {
            window.location.href = "ffmx_edit.html?MENU_ID=" + MENU_ID + "&msg=" + msg;
        },

        //删除
        delMenu: function (MENU_NAME, MENU_ID) {
            this.$confirm('确定要删除' + MENU_NAME + '吗', '提示', {
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
                    url: httpurl + 'menu/delete',
                    data: {MENU_ID: MENU_ID, tm: new Date().getTime()},
                    dataType: 'json',
                    success: function (data) {
                        if ("success" == data.result) {
                            message('success', '删除成功!', 1000);
                            parent.refreshNode();
                            //刷新本页面
                            vm.getList();
                        } else {
                            message('error', '删除失败,请先删除子菜单!', 1000);
                            vm.loading = false;
                        }

                    }
                });

            });
        },

        //判断按钮权限，用于是否显示按钮
        hasButton: function () {
            var keys = 'ffmx:add,ffmx:del,ffmx:edit';
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'head/hasButton',
                data: {keys: keys, tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.add = data.menufhadminadd;
                        vm.del = data.menufhadmindel;
                        vm.edit = data.menufhadminedit;
                    } else if ("exception" == data.result) {
                        showException("按钮权限", data.exception);
                    }
                }
            })
        },
    },

    //初始化创建
    mounted() {
        this.init();
    }
})
