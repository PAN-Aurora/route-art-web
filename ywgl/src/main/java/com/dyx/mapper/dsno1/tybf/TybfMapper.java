package com.dyx.mapper.dsno1.tybf;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;

/**
 * 说明： 退役报废计划Mapper
 * 时间：2020-12-17
 */
public interface TybfMapper {

    /**
     * 新增
     *
     * @param pd
     * @throws Exception
     */
    void save(PageData pd);

    /**
     * 删除
     *
     * @param pd
     * @throws Exception
     */
    void delete(PageData pd);

    /**
     * 修改
     *
     * @param pd
     * @throws Exception
     */
    void edit(PageData pd);

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    List<PageData> datalistPage(Page page);

    /**
     * 列表(全部)
     *
     * @param pd
     * @throws Exception
     */
    List<PageData> listAll(PageData pd);

    /**
     * 通过id获取数据
     *
     * @param pd
     * @throws Exception
     */
    PageData findById(PageData pd);

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    void deleteAll(String[] ArrayDATA_IDS);

    /**
     * 获取当前登录用户单位
     *
     * @throws Exception
     */
    PageData getDeptName(PageData pd);

    /**
     * 退役报废审批完成修改库存状态
     *
     * @param pd
     * @throws Exception
     */
    void updateKcwzzt(PageData pd);
}

