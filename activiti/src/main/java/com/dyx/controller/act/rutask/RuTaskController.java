package com.dyx.controller.act.rutask;

import com.dyx.entity.system.User;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.session.Session;
import com.dyx.controller.act.AcBusinessController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.service.act.HiprocdefService;
import com.dyx.service.act.RuprocdefService;
import com.dyx.util.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.net.URLDecoder;
import java.util.*;

/**
 * Description：修改流程公共页面
 * Author：何学斌
 * Date：2020/3/5
 */
@Controller
@RequestMapping(value = "/rutask")
public class RuTaskController extends AcBusinessController {

    @Autowired
    private RuprocdefService ruprocdefService;

    @Autowired
    private HiprocdefService hiprocdefService;

    /**
     * 待办任务列表
     *
     * @param page
     * @throws Exception
     */
    @RequestMapping(value = "/list")
    @RequiresPermissions("rutask:list")
    @ResponseBody
    public Object list(Page page) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        String KEYWORDS = pd.getString("keyWords");                        //关键词检索条件
        if (Tools.notEmpty(KEYWORDS)) pd.put("keywords", KEYWORDS.trim());
        String STRARTTIME = pd.getString("STRARTTIME");                    //开始时间
        String ENDTIME = pd.getString("ENDTIME");                        //结束时间
        if (Tools.notEmpty(STRARTTIME)) pd.put("lastStart", STRARTTIME + " 00:00:00");
        if (Tools.notEmpty(ENDTIME)) pd.put("lastEnd", ENDTIME + " 00:00:00");
        //获取Session
        Session session = Jurisdiction.getSession();
        //获取当前登录用户
        User user = (User) session.getAttribute(Const.SESSION_USER);
        //查询用户所在单位具体信息
        pd.put("DEPT_ID", user.getDeptId());
        //查询当前用户的任务(用户名查询)
        pd.put("USERNAME", Jurisdiction.getUsername());
        //查询当前用户的任务(角色编码查询)
        pd.put("RNUMBERS", Jurisdiction.getRnumbers());
        page.setPd(pd);
        List<PageData> varList = ruprocdefService.list(page);    //列出Rutask列表
        map.put("varList", varList);
        map.put("page", page);
        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 待办任务列表(只显示5条,用于后台顶部小铃铛左边显示)
     *
     * @param page
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getList")
    @ResponseBody
    public Object getList(Page page) throws Exception {
        PageData pd = new PageData();
        Map<String, Object> map = new HashMap<String, Object>();
        //获取Session
        Session session = Jurisdiction.getSession();
        //获取当前登录用户
        User user = (User) session.getAttribute(Const.SESSION_USER);
        //查询用户所在单位具体信息
        pd.put("DEPT_ID", user.getDeptId());
        //查询当前用户的任务(用户名查询)
        pd.put("USERNAME", Jurisdiction.getUsername());
        //查询当前用户的任务(角色编码查询)
        pd.put("RNUMBERS", Jurisdiction.getRnumbers());
        page.setPd(pd);
        page.setShowCount(5);
        List<PageData> varList = ruprocdefService.list(page);    //列出Rutask列表
        List<PageData> pdList = new ArrayList<PageData>();
        for (int i = 0; i < varList.size(); i++) {
            PageData tpd = new PageData();
            tpd.put("ID_", varList.get(i).getString("ID_"));    //ID
            tpd.put("NAME_", varList.get(i).getString("NAME_"));    //任务名称
            tpd.put("PNAME_", varList.get(i).getString("PNAME_"));    //流程名称
            tpd.put("CREATE_TIME_", varList.get(i).get("CREATE_TIME_").toString().substring(0, 10));    //创建时间
            tpd.put("ASSIGNEE_", varList.get(i).getString("ASSIGNEE_"));    //申请人
            tpd.put("PROC_INST_ID_", varList.get(i).getString("PROC_INST_ID_"));
            tpd.put("DGRM_RESOURCE_NAME_", varList.get(i).getString("DGRM_RESOURCE_NAME_"));
            tpd.put("INITATOR", varList.get(i).getString("INITATOR"));//计划申请人
            pdList.add(tpd);
        }
        map.put("list", pdList);
        map.put("taskCount", page.getTotalResult());
        return map;
    }

