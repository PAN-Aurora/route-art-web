
/**
 *  post 请求
 * @param postUrl
 * @param data
 * @returns
 */
function doPost(postUrl,data){
	 alert(11);
	 $.ajax({
		    xhrFields: {
		        withCredentials: true
		    },
		    type: "POST",
		    url: httpurl + postUrl,
		    data: data,
		    dataType: "json",
		    /**
		     * 成功回调函数
		     * @param data 返回数据
		     */
		    success: function (data) {
		        if ("success" == data.result) {
		             return data;
		        } else if ("exception" == data.result) {
		            //显示异常
		            showException("领域技术现状分析-统计查询", data.exception);
		            return null;
		        }
		    }
		}).done().fail(function () {
		    message('warning', '请求服务器无响应，稍后再试!', 1000);
		    return null;
//		    setTimeout(function () {
//		        window.location.href = "../../login.html";
//		    }, 2000);
		});	
}    
   