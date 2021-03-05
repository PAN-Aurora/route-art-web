package com.dyx.mapper.dsno1.act;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

/**
 * 说明： 流程管理Mapper
 * 作者：FH Admin QQ313596790
 * 官网：www.fhadmin.org
 * @version
 */
public interface ProcdefMapper{

	/**列表
	 * @param page
	 * @throws Exception
	 */
	List<PageData> datalistPage(Page page);

}

