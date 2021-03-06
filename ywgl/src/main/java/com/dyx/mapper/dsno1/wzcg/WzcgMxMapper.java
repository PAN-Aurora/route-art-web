package com.dyx.mapper.dsno1.wzcg;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;
import java.util.Map;

public interface WzcgMxMapper {

    /**
     * 新增资产管理-物资采购明细数据
     *
     * @param pd 资产管理-物资采购明细的数据
     * @throws Exception
     */
    void save(PageData pd);

    /**
     * 删除资产管理-物资采购明细数据
     *
     * @param pd 资产管理-物资采购明细的数据
     * @throws Exception
     */
    void delete(PageData pd);

    /**
     * 关联资产管理-物资采购明细数据
     *
     * @throws Exception
     */
    void deleteByXljhID(PageData pd);

    /**
     * 修改资产管理-物资采购明细数据
     *
     * @param pd 资产管理-物资采购明细的数据
     * @throws Exception
     */
    void edit(PageData pd);

    /**
     * 资产管理-物资采购明细数据列表
     *
     * @param page 机资产管理-物资采购明细数据列表
     * @return List<PageData> 资产管理-物资采购明细的数据
     * @throws Exception
     */
    List<PageData> datalistPage(Page page);

    /**
     * 资产管理-物资采购明细列表
     *
     * @param strId 物资采购主表ID
     * @return List<PageData> 资产管理-物资采购明细的数据
     * @throws Exception
     */
    List<PageData> listMx(String strId);

    /**
     * 通过资产管理-物资采购id获取数据
     *
     * @param pd 资产管理-物资采购明细的数据
     * @return PageData 资产管理-物资采购明细的数据
     * @throws Exception
     */
    PageData findById(PageData pd);

    /**
     * 批量删除资产管理-物资采购明细数据
     *
     * @param arrDataIds 资产管理-物资采购明细的数据
     * @throws Exception
     */
    void deleteAll(String[] arrDataIds);

    /**
     * 资产管理-物资采购明细数据列表(全部)
     *
     * @param pd 资产管理-物资采购明细数据列表(全部)
     * @return List<PageData> 资产管理-物资采购明细的数据
     * @throws Exception
     */
    List<Map> listAllForWord(PageData pd);

    /**
     * 批量保存资产管理-物资采购明细数据
     *
     * @param zbList
     */
    void insertXljhBatch(List<PageData> zbList);

    /**
     * 更新修理计划行
     *
     * @param pd
     */
    void updateRow(PageData pd);

    /**
     * 通过ID获取指定物资采购明细数据
     *
     * @param page
     * @return
     */
    List<PageData> findByMxId(Page page);

}

