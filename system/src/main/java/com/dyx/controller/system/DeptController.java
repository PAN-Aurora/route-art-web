package com.dyx.controller.system;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.Dept;
import com.dyx.entity.system.User;
import com.dyx.service.system.DeptService;
import com.dyx.util.*;
import net.sf.json.JSONArray;
import org.apache.commons.lang.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.session.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Description：组织机构
 * Author：杨乐天
 * Date：2020/5/18
 */
@Controller
@RequestMapping("/dept")
public class DeptController extends BaseController {

    @Autowired
    private DeptService deptService;

    /**
     * 保存
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/add")
    @RequiresPermissions("dept:add")
    @ResponseBody
    public Object add() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        //主键
        pd.put("DEPT_ID", this.get32UUID());
        String parent_id = pd.getString("PARENT_ID");
        //根据父级ID 获取部门信息
        PageData byParentId = deptService.findByParentId(parent_id);
        if (null == byParentId) {
            pd.put("PATH", "001");
        } else {
//            List<Dept> depts = deptService.listByParentId(parent_id);
            String maxPath = deptService.getMaxPathByPid(parent_id);
            if (maxPath != null) {
                maxPath = maxPath.replaceAll("/", ".");
                String lastPath = maxPath.substring(maxPath.lastIndexOf(".")).substring(1);

                String path = byParentId.getString("PATH").replaceAll("/", ".") + "." + String.format("%03d", Integer.parseInt(lastPath) + 1);
                pd.put("PATH", path);
            } else {
                pd.put("PATH", byParentId.getString("PATH").replaceAll("/", ".") + ".001");
            }
        }
//        PageData pathPd = new PageData();
//        if(pd.getString("PARENT_ID")!= null && !"".equals(pd.getString("PARENT_ID"))){
//            pathPd.put("DEPT_ID", pd.getString("PARENT_ID"));
//            pathPd = deptService.findById(pathPd);
//            pd.put("PATH", pathPd.getString("PATH") + "/" + pd.getString("NAME"));
//        }
        deptService.save(pd);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 删除
     *
     * @throws Exception
     */
    @RequestMapping(value = "/delete")
    @RequiresPermissions("dept:del")
    @ResponseBody
    public Object delete(@RequestParam String DEPT_ID) throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd.put("DEPT_ID", DEPT_ID);
        if (deptService.listByParentId(DEPT_ID).size() > 0) {        //判断是否有子级，是：不允许删除
            errInfo = "error";
        } else {
            deptService.delete(pd);
        }
        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 修改
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/edit")
    @RequiresPermissions("dept:edit")
    @ResponseBody
    public Object edit() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        deptService.edit(pd);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    @RequestMapping(value = "/list")
    @RequiresPermissions("dept:list")
    @ResponseBody
    public Object list(Page page) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        String keyWords = pd.getString("keyWords").replace("%", "\\%");                                //关键词检索条件
        if (Tools.notEmpty(keyWords)) {
            pd.put("keyWords", keyWords.trim());
        }
        String DEPT_ID = null == pd.get("DEPT_ID") ? "" : pd.get("DEPT_ID").toString();
        pd.put("DEPT_ID", DEPT_ID);                    //当作上级ID
        page.setPd(pd);
        List<PageData> varList = deptService.list(page);            //列出Dept列表
        if ("".equals(DEPT_ID) || "0".equals(DEPT_ID)) {
            map.put("PARENT_ID", "0");                                            //上级ID
        } else {
            map.put("PARENT_ID", deptService.findById(pd).getString("PARENT_ID"));    //上级ID
        }
        map.put("varList", varList);
        map.put("page", page);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 显示列表ztree
     *
     * @return
     */
    @RequestMapping(value = "/listTree")
    @RequiresPermissions("dept:list")
    @ResponseBody
    public Object listTree() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        JSONArray arr = JSONArray.fromObject(deptService.listTree("0"));
        String json = arr.toString();
        json = json.replaceAll("DEPT_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("NAME", "name").replaceAll("subDept", "nodes").replaceAll("hasDept", "checked").replaceAll("treeurl", "url");
        map.put("zTreeNodes", json);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 态势页面查询组织机构列表
     *
     * @return
     */
    @RequestMapping(value = "/listDepTree")
    @RequiresPermissions("dept:list")
    @ResponseBody
    public Object listDepTree() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        List<Dept> listDep = deptService.listTree("0");

        map.put("listDep", listDep);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 显示阵地实力列表ztree
     *
     * @return
     */
    @RequestMapping(value = "/listZdslTree")
    @ResponseBody
    public Object listZdslTree() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        JSONArray arr = JSONArray.fromObject(deptService.listZdslTree("0"));
        String json = arr.toString();
        json = json.replaceAll("DEPT_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("NAME", "name").replaceAll("subDept", "nodes").replaceAll("hasDept", "checked").replaceAll("treeurl", "url");
        map.put("zTreeNodes", json);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 校验是否子节点
     *
     * @return
     */
    @RequestMapping(value = "/JYSFZJD")
    @ResponseBody
    public Object JYSFZJD() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        List lstdept = deptService.listByParentId(pd.getString("SSDWNM"));
        if (lstdept.size() > 0) {
            map.put("sfzjd", false);
        } else {
            map.put("sfzjd", true);
        }
        return map;
    }

    /**
     * 获取通过单位内码获取下级单位id
     *
     * @return
     */
    @RequestMapping(value = "/getDeptId")
    @ResponseBody
    public Object getDeptId() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        Page page = new Page();
        pd = this.getPageData();
        page.setPd(pd);
        List<PageData> varList = deptService.getDeptId(page);
        String[] strDeptId = new String[varList.size()];
        for (int i = 0; i < varList.size(); i++) {
            strDeptId[i] = String.valueOf(varList.get(i).getString("DEPT_ID"));
        }
        String strdepts = StringUtils.join(strDeptId, ",");
        map.put("DEPT_IDS", strdepts);
        return map;
    }

