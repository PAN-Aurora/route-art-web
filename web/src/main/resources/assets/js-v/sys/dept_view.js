

var vm = new Vue({
    el: '#app',

    data: {
        PARENT_ID: '',				//上级ID
        DEPT_ID: '',	//主键ID
        pd: {SSQYMC: [], SSQYNM: []},						//存放字段参数
        //上级单位信息
        pds: [],
        msg: 'add',
        //战区下拉框
        zq_options: []
    },

    methods: {

        //初始执行
        init() {
            var FID = getUrlKey('DEPT_ID');	//链接参数
            var P_ID = getUrlKey('PARENT_ID');
            this.PARENT_ID = P_ID;
            if (null != FID) {
                this.DEPT_ID = FID;
                this.getData();
            }
        },

        //根据主键ID获取数据(修改时)
        getData: function () {
            //发送 post 请求
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'dept/goView',
                data: {DEPT_ID: this.DEPT_ID, PARENT_ID: this.PARENT_ID, tm: new Date().getTime()},
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        vm.pd = data.pd;
                        vm.DEPT_ID = data.pd.DEPT_ID;
                        vm.PARENT_ID = data.pd.PARENT_ID;
                    } else if ("exception" == data.result) {
                        showException("组织机构", data.exception);	//显示异常
                        $("#showform").show();
                        $("#jiazai").hide();
                    }
                }
            }).done().fail(function () {
                message('warning', '请求服务器无响应，稍后再试!', 1000);
                $("#showform").show();
                $("#jiazai").hide();
            });
        },
    },

    mounted() {
        this.init();
    }
});
