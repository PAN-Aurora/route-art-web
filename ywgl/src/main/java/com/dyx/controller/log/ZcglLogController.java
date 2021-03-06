package com.dyx.controller.log;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.service.log.ZcglLogService;
import com.dyx.util.Const;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Description：物资历史信息查询
 * Author：孟凡星
 * Date：2021/1/8
 */
@Controller
@RequestMapping("/wzlog")
public class ZcglLogController extends BaseController {

    /**
     * 注入资产管理-日志记录service层
     */
    @Autowired
    private ZcglLogService zcglLogService;

    /**
     * 物资库存列表   用于弹出选择物资
     *
     * @param page
     * @throws Exception
     */
    @RequestMapping(value = "/list")
    @ResponseBody
    public Object getWzkcList(Page page) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        //分页处理
        pd.put("page", ((Integer.parseInt(pd.get("currentPage").toString())) - 1) * Integer.parseInt(pd.get("pageSize").toString()));
        //查询出来数据分页处理
        page.setPd(pd);
        //列出物资库存列表
        List<PageData> varList = zcglLogService.list(page);
        //返回遍历的数据
        map.put("varList", varList);
        //返回装备实力分页的数据
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        return map;
    }
}
