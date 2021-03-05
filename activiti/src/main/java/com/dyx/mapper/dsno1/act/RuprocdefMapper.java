package com.dyx.mapper.dsno1.act;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

/**
 * 说明： 正在运行的流程Mapper
 * 作者：FH Admin QQ313596790
 * 官网：www.fhadmin.org
 * @version
 */
public interface RuprocdefMapper {

	/**待办任务 or正在运行任务列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> datalistPage(Page page)throws Exception;

	/**流程变量列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> varList(PageData pd)throws Exception;

	/**历史任务节点列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> hiTaskList(PageData pd)throws Exception;

	/**已办任务列表列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> hitaskdatalistPage(Page page)throws Exception;

	/**激活or挂起任务(指定某个任务)
	 * @param pd
	 * @throws Exception
	 */
	public void onoffTask(PageData pd)throws Exception;

	/**激活or挂起任务(指定某个流程的所有任务)
	 * @param pd
	 * @throws Exception
	 */
	public void onoffAllTask(PageData pd)throws Exception;

	/**
	 * 根据计划ID返回流程相关信息
	 *
	 * @param pd 计划ID
	 * @return
	 */
	PageData findRutaskByJhid(PageData pd) throws Exception;
	/**
	 * 更新流程变量
	 *
	 * @param pd
	 */
	void edit(PageData pd);

	/**
	 * 更新流程变量表的流程状态
	 *
	 * @param pd id和zt
	 */
	void editVarinst(PageData pd);

	/**
	 * 删除流程任务
	 *
	 * @param pd 任务ID
	 */
	void delTask(PageData pd);

	/**
	 * 流程变量表
	 *
	 * @param pd 计划ID
	 */
	void delVariable(PageData pd);

	/**
	 * 更新申请状态
	 *
	 * @param pd
	 * @throws Exception
	 */
	void editSqzt(PageData pd);

	/**
	 * 更新历史节点提交人和委派人
	 * @param pd
	 */
	void editHitinst(PageData pd);

	/**
	 * 根据流程进度id获取审批进度的任务id
	 * @param pd
	 * @return pd
	 */
	PageData getTaskid(PageData pd);

	/**
	 * 更新历史节点提交人和委派人
	 * @param pd
	 */
	void editHitaskt(PageData pd);


}
