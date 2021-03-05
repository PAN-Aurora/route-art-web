package com.dyx.controller.system;

import com.dyx.service.system.CalendarService;
import com.dyx.entity.PageData;
import com.dyx.controller.base.BaseController;
import com.dyx.util.*;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;

/**
 * Description：日历
 * Author：邹靓
 * Date：2020/3/31
 */

@Controller
@RequestMapping("/calendar")
public class CalendarController extends BaseController {

    @Autowired
    private CalendarService calendarService;

    /** 查询事项列表
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping("/list")
    @ResponseBody
    public Object listUsers()throws Exception {
        Map<String,Object> map = new HashMap<String,Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        // 获取当前登录用户名
        pd.put("USERNAME", Jurisdiction.getUsername());
        // 根据用户名获取日历事项
        List<PageData> calList = calendarService.listByUser(pd);
        // 返回参数
        map.put("pd", pd);
        map.put("list", calList);
        map.put("result", errInfo);
        return map;
    }

    /**添加事项
     * @param
     * @return
     * @throws Exception
     */
    @RequestMapping("/saveCalendar")
    @ResponseBody
    public Object saveCalendar()throws Exception {
        Map<String,Object> map = new HashMap<String,Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        // ID
        pd.put("ID", pd.get("ID") == null || "".equals(pd.get("ID")) ? UuidUtil.get32UUID():pd.get("ID"));
        // 用户名
        pd.put("USER", Jurisdiction.getUsername());
        // 开始时间
        pd.put("STARTTIME","".equals(pd.get("STARTTIME"))?null:pd.get("STARTTIME"));
        // 结束时间
        pd.put("ENDTIME","".equals(pd.get("ENDTIME"))?null:pd.get("ENDTIME"));
        // 事项标识（颜色）
        pd.put("CLASSNAME",pd.get("CLASSNAME")==null?pd.get("CLASSNAME[]"):pd.get("CLASSNAME"));
        // 优先级
        pd.put("SORT","".equals(pd.get("SORT"))?null:pd.get("SORT"));
        // 调用保存方法
        calendarService.saveCalendar(pd);
        // 返回参数
        map.put("result", errInfo);
        return map;
    }

    /**删除事项
     * @return
     */
    @RequestMapping(value="/deleteCalendar")
    @ResponseBody
    public Object deleteUser() throws Exception{
        Map<String,String> map = new HashMap<String,String>();
        PageData pd = new PageData();
        String errInfo = "success";
        pd = this.getPageData();
        // 调用删除方法
        calendarService.deleteCalendar(pd);
        // 返回参数
        map.put("result", errInfo);
        return map;
    }

    /**
     * 导出日历数据到excel
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/excel")
    @RequiresPermissions("toExcel")
    public ModelAndView exportExcel() throws Exception {
        ModelAndView mv = new ModelAndView();
        PageData pd = new PageData();
        pd = this.getPageData();
        try {
            // 把当前用户放入查询条件中
            pd.put("USERNAME", Jurisdiction.getUsername());

            Map<String, Object> dataMap = new HashMap<String, Object>(16);
            List<String> titles = new ArrayList<String>();
            titles.add("任务名称");
            titles.add("开始时间");
            titles.add("结束时间");
            titles.add("是否全天事项");
            titles.add("优先级");
            titles.add("链接");
            // 保存遍历的数据
            dataMap.put("titles", titles);
            // 查询全部数据
            List<PageData> lstCal = calendarService.listToExcel(pd);
            // 用list遍历添加的数据
            List<PageData> varList = new ArrayList<PageData>();
            // 遍历列名和值相对应
            for (int i = 0; i < lstCal.size(); i++) {
                // 参数保存到集合中
                PageData vpd = new PageData();
                vpd.put("var1", lstCal.get(i).getString("TITLE"));
                vpd.put("var2", lstCal.get(i).getString("STARTTIME"));
                vpd.put("var3", lstCal.get(i).getString("ENDTIME"));
                vpd.put("var4", lstCal.get(i).get("ALLDAY") != null ? (lstCal.get(i).get("ALLDAY").toString() == "1" ?"是" : "否") : "");
                vpd.put("var5", lstCal.get(i).get("SORT") != null ? (lstCal.get(i).get("SORT").toString() == "1" ?"重要紧急" : (lstCal.get(i).get("SORT").toString() == "2" ? "重要" : "一般")) : "");
                vpd.put("var6", lstCal.get(i).getString("URL"));
                // 把遍历的对应的数据添加到varList中
                varList.add(vpd);
            }
            // 保存遍历的数据
            dataMap.put("varList", varList);
            // 定义导出到EXCEL的方法
            ObjectExcelView erv = new ObjectExcelView();
            // 返回导出execl数据
            mv = new ModelAndView(erv, dataMap);
        } catch (Exception e){
            e.printStackTrace();
        }
        return mv;
    }
}
