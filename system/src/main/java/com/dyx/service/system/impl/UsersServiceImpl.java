package com.dyx.service.system.impl;

import com.dyx.service.system.UsersService;
import com.dyx.util.RedisUtil;
import com.dyx.util.Tools;

import java.util.List;

import javax.annotation.Resource;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.User;
import com.dyx.mapper.dsno1.system.UsersMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 说明：用户服务接口实现类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class UsersServiceImpl implements UsersService {

    @Autowired
    private UsersMapper usersMapper;


    //----------------------redis使用demo----------------------
    @Resource
    private RedisUtil redisUtil;

    /**
     * redis使用demo
     *
     * @throws Exception
     */
    public void saveToredis() throws Exception {
        redisUtil.set("fhadmin", "你好");
    }
//----------------------redis使用demo----------------------


    /**
     * 通过用户名获取用户信息
     *
     * @param pd
     * @return
     * @throws Exception
     */
    public PageData findByUsername(PageData pd) throws Exception {
        return usersMapper.findByUsername(pd);
    }

    /**
     * 通过用户ID获取用户信息
     *
     * @param pd
     * @return
     * @throws Exception
     */
    public PageData findById(PageData pd) throws Exception {
        return usersMapper.findById(pd);
    }

    /**
     * 用户列表
     *
     * @param page
     * @return
     * @throws Exception
     */
    public List<PageData> userlistPage(Page page) throws Exception {
        return usersMapper.userlistPage(page);
    }

    /**
     * 通过用户ID获取用户信息和角色信息
     *
     * @param USER_ID
     * @return
     * @throws Exception
     */
    public User getUserAndRoleById(String USER_ID) throws Exception {
        return usersMapper.getUserAndRoleById(USER_ID);
    }

    /**
     * 保存用户IP
     *
     * @param pd
     * @throws Exception
     */
    public void saveIP(PageData pd) throws Exception {
        usersMapper.saveIP(pd);
    }

    /**
     * 通过邮箱获取数据
     *
     * @param pd
     * @return
     * @throws Exception
     */
    public PageData findByEmail(PageData pd) throws Exception {
        return usersMapper.findByEmail(pd);
    }

    /**
     * 通过编码获取数据
     *
     * @param pd
     * @return
     * @throws Exception
     */
    public PageData findByNumbe(PageData pd) throws Exception {
        return usersMapper.findByNumbe(pd);
    }

    /**
     * 列出某角色下的所有用户
     *
     * @param pd
     * @return
     * @throws Exception
     */
    public List<PageData> listAllUserByRoldId(PageData pd) throws Exception {
        return usersMapper.listAllUserByRoldId(pd);
    }

    /**
     * 用户列表(全部)
     *
     * @param pd
     * @return
     * @throws Exception
     */
    public List<PageData> listAllUser(PageData pd) throws Exception {
        return usersMapper.listAllUser(pd);
    }

    /**
     * 用户列表(安卓接口同步调用)
     *
     * @param pd
     * @return
     * @throws Exception
     */
    @Override
    public List<PageData> getList(PageData pd) throws Exception {
        return usersMapper.getList(pd);
    }

    /**
     * 用户列表(弹窗选择用)
     *
     * @param page
     * @return
     * @throws Exception
     */
    public List<PageData> listUsersBystaff(Page page) throws Exception {
        return usersMapper.userBystafflistPage(page);
    }

    /**
     * 保存用户
     *
     * @param pd
     * @throws Exception
     */
    public void saveUser(PageData pd) throws Exception {
        usersMapper.saveUser(pd);
        pd.put("tokenKey", Tools.creatTokenKey("userAdd"));
        //LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-dbsync", "user/add", pd);    //请求数据库表同步微服务
    }

    /**
     * 保存用户系统皮肤
     *
     * @param pd
     * @throws Exception
     */
    public void saveSkin(PageData pd) throws Exception {
        usersMapper.saveSkin(pd);
    }

    /**
     * 修改用户
     *
     * @param pd
     * @throws Exception
     */
    public void editUser(PageData pd) throws Exception {
        usersMapper.editUser(pd);
        pd.put("tokenKey", Tools.creatTokenKey("userEdit"));
        //LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-dbsync", "user/edit", pd);    //请求数据库表同步微服务
    }

    /**
     * 删除用户
     *
     * @param pd
     * @throws Exception
     */
    public void deleteUser(PageData pd) throws Exception {
        usersMapper.deleteUser(pd);
        pd.put("tokenKey", Tools.creatTokenKey("userDel"));
        //LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-dbsync", "user/delete", pd);    //请求数据库表同步微服务
    }

    /**
     * 批量删除用户
     *
     * @param pd
     * @throws Exception
     */
    public void deleteAllUser(String[] USER_IDS, String SUSER_ID) throws Exception {
        usersMapper.deleteAllUser(USER_IDS);
        PageData pd = new PageData();
        pd.put("tokenKey", Tools.creatTokenKey("userDelAll"));
        pd.put("SUSER_ID", SUSER_ID);
        //LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-dbsync", "user/deleteAll", pd);    //请求数据库表同步微服务
    }

    /**
     * 更新到寿提醒页面设置的剩余天数
     * @param pd
     * @throws Exception
     */
    public void editSyts(PageData pd) throws Exception {
        usersMapper.editSyts(pd);
    }

    /**
     * 批量插入用户
     * @param lstUser
     * @throws Exception
     */
    @Override
    public void insertUsers(List<PageData> lstUser) throws Exception {
        usersMapper.insertUsers(lstUser);
    }

}
