package com.dyx.controller.system;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.Dictionaries;
import com.dyx.entity.system.Role;
import com.dyx.entity.system.User;
import com.dyx.service.system.*;
import com.dyx.util.*;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.session.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletResponse;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 说明：系统用户处理类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/user")
public class UsersController extends BaseController {

    @Autowired
    private UsersService usersService;
    @Autowired
    private RoleService roleService;
    @Autowired
    private UeditorService ueditorService;
    @Autowired
    private FHlogService FHLOG;

    @Autowired
    private DictionariesService dictionariesService;

    /**
     * 用户列表
     *
     * @param page
     * @return
     * @throws Exception
     */
    @RequestMapping("/list")
    @RequiresPermissions("user:list")
    @ResponseBody
    public Object listUsers(Page page) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();

        /*检索条件*/
        String ROLE_ID = pd.getString("ROLE_ID");                        //角色ID
        String keyWords = pd.getString("keyWords").replace("%", "\\%");                        //关键词检索条件
        if (Tools.notEmpty(keyWords)) pd.put("keyWords", keyWords.trim());
        String startTime = pd.getString("startTime");                    //开始时间
        String endTime = pd.getString("endTime");                        //结束时间
        if (Tools.notEmpty(startTime)) pd.put("startTime", startTime + " 00:00:00");
        if (Tools.notEmpty(endTime)) pd.put("endTime", endTime + " 00:00:00");

        page.setPd(pd);
        List<PageData> userList = usersService.userlistPage(page);        //列出用户列表
        pd.put("ROLE_ID", "1");
        List<Role> roleList = roleService.listAllRolesByPId(pd);        //列出所有系统用户角色

        map.put("userList", userList);
        map.put("roleList", roleList);
        map.put("ROLE_ID", ROLE_ID);
        map.put("page", page);
        map.put("pd", pd);

