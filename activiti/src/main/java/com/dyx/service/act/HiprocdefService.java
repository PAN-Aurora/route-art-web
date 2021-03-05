package com.dyx.service.act;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

/**
 * 说明： 历史流程任务接口
 * 创建人：FH Q313596790
 * 官网：www.fhadmin.org
 */
public interface HiprocdefService {

	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;

	/**历史流程变量列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> hivarList(PageData pd)throws Exception;

	/**
	 * 更新作废流程
	 * @param pd
	 */
	public void editProcinst(PageData pd) throws Exception;
}
