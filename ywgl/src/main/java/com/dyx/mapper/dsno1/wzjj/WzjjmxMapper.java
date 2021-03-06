package com.dyx.mapper.dsno1.wzjj;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;
import java.util.Map;

/**
 * 说明：资产管理-物资交接明细Mapper层
 * 作者：杨晨浩
 * 时间：2020-12-17
 */
public interface WzjjmxMapper {

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
     * 资产管理-物资交接明细数据列表(全部)
     *
     * @param pd 资产管理-物资交接明细数据列表(全部)
     * @return List<PageData> 资产管理-物资交接明细的数据
     * @throws Exception
     */
    List<Map> listAllForWord(PageData pd);

    /**
     * 批量添加物资交接明细数据
     *
     * @param zbList
     */
    void insertWzjjBatch(List<PageData> zbList);

    /**
     * 通过id获取物资交接明细
     *
     * @param page
     * @return
     */
    List<PageData> findByMxId(Page page);

    /**
     * 更新物资交接行
     *
     * @param pd
     */
    void updateRow(PageData pd);
}

