package com.dyx.controller.act.ruprocdef;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.dyx.entity.system.User;
import com.dyx.util.Const;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import com.dyx.controller.act.AcBusinessController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.service.act.HiprocdefService;
import com.dyx.service.act.RuprocdefService;
import com.dyx.util.DateUtil;
import com.dyx.util.Jurisdiction;
import com.dyx.util.Tools;
import org.apache.shiro.session.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 说明：正在运行的流程
 * 作者：FH Admin Q31-359-6790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping(value="/ruprocdef")
public class RuprocdefController extends AcBusinessController {

	@Autowired
	private RuprocdefService ruprocdefService;

	@Autowired
	private HiprocdefService hiprocdefService;

	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@RequiresPermissions("ruprocdef:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String keyWords = pd.getString("keyWords");						//关键词检索条件
		if(Tools.notEmpty(keyWords))pd.put("keyWords", keyWords.trim());
		String STRARTTIME = pd.getString("STRARTTIME");					//开始时间
		String ENDTIME = pd.getString("ENDTIME");						//结束时间
		if(Tools.notEmpty(STRARTTIME))pd.put("lastStart", STRARTTIME+" 00:00:00");
		if(Tools.notEmpty(ENDTIME))pd.put("lastEnd", ENDTIME+" 00:00:00");
		//获取Session
		Session session = Jurisdiction.getSession();
		//获取当前登录用户
		User user = (User) session.getAttribute(Const.SESSION_USER);
		//查询用户所在单位具体信息
		pd.put("DEPT_ID",user.getDeptId());
		//查询当前用户的任务(用户名查询)
		pd.put("USERNAME", Jurisdiction.getUsername());
		//查询当前用户的任务(角色编码查询)
		pd.put("RNUMBERS", Jurisdiction.getRnumbers());
		//查询运行中流程标识
		pd.put("TYPE","RUNNING");
		page.setPd(pd);
		List<PageData>	varList = ruprocdefService.list(page);			//列出Ruprocdef列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("result", errInfo);				//返回结果
		return map;
	}

	/**委派
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/delegate")
//	@RequiresPermissions("Delegate")
	@ResponseBody
	public Object delegate() throws Exception{
		Map<String,Object> zmap = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		//流程任务ID
		String taskId = pd.getString("ID_");
		Map<String,Object> map = new LinkedHashMap<String, Object>();
		//审批结果中记录委派
		map.put("审批结果", "任务由 ["+Jurisdiction.getUsername()+"] 委派");
		//设置流程变量
		setVariablesByTaskIdAsMap(pd.getString("ID_"),map);
		setVariablesByTaskId(taskId,"RESULT","批准");
		//用户首次提交流程时运行
		if ("first".equals(pd.get("TAG"))){
			completeMyPersonalTask(taskId);
		}
		//更新委派对象
		ruprocdefService.edit(pd);
		//委派时更新委派状态为0
		ruprocdefService.editVarinst(pd);
		//更新历史节点提交人和委派人
		pd.put("TASK_ID",ruprocdefService.getTaskid(pd).get("ID_"));
		ruprocdefService.editHitinst(pd);
		//用于给待办人发送新任务消息
		zmap.put("ASSIGNEE_",pd.getString("ASSIGNEE_"));
		trySendSms(zmap,pd);
		//返回结果
		zmap.put("result", errInfo);
		return zmap;
	}

	/**委派
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/getDelegate")
	@ResponseBody
	public Object getDelegate() throws Exception{
		Map<String,Object> zmap = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		//流程任务ID
		String taskId = pd.getString("ID_");


		//返回结果
		zmap.put("result", errInfo);
		return zmap;
	}


	/**发送站内信
	 * @param
	 * @param pd
	 * @throws Exception
	 */
	public void trySendSms(Map<String,Object> zmap,PageData pd)throws Exception{
		//列出历史流程变量列表
		List<PageData>	hivarList = hiprocdefService.hivarList(pd);
		for(int i=0;i<hivarList.size();i++){
			if("USERNAME".equals(hivarList.get(i).getString("NAME_"))){
				sendSms(hivarList.get(i).getString("TEXT_"));
				zmap.put("FHSMS",hivarList.get(i).getString("TEXT_"));
				break;
			}
		}
	}
	/**激活or挂起任务
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/onoffTask")
	@RequiresPermissions("ruprocdef:edit")
	@ResponseBody
	public Object onoffTask()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		ruprocdefService.onoffTask(pd);
		map.put("result", errInfo);						//返回结果
		return map;
	}

	/**作废流程
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@RequiresPermissions("Abolish")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		//作废原因
		String reason = "【作废】"+Jurisdiction.getName()+"："+URLDecoder.decode(pd.getString("reason"), "UTF-8");
		/**任务结束时发站内信通知审批结束*/
		//列出历史流程变量列表
		List<PageData>	hivarList = hiprocdefService.hivarList(pd);
		for(int i=0;i<hivarList.size();i++){
			if("USERNAME".equals(hivarList.get(i).getString("NAME_"))){
				sendSms(hivarList.get(i).getString("TEXT_"));
				break;
			}
		}
		//作废流程
		deleteProcessInstance(pd.getString("PROC_INST_ID_"),reason);
		map.put("result", errInfo);
		return map;
	}

	/**发站内信通知审批结束
	 * @param USERNAME
	 * @throws Exception
	 */
	public void sendSms(String USERNAME) throws Exception{
		PageData pd = new PageData();
		pd.put("SANME_ID", this.get32UUID());			//ID
		pd.put("SEND_TIME", DateUtil.getTime());		//发送时间
		pd.put("FHSMS_ID", this.get32UUID());			//主键
		pd.put("TYPE", "1");							//类型1：收信
		pd.put("FROM_USERNAME", USERNAME);				//收信人
		pd.put("TO_USERNAME", "系统消息");
		pd.put("CONTENT", "您申请的任务已经被作废,请到已办任务列表查看");
		pd.put("STATUS", "2");
		ruprocdefService.sendSms(pd);
	}

	/**修改申请状态
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/editSqzt")
	@ResponseBody
	public Object editSqzt()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		ruprocdefService.editSqzt(pd);
		map.put("result", errInfo);						//返回结果
		return map;
	}
}