    /**
     * 待办任务列表(只显示5条,用于后台顶部小铃铛左边显示)
     *
     * @param page
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getRuList")
    @ResponseBody
    public Object getRuList(Page page) throws Exception {
        PageData pd = new PageData();
        pd = this.getPageData();
        Map<String, Object> map = new HashMap<String, Object>();
        //获取Session
        Session session = Jurisdiction.getSession();
        //获取当前登录用户
        User user = (User) session.getAttribute(Const.SESSION_USER);
        //查询用户所在单位具体信息
        pd.put("DEPT_ID", user.getDeptId());
        //查询当前用户的任务(用户名查询)
        pd.put("USERNAME", Jurisdiction.getUsername());
        //查询当前用户的任务(角色编码查询)
        pd.put("RNUMBERS", Jurisdiction.getRnumbers());
        page.setPd(pd);
        List<PageData> varList = ruprocdefService.list(page);    //列出Rutask列表
        List<PageData> pdList = new ArrayList<PageData>();
        for (int i = 0; i < varList.size(); i++) {
            PageData tpd = new PageData();
            tpd.put("ID_", varList.get(i).getString("ID_"));    //ID
            tpd.put("NAME_", varList.get(i).getString("NAME_"));    //任务名称
            tpd.put("PNAME_", varList.get(i).getString("PNAME_"));    //流程名称
            tpd.put("CREATE_TIME_", varList.get(i).get("CREATE_TIME_").toString().substring(0, 10));    //创建时间
            tpd.put("ASSIGNEE_", varList.get(i).getString("ASSIGNEE_"));    //流程办理人
            tpd.put("PROC_INST_ID_", varList.get(i).getString("PROC_INST_ID_"));
            tpd.put("PROC_DEF_ID_", varList.get(i).getString("PROC_DEF_ID_"));
            tpd.put("DGRM_RESOURCE_NAME_", varList.get(i).getString("DGRM_RESOURCE_NAME_"));
            tpd.put("INITATOR", varList.get(i).getString("INITATOR"));//计划申请人
            pdList.add(tpd);
        }
        map.put("list", pdList);
        map.put("taskCount", page.getTotalResult());
        return map;
    }

    /**
     * 待办任务数量
     *
     * @param page
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getTaskCount")
    @ResponseBody
    public Object getTaskCount(Page page) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        //获取Session
        Session session = Jurisdiction.getSession();
        //获取当前登录用户
        User user = (User) session.getAttribute(Const.SESSION_USER);
        //查询用户所在单位具体信息
        pd.put("DEPT_ID", user.getDeptId());
        //查询当前用户的任务(用户名查询)
        pd.put("USERNAME", Jurisdiction.getUsername());
        //查询当前用户的任务(角色编码查询)
        pd.put("RNUMBERS", Jurisdiction.getRnumbers());
        page.setPd(pd);
        page.setShowCount(5);
        ruprocdefService.list(page);
        map.put("taskCount", page.getTotalResult());
        map.put("result", errInfo);
        return map;
    }

    /**
     * 去办理任务页面获取数据
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/getHandleData")
    @ResponseBody
    public Object getHandleData() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        //列出流程变量列表
        List<PageData> varList = ruprocdefService.varList(pd);
        for (int i = 0; i < varList.size(); i++) {
            PageData pdList = varList.get(i);
            //设置跳转路径
            if (pdList.get("NAME_").toString().contains("tzUrl")) {
                map.put("tzUrl", pdList.get("TEXT_").toString());
            }

            //设置计划id
            if (pdList.get("NAME_").toString().contains("JHID")) {
                map.put("JHID", pdList.get("TEXT_").toString());
            }

            //设置提交用户
            if (pdList.get("NAME_").toString().contains("TJYH")) {
                map.put("TJYH", pdList.get("TEXT_").toString());
            }

            //设置指定代理人
            if (pdList.get("NAME_").toString().contains("USERNAME")) {
                map.put("ZDDLR", pdList.get("TEXT_").toString());
            }

            //委派标识
            map.put("DELEGATE_TAG_", pdList.get("DELEGATE_TAG_"));
            //委派对象内码
            map.put("ASSIGNEE_", pdList.get("ASSIGNEE_"));
        }
        //历史任务节点列表
        List<PageData> hitaskList = ruprocdefService.hiTaskList(pd);
        //根据耗时的毫秒数计算天时分秒
        for (int i = 0; i < hitaskList.size(); i++) {
            if (null != hitaskList.get(i).get("DURATION_")) {
                Long ztime = Long.parseLong(hitaskList.get(i).get("DURATION_").toString());
                Long tian = ztime / (1000 * 60 * 60 * 24);
                Long shi = (ztime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
                Long fen = (ztime % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60) / (1000 * 60);
                Long miao = (ztime % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60) % (1000 * 60) / 1000;
                hitaskList.get(i).put("ZTIME", tian + "天" + shi + "时" + fen + "分" + miao + "秒");
            }
        }
        String FILENAME = URLDecoder.decode(pd.getString("FILENAME"), "UTF-8");
        //生成当前任务节点的流程图片
        createXmlAndPngAtNowTask(pd.getString("PROC_INST_ID_"), FILENAME);
        String imgSrcPath = PathUtil.getProjectpath() + Const.FILEACTIVITI + FILENAME;
        //解决图片src中文乱码，把图片转成base64格式显示(这样就不用修改tomcat的配置了)
        map.put("imgSrc", "data:image/jpeg;base64," + ImageAnd64Binary.getImageStr(imgSrcPath));
        map.put("hitaskList", hitaskList);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 办理任务
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/handle")
    @RequiresPermissions("rutask:edit")
    @ResponseBody
    public Object handle() throws Exception {
        Map<String, Object> zmap = new HashMap<String, Object>();
        String errInfo = "success";
        Session session = Jurisdiction.getSession();
        PageData pd = new PageData();
        pd = this.getPageData();
        //流程任务ID
        String taskId = pd.getString("ID_");
        String sfrom = "";
        //流程审批结果
        Object ofrom = getVariablesByTaskIdAsMap(taskId, "审批结果");
        if (null != ofrom) {
            sfrom = ofrom.toString();
        }
        Map<String, Object> map = new LinkedHashMap<String, Object>();
        //审批人的姓名+审批意见
        String OPINION = sfrom + Jurisdiction.getName() + ",fh," + pd.getString("OPINION");
        //审批标识
        String msg = pd.getString("msg");
        //批准
        if ("yes".equals(msg)) {
            //审批结果
            map.put("审批结果", "任务由 [" + Jurisdiction.getName() + "] 批准：" + pd.getString("OPINION"));
            //设置流程变量
            setVariablesByTaskIdAsMap(taskId, map);
            setVariablesByTaskId(taskId, "RESULT", "批准");
            //任务结束
            completeMyPersonalTask(taskId);
            //驳回
        } else if ("no".equals(msg)) {
            //审批结果
            map.put("审批结果", "任务由 [" + Jurisdiction.getName() + "] 驳回：" + pd.getString("OPINION"));
            //设置流程变量
            setVariablesByTaskIdAsMap(taskId, map);
            setVariablesByTaskId(taskId, "RESULT", "驳回");
            //任务结束
            completeMyPersonalTask(taskId);
        } else if ("del".equals(msg)) {
            //审批结果
            map.put("审批结果", "任务由 [" + Jurisdiction.getName() + "] 作废：" + pd.getString("OPINION"));
            //作废原因
            String reason = "【作废】"+Jurisdiction.getName()+"："+URLDecoder.decode(pd.getString("OPINION"), "UTF-8");
            pd.put("OPINION",reason);
            //设置流程变量
            setVariablesByTaskIdAsMap(taskId, map);
            setVariablesByTaskId(taskId, "RESULT", "批准");
            //任务结束
            completeMyPersonalTask(taskId);
            //更新历史流程变量
            hiprocdefService.editProcinst(pd);
        }
        //更新委派对象
        ruprocdefService.edit(pd);
        try {
            //移除流程变量(从正在运行中)
            removeVariablesByPROC_INST_ID_(pd.getString("PROC_INST_ID_"), "RESULT");
        } catch (Exception e) {
            /*此流程变量在历史中**/
            System.out.println("=====================================此处控制台异常属于正常现象(流程审批完成时出现)=====================================");
        }
