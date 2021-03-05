
var vm = new Vue({
	el: '#app',
	methods: {
		//保存
		goUpload: function (){
			if($("#fileField").val() == ''){
				$("#fileField").tips({
					side:3,
		            msg:'请选择压缩包',
		            bg:tipsColor,
		            time:3
		        });
				return false;
			}
            var formdata = new FormData();
            var zipFile = document.getElementById("fileField").files[0];
			formdata.append("zip", zipFile);

			$("#showform").hide();
			$("#jiazai").show();

			//异步 跨域 上传文件
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
                url: httpurl + 'procdef/uploadPro',
                type: 'POST',
                data: formdata,
                async: false,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                   if("success" == data.result){
	                	   $("#fileField").tips({
	       					side:3,
	       		            msg:'上传成功',
	       		            bg:tipsColor,
	       		            time:3
	       		        });
                       setTimeout(function(){
                   		top.Dialog.close();
                       },860);
                   }else if ("errer" == data.result){
                	   	alert("导入失败! 文件资源不符合流程标准( 或缺少 xml or png )或者压缩包中包含目录");
                	   	$("#showform").show();
               			$("#jiazai").hide();
                   }else if ("exception" == data.result){
                	   alert("导入模版"+data.exception);
                	   $("#showform").show();
              		  $("#jiazai").hide();
                   }
                }
           }).done().fail(function(){
        	   alert("登录失效!请求服务器无响应,稍后再试");
               $("#showform").show();
       		   $("#jiazai").hide();
            });
		}

	}

})

//判断格式
function checkFileType (obj){
	document.getElementById('textfield').value=obj.value;
    //获得文件后缀名
	var fileType=obj.value.substr(obj.value.lastIndexOf(".")).toLowerCase();
    if(fileType != '.zip'){
    	$("#fileField").tips({
			side:3,
            msg:'请上传zip格式的压缩包',
            bg:tipsColor,
            time:3
        });
    	$("#fileField").val('');
    	$("#textfield").val('请选择zip格式的压缩包');
    }
}
