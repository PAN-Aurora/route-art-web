package com.dyx.controller.wzdj;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.service.log.ZcglLogService;
import com.dyx.service.wzcg.WzcgService;
import com.dyx.service.wzdj.WzdjService;
import com.dyx.util.*;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;

/**
 * Description：资产管理-物资登记 Controller层
 *
 * @author：杨晨浩 Date：2020/12/15
 */
@Controller
@RequestMapping("/wzdj")
public class WzdjController extends BaseController {
    /**
     * 注入资产管理-物资登记的service层
     */
    @Autowired
    private WzdjService wzdjService;

    /**
     * 注入资产管理-物资采购的service层
     */
    @Autowired
    private WzcgService wzcgService;

    /**
     * 注入资产管理-日志记录service层
     */
    @Autowired
    private ZcglLogService zcglLogService;


    /**
     * 获取已审批的采购单
     *
     * @throws Exception
     */
    @RequestMapping(value = "/generateData")
    @ResponseBody
    public Object generateData(Page page) throws Exception {

        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //创建人
        pd.put("CJR", Const.getUser().getUSER_ID());
        //创建时间
        pd.put("CJSJ", new Date());
        //根据选择明细id查询数据
        List<PageData> lstWzmx = wzdjService.findByIds(pd);
        //定义list接收经过拆分后的总数据
        List<PageData> lstDjsj = new ArrayList<>();
        //定义数量接收每条明细数据的数量，用于后续拆分数据使用
        Integer intSl = 0;
        //遍历选择的明细条数
        for (int i = 0; i < lstWzmx.size(); i++) {
            //接收每条明细的数量
            intSl = (Integer) lstWzmx.get(i).get("SL");
            //按照每条数据的数量进行拆分
            for (int j = 0; j < intSl; j++) {
                //讲拆分后的数据放入list
                lstDjsj.add(lstWzmx.get(i));
            }
        }
        if (lstDjsj.size() > 0) {
            //批量插入选择的物资按照数量拆分后的数据
            wzdjService.insertWzBatch(lstDjsj);
            pd.put("DJZT", 1);
            //更新采购单登记状态
            wzcgService.updateCgZt(pd);
        } else {
            errInfo = "noData";
        }
        //返回结果
        map.put("result", errInfo);
        return map;
    }


