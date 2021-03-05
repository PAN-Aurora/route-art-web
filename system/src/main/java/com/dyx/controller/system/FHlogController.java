package com.dyx.controller.system;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.service.system.FHlogService;
import com.dyx.util.Tools;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 说明：操作日志记录处理类
 * 作者：FH Admin Q313 596-790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/fhlog")
public class FHlogController extends BaseController {

    @Autowired
    private FHlogService fHlogService;

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    @RequestMapping(value = "/list")
    @RequiresPermissions("fhlog:list")
    @ResponseBody
    public Object list(Page page) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        String keyWords = pd.getString("keyWords");        //关键词检索条件
        if (Tools.notEmpty(keyWords)) {
            pd.put("keyWords", keyWords.trim());
        }
        String startTime = pd.getString("startTime");                    //开始时间
        String endTime = pd.getString("endTime");                        //结束时间
        if (Tools.notEmpty(startTime)) {
            pd.put("startTime", startTime + " 00:00:00");
        }
        if (Tools.notEmpty(endTime)) {
            pd.put("endTime", endTime + " 00:00:00");
        }
        page.setPd(pd);
        List<PageData> varList = fHlogService.list(page);        //列出FHlog列表
        map.put("varList", varList);
        map.put("page", page);
        map.put("pd", pd);
        map.put("result", errInfo);
        return map;
    }


    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    @RequestMapping(value = "/ywptFhlogList")
    @RequiresPermissions("fhlog:list")
    @ResponseBody
    public Object ywptFhlogList(Page page) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        page.setPd(pd);
        //列出FHlog列表
        List<PageData> varList = fHlogService.ywptFhlogList(page);
        map.put("varList", varList);
        map.put("page", page);
        map.put("pd", pd);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 删除
     *
     * @param out
     * @throws Exception
     */
    @RequestMapping(value = "/delete")
    @RequiresPermissions("fhlog:del")
    @ResponseBody
    public Object delete() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        PageData pd = new PageData();
        pd = this.getPageData();
        fHlogService.delete(pd);
        map.put("result", "success");                //返回结果
        return map;
    }

    /**
     * 批量删除
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/deleteAll")
    @RequiresPermissions("fhlog:del")
    @ResponseBody
    public Object deleteAll() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        String DATA_IDS = pd.getString("DATA_IDS");
        if (null != DATA_IDS && !"".equals(DATA_IDS)) {
            String ArrayDATA_IDS[] = DATA_IDS.split(",");
            fHlogService.deleteAll(ArrayDATA_IDS);
        } else {
            errInfo = "error";
        }
        map.put("result", errInfo);                //返回结果
        return map;
    }

}
