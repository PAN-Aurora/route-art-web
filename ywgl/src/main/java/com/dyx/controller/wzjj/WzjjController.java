package com.dyx.controller.wzjj;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.service.act.RuprocdefService;
import com.dyx.service.log.ZcglLogService;
import com.dyx.service.wzjj.WzjjService;
import com.dyx.service.wzjj.WzjjmxService;
import com.dyx.util.*;
import org.apache.commons.collections.map.LinkedMap;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * Description：资产管理-物资交接Controller层
 *
 * @author：杨晨浩 Date：2020-12-17
 */
@Controller
@RequestMapping("/wzjj")
public class WzjjController extends BaseController {
    /**
     * 注入资产管理-物资交接的service层
     */
    @Autowired
    private WzjjService wzjjService;

    /**
     * 注入机资产管理-物资交接明细的service层
     */
    @Autowired
    private WzjjmxService wzjjmxService;

    /**
     * 注入计划流程的service层
     */
    @Autowired
    private RuprocdefService ruprocdefService;

    /**
     * 资产管理日志的service层
     */
    @Autowired
    private ZcglLogService zcglLogService;

    /**
     * 保存资产管理-物资交接数据
     *
     * @param
     * @return map 资产管理-物资交接的数据
     * @throws Exception
     */
    @RequestMapping(value = "/add")
    @ResponseBody
    public Object add() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>(16);
        String errInfo = "edit";
        //创建pd对象
        PageData pd = new PageData();
        pd = this.getPageData();
        //物资交接主键id
        pd.put("WZJJ_ID", this.get32UUID());
        //创建人
        pd.put("CJR", Const.getUser().getUSER_ID());
        //创建时间
        pd.put("CJSJ", new Date());
        //状态
        pd.put("ZT", 0);
        //保存资产管理-物资交接数据
        wzjjService.save(pd);
        map.put("pd", pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 删除资产管理-物资交接数据
     *
     * @param
     * @return map 资产管理-物资交接的数据
     * @throws Exception
     */
    @RequestMapping(value = "/delete")
//    @RequiresPermissions("wzjj:del")
    @ResponseBody
    public Object delete() throws Exception {
        //创建HashMap对象
        Map<String, String> map = new HashMap<String, String>();
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //资产管理-物资交接删除方法
        wzjjService.delete(pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 修改资产管理-物资交接数据
     *
     * @param
     * @return map 资产管理-物资交接的数据
     * @throws Exception
     */
    @RequestMapping(value = "/edit")
    @ResponseBody
    public Object edit() throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //修改人
        pd.put("XGR", Const.getUser().getUSER_ID());
        //修改时间
        pd.put("XGSJ", new Date());
        //资产管理-物资交接修改方法
        wzjjService.edit(pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 提交资产管理-物资交接
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/tjsave")
    @ResponseBody
    public Object tjsave(Page page) throws Exception {
        //创建HashMap对象
        Map<String, Object> zmap = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //修改人
        pd.put("XGR", Const.getUser().getNAME());
        //修改时间
        pd.put("XGSJ", new Date());
        //状态
        pd.put("ZT", 1);
        try {
            /** 工作流的操作 **/
            Map<String, Object> map = new LinkedHashMap<String, Object>();
            //用于获取明细信息
            map.put("JHID", pd.getString("WZJJ_ID"));
            //设置提交用户为当前用户的姓名
            map.put("TJYH", Jurisdiction.getName());
            //指派代理人为当前用户
            map.put("USERNAME", Jurisdiction.getUsername());
            //指定跳转路径
            map.put("tzUrl", Const.WZJJVIEW);
            //记录存入数据库
            wzjjService.tjsave(pd, map);
            //用于给待办人发送新任务消息
            zmap.put("ASSIGNEE_", Jurisdiction.getUsername());
        } catch (Exception e) {
            errInfo = "errer";
        }
        //根据计划ID返回流程相关信息，直接打开审批选人界面
        PageData rutaskPd = new PageData();
        rutaskPd.put("JHID", pd.getString("WZJJ_ID"));
        rutaskPd = ruprocdefService.findRutaskByJhid(rutaskPd);
        //返回结果
        zmap.put("result", errInfo);
        zmap.put("pd", rutaskPd);
        return zmap;
    }


    /**
     * 资产管理-物资交接数据列表
     *
     * @param page 资产管理-物资交接的数据
     * @throws Exception
     */
    @RequestMapping(value = "/list")
    @ResponseBody
    public Object list(Page page) throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //把当前用户id放入查询条件中
        pd.put("CJR", Const.getUser().getUSER_ID());
        //关键词检索条件
        String keyWords = pd.getString("keyWords").replace("%", "\\%");
        //如果输入关键字不为空
        if (Tools.notEmpty(keyWords)) {
            //保存输入的关键字(去除前后空格)
            pd.put("keyWords", keyWords.trim());
        }
        page.setPd(pd);
        //列出数据列表
        List<PageData> varList = wzjjService.list(page);
        //将数据 page返回到前台
        map.put("varList", varList);
        //分页
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 去修改页面获取数据
     *
     * @param
     * @return map 资产管理-物资交接数据
     * @throws Exception
     */
    @RequestMapping(value = "/goEdit")
    @ResponseBody
    public Object goEdit() throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //根据资产管理-物资交接ID读取数据
        pd = wzjjService.findById(pd);
        //返回pd到前台
        map.put("pd", pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 批量删除资产管理-物资交接数据
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/deleteAll")
//    @RequiresPermissions("wzjj:del")
    @ResponseBody
    public Object deleteAll() throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //接收前台点击选择的数据
        String dataIds = pd.getString("DATA_IDS");
        //选择要删除的数据
        if (Tools.notEmpty(dataIds)) {
            //存入数组
            String[] arrDataIds = dataIds.split(",");
            //删除选择数据
            wzjjService.deleteAll(arrDataIds);
            //删除成功，返回success
            errInfo = "success";
        } else {
            //没选择数据,返回提示信息
            errInfo = "error";
        }
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 导出资产管理-物资交接数据到excel
     *
     * @param
     * @return ModelAndView 资产管理-物资交接导出的数据
     * @throws Exception
     */
    @RequestMapping(value = "/excel")
    @RequiresPermissions("toExcel")
    public ModelAndView exportExcel() throws Exception {
        //创建ModelAndView对象
        ModelAndView mv = new ModelAndView();
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //传来id
        String strDataIds = pd.getString("DATA_IDS");
        //分割id导出
        if (Tools.notEmpty(strDataIds)) {
            String[] arrDataIds = strDataIds.split(",");
            pd.put("arrDataIds", arrDataIds);
        }
        try {
            //把当前用户id放入查询条件中
            pd.put("CJR", Const.getUser().getUSER_ID());
            //关键词检索条件
            String keyWords = pd.getString("keyWords").replace("%", "\\%");
            //判空校验
            if (Tools.notEmpty(keyWords)) {
                //保存输入的关键字(去除前后空格)
                pd.put("keyWords", keyWords.trim());
            }
            //开始时间
            String startTime = pd.getString("startTime");
            //判空校验
            if (Tools.notEmpty(startTime)) {
                pd.put("startTime", startTime);
            }
            //结束时间
            String endTime = pd.getString("endTime");
            //判空校验
            if (Tools.notEmpty(endTime)) {
                pd.put("endTime", endTime);
            }
            //创建Map对象 用来存放导出的表头 表数据
            Map<String, Object> dataMap = new HashMap<String, Object>(16);
            //创建ArrayList 用来存放表头
            List<String> titles = new ArrayList<String>();
            titles.add("交接单号");
            titles.add("申请时间");
            titles.add("所属部门");
            titles.add("交接原因");
            titles.add("状态");
            dataMap.put("titles", titles);
            //查询要导出的数据集
            List<PageData> varOList = wzjjService.listAll(pd);
            //创建ArrayList用来存放数据集
            List<PageData> varList = new ArrayList<PageData>();
            //遍历varOList中的数据 获取并放到varList中
            for (int i = 0; i < varOList.size(); i++) {
                String zt = "";
                if ("0".equals(varOList.get(i).get("ZT").toString())) {
                    zt = "未提交";
                } else if ("1".equals(varOList.get(i).get("ZT").toString())) {
                    zt = "审批中";
                } else if ("2".equals(varOList.get(i).get("ZT").toString())) {
                    zt = "已完成";
                } else {
                    zt = "已作废";
                }
                PageData vpd = new PageData();
                vpd.put("var1", Tools.checkString(varOList.get(i).get("JJDH")));
                vpd.put("var2", Tools.checkString(varOList.get(i).get("SQSJ")));
                vpd.put("var3", Tools.checkString(varOList.get(i).get("SSBM")));
                vpd.put("var4", Tools.checkString(varOList.get(i).get("JJYY")));
                vpd.put("var5", zt);
                //遍历数据放入集合中
                varList.add(vpd);
            }
            //将数据varList数据放到dataMap里
            dataMap.put("varList", varList);
            //创建ObjectExcelView对象
            ObjectExcelView erv = new ObjectExcelView();
            //返回结果到前台
            mv = new ModelAndView(erv, dataMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mv;
    }

    /**
     * 流程处理
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/handle")
    @ResponseBody
    public Object handle() throws Exception {
        Map<String, String> map = new HashMap<String, String>(16);
        String errInfo = "success";
        //获取前端传递参数
        PageData pd = new PageData();
        Page page = new Page();
        pd = this.getPageData();
        //审批结果
        String msg = pd.getString("msg");
        //变更ID
        String id = pd.getString("id");
        //物资交接ID
        pd.put("WZJJ_ID", id);
        pd = wzjjService.findById(pd);
        //根据审批结果处理
        if ("yes".equals(msg)) {
            //批准
            //状态 0初始/驳回 1已提交(审批中) 2批准(意味着该申请已完成) 3作废
            pd.put("ZT", "2");
            //更新物资责任人 所属单位
            wzjjService.updateZrr(pd);

            //创建人
            pd.put("CJR", Const.getUser().getUSER_ID());
            //创建人姓名
            pd.put("CJRMC", Const.getUser().getNAME());
            //创建时间
            pd.put("CZSJ", new Date());

            //查询物资交接明细
            List<PageData> lstData = wzjjmxService.listAll(pd);

            //添加物资交接日志记录
            zcglLogService.saveData("WZJJ", pd, lstData);

        } else if ("no".equals(msg)) {
            //驳回 修改状态可以重新修改提交
            pd.put("ZT", "0");
        } else {
            //作废 删除采购以及明细(假删除)
            pd.put("ZT", "3");
        }
        //修改状态
        wzjjService.edit(pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 导出到Word
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/word")
    public void exportWord(HttpServletResponse response, HttpServletRequest request) throws Exception {
        //获取前端传递参数
        PageData pd = new PageData();
        pd = this.getPageData();
        //ftl路径
        String ftlPath = "exportForWord";
        //导出word模板名称
        String strFilename = "物资交接.doc";
        // 导出数据集
        Map dataMap = new LinkedMap();
        // 构造物资交接基本信息
        dataMap = wzjjService.findById(pd);

        // 构造物资交接明细信息
        List<Map> lstMxData = wzjjmxService.listAllForWord(pd);
        // 添加到数据集中
        dataMap.put("wzjjmx", lstMxData);

        //生成文件
        Freemarker.printFile("docWzjj.ftl", dataMap, strFilename, Const.CON_WORD_TEMP_PATH, ftlPath);
        //调用下载方法
        FileDownload.fileDownload(response, PathUtil.getProjectpath() + Const.CON_WORD_TEMP_PATH + strFilename, strFilename);
//        FileDownload.fileDownload(response, PathUtil.getClasspath() + Const.CON_WORD_TEMP_PATH + strFilename, strFilename);
        //删除生成临时文件
//        FileUtil.deleteFile(PathUtil.getClasspath() + Const.CON_WORD_TEMP_PATH + strFilename);
    }

}