    /**
     * 修改资产管理-物资采购明细数据校验
     *
     * @param
     * @return map 资产管理-物资采购明细数据校验
     * @throws Exception
     */
    @RequestMapping(value = "/validateData")
    @ResponseBody
    public Object validateData() throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //资产管理-物资采购修改方法
        int intCount = wzdjService.validateData(pd);
        //返回结果
        map.put("result", intCount == 0);
        return map;
    }


    /**
     * 获取已审批的采购单
     *
     * @throws Exception
     */
    @RequestMapping(value = "/getCgdh")
    @ResponseBody
    public Object getCgdhList(Page page) throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>();
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        page.setPd(pd);
        //列出数据列表
        List<PageData> varList = wzdjService.getCgdh(page);
        //遍历集合
        map.put("varList", varList);
        //分页
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        //将数据 pd返回到前台
        return map;
    }


    /**
     * 根据采购单号获取采购明细列表
     *
     * @throws Exception
     */
    @RequestMapping(value = "/wzcgList")
    @ResponseBody
    public Object wzcgList(Page page) throws Exception {
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
        List<PageData> varList = wzdjService.wzcgList(page);
        //将数据 page返回到前台
        map.put("varList", varList);
        //分页
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 批量保存
     *
     * @return map 批量保存数据
     * @throws Exception
     */
    @RequestMapping(value = "/plSave")
    @ResponseBody
    public Object plSave() throws Exception {
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
        //创建人
        pd.put("CJR", Const.getUser().getUSER_ID());
        //创建时间
        pd.put("CJSJ", new Date());
        //根据选择明细id查询数据
        List<PageData> lstWzmx = wzdjService.findByIds(pd);
        //定义list接收经过拆分后的总数据
        List<PageData> lstDjsj = new ArrayList<>();
        //定义数量接收每条明细数据的数量，用于后续拆分数据使用
        Integer intSl = 0;
        //遍历选择的明细条数
        for (int i = 0; i < lstWzmx.size(); i++) {
            //接收每条明细的数量
            intSl = (Integer) lstWzmx.get(i).get("SL");
            //按照每条数据的数量进行拆分
            for (int j = 0; j < intSl; j++) {
                //讲拆分后的数据放入list
                lstDjsj.add(lstWzmx.get(i));
            }
        }
        if (lstDjsj.size() > 0) {
            //批量插入选择的物资按照数量拆分后的数据
            wzdjService.insertWzBatch(lstDjsj);
            //更改已插入到物资登记表中的数据在物资采购明细表的状态
            wzdjService.updateWzcgmxZt(pd);
        } else {
            errInfo = "noData";
        }

        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 批量保存
     *
     * @return map 批量保存数据
     * @throws Exception
     */
    @RequestMapping(value = "/complete")
    @ResponseBody
    public Object complete() throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //创建人
        pd.put("CJR", Const.getUser().getUSER_ID());
        //状态 默认0
        pd.put("ZT", 0);
        pd.put("DJRQ", new Date());
        //添加至库存表
        wzdjService.insertKcBatch(pd);
        //登记状态
        pd.put("DJZT", 2);
        //更新采购单状态
        wzcgService.updateCgZt(pd);
        //更新物资登记表登记日期
        wzdjService.updateDjrq(pd);

        //添加登记日志记录
        //创建人
        pd.put("CJR", Const.getUser().getUSER_ID());
        //创建人姓名
        pd.put("CJRMC", Const.getUser().getNAME());
        zcglLogService.batchInsertWzdj(pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }


    /**
     * 批量编辑
     *
     * @return map 批量编辑数据
     * @throws Exception
     */
    @RequestMapping(value = "/editAll")
    @ResponseBody
    public Object editAll() throws Exception {
        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //返回参数
        String errInfo = "success";
        //创建pd对象
        PageData pd = new PageData();
        //获取前台传来的pd数据
        pd = this.getPageData();
        //传来id
        String strDataIds = pd.getString("IDS");
        //判断strDataIds是否为空
        //将strDataIds以逗号分割变为数组
        String[] arrDataIds = strDataIds.split(",");
        pd.put("arrDataIds", arrDataIds);

        //批量更新
        wzdjService.editAll(pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }


    /**
     * 修改资产管理-物资登记数据
     *
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
        //资产管理-物资登记修改方法
        wzdjService.edit(pd);
        map.put("pd", pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 物资登记成功后修改状态
     *
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
        //创建人
        pd.put("CJR", Const.getUser().getUSER_ID());
        //创建人姓名
        pd.put("CJRMC", Const.getUser().getNAME());
        //创建时间
        pd.put("CJSJ", new Date());
        //状态
        pd.put("ZT", 1);
        //登记日期
        pd.put("DJRQ", new Date());
        if (Tools.notEmpty(pd.getString("DATA_IDS"))) {
            //传来id
            String strDataIds = pd.getString("DATA_IDS");
            //判断strDataIds是否为空
            //将strDataIds以逗号分割变为数组
            String[] arrDataIds = strDataIds.split(",");
            pd.put("arrDataIds", arrDataIds);
        }
        //物资登记修改状态方法
        wzdjService.updateZt(pd);
        //根据id查询物资数据信息
        List<PageData> lstWz = wzdjService.findById(pd);
        //将已登记物资数据插入物资库存表
//        wzdjService.insertKcBatch(lstWz);
        //添加log日志
        zcglLogService.saveData("WZDJ", pd, lstWz);

        map.put("pd", pd);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 物资登记数据列表
     *
     * @param page
     * @throws Exception
     */
    @RequestMapping(value = "/list")
    @RequiresPermissions("wzdj:list")
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
        //获取当前用户 id
        String strUserId = Const.getUser().getUSER_ID();
        //把当前用户子单位放入查询条件中
        pd.put("CJR", strUserId);
        //关键词检索条件
        String keyWords = pd.getString("keyWords").replace("%", "\\%");
        //判断这个关键词是否为空，不为空则过滤查询
        if (Tools.notEmpty(keyWords)) {
            pd.put("keyWords", keyWords.trim());
        }
        page.setPd(pd);
        //列出物资登记列表
        List<PageData> varList = wzdjService.list(page);
        //将数据 page返回到前台
        map.put("varList", varList);
        //分页
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        //返回map
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
            //获取当前用户ID
            String strUserId = Const.getUser().getUSER_ID();
            //把当前用户id放入查询条件中
            pd.put("CJR", strUserId);
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
            Map<String, Object> strMap = new HashMap<String, Object>(16);
            //创建ArrayList 用来存放表头
            List<String> lstTitles = new ArrayList<String>();
            lstTitles.add("物资名称");
            lstTitles.add("生产厂家");
            lstTitles.add("型号");
            lstTitles.add("物资编号");
            lstTitles.add("计量单位");
            lstTitles.add("单价（元）");
            lstTitles.add("责任人");
            lstTitles.add("所属部门");
            lstTitles.add("登记日期");
            lstTitles.add("备注");
            //保存遍历的数据
            strMap.put("titles", lstTitles);
            //查询全部数据
            List<PageData> lstVarO = wzdjService.listAll(pd);
            //用list遍历添加的数据
            List<PageData> lstVar = new ArrayList<PageData>();
            //遍历列名和值相对应
            for (int i = 0; i < lstVarO.size(); i++) {
                //参数保存到集合中
                PageData vpd = new PageData();
                vpd.put("var1", Tools.checkString(lstVarO.get(i).get("WZMC")));
                vpd.put("var2", Tools.checkString(lstVarO.get(i).get("SCCJ")));
                vpd.put("var3", Tools.checkString(lstVarO.get(i).get("XH")));
                vpd.put("var4", Tools.checkString(lstVarO.get(i).get("WZBH")));
                vpd.put("var5", Tools.checkString(lstVarO.get(i).get("JLDW")));
                vpd.put("var6", Tools.checkString(lstVarO.get(i).get("DJ")));
                vpd.put("var7", Tools.checkString(lstVarO.get(i).get("ZRR")));
                vpd.put("var8", Tools.checkString(lstVarO.get(i).get("SSBM")));
                vpd.put("var9", Tools.checkString(lstVarO.get(i).get("DJRQ")));
                vpd.put("var10", Tools.checkString(lstVarO.get(i).get("BZ")));
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

    /**
     * 物资库存列表   用于弹出选择物资
     *
     * @param page
     * @throws Exception
     */
    @RequestMapping(value = "/getWzkcList")
    @ResponseBody
    public Object getWzkcList(Page page) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        //把当前用户id放入查询条件中
        pd.put("CJR", Const.getUser().getUSER_ID());
        //关键词检索条件
        String keyWords = pd.getString("keyWords").replace("%", "\\%");
        //分页处理
        pd.put("page", ((Integer.parseInt(pd.get("currentPage").toString())) - 1) * Integer.parseInt(pd.get("pageSize").toString()));
        //如果输入关键字不为空
        if (Tools.notEmpty(keyWords)) {
            //保存输入的关键字(去除前后空格)
            pd.put("keyWords", keyWords.trim());
        }
        //查询出来数据分页处理
        page.setPd(pd);
        //列出物资库存列表
        List<PageData> varList = wzdjService.wzkcList(page);
        //返回遍历的数据
        map.put("varList", varList);
        //返回装备实力分页的数据
        map.put("page", page);
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 生成物资明细二维编码
     */
    @RequestMapping(value = "/getWzdjmxCode")
    @ResponseBody
    public void getWzdjmxCode(HttpServletResponse response) throws Exception {
        PageData pd = this.getPageData();
        // 获取物资明细ID
        String strMxid = Tools.checkString(pd.get("MXID"));
        //获取物资明细名称
        String strMxmc = Tools.checkString(pd.get("MXMC"));
        // 定义图片存储路径
        String path = PathUtil.getProjectpath() + strMxid + ".png";
        QRCodeUtil.generateQRCodeImgByChinese(strMxid + "," + strMxmc, 200, 200, path);
        File imgFile = new File(path);
        try (InputStream is = new FileInputStream(imgFile);
             OutputStream os = response.getOutputStream();) {
            // 图片文件流缓存池
            byte[] buffer = new byte[1024];
            while (is.read(buffer) != -1) {
                os.write(buffer);
            }
            os.flush();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        }
    }

    /**
     * 生成物资明细二维编码
     */
    @RequestMapping(value = "/generateQRCodeByCgid")
    @ResponseBody
    public void generateQRCodeByCgid(HttpServletResponse response) throws Exception {

      /*  //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //用于存储图片路径
        List<String> lstImg = new ArrayList();

        PageData pd = this.getPageData();
        // 获取物资明细ID
        String strParam = Tools.checkString(pd.get("param"));

        String[] strArr = strParam.split("\\|");

        if (strArr != null && strArr.length > 0) {

            StringBuffer strBuf = new StringBuffer();

            //遍历明细数据 每5条生成一个二维码
            for (int i = 0; i < strArr.length; i++) {
                strBuf.append(strArr[i]);
                strBuf.append("|");

                if ((i + 1) % 5 == 0) {
                    //删除最后一位拼接字符
                    strBuf = strBuf.deleteCharAt(strBuf.length() - 1);
                    //图片名称
                    String strFileName = (i - 3) + "～" + (i + 1) + ".png";
                    // 定义图片存储路径
                    String path = PathUtil.getClasspath() + Const.getUser().getUSER_ID() + "/" + strFileName;
                    //父级目录不存在时 创建目录
                    FileUtil.createDir(path);

                    BaseUtil.encryption(strBuf.toString());
                    //生成二维码图片到指定位置
                    QRCodeUtil.generateQRCodeImgByChinese(strBuf.toString(), 200, 200, path);
//                    QRCodeUtil.generateQRCodeImgByChinese(BaseUtil.encryption(strBuf.toString()), 200, 200, path);
                    //添加图片路径
                    lstImg.add("/wzdj/showQRCode?strId=" + Const.getUser().getUSER_ID() + "&fileName=" + strFileName);
                    //strBuf置空
                    strBuf = new StringBuffer();
                }
                //遍历到最后时 生成最后几条二维码图片数据到指定位置
                if (i == strArr.length - 1 && (i + 1) % 5 != 0) {
                    //删除最后一位拼接字符
                    strBuf = strBuf.deleteCharAt(strBuf.length() - 1);
                    //图片名称
                    String strFileName = ((strArr.length / 5) * 5) + 1 + "～" + strArr.length + ".png";
                    // 定义图片存储路径
                    String path = PathUtil.getClasspath() + Const.getUser().getUSER_ID() + "/" + strFileName;
                    //父级目录不存在时 创建目录
                    FileUtil.createDir(path);
                    //生成二维码图片到指定位置
                    QRCodeUtil.generateQRCodeImgByChinese(strBuf.toString(), 200, 200, path);
//                    QRCodeUtil.generateQRCodeImgByChinese(BaseUtil.encryption(strBuf.toString()), 200, 200, path);
                    //添加图片路径
                    lstImg.add("/wzdj/showQRCode?strId=" + Const.getUser().getUSER_ID() + "&fileName=" + strFileName);
                }
            }
            map.put("result", "success");
            map.put("imgData", lstImg);
        } else {
            map.put("result", "no");
        }

        return map;*/


        //创建HashMap对象
        Map<String, Object> map = new HashMap<String, Object>(16);
        //用于存储图片路径
        List<String> lstImg = new ArrayList();

        PageData pd = this.getPageData();
        // 获取物资明细ID
        String strParam = Tools.checkString(pd.get("param"));

        String[] strArr = strParam.split("\\|");

        if (strArr != null && strArr.length > 0) {

            StringBuffer strBuf = new StringBuffer();

            //遍历明细数据 每5条生成一个二维码
            for (int i = 0; i < strArr.length; i++) {
                strBuf.append(strArr[i]);
                strBuf.append("|");
            }
            //删除最后一位拼接字符
            strBuf = strBuf.deleteCharAt(strBuf.length() - 1);
            // 定义图片存储路径
            String path = PathUtil.getClasspath() + Const.getUser().getUSER_ID() + "/" + "QRcode.png";
            //父级目录不存在时 创建目录
            FileUtil.createDir(path);
            QRCodeUtil.generateQRCodeImgByChinese(strBuf.toString(), 300, 300, path);
            File imgFile = new File(path);
            try (InputStream is = new FileInputStream(imgFile);
                 OutputStream os = response.getOutputStream();) {
                // 图片文件流缓存池
                byte[] buffer = new byte[1024];
                while (is.read(buffer) != -1) {
                    os.write(buffer);
                }
                os.flush();
            } catch (IOException ioe) {
                ioe.printStackTrace();
            }
        }
    }

    /**
     * 删除生成二维码
     */
    @RequestMapping(value = "/deleteQrCode")
    @ResponseBody
    public void deleteQrCode() throws Exception {
        String filePath = PathUtil.getClasspath() + Const.getUser().getUSER_ID();
        FileUtil.deleteFile(filePath);
    }


    /**
     * 显示二维码
     */
    @RequestMapping(value = "/showQRCode")
    @ResponseBody
    public void showQRCode(HttpServletResponse response) throws Exception {
        try {
            PageData pd = new PageData();
            pd = this.getPageData();
            String filePath = PathUtil.getClasspath() + pd.get("strId") + "/" + pd.get("fileName");
            File file = new File(filePath);
            if (!file.exists()) {
                return;
            }
            FileInputStream inputStream = new FileInputStream(file);
            if (inputStream != null) {
                //得到文件大小
                int i = inputStream.available();
                byte[] data = new byte[i];
                //读数据
                inputStream.read(data);
                inputStream.close();
                OutputStream outputStream = response.getOutputStream();
                outputStream.write(data);
                outputStream.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


    /**
     * 二维码数据回传
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/qrCodeUpload")
    @ResponseBody
    public Object qrCodeUpload() throws Exception {

        //保存返回结果
        Map<String, Object> map = new HashMap<String, Object>();
        PageData pd = new PageData();
        //获取前端返回参数
        pd = this.getPageData();

        List<String> lstRlt = new ArrayList<>();
        try {
            String strParam = Tools.checkString(pd.get("param"));
            //解密
            //String strParam = BaseUtil.decrypt(Tools.checkString(pd.get("param")));

            String[] strArr = strParam.split("\\|");

            for (int i = 0; i < strArr.length; i++) {

                String[] strDataArr = strArr[i].split(",");
                //小于2列时 二维码格式不正确
                if (strDataArr.length < 2) {
                    map.put("msg", "error");
                    return map;
                }
                //ID为空时 跳出循环
                if (strDataArr[0] == null || strDataArr.equals("")) {
                    continue;
                }
                PageData oPd = new PageData();
                //物资采购明细ID
                oPd.put("WZDJ_ID", Tools.checkString(strDataArr[0]));
                //物资编号
                if (strDataArr.length >= 2) {
                    oPd.put("WZBH", Tools.checkString(strDataArr[1]));
                } else {
                    oPd.put("WZBH", "");
                }
                //物资责任人
                if (strDataArr.length >= 3) {
                    oPd.put("ZRR", Tools.checkString(strDataArr[2]));
                } else {
                    oPd.put("ZRR", "");
                }
                //更新物资编号 责任人数据
                wzdjService.updateWzdj(oPd);
            }
            map.put("msg", "success");

        } catch (Exception e) {
            e.printStackTrace();
            map.put("msg", "error");
            return map;
        }
        //上传详情
        map.put("varList", lstRlt);
        return map;
    }
}
