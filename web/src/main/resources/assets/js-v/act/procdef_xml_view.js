

var DEPLOYMENT_ID_ = '';
var FILENAME = '';
window.onload=function (){
    //链接参数
	DEPLOYMENT_ID_ = getUrlKey('DEPLOYMENT_ID_');
	FILENAME = getUrlKey('FILENAME');
	getCodeFromView();
}

window.onresize=function(){
	cmainFrame();
};

if(ie_error()){
       $('#editor').hide();
}else{
    $('#editorBox').hide();
    ace.require("ace/ext/language_tools");
    var editor = ace.edit("editor");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/java");
}

//获取code
function getCodeFromView(){
	$.ajax({
		xhrFields: {
            withCredentials: true
        },
		type: "POST",
		url: httpurl+'procdef/getViewXml',
    	data: {DEPLOYMENT_ID_:DEPLOYMENT_ID_,FILENAME:FILENAME,tm:new Date().getTime()},
		dataType:'json',
		success: function(data){
			if("success" == data.result){
			  $("#jiazai").hide();
			  setCodeTxt(data.code);
			 }else if ("exception" == data.result){
              	showException("xml预览",data.exception);
             }
		}
	}).done().fail(function(){
        message('warning', '请求服务器无响应，稍后再试!', 1000);
    });
}

//设置代码内容
function setCodeTxt(value){
    if(typeof(editor) == "undefined"){
        $('#editorBox').val(value);
    }else{
        editor.setValue(value,-1);
    }
}

function cmainFrame(){
	var hmain = document.getElementById("editor");
	var bheight = document.documentElement.clientHeight;
	hmain .style.width = '100%';
	hmain .style.height = (bheight) + 'px';
}

cmainFrame();
