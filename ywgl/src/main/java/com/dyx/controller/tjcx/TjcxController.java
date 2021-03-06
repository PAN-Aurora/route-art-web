package com.dyx.controller.tjcx;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.User;
import com.dyx.service.tjcx.TjcxService;
import com.dyx.util.Const;
import com.dyx.util.ObjectExcelView;
import com.dyx.util.Tools;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Description：物资统计查询
 * Author：孟凡星
 * Date：2020/12/31
 */
@Controller
@RequestMapping("/tjcx")
public class TjcxController extends BaseController {
    /**
     * 注入资产管理-物资统计查询的service层
     */
    @Autowired
    private TjcxService tjcxService;

    /**
     * 查询物资汇总数据
     *
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
        User user = Const.getUser();
        //把当前用户id放入查询条件中
        pd.put("CJR", user.getUSER_ID());
        //创建人名称
        pd.put("CJRMC",user.getNAME());
        //是否注册用户
        pd.put("ISCOMMON", user.getROLE_ID().equalsIgnoreCase(Const.ZCGL_ZCYH_ROLEID));
        page.setPd(pd);
        //列出数据列表
        List<PageData> varList = tjcxService.list(page);
        //将数据 page返回到前台
        map.put("varList", varList);
        //分页
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 物资明细信息
     *
     * @throws Exception
     */
    @RequestMapping(value = "/mxList")
    @ResponseBody
    public Object mxList(Page page) throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        User user = Const.getUser();
        //把当前用户id放入查询条件中
        pd.put("CJR", user.getUSER_ID());
        //创建人名称
        pd.put("CJRMC",user.getNAME());
        //是否注册用户
        pd.put("ISCOMMON", user.getROLE_ID().equalsIgnoreCase(Const.ZCGL_ZCYH_ROLEID));
        page.setPd(pd);
        //列出数据列表
        List<PageData> varList = tjcxService.mxList(page);
        //将数据 page返回到前台
        map.put("varList", varList);
        //分页
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 查询物资汇总数据
     *
     * @throws Exception
     */
    @RequestMapping(value = "/kclist")
    @ResponseBody
    public Object kclist(Page page) throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();

        User user = Const.getUser();
        //把当前用户id放入查询条件中
        pd.put("CJR", user.getUSER_ID());
        //创建人名称
        pd.put("CJRMC",user.getNAME());
        //是否注册用户
        pd.put("ISCOMMON", user.getROLE_ID().equalsIgnoreCase(Const.ZCGL_ZCYH_ROLEID));
        page.setPd(pd);
        //列出数据列表
        List<PageData> varList = tjcxService.kclist(page);
        //将数据 page返回到前台
        map.put("varList", varList);
        //分页
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        return map;
    }


    /**
     * 查询物资汇总数据
     *
     * @throws Exception
     */
    @RequestMapping(value = "/wzjjjllist")
    @ResponseBody
    public Object wzjjjllist(Page page) throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();

        User user = Const.getUser();
        //把当前用户id放入查询条件中
        pd.put("CJR", user.getUSER_ID());
        //创建人名称
        pd.put("CJRMC",user.getNAME());
        //是否注册用户
        pd.put("ISCOMMON", user.getROLE_ID().equalsIgnoreCase(Const.ZCGL_ZCYH_ROLEID));
        page.setPd(pd);
        //列出数据列表
        List<PageData> varList = tjcxService.wzjjjlList(page);
        //将数据 page返回到前台
        map.put("varList", varList);
        //分页
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        return map;
    }


    /**
     * 导出物资登记数据到excel
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/excel")
    @RequiresPermissions("toExcel")
    public ModelAndView exportExcel() throws Exception {
        //创建ModelAndView对象
        ModelAndView mv = new ModelAndView();
        //创建pd对象
        PageData pd = new PageData();
        //从前台中获取pd值
        pd = this.getPageData();
        //传来id
        String strDataIds = pd.getString("DATA_IDS");
        //分割id导出
        if (Tools.notEmpty(strDataIds)) {
            String[] arrDataIds = strDataIds.split(",");
            pd.put("arrDataIds", arrDataIds);
        }
        try {
            //获取当前用户
            User user = Const.getUser();
            //把当前用户id放入查询条件中
            pd.put("CJR", user.getUSER_ID());
            //创建人名称
            pd.put("CJRMC",user.getNAME());
            //是否注册用户
            pd.put("ISCOMMON", user.getROLE_ID().equalsIgnoreCase(Const.ZCGL_ZCYH_ROLEID));
            //关键词检索条件
            String keyWords = pd.getString("keyWords").replace("%", "\\%");
            //判空校验
            if (Tools.notEmpty(keyWords)) {
                //保存输入的关键字(去除前后空格)
                pd.put("keyWords", keyWords.trim());
            }

            //创建Map对象 用来存放导出的表头 表数据
            Map<String, Object> strMap = new HashMap<String, Object>(16);
            //创建ArrayList 用来存放表头
            List<String> lstTitles = new ArrayList<String>();
            lstTitles.add("物资编号");
            lstTitles.add("物资名称");
            lstTitles.add("物资分类");
            lstTitles.add("生产厂家");
            lstTitles.add("型号");
            lstTitles.add("计量单位");
            lstTitles.add("单价（元）");
            lstTitles.add("责任人");
            lstTitles.add("所属部门");
            lstTitles.add("登记日期");
            lstTitles.add("备注");
            //保存遍历的数据
            strMap.put("titles", lstTitles);
            //查询全部数据
            List<PageData> lstVarO = tjcxService.listAll(pd);
            //用list遍历添加的数据
            List<PageData> lstVar = new ArrayList<PageData>();
            //遍历列名和值相对应
            for (int i = 0; i < lstVarO.size(); i++) {
                //参数保存到集合中
                PageData vpd = new PageData();
                vpd.put("var1", Tools.checkString(lstVarO.get(i).get("WZBH")));
                vpd.put("var2", Tools.checkString(lstVarO.get(i).get("WZMC")));
                vpd.put("var3", Tools.checkString(lstVarO.get(i).get("WZFL")));
                vpd.put("var4", Tools.checkString(lstVarO.get(i).get("SCCJ")));
                vpd.put("var5", Tools.checkString(lstVarO.get(i).get("XH")));
                vpd.put("var6", Tools.checkString(lstVarO.get(i).get("JLDW")));
                vpd.put("var7", Tools.checkString(lstVarO.get(i).get("DJ")));
                vpd.put("var8", Tools.checkString(lstVarO.get(i).get("ZRR")));
                vpd.put("var9", Tools.checkString(lstVarO.get(i).get("SSBM")));
                vpd.put("var10", Tools.checkString(lstVarO.get(i).get("DJRQ")));
                vpd.put("var11", Tools.checkString(lstVarO.get(i).get("BZ")));
                //把遍历的对应的数据添加到varList中
                lstVar.add(vpd);
            }
            //保存遍历的数据
            strMap.put("varList", lstVar);
            //定义导出到EXCEL的方法
            ObjectExcelView oElv = new ObjectExcelView();
            //返回导出execl数据
            mv = new ModelAndView(oElv, strMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        //返回mv
        return mv;
    }


}
