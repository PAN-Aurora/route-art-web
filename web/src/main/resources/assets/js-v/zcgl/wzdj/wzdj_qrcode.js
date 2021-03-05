//机动装备装备实力选择url

var vm = new Vue({
    el: '#app',
    data: {
        //物资明细参数
        param: '',
        //图片列表
        imgData: [],
        tblHeight: getTblHeight(42),

    },

    methods: {
        //初始执行
        init() {
            //获取物资采购ID
            // this.param = getUrlKey('param');
            this.param = sessionStorage.getItem('param');
            //移除session
            sessionStorage.removeItem("param")
            this.showQRCodeByCgid(this.param);
        },
        // 根据采购计划显示二维码信息
        showQRCodeByCgid: function () {

            this.loading = true;
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'wzdj/generateQRCodeByCgid',
                data: {param:this.param},
                dataType: 'json',
                success: function (data) {

                    if ("success" == data.result) {
                        vm.imgData = data.imgData;
                    }
                }
            })
        },

    },

    //初始化创建
    mounted() {
        this.init();
    },
});
