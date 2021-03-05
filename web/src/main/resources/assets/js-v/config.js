var httpurl = '/';

// 黄山样式：yGreen；车辆样式dGreen
var version = 'dGreen';
// 车辆
var tipsColor = '#3c763d'
// 黄山
// var tipsColor='3aa605'
var IP = 'http://192.168.0.3:8081/';

//显示异常
function showException(modular, exception) {
    swal("[" + modular + "]程序异常!", "抱歉！您访问的页面出现异常，请稍后重试或联系管理员 " + exception, "warning");
}

