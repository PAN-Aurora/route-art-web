var httpurl = httpurlZnck;

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
        node: [],
        expands: []
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    methods: {
        //初始执行
        init() {
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
                url: httpurl + 'dept/listZjjgTree',
                data: {tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.treeData = JSON.parse(data.zTreeNodes);
                        vm.expands = [];
                        // for (var i = 0; i < data.zTreeNodes.length; i++) {
                        vm.expands.push(vm.treeData[0].id);
                        // }
                    } else if ("exception" == data.result) {
                        alert("组织机构树" + data.exception);//显示异常
                    }
                }
            })
        },
        //树节点过滤
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        //树节点选择事件
        nodeClick: function (obj, node, data) {
            this.node = node;
        },
        savePublicDw() {
            if (this.node.length <= 0 || this.node.level == 1) {
                vm.$message.warning('请选择部门');
                return;
            }
            //将选择数据放在session中，在父页面中调用
            sessionStorage.setItem("label", this.node.data.Flabel);
            sessionStorage.setItem("id", this.node.data.id);
            top.Dialog.close();
        },
    },
    mounted() {
        this.init();
    },

});