//		不需要指定下一步
//		try{
//			String ASSIGNEE_ = pd.getString("ASSIGNEE_");							//下一待办对象
//			if(Tools.notEmpty(ASSIGNEE_)){
//				setAssignee(session.getAttribute("TASKID").toString(),ASSIGNEE_);	//指定下一任务待办对象
//			}else{
//				Object os = session.getAttribute("YAssignee");
//				if(null != os && !"".equals(os.toString())){
//					ASSIGNEE_ = os.toString();										//没有指定就是默认流程的待办人
//				}else{
//					trySendSms(zmap,pd); 			//没有任务监听时，默认流程结束，发送站内信给任务发起人
//				}
//			}
//			zmap.put("ASSIGNEE_",ASSIGNEE_);		//用于给待办人发送新任务消息
//		}catch(Exception e){
//			zmap.put("ASSIGNEE_","null");
//			/*手动指定下一待办人，才会触发此异常。
//			 * 任务结束不需要指定下一步办理人了,发送站内信通知任务发起人**/
//			trySendSms(zmap,pd);
//		}
        //返回结果
        zmap.put("result", errInfo);
        return zmap;
    }

    /**
     * 发送站内信
     *
     * @param
     * @param pd
     * @throws Exception
     */
    public void trySendSms(Map<String, Object> zmap, PageData pd) throws Exception {
        List<PageData> hivarList = hiprocdefService.hivarList(pd);            //列出历史流程变量列表
        for (int i = 0; i < hivarList.size(); i++) {
            if ("USERNAME".equals(hivarList.get(i).getString("NAME_"))) {
                sendSms(hivarList.get(i).getString("TEXT_"));
                zmap.put("FHSMS", hivarList.get(i).getString("TEXT_"));
                break;
            }
        }
    }

    /**
     * 发站内信通知审批结束
     *
     * @param USERNAME
     * @throws Exception
     */
    public void sendSms(String USERNAME) throws Exception {
        PageData pd = new PageData();
        pd.put("SANME_ID", this.get32UUID());            //ID
        pd.put("SEND_TIME", DateUtil.getTime());        //发送时间
        pd.put("FHSMS_ID", this.get32UUID());            //主键
        pd.put("TYPE", "1");                            //类型1：收信
        pd.put("FROM_USERNAME", USERNAME);                //收信人
        pd.put("TO_USERNAME", "系统消息");
        pd.put("CONTENT", "您申请的任务已经审批完毕,请到已办任务列表查看");
        pd.put("STATUS", "2");
        ruprocdefService.sendSms(pd);
    }

    /**
     * 删除功能
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/delRutask")
    @ResponseBody
    public void delRutask() throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        //定义返回结果
        String errInfo = "success";
        //参数保存到集合中
        PageData pd = new PageData();
        pd = this.getPageData();
        //删除流程任务表
        ruprocdefService.delTask(pd);
        //删除流程变量表
        ruprocdefService.delVariable(pd);
    }

}
