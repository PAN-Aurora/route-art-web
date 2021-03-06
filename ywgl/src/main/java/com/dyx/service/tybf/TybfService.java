package com.dyx.service.tybf;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;
import java.util.Map;

/**
 * 说明： 退役报废计划接口
 * 作者：FH Admin QQ313596790
 * 时间：2020-12-07
 * 官网：www.fhadmin.org
 */
public interface TybfService {

    /**
     * 新增
     *
     * @param pd
     * @throws Exception
     */
    public void save(PageData pd) throws Exception;

    /**
     * 删除
     *
     * @param pd
     * @throws Exception
     */
    public void delete(PageData pd) throws Exception;

    /**
     * 修改
     *
     * @param pd
     * @throws Exception
     */
    public void edit(PageData pd) throws Exception;

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception;

    /**
     * 列表(全部)
     *
     * @param pd
     * @throws Exception
     */
    public List<PageData> listAll(PageData pd) throws Exception;

    /**
     * 通过id获取数据
     *
     * @param pd
     * @throws Exception
     */
    public PageData findById(PageData pd) throws Exception;

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    public void deleteAll(String[] ArrayDATA_IDS) throws Exception;

    /**
     * 提交退役报废计划
     *
     * @param pd
     * @param map
     */
    public void tjsave(PageData pd, Map<String, Object> map) throws Exception;


    /**
     * 获取当前登录用户单位
     *
     * @throws Exception
     */
    public PageData getDeptName(PageData pd) throws Exception;

    /**
     * 退役报废审批完成修改库存状态
     *
     * @param pd
     * @throws Exception
     */
    public void updateKcwzzt(PageData pd) throws Exception;

}

