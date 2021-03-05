package com.dyx.service.act;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

/**
 * 说明： 流程管理接口
 * 作者：FH Admin QQ313596790
 * 官网：www.fhadmin.org
 * @version
 */
public interface ProcdefService{

	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;

}

