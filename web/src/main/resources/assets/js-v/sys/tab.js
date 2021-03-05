var tab;
var vm = new Vue({
    el: '#app',
    methods: {
        //添加标签
        tabAddHandler: function (mid, mtitle, murl) {
            tab.update({
                id : 'tab1_index1',
                title : mtitle,
                url : murl,
                isClosed : true
            });
        },

        //关闭标签
        tabClose: function (mid){
            tab.close(mid);
        },

        //调整宽度和高度
        cmainFrameT: function (){
            var hmainT = document.getElementById("page");
            var bheightT = document.documentElement.clientHeight;
            hmainT.style.width = '100%';
            hmainT.style.height = (bheightT - 37) + 'px';
        },

        //初始执行
        init() {
            //根据不同用户跳转不同页面
            tab = new TabView({
                containerId : 'tab_menu',
                pageid : 'page',
                cid : 'tab1',
                position : "top"
            });

            tab.add({
                id : 'tab1_index1',
                title : "主页",
                // url : "default.html",
                url : "../../../views/zcgl/homepage/homepage_list.html",
                isClosed : false
            });
            // vm.cmainFrame();
            this.cmainFrameT();
        }
    },
    mounted(){
        this.init();
    }
})

//窗口宽度高度变化事件
window.onresize = function() {
	vm.cmainFrameT();
};
//3-1-3-5-9-6-7-9-0-QQ
