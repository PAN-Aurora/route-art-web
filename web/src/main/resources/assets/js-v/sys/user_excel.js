


var vm = new Vue({
	el: '#app',
	
	methods: {
        
		//保存
		goUpload: function (){
			if($("#fileField").val() == ''){
				$("#fileField").tips({
					side:3,
		            msg:'请选择文件',
		            bg:tipsColor,
		            time:3
		        });
				return false;
			}
			$("#showform").hide();
			$("#jiazai").show();
            
            var formdata = new FormData();
            var excelFile = document.getElementById("fileField").files[0];
			formdata.append("excel", excelFile);
            
			//异步 跨域 上传文件
            $.ajax({
            	xhrFields: {
                    withCredentials: true
                },
                url: httpurl + 'user/readExcel',  
                type: 'POST',  
                data: formdata,  
                cache: false,
                contentType: false,  
                processData: false,  
                success: function (data) {  
	               //     if("success" == data.result){
	               //  	   $("#fileField").tips({
	       			// 		side:3,
	       		   //          msg:'上传成功',
	       		   //          bg:tipsColor,
	       		   //          time:2
	       		   //      });
                   //     setTimeout(function(){
                   // 		top.Dialog.close();//关闭弹窗
                   //     },860);
                   // }else if ("exception" == data.result){
                	//     alert("上传excel"+data.exception);//显示异常
                   // 		$("#showform").show();
               	// 		$("#jiazai").hide();
                   // }



                    $("#showform").show();
                    $("#jiazai").hide();
                    var str='';
                    var array=eval(data);
                    for (i=0; i < array.length;i++){
                        var obj = array[i];
                        str += "<tr>" +
                            "<td class='center' style='width:30px;'>"+(i+1)+"</td>"+
                            "<td class='left'>"+obj.info+"</td>"+ "</tr>";
                    }
                    $("#info").html(str);
                    //清空file框
                    $(".remove").trigger("click");
                    $("infoDiv").css("display","block");
                    $("#textfield").val('请选择excel文件');
                    $("#fileField").val('')


                } 
           }).done().fail(function(){
        	   alert("登录失效!请求服务器无响应,稍后再试");
               $("#showform").show();
       		   $("#jiazai").hide();
            });
		},
		
		//下载模版
		goDownload: function (){
			window.location.href = httpurl + 'user/downExcel';
		}
        
	}
	
})

//判断格式
function checkFileType (obj){
	document.getElementById('textfield').value=obj.value;
	var fileType=obj.value.substr(obj.value.lastIndexOf(".")).toLowerCase();//获得文件后缀名
    if(fileType != '.xls' && fileType != '.xlsx'){
    	$("#fileField").tips({
			side:3,
            msg:'请上传xls，或者xlsx格式的文件',
            bg:tipsColor,
            time:3
        });
    	$("#fileField").val('');
    	$("#textfield").val('请选择xls，或者xlsx格式的文件');
    }
}
