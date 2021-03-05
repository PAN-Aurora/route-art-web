package com.dyx.controller.base;

import com.dyx.entity.PageData;
import com.dyx.util.UuidUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;

/**
 * 说明：所有处理类父类  
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public class BaseController {

	protected final transient Log log = LogFactory.getLog(this.getClass());
	/**
	 * new PageData对象
	 * @return
	 */
	public PageData getPageData() {
		return new PageData(this.getRequest());
	}

	/**
	 * 得到request对象
	 * @return
	 */
	public HttpServletRequest getRequest() {
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
				.getRequest();
		return request;
	}
	
	/**得到32位的uuid
	 * @return
	 */
	public String get32UUID(){
		return UuidUtil.get32UUID();
	}
	
}
