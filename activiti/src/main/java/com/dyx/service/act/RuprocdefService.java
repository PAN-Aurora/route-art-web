package com.dyx.service.act;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

/**
 * 说明： 正在运行的流程接口
 * 创建人：FH Q313596790
 * 官网：www.fhadmin.org
 */
public interface RuprocdefService {

	/**待办任务 or正在运行任务列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;

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
	public List<PageData> hitasklist(Page page)throws Exception;

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

	/**发送站内信
	 * @param pd
	 * @throws Exception
	 */
	public void sendSms(PageData pd)throws Exception;

	/************************************新增加的****************************************/
	/**
	 * 根据计划ID返回流程相关信息
	 *
	 * @param pd 计划Id
	 * @return
	 * @throws Exception
	 */
	public PageData findRutaskByJhid(PageData pd) throws Exception;

	/**
	 * 更新流程变量
	 *
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd) throws Exception;

	/**
	 * 更新流程变量表的流程状态
	 *
	 * @param pd id和zt
	 */
	public void editVarinst(PageData pd) throws Exception;

	/**
	 * 删除流程任务
	 *
	 * @param pd 任务ID
	 * @throws Exception
	 */
	public void delTask(PageData pd) throws Exception;

	/**
	 * 流程变量表
	 *
	 * @param pd 计划ID
	 * @throws Exception
	 */
	public void delVariable(PageData pd) throws Exception;

	/**
	 * 更新申请状态
	 *
	 * @param pd
	 * @throws Exception
	 */
	public void editSqzt(PageData pd) throws Exception;

	/**
	 * 更新任务提交人和委派人
	 *
	 * @param pd
	 * @throws Exception
	 */
	public void editHitinst(PageData pd) throws Exception;

	/**
	 * 根据流程进度id获取审批进度的任务id
	 * @param pd
	 * @return pd
	 * @throws Exception
	 */
	public PageData getTaskid(PageData pd) throws Exception;
}
