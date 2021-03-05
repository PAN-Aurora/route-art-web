package com.dyx.util;

import com.dyx.entity.system.User;
import org.apache.shiro.session.Session;

import java.lang.reflect.Field;
import java.text.DecimalFormat;

/**
 * 说明：常量
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public class Const {

    /**
     * 将上传上来的文件转换至 B、KB、MB、GB、TB类型
     *
     * @param size 文件的字节大小
     * @return
     */
    public static String readableFileSize(long size) {
        if (size <= 0) {
            return "0";
        }
        final String[] units = new String[]{"B", "KB", "MB", "GB", "TB"};
        int digitGroups = (int) (Math.log10(size) / Math.log10(1024));
        return new DecimalFormat("#,##0.#").format(size / Math.pow(1024, digitGroups)) + "" + units[digitGroups];
    }

    /**
     * 获取当前用户信息
     *
     * @return
     */
    public static User getUser() {
        //获取session
        Session session = Jurisdiction.getSession();
        //获取当前登录用户
        User user = (User) session.getAttribute(SESSION_USER);
        return user;
    }

    /**
     * 反射获取静态常量
     */
    public static String getConst(String field) {
        try {
            return String.valueOf(Const.class.getField(field).get(null));
        } catch (Exception e) {
//            e.printStackTrace();
            return field;
        }
    }

    /**
     * 反射获取静态常量
     */
    public static String getPrivateConst(String field) {
        try {
            Field f = Const.class.getDeclaredField(field);
            f.setAccessible(true);
            return String.valueOf(f.get(null));
        } catch (Exception e) {
//            e.printStackTrace();
            return field;
        }
    }

    public static final String SESSION_USER = "SESSION_USER";                        //session用的用户
    public static final String SESSION_USERROL = "SESSION_USERROL";                    //用户对象(包含角色信息)
    public static final String SESSION_ROLE_RIGHTS = "SESSION_ROLE_RIGHTS";            //角色菜单权限
    public static final String SHIROSET = "SHIROSET";                                //菜单权限标识
    public static final String SESSION_USERNAME = "USERNAME";                        //用户名
    public static final String SESSION_U_NAME = "SESSION_U_NAME";                    //用户姓名
    public static final String SESSION_ROLE = "SESSION_ROLE";                        //主职角色信息
    public static final String SESSION_RNUMBERS = "RNUMBERS";                        //角色编码数组
    public static final String SESSION_ALLMENU = "SESSION_ALLMENU";                    //全部菜单
    public static final String SKIN = "SKIN";                                        //用户皮肤

    public static final String SYSSET = "config/sysSet.ini";                        //系统设置配置文件路径
    public static final String SYSNAME = "sysName";                                    //系统名称
    public static final String SHOWCOUNT = "showCount";                                //每页条数

    public static final String FILEPATHFILE = "uploadFiles/file/";                    //文件上传路径
    public static final String FILEPATHIMG = "uploadFiles/imgs/";                    //图片上传路径
    public static final String CON_PRINT_PATH = "template/print/";                  //fr3 打印模板路径
    public static final String CON_Excel_PATH = "template/excel/";                //Excel模板路径
    public static final String CON_WORD_TEMP_PATH = "admin/createcode/wordTemp/"; //Word临时文件生成路径

    public static final String FILEACTIVITI = "uploadFiles/activitiFile/";            //工作流生成XML和PNG目录
    public static final String ZZJGID = "a6c6695217ba4a4dbfe9f7e9d2c06730";          //组织机构id
    public static final String ZCGL_ZCYH_ROLEID = "fhadminzhuche";          //注册用户ID


/******************************************************************业务端常量（资产管理）*********************************************************************/
    /**
     * 退役报废申请路径
     */
    public static final String TYBFVIEW = "../../zcgl/tybf/tybf_viewLc.html";

    /**
     * 物资采购申请路径
     */
    public static final String WZCGVIEW = "../../zcgl/wzcg/wzcg_viewLc.html";

    /**
     * 物资交接申请路径
     */
    public static final String WZJJVIEW = "../../zcgl/wzjj/wzjj_viewLc.html";

}

