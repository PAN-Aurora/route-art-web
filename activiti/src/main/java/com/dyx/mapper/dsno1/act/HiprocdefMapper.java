package com.dyx.mapper.dsno1.act;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

/**
 * 说明： 历史流程Mapper
 * 作者：FH Admin QQ313596790
 * 官网：www.fhadmin.org
 */
public interface HiprocdefMapper {

	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> datalistPage(Page page)throws Exception;

	/**历史流程变量列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> hivarList(PageData pd)throws Exception;

	/**
	 * 更新作废流程标识
	 * @param pd
	 */
	public void editProcinst(PageData pd);
}