        map.put("result", errInfo);
        return map;
    }

    /**
     * 去新增用户页面
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/goAddUser")
    @RequiresPermissions("user:add")
    @ResponseBody
    public Object goAddUser() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd.put("ROLE_ID", "1");
        List<Role> roleList = roleService.listAllRolesByPId(pd);        //列出所有系统用户角色
        map.put("roleList", roleList);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 去修改用户页面(从系统用户页面修改)
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/goEditUser")
    @RequiresPermissions("user:edit")
    @ResponseBody
    public Object goEditUser() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        if ("1".equals(pd.getString("USER_ID"))) {
            return null;
        }        //不能修改admin用户
        pd.put("ROLE_ID", "1");
        List<Role> roleList = roleService.listAllRolesByPId(pd);    //列出所有系统用户角色
        pd = usersService.findById(pd);                                //根据ID读取
        String ROLE_IDS = pd.getString("ROLE_IDS");                    //副职角色ID
        if (Tools.notEmpty(ROLE_IDS)) {
            String arryROLE_ID[] = ROLE_IDS.split(",");
            for (int i = 0; i < roleList.size(); i++) {
                Role role = roleList.get(i);
                String roleId = role.getROLE_ID();
                for (int n = 0; n < arryROLE_ID.length; n++) {
                    if (arryROLE_ID[n].equals(roleId)) {
                        role.setRIGHTS("1");    //此时的目的是为了修改用户信息上，能看到副职角色都有哪些
                        break;
                    }
                }
            }
        }
        map.put("pd", pd);
        map.put("roleList", roleList);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 去修改用户页面(个人资料修改)
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/goEditMyInfo")
    @ResponseBody
    public Object goEditMyInfo() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        pd.put("ROLE_ID", "1");
        List<Role> roleList = roleService.listAllRolesByPId(pd);    //列出所有系统用户角色
        pd.put("USERNAME", Jurisdiction.getUsername());
        pd = usersService.findByUsername(pd);                        //根据用户名读取
        map.put("pd", pd);
        map.put("roleList", roleList);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 修改用户(系统用户列表修改)
     */
    @RequestMapping(value = "/editUser")
    @RequiresPermissions("user:edit")
    @ResponseBody
    public Object editUser() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        FHLOG.save(Jurisdiction.getUsername(), "从系统用户中修改" + pd.getString("USERNAME") + "的资料");                //记录日志
        if (!Jurisdiction.getUsername().equals(pd.getString("USERNAME"))) { //如果当前登录用户修改用户资料提交的用户名非本人
            if ("admin".equals(pd.getString("USERNAME")) && !"admin".equals(Jurisdiction.getUsername())) {
                return null;
            }    //非admin用户不能修改admin
        } else {    //如果当前登录用户修改用户资料提交的用户名是本人，则不能修改本人的角色ID
            PageData upd = new PageData();
            upd = usersService.findByUsername(pd);
            pd.put("ROLE_ID", upd.getString("ROLE_ID")); //对角色ID还原本人角色ID
            pd.put("ROLE_IDS", Tools.notEmpty(upd.getString("ROLE_IDS")) ? upd.get("ROLE_IDS") : ""); //对角色ID还原本人副职角色ID
        }
        if (pd.getString("PASSWORD") != null && !"".equals(pd.getString("PASSWORD"))) {
            pd.put("PASSWORD", new SimpleHash("SHA-1", pd.getString("USERNAME"), pd.getString("PASSWORD")).toString());
        }
        usersService.editUser(pd);    //执行修改
        map.put("result", errInfo);
        return map;
    }

    /**
     * 修改用户(个人资料修改)
     */
    @RequestMapping(value = "/editUserOwn")
    @ResponseBody
    public Object editUserOwn() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        if (!Jurisdiction.getUsername().equals(pd.getString("USERNAME"))) { //如果当前登录用户修改用户资料提交的用户名非本人
            FHLOG.save(Jurisdiction.getUsername(), "恶意修改用户资料：" + pd.getString("USERNAME"));
            return null;//不能修改非本人的资料
        } else {            //如果当前登录用户修改用户资料提交的用户名是本人，则不能修改本人的角色ID
            PageData upd = new PageData();
            upd = usersService.findByUsername(pd);
            pd.put("USER_ID", upd.getString("USER_ID")); //对ID还原本人ID，防止串改
            pd.put("ROLE_ID", upd.getString("ROLE_ID")); //对角色ID还原本人角色ID
            pd.put("ROLE_IDS", Tools.notEmpty(upd.getString("ROLE_IDS")) ? upd.get("ROLE_IDS") : ""); //对角色ID还原本人副职角色ID
        }
        if (pd.getString("PASSWORD") != null && !"".equals(pd.getString("PASSWORD"))) {
            pd.put("PASSWORD", new SimpleHash("SHA-1", pd.getString("USERNAME"), pd.getString("PASSWORD")).toString());
        }
        usersService.editUser(pd);    //执行修改
        FHLOG.save(Jurisdiction.getUsername(), "从个人资料中修改" + pd.getString("USERNAME") + "的资料");                //记录日志
        map.put("result", errInfo);
        return map;
    }

    /**
     * 判断用户名是否存在
     *
     * @return
     */
    @RequestMapping(value = "/hasUser")
    @ResponseBody
    public Object hasUser() throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        if (usersService.findByUsername(pd) != null) {
            errInfo = "error";
        }
        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 判断邮箱是否存在
     *
     * @return
     */
    @RequestMapping(value = "/hasEmail")
    @ResponseBody
    public Object hasEmail() throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        if (usersService.findByEmail(pd) != null) {
            errInfo = "error";
        }
        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 判断编码是否存在
     *
     * @return
     */
    @RequestMapping(value = "/hasNumber")
    @ResponseBody
    public Object hasNumber() throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        if (usersService.findByNumbe(pd) != null) {
            errInfo = "error";
        }
        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 保存用户
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/saveUser")
    @RequiresPermissions("user:add")
    @ResponseBody
    public Object saveUser() throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        //ID 主键
        pd.put("USER_ID", this.get32UUID());
        //最后登录时间
        pd.put("LAST_LOGIN", "");
        //IP
        pd.put("IP", "");
        //状态
        pd.put("STATUS", "0");
        //提醒天数初始默认值30天
        pd.put("DSTX_SYTS", 30);
        pd.put("SKIN", "pcoded-navbar navbar-image-3,navbar pcoded-header navbar-expand-lg navbar-light header-dark,");        //用户默认皮肤
        pd.put("PASSWORD", new SimpleHash("SHA-1", pd.getString("USERNAME"), pd.getString("PASSWORD")).toString());            //密码加密
        if (null == usersService.findByUsername(pd)) {    //判断用户名是否存在
            usersService.saveUser(pd);                    //执行保存
        } else {
            map.put("result", "failed");
        }
        FHLOG.save(Jurisdiction.getUsername(), "新增用户：" + pd.getString("USERNAME"));                //记录日志
        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 删除用户
     *
     * @return
     */
    @RequestMapping(value = "/deleteUser")
    @RequiresPermissions("user:del")
    @ResponseBody
    public Object deleteUser() throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        PageData pd = new PageData();
        String errInfo = "success";
        pd = this.getPageData();
        FHLOG.save(Jurisdiction.getUsername(), "删除用户ID：" + pd.getString("USER_ID"));                //记录日志
        usersService.deleteUser(pd);            //删除用户
        ueditorService.delete(pd);                //删除副文本关联数据
        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 批量删除
     *
     * @throws Exception
     */
    @RequestMapping(value = "/deleteAllUser")
    @RequiresPermissions("user:del")
    @ResponseBody
    public Object deleteAllUser() throws Exception {
        PageData pd = new PageData();
        Map<String, Object> map = new HashMap<String, Object>();
        pd = this.getPageData();
        String USER_IDS = pd.getString("USER_IDS");
        String errInfo = "success";
        if (Tools.notEmpty(USER_IDS)) {
            String ArrayUSER_IDS[] = USER_IDS.split(",");
            FHLOG.save(Jurisdiction.getUsername(), "批量删除用户");                //记录日志
            usersService.deleteAllUser(ArrayUSER_IDS, USER_IDS);    //删除用户
            ueditorService.deleteAll(ArrayUSER_IDS);            //删除副文本关联数据
            errInfo = "success";
        } else {
            errInfo = "error";
        }
        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 导出用户信息到EXCEL
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/excel")
    @RequiresPermissions("toExcel")
    public ModelAndView exportExcel() throws Exception {
        ModelAndView mv = new ModelAndView();
        PageData pd = new PageData();
        pd = this.getPageData();
        //传来id
        String strDataIds = pd.getString("DATA_IDS");
        //分割id导出
        if (Tools.notEmpty(strDataIds)) {
            String[] arrDataIds = strDataIds.split(",");
            pd.put("arrDataIds", arrDataIds);
        }
        try {

            /*检索条件*/
            //关键词检索条件
            String keyWords = pd.getString("keyWords").replace("%", "\\%");
            if (Tools.notEmpty(keyWords)) pd.put("keyWords", keyWords.trim());
            //开始时间
            String startTime = pd.getString("startTime");
            //结束时间
            String endTime = pd.getString("endTime");
            if (Tools.notEmpty(startTime)) pd.put("startTime", startTime + " 00:00:00");
            if (Tools.notEmpty(endTime)) pd.put("endTime", endTime + " 00:00:00");

            Map<String, Object> dataMap = new HashMap<String, Object>();
            List<String> titles = new ArrayList<String>();
            titles.add("用户名");        //1
            titles.add("编号");        //2
            titles.add("姓名");            //3
            titles.add("职位");            //4
            titles.add("手机");            //5
            titles.add("邮箱");            //6
            titles.add("最近登录");        //7
            titles.add("上次登录IP");    //8
            dataMap.put("titles", titles);
            List<PageData> userList = usersService.listAllUser(pd);
            List<PageData> varList = new ArrayList<PageData>();
            for (int i = 0; i < userList.size(); i++) {
                PageData vpd = new PageData();
                vpd.put("var1", userList.get(i).getString("USERNAME"));        //1
                vpd.put("var2", userList.get(i).getString("NUMBER"));        //2
                vpd.put("var3", userList.get(i).getString("NAME"));            //3
                vpd.put("var4", userList.get(i).getString("ROLE_NAME"));    //4
                vpd.put("var5", userList.get(i).getString("PHONE"));        //5
                vpd.put("var6", userList.get(i).getString("EMAIL"));        //6
                vpd.put("var7", userList.get(i).getString("LAST_LOGIN"));    //7
                vpd.put("var8", userList.get(i).getString("IP"));            //8
                varList.add(vpd);
            }
            dataMap.put("varList", varList);
            ObjectExcelView erv = new ObjectExcelView();                    //执行excel操作
            mv = new ModelAndView(erv, dataMap);
        } catch (Exception e) {
        }
        return mv;
    }

    /**
     * 下载模版
     *
     * @param response
     * @throws Exception
     */
    @RequestMapping(value = "/downExcel")
    public void downExcel(HttpServletResponse response) throws Exception {
        FileDownload.fileDownload(response, PathUtil.getClasspath2() + "Users.xlsx", "Users.xlsx");
    }

    /**
     * 从EXCEL导入到数据库
     *
     * @param file
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/readExcel")
    @RequiresPermissions("fromExcel")
    @SuppressWarnings("unchecked")
    @ResponseBody
    public Object readExcel(@RequestParam(value = "excel", required = false) MultipartFile file) throws Exception {
        //定义错误信息
        List<Map> lstError = new ArrayList<>();
        //返回的错误
        List<Map> resError = new ArrayList<>();
        //定义插入遍历数据
        List<PageData> lstUser = new ArrayList<>();

        try {
            if (null != file && !file.isEmpty()) {
                //文件上传路径
                String filePath = PathUtil.getClasspath2();
                //执行上传
                String fileName = FileUpload.fileUp(file, filePath, "jssc");
                //执行读EXCEL操作,读出的数据导入List 2:从第3行开始；0:从第A列开始；0:第0个sheet
                List<PageData> lstPd = (List) ObjectExcelReadT.readExcel(filePath, fileName, 2, 0, 0);

                /**
                 * 角色
                 * 用户名
                 * 编号
                 * 姓名
                 * 手机号
                 * 邮箱
                 * 备注
                 */
                //有数据进方法
                if (lstPd.size() > 0) {
                    for (int i = 0; i < lstPd.size(); i++) {
                        //保存错误信息
                        //先把数据全部放入pd中，方便后续能直接把错误的数据add到导出list
                        //获取前端传递参数
                        PageData pd = new PageData();
                        //存储错误信息
                        Map errorMap = new HashMap();
                        //判断值是否存在
                        PageData pageData = lstPd.get(i);
                        //定义错误标识
                        boolean bugFlag = false;
                        //定义错误信息
                        StringBuffer errorMessage = new StringBuffer();
                        errorMessage.append("第" + (i + 3) + "行出现错误：");
                        //角色
                        if (pageData.get("var0") != null && !pageData.get("var0").equals("")) {

                            pd = roleService.findByName(pageData.getString("var0"));
                            //角色NAME
                            pd.put("ROLE_NAME", pageData.getString("var0"));
                            //角色ID
                            pd.put("ROLE_ID",pd.get("ROLE_ID"));

                        } else {
                            errorMessage.append("角色不能为空；");
                            bugFlag = true;
                        }
                        //姓名
                        pd.put("USERNAME", lstPd.get(i).getString("var1"));
                        //用户名//判断用户名是否重复
                        if (usersService.findByUsername(pd) == null) {
                            pd.put("USERNAME", lstPd.get(i).getString("var1"));
                            //默认密码a12345
                            pd.put("PASSWORD", new SimpleHash("SHA-1", lstPd.get(i).getString("var1"), "a12345").toString());
                        } else {
                            errorMessage.append("用户名重复；");
                            bugFlag = true;
                        }

                        //编号
                        if (pageData.get("var2") != null && !pageData.get("var2").equals("")) {
                            pd.put("NUMBER", lstPd.get(i).getString("var2"));
                        } else {
                            errorMessage.append("编号不能为空；");
                            bugFlag = true;
                        }

                        //姓名
                        if (pageData.get("var3") != null && !pageData.get("var3").equals("")) {
                            pd.put("NAME", lstPd.get(i).getString("var3"));
                        } else {
                            errorMessage.append("姓名不能为空；");
                            bugFlag = true;
                        }

                        //手机号
                        if (pageData.get("var4") != null && !pageData.get("var4").equals("")) {
                            pd.put("PHONE", lstPd.get(i).getString("var4"));
                        } else {
                            errorMessage.append("手机号不能为空；");
                            bugFlag = true;
                        }

                        //邮箱//邮箱格式不对就跳过
                        if (Tools.checkEmail(lstPd.get(i).getString("var5"))) {
                            pd.put("EMAIL", lstPd.get(i).getString("var5"));
                            //邮箱已存在就跳过
                            if (usersService.findByEmail(pd) != null) {
                                //邮箱已存在
                                errorMessage.append("此邮箱已经存在；");
                                bugFlag = true;
                            }
                        } else {
                            //邮箱格式不对
                            errorMessage.append("邮箱格式错误；");
                            bugFlag = true;
                        }

                        //备注
                        if (pageData.get("var6") != null && !pageData.get("var6").equals("")) {
                            pd.put("BZ", lstPd.get(i).getString("var6"));
                        }

                        //获取session数据
                        Session session = Jurisdiction.getSession();
                        //获取当前中用户信息
                        User user = (User) session.getAttribute(Const.SESSION_USER);
                        //用户主键ID
                        pd.put("USER_ID", this.get32UUID());
                        //最后登录时间
                        pd.put("LAST_LOGIN", "");
                        //IP
                        pd.put("IP", "");
                        //状态
                        pd.put("STATUS", "0");
                        pd.put("SKIN", "pcoded-navbar navbar-image-3,navbar pcoded-header navbar-expand-lg navbar-light header-dark,");                    //默认皮肤
                        //副职角色
                        pd.put("ROLE_IDS", "");
                        //到寿天数 剩余天数默认30天
                        pd.put("DSTX_SYTS", 30);
                        //组织机构id
                        pd.put("DEPT_ID",Const.ZZJGID);
                        //组织机构名称
                        pd.put("DEPT_NAME","组织机构");
                        if (bugFlag) {
                            pd.put("info", errorMap.toString());
                            //错误信息存储里面
                            lstError.add(pd);
                            errorMap.put("info", errorMessage.toString());
                            //错误信息存储里面
                            resError.add(errorMap);
                        } else {
                            //无错误信息，保存
                            lstUser.add(pd);
                        }
                    }
                }
                Map map = new HashMap();
                if (lstError.size() <= 0 && lstUser.size() > 0) {
					usersService.insertUsers(lstUser);
                    map.put("info", "导入成功！");
                } else {
                    map.put("info", "导入失败！");
                }

                resError.add(map);
                return resError;

            }
        } catch (Exception e) {
            e.printStackTrace();
            Map map = new HashMap();
            map.put("info", "导入失败！");
            resError.add(map);
            return resError;
        }
        //返回结果
        return resError;
    }

    /**
     * 去修改用户页面(在线管理页面打开)
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/goEditUfromOnline")
    @ResponseBody
    public Object goEditUfromOnline() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        if ("admin".equals(pd.getString("USERNAME"))) {
            return null;
        }    //不能查看admin用户
        pd.put("ROLE_ID", "1");
        List<Role> roleList = roleService.listAllRolesByPId(pd);    //列出所有系统用户角色
        map.put("fx", "user");
        pd = usersService.findByUsername(pd);                        //根据ID读取
        String ROLE_IDS = pd.getString("ROLE_IDS");                    //副职角色ID
        if (Tools.notEmpty(ROLE_IDS)) {
            String arryROLE_ID[] = ROLE_IDS.split(",");
            for (int i = 0; i < roleList.size(); i++) {
                Role role = roleList.get(i);
                String roleId = role.getROLE_ID();
                for (int n = 0; n < arryROLE_ID.length; n++) {
                    if (arryROLE_ID[n].equals(roleId)) {
                        role.setRIGHTS("1");    //此时的目的是为了修改用户信息上，能看到副职角色都有哪些
                        break;
                    }
                }
            }
        }
        map.put("pd", pd);
        map.put("roleList", roleList);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 查看用户
     *
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/view")
    @ResponseBody
    public Object view() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        String USERNAME = pd.getString("USERNAME");
        if ("admin".equals(USERNAME)) {
            return null;
        }                    //不能查看admin用户
        pd.put("ROLE_ID", "1");
        List<Role> roleList = roleService.listAllRolesByPId(pd);    //列出所有系统用户角色
        pd = usersService.findByUsername(pd);                        //根据ID读取
        map.put("msg", "1");
        if (null == pd) {
            PageData rpd = new PageData();
            rpd.put("RNUMBER", USERNAME);                            //用户名查不到数据时就把数据当作角色的编码去查询角色表
            rpd = roleService.getRoleByRnumber(rpd);
            map.put("rpd", rpd);
            map.put("msg", "2");
        }
        map.put("pd", pd);
        map.put("roleList", roleList);
        map.put("result", errInfo);
        return map;
    }

    /**
     * 显示用户列表(弹窗选择用)
     *
     * @param page
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/listUsersForWindow")
    @ResponseBody
    public Object listUsersForWindow(Page page) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        String keyWords = pd.getString("keyWords").replace("%", "\\%");                        //关键词检索条件
        if (Tools.notEmpty(keyWords)) pd.put("keyWords", keyWords.trim());
        String STRARTTIME = pd.getString("STRARTTIME");                    //开始时间
        String endTime = pd.getString("endTime");                        //结束时间
        if (Tools.notEmpty(STRARTTIME)) pd.put("STRARTTIME", STRARTTIME + " 00:00:00");
        if (Tools.notEmpty(endTime)) pd.put("endTime", endTime + " 00:00:00");
        page.setPd(pd);
        List<PageData> userList = usersService.listUsersBystaff(page);    //列出用户列表(弹窗选择用)
        pd.put("ROLE_ID", "1");
        List<Role> roleList = roleService.listAllRolesByPId(pd);        //列出所有系统用户角色
        map.put("userList", userList);
        map.put("roleList", roleList);
        map.put("page", page);
        map.put("pd", pd);
        map.put("result", errInfo);
        return map;
    }


    /**
     * 更新到寿提醒页面设置的剩余天数
     */
    @RequestMapping(value = "/editSyts")
    @ResponseBody
    public Object editSyts() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        //获取当前用户ID
        String strUserId = Const.getUser().getUSER_ID();
        //把当前用户id放入查询条件中
        pd.put("USER_ID", strUserId);
        //剩余天数
//		String strSyts = pd.getString("SYTS");
//		//如果输入关键字不为空
//		if (Tools.notEmpty(strSyts)) {
//			//保存输入的关键字(去除前后空格)
//			pd.put("strSyts", strSyts.trim());
//		}
        //执行修改
        usersService.editSyts(pd);
        map.put("result", errInfo);
        return map;
    }

}
