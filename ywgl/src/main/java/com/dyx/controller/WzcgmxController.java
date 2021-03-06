package com.dyx.controller;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.service.wzcg.WzcgmxService;
import com.dyx.util.Const;
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
 * Description：资产管理-物资采购明细Controller层
 *
 * @author：陈磊 Date：2020-12-15
 */
@Controller
@RequestMapping("/wzcgmx")
public class WzcgmxController extends BaseController {

    /**
     * 注入资产管理-物资采购明细的service层
     */
    @Autowired
    private WzcgmxService wzcgmxService;

    /**
     * 保存资产管理—物资采购明细数据
     *
     * @param
     * @return map 资产管理—物资采购明细的数据
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
        pd.put("CJR", Const.getUser().getUSER_ID());
        //创建时间
        pd.put("CJSJ", new Date());
        //状态
        pd.put("ZT", 0);
        //保存资产管理-物资采购明细数据
        wzcgmxService.save(pd);
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
        wzcgmxService.updateRow(pd);
        map.put("pd", pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 删除资产管理—物资采购明细数据
     *
     * @param
     * @return map 资产管理—物资采购明细的数据
     * @throws Exception
     */
    @RequestMapping(value = "/delete")
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
        //资产管理-物资采购明细删除方法
        wzcgmxService.delete(pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 修改资产管理—物资采购明细数据
     *
     * @param
     * @return map 资产管理—物资采购明细的数据
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
        //资产管理-物资采购明细修改方法
        wzcgmxService.edit(pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 资产管理—物资采购明细数据列表
     *
     * @param page 资产管理—物资采购明细的数据
     * @return map 资产管理—物资采购明细的数据
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
        page.setPd(pd);
        //列出数据列表
        List<PageData> varList = wzcgmxService.list(page);
        //将数据 page返回到前台
        map.put("varList", varList);
        //分页
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        return map;
    }



    /**
     * 去资产管理—物资采购明细修改页面获取数据
     *
     * @param
     * @return map 资产管理—物资采购明细的数据
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
        //根据资产管理-物资采购明细ID读取数据
        pd = wzcgmxService.findById(pd);
        //返回pd到前台
        map.put("pd", pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 批量删除资产管理—物资采购明明细数据
     *
     * @param
     * @return map 资产管理—物资采购明细的数据
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
        //修改人
        pd.put("XGR", Const.getUser().getUSER_ID());
        //修改时间
        pd.put("XGSJ", new Date());
        //接收前台点击选择的数据
        String dataIds = pd.getString("DATA_IDS");
        //选择要删除的数据
        if (Tools.notEmpty(dataIds)) {
            //存入数组
            String[] arrDataIds = dataIds.split(",");
            //删除选择数据
            wzcgmxService.deleteAll(arrDataIds);
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

}
