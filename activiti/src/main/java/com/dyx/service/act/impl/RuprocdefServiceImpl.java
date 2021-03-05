package com.dyx.service.act.impl;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.act.RuprocdefMapper;
import com.dyx.service.act.RuprocdefService;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 说明： 正在运行的流程接口实现类
 * 创建人：FH Q313596790
 * 官网：www.fhadmin.org
 */
@Service(value="ruprocdefServiceImpl")
@Transactional //开启事物
public class RuprocdefServiceImpl implements RuprocdefService {

	@Autowired
	private RuprocdefMapper ruprocdefMapper;


	/**待办任务 or正在运行任务列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception{
		return ruprocdefMapper.datalistPage(page);
	}

	/**流程变量列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> varList(PageData pd)throws Exception{
		return ruprocdefMapper.varList(pd);
	}

	/**历史任务节点列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> hiTaskList(PageData pd)throws Exception{
		return ruprocdefMapper.hiTaskList(pd);
	}

	/**已办任务列表列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> hitasklist(Page page)throws Exception{
		return ruprocdefMapper.hitaskdatalistPage(page);
	}

	/**激活or挂起任务(指定某个任务)
	 * @param pd
	 * @throws Exception
	 */
	public void onoffTask(PageData pd)throws Exception{
		ruprocdefMapper.onoffTask(pd);;
	}

	/**激活or挂起任务(指定某个流程的所有任务)
	 * @param pd
	 * @throws Exception
	 */
	public void onoffAllTask(PageData pd)throws Exception{
		ruprocdefMapper.onoffAllTask(pd);;
	}

	/**发送站内信
	 * @param pd
	 * @throws Exception
	 */
	public void sendSms(PageData pd)throws Exception{
		pd.put("tokenKey", Tools.creatTokenKey("sendSms"));
		//LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-system", "fhsms/tosms", pd);	//请求系统微服务的站内信接口
	}

	/**************************新增加的************************************************/
	/**
	 * 根据计划ID返回流程相关信息
	 *
	 * @param pd 计划Id
	 * @return
	 * @throws Exception
	 */
	@Override
	public PageData findRutaskByJhid(PageData pd) throws Exception {
		return ruprocdefMapper.findRutaskByJhid(pd);
	}

	/**
	 * 更新流程变量
	 *
	 * @param pd
	 * @throws Exception
	 */
	@Override
	public void edit(PageData pd) throws Exception {
		ruprocdefMapper.edit(pd);
	}

	/**
	 * 更新流程变量表的流程状态
	 *
	 * @param pd id和zt
	 * @throws Exception
	 */
	@Override
	public void editVarinst(PageData pd) throws Exception {
		ruprocdefMapper.editVarinst(pd);
	}

	/**
	 * 删除流程任务
	 *
	 * @param pd 任务ID
	 * @throws Exception
	 */
	@Override
	public void delTask(PageData pd) throws Exception {
		ruprocdefMapper.delTask(pd);
	}

	/**
	 * 流程变量表
	 *
	 * @param pd 计划ID
	 * @throws Exception
	 */
	@Override
	public void delVariable(PageData pd) throws Exception {
		ruprocdefMapper.delVariable(pd);
	}

	/**
	 * 更新申请状态
	 *
	 * @param pd
	 * @throws Exception
	 */
	@Override
	public void editSqzt(PageData pd) throws Exception {
		ruprocdefMapper.editSqzt(pd);
	}

	/**
	 * 更新历史节点提交人和委派人
	 * @param pd
	 * @throws Exception
	 */
	@Override
	public void editHitinst(PageData pd) throws Exception {
		ruprocdefMapper.editHitinst(pd);
		ruprocdefMapper.editHitaskt(pd);
	}

	/**
	 * 根据流程进度id获取审批进度的任务id
	 * @param pd
	 * @return pd
	 * @throws Exception
	 */
	@Override
	public PageData getTaskid(PageData pd) throws Exception {
		return ruprocdefMapper.getTaskid(pd);
	}
}
