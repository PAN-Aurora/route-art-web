package com.dyx.controller.wzjj;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import com.dyx.service.wzdj.WzdjService;
import com.dyx.service.wzjj.WzjjmxService;
import com.dyx.util.Const;
import com.dyx.util.Jurisdiction;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Description：资产管理-物资交接明细Controller层
 *
 * @author：杨晨浩
 * Date：2020-12-18
 */
@Controller
@RequestMapping("/wzjjmx")
public class WzjjmxController extends BaseController {

    /**
     * 物资交接明细接口
     */
    @Autowired
    private WzjjmxService wzjjmxService;

    /**
     * 注入资产管理-物资登记的service层
     */
    @Autowired
    private WzdjService wzdjService;


    /**
     * 保存资产管理—物资交接明细数据
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/add")
    @ResponseBody
    public Object add() throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
//      pd.put("ZT", 0);
        //物资交接明细主键
        pd.put("WZJJMX_ID", this.get32UUID());
        //物资交接明细创建人
        pd.put("CJR", Jurisdiction.getUsername());
        //物资交接明细创建时间
        pd.put("CJSJ", new Date());
        //物资交接明细保存方法
        wzjjmxService.save(pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 批量保存资产管理-物资交接明细数据
     *
     * @param
     * @return map 资产管理-物资交接明细的数据
     * @throws Exception
     */
    @RequestMapping(value = "/plAdd")
    @ResponseBody
    public Object plAdd() throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //传来id
        String strDataIds = pd.getString("DATA_IDS");
        //判断strDataIds是否为空
        //将strDataIds以逗号分割变为数组
        String[] arrDataIds = strDataIds.split(",");
        pd.put("arrDataIds", arrDataIds);
        //创建时间
        pd.put("CJSJ", new Date());
        //查询
        List<PageData> lstWzkc = wzdjService.findWzkcByIds(pd);
        //批量保存机动装备-动用使用明细数据
        wzjjmxService.insertWzjjBatch(lstWzkc);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 删除资产管理-物资交接明细
     *
     * @throws Exception
     */
    @RequestMapping(value = "/delete")
    @ResponseBody
    public Object delete() throws Exception {
        //创建HashMap对象
        Map<String, String> map = new HashMap<String, String>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //物资交接明细删除方法
        wzjjmxService.delete(pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 修改物资交接明细
     *
     * @param
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
        //物资交接明细修改人
        pd.put("XGR", Jurisdiction.getUsername());
        //物资交接明细修改时间
        pd.put("XGSJ", new Date());
        //物资交接明细修改方法
        wzjjmxService.edit(pd);
        //返回方法
        map.put("result", errInfo);
        return map;
    }

    /**
     * 资产管理-物资交接明细列表
     *
     * @param page
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
        //关键词检索条件
        String keyWords = pd.getString("keyWords").replace("%", "\\%");
        //获取关键词
        if (Tools.notEmpty(keyWords)) {
            pd.put("keyWords", keyWords.trim());
        }
        page.setPd(pd);
        //列出物资交接明细列表
        List<PageData> varList = wzjjmxService.list(page);
        //将数据 page返回到前台
        map.put("varList", varList);
        //分页
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 去修改页面获取物资交接明细数据
     *
     * @param
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
        //根据ID读取物资交接明细
        pd = wzjjmxService.findById(pd);
        //返回pd到前台
        map.put("pd", pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 更新行
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/updateRow")
    @ResponseBody
    public Object updateRow() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        //获取前端传递参数
        PageData pd = new PageData();
        pd = this.getPageData();
        pd.put("XGR", Const.getUser().getUSER_ID());
        pd.put("XGSJ", new Date());
        //根据ID读取
        wzjjmxService.updateRow(pd);
        map.put("pd", pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }
    /**
     * 批量删除物资交接明细
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/deleteAll")
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
        //传来id
        String strDataIds = pd.getString("DATA_IDS");
        //分割删除
        if (Tools.notEmpty(strDataIds)) {
            String[] arrDataIds = strDataIds.split(",");
            //删除物资交接明细
            wzjjmxService.deleteAll(arrDataIds);
            errInfo = "success";
        } else {
            errInfo = "error";
        }
        //返回结果
        map.put("result", errInfo);
        return map;
    }

}
