package com.dyx.controller.act.hitask;

import com.dyx.entity.system.User;
import com.dyx.util.Const;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import com.dyx.controller.act.AcBusinessController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.service.act.RuprocdefService;
import com.dyx.util.Jurisdiction;
import com.dyx.util.Tools;
import org.apache.shiro.session.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 说明：已办任务
 * 作者：FH Admin Q31-35-96790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/hitask")
public class HiTaskController extends AcBusinessController {

    @Autowired
    private RuprocdefService ruprocdefService;

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    @RequestMapping(value = "/list")
    @RequiresPermissions("hitask:list")
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
        pd.put("DEPT_ID",user.getDeptId());
        //查询当前用户的任务(用户名查询)
        pd.put("USERNAME", Jurisdiction.getUsername());
        //查询当前用户的任务(角色编码查询)
        pd.put("RNUMBERS", Jurisdiction.getRnumbers());
        page.setPd(pd);
        List<PageData> varList = ruprocdefService.hitasklist(page);    //列出历史任务列表
        for (int i = 0; i < varList.size(); i++) {
            Long ztime = Long.parseLong(varList.get(i).get("DURATION_").toString());
            Long tian = ztime / (1000 * 60 * 60 * 24);
            Long shi = (ztime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
            Long fen = (ztime % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60) / (1000 * 60);
            Long miao = (ztime % (1000 * 60 * 60 * 24)) % (1000 * 60 * 60) % (1000 * 60) / 1000;
            varList.get(i).put("ZTIME", tian + "天" + shi + "时" + fen + "分" + miao + "秒");
//            varList.get(i).put("INITATOR", getInitiator(varList.get(i).getString("PROC_INST_ID_")));//流程申请人
        }
        map.put("varList", varList);
        map.put("page", page);
        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 已办任务列表(只显示5条,用于门户显示)
     *
     * @param page
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/getList")
    @ResponseBody
    public Object getList(Page page) throws Exception {
        PageData pd = new PageData();
        pd = this.getPageData();
        Map<String, Object> map = new HashMap<String, Object>();
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
        page.setPd(pd);
        List<PageData> varList = ruprocdefService.hitasklist(page);    //列出hitask列表
        List<PageData> pdList = new ArrayList<PageData>();
        for (int i = 0; i < varList.size(); i++) {
            PageData tpd = new PageData();
            tpd.put("ID_", varList.get(i).getString("ID_"));    //ID
            tpd.put("NAME_", varList.get(i).getString("NAME_"));    //任务名称
            tpd.put("PNAME_", varList.get(i).getString("PNAME_"));    //流程名称
            tpd.put("START_TIME_", varList.get(i).get("START_TIME_").toString().substring(0, 10));    //创建时间
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
}
