
var vm = new Vue({
    el: '#app',
    data: {
        //过滤文本
        filterText: '',
        //树节点数据
        treeData: [],
        defaultProps: {
            children: 'children',
            label: 'label'
        },
        expands: [],
        selects: [],
        id: [],
    },

    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },

    methods: {
        //初始执行
        init() {
            //获取数据回显值
            this.id = getUrlKey('id');
            this.getData();
        },

        //根据主键ID获取数据
        getData: function () {
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'common/listTree',
                data: { tm: new Date().getTime() },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.treeData = JSON.parse(data.zTreeNodes);
                        //因为有许多根节点 所以要遍历绘制节点图标
                        for (var i = 0; i < vm.treeData.length; i++) {
                            //绘制节点图标
                            vm.renderIcon(vm.treeData[i]);
                        }
                    } else if ("exception" == data.result) {
                        //显示异常
                        alert("组织机构树" + data.exception);
                    }
                }
            })
        },
        // 绘制节点图标
        renderIcon: function (node) {
            if (node) {
                // 回显已选中值
                if (node.id == this.id) {
                    // 展开父节点
                    vm.expands.push(node.pId);
                    // 显示选择节点
                    vm.selects.push(node.id);
                }
                // 包含子节点
                if (node.children && node.children.length > 0) {
                    node.icon = 'el-icon-office-building';
                    // 循环子节点
                    node.children.forEach(element => {
                        // 递归处理
                        this.renderIcon(element);
                    });
                }
                // 不包含子节点
                else {
                    node.icon = 'el-icon-school';
                }
            }
        },
        //树节点过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        checkChange(data, checked, node) {
            if (checked == true) {
                this.$refs.tree.setCheckedNodes([data]);
            }
        },
        //树节点选择事件
        nodeClick: function (obj) {
            this.$refs.tree.setCheckedNodes([obj]);
        },

        //保存选择的库房数据
        savePublicKf() {
            if (this.$refs.tree.getCheckedNodes().length <= 0) {
                message('warning', '请选择库房', 1000);
                return;
            } else {
                var arr = this.$refs.tree.getCheckedNodes();
                var jsonObject = {
                    kfnm: arr[0].id,
                    kfmc: arr[0].label,
                    lxnm: arr[0].LXNM
                }
                sessionStorage.setItem("oukf", JSON.stringify(jsonObject));
            }
            top.Dialog.close();
        },
    },

    //初始化执行
    mounted() {
        this.init();
    },

});