    /**
     * 获取所有的组织结构作为单位弹出框
     *
     * @return
     */
    @RequestMapping(value = "/listZjjgTree")
//    @RequiresPermissions("dept:list")
    @ResponseBody
    public Object listZjjgTree() throws Exception {
        //获取session
        Session session = Jurisdiction.getSession();
        //获取当前登录用户
        User user = (User) session.getAttribute(Const.SESSION_USER);
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        JSONArray arr = JSONArray.fromObject(deptService.listZjjgTree(user.getDeptId(), 0));
        String json = arr.toString();
        json = json.replaceAll("DEPT_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("NAME", "label").replaceAll("subDept", "children");
        map.put("zTreeNodes", json);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 单位选择树/懒加载
     */
    @RequestMapping(value = "/deptSelect")
    @ResponseBody
    public String deptSelect() throws Exception {
        //获取session
        Session session = Jurisdiction.getSession();
        //获取当前登录用户
        User user = (User) session.getAttribute(Const.SESSION_USER);
        //获取仓库树形结构数据（递归处理并转为json字符串）
        PageData pd = this.getPageData();

        //初始化加载单位内码为空默认为用户所在单位 isInit-是否初始化加载
        if (pd.get("DEPT_ID") == null) {
            pd.put("DEPT_ID", user.getDeptId());
            pd.put("isInit", "true");
            //二次加载时根据前台
        } else {
            pd.put("isInit", "false");
        }

        //查询数据
        List<PageData> lstDwml = deptService.listLazyDwTree(pd);
        //转换为json数据
        JSONArray arrTreeNodes = JSONArray.fromObject(lstDwml);
        //返回树节点数据
        return arrTreeNodes.toString();
    }

    /**
     * 向上递归获取所有组织机构
     *
     * @return
     */
    @RequestMapping(value = "/delegateTree")
    @ResponseBody
    public Object delegateTree() throws Exception {
        //获取session
        Session session = Jurisdiction.getSession();
        //获取当前登录用户
        User user = (User) session.getAttribute(Const.SESSION_USER);
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd.put("DEPT_ID", user.getDeptId());
        //查询上级单位ids
        String deptIds = deptService.getParentDeptIds(pd);
        deptIds = deptIds.substring(1, deptIds.length());
        String[] arrDataIds = deptIds.split(",");
        //获取该单位的所有上级单位信息
        List<Map<String, Object>> lstDelegateParentDept = deptService.getDelegateParentDept(arrDataIds);
        JSONArray array = TreeUtil.listToTree(lstDelegateParentDept, "0", "DEPT_ID", "PARENT_ID", "children");
        String json = array.toString();
        json = json.replaceAll("DEPT_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("NAME", "label");
        map.put("zTreeNodes", json);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 去新增页面
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/goAdd")
    @RequiresPermissions("dept:add")
    @ResponseBody
    public Object goAdd() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        String DEPT_ID = null == pd.get("DEPT_ID") ? "" : pd.get("DEPT_ID").toString();
        pd.put("DEPT_ID", DEPT_ID);                    //上级ID
        map.put("pds", deptService.findById(pd));                    //传入上级所有信息
        map.put("result", errInfo);
        return map;
    }

    /**
     * 去修改页面
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/goEdit")
    @RequiresPermissions("dept:edit")
    @ResponseBody
    public Object goEdit() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        pd = deptService.findById(pd);                                    //根据ID读取
        map.put("pd", pd);                                                                //放入视图容器
        pd.put("DEPT_ID", pd.get("PARENT_ID").toString());                    //用作上级信息
        map.put("pds", deptService.findById(pd));                            //传入上级所有信息
        map.put("result", errInfo);
        return map;
    }

    /**
     * 去查看页面
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/goView")
    @ResponseBody
    public Object goView() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        //根据ID读取
        pd = deptService.findById(pd);
        //放入视图容器
        map.put("pd", pd);
        //用作上级信息
        PageData pds = new PageData();
        pds.put("DEPT_ID", pd.get("PARENT_ID").toString());
        //传入上级所有信息
        map.put("pds", deptService.findById(pds));
        map.put("result", errInfo);
        return map;
    }

    /**
     * 导出到excel
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/excel")
    public ModelAndView exportExcel() throws Exception {
        ModelAndView mv = new ModelAndView();
        PageData pd = new PageData();
        pd = this.getPageData();
        try {
            //关键词检索条件
            String keyWords = pd.getString("keyWords").replace("%", "\\%");
            //判空校验
            if (Tools.notEmpty(keyWords)) {
                //保存输入的关键字(去除前后空格)
                pd.put("keyWords", keyWords.trim());
            }
            Map<String, Object> dataMap = new HashMap<String, Object>();
            List<String> titles = new ArrayList<String>();
            titles.add("机构");
            titles.add("名称");
            titles.add("战区");
            titles.add("编码");
            titles.add("负责人");
            titles.add("电话");
            titles.add("地址");
            dataMap.put("titles", titles);
            List<PageData> varOList = deptService.listAll(pd);
            List<PageData> varList = new ArrayList<PageData>();
            for (int i = 0; i < varOList.size(); i++) {
                PageData vpd = new PageData();
                vpd.put("var1", varOList.get(i).getString("NAME"));
                vpd.put("var2", varOList.get(i).getString("NAME"));
                vpd.put("var3", varOList.get(i).getString("ZQMC"));
                vpd.put("var4", varOList.get(i).getString("BIANMA"));
                vpd.put("var5", varOList.get(i).getString("HEADMAN"));
                vpd.put("var6", varOList.get(i).getString("TEL"));
                vpd.put("var7", varOList.get(i).getString("ADDRESS"));
                varList.add(vpd);
            }
            dataMap.put("varList", varList);
            ObjectExcelView erv = new ObjectExcelView();
            mv = new ModelAndView(erv, dataMap);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return mv;
    }

    /**
     * 态势第一版
     *
     * @param
     * @throws Exception
     */
    @RequestMapping(value = "/listByParentId")
    @ResponseBody
    public Object listByParentId(@RequestParam String DEPT_ID) throws Exception {
        //定义返回集合
        Map<String, Object> map = new HashMap<String, Object>(16);
        //定义但会值
        String errInfo = "success";
        //调用方法
        List<PageData> varList = deptService.listForParentId(DEPT_ID);
        //放入查到的数据
        map.put("varList", varList);
        //总数
        map.put("zs", varList.size());
        //返回结果
        map.put("result", errInfo);
        return map;
    }

    /**
     * 左侧组织机构树/懒加载
     */
    @RequestMapping(value = "/listLazyTree")
    @ResponseBody
    public String listLazyTree() throws Exception {
        //获取仓库树形结构数据（递归处理并转为json字符串）
        PageData pd = this.getPageData();
        //查询数据
        List<PageData> lstZzjg = deptService.listLazyTree(pd);
        //转换为json数据
        JSONArray arrTreeNodes = JSONArray.fromObject(lstZzjg);
        //返回树节点数据
        return arrTreeNodes.toString();
    }

    /**
     * 左侧组织机构树/单位懒加载
     */
    @RequestMapping(value = "/listLazyxzdwTree")
    @ResponseBody
    public String listLazyxzdwTree() throws Exception {
        //获取仓库树形结构数据（递归处理并转为json字符串）
        PageData pd = this.getPageData();
        //查询数据
        List<PageData> lstZzjg = deptService.listLazyxzdwTree(pd);
        //转换为json数据
        JSONArray arrTreeNodes = JSONArray.fromObject(lstZzjg);
        //返回树节点数据
        return arrTreeNodes.toString();
    }

    /**
     * 下载模版
     *
     * @param response
     * @throws Exception
     */
    @RequestMapping(value = "/downExcel")
    public void downExcel(HttpServletResponse response) throws Exception {
//		FileDownload.fileDownload(response, PathUtil.getProjectpath() + Const.FILEPATHFILE + "Dept.xlsx", "Dept.xlsx");
        String path = PathUtil.getClasspath();
        //获取当前使用的系统名称
        String os = System.getProperty("os.name");
        String configFile = "";
        //拼接模板所在的位置路径
        if (os.toLowerCase().contains("windows")) {
            configFile = path + "config/template/excel/Dept.xlsx";
        } else if (os.toLowerCase().contains("linux")) {
            configFile = "/usr/zbbm/config/template/excel/Dept.xlsx";
        }

        FileDownload.fileDownload(response, configFile, "Dept.xlsx");
    }

    /**
     * 从EXCEL按照名称全路径导入到数据库
     *
     * @param file
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/readExcelbymc")
    @RequiresPermissions("fromExcel")
    @SuppressWarnings("unchecked")
    @ResponseBody
    public Object readExcelbymc(@RequestParam(value = "excel", required = false) MultipartFile file) throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        String errInfo = "success";
        if (null != file && !file.isEmpty()) {
            //文件上传路径
            String filePath = PathUtil.getProjectpath() + Const.FILEPATHFILE;
            //执行上传
            String fileName = FileUpload.fileUp(file, filePath, "deptexcel");
            //执行读EXCEL操作,读出的数据导入List 2:从第3行开始；0:从第A列开始；0:第0个sheet
            List<PageData> listPd = (List) ObjectExcelRead.readExcel(filePath, fileName, 3, 0, 0);
            for (int i = 0; i < listPd.size(); i++) {
                PageData pd = new PageData();
                PageData pdExcel = listPd.get(i);
                //ID，设置数据id
                pd.put("DEPT_ID", this.get32UUID());
                //判断必填项是否为空
                if (pdExcel.getString("var0").isEmpty() || pdExcel.getString("var1").isEmpty()) {
                    errInfo = "null";
                    //返回结果
                    map.put("result", errInfo);
                    return map;
                }
                //根据名称全部经判断是否存在该单位，且上级单位是否存在
                String strDwmc = pdExcel.getString("var0");
                //根据/分割单位路径
                String[] arrDwmc = strDwmc.split("/");
                //拼接上级单位全路径
                StringBuffer sbDwmc = new StringBuffer();
                for (int j = 0; j < arrDwmc.length - 1; j++) {
                    sbDwmc.append(arrDwmc[j]).append("/");
                }
                //去除最后一个/
                String strSjdwPath = sbDwmc.toString().substring(0, sbDwmc.toString().length() - 1);
                //查询上级单位信息
                PageData pdSjdw = deptService.findDeptByPath(strSjdwPath);
                //查询本级单位信息
                PageData pdBjdw = deptService.findDeptByPath(strDwmc);
                if (pdSjdw != null && pdBjdw == null) {
                    pd.put("PARENT_ID", pdSjdw.getString("DEPT_ID"));
                } else {
                    errInfo = "dwmc" + (i + 4);
                    //返回结果
                    map.put("result", errInfo);
                    return map;
                }

                //单位名称
                pd.put("NAME", arrDwmc[arrDwmc.length - 1]);
                //单位名称全路径
                pd.put("PATH", pdExcel.getString("var0"));
                //校验当前单位编码是否正确，是否存在
                String strBjjdbm = pdExcel.getString("var1");
//                int intCount = deptService.findByBjjdbm(strBjjdbm);
//                if (intCount > 0) {
//                    errInfo = "bjjdbm"+(i+4);
//                    //返回结果
//                    map.put("result", errInfo);
//                    return map;
//                } else {
                pd.put("BIANMA", strBjjdbm);
//                }
                //获取战区内码
                pd.put("ZQMC", pdExcel.getString("var2"));
//                pd.put("ZQNM", pdExcel.getString("var2"));
                //校验地区是否填写正确
                pd.put("SSQYMC", pdExcel.getString("var3"));
                //电话
                pd.put("TEL", pdExcel.getString("var4"));
                //地址
                pd.put("ADDRESS", pdExcel.getString("var5"));
                //经度
                pd.put("LON", pdExcel.getString("var6"));
                //纬度
                pd.put("LAT", pdExcel.getString("var7"));
                //备注
                pd.put("BZ", pdExcel.getString("var8"));
                deptService.save(pd);
                //更新层级码
//                updateLevel(pd);
            }
        }
        //返回结果
        map.put("result", errInfo);
        return map;
    }
}
