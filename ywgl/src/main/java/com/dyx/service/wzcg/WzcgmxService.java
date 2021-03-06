package com.dyx.service.wzcg;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;
import java.util.Map;

/**
 * Description：资产管理-物资采购明细接口
 *
 * @author：李可 Date：2020-12-15
 */
public interface WzcgmxService {

    /**
     * 新增资产管理-物资采购明细数据
     *
     * @param pd 资产管理-物资采购明细接口
     * @throws Exception
     */
    public void save(PageData pd) throws Exception;

    /**
     * 删除资产管理-物资采购明细数据
     *
     * @param pd 资产管理-物资采购明细的数据
     * @throws Exception
     */
    public void delete(PageData pd) throws Exception;

    /**
     * 关联删除资产管理-物资采购数据
     *
     * @throws Exception
     */
    public void deleteByXljhID(PageData pd) throws Exception;

    /**
     * 修改资产管理-物资采购明细数据
     *
     * @param pd 资产管理-物资采购明细的数据
     * @throws Exception
     */
    public void edit(PageData pd) throws Exception;

    /**
     * 资产管理-物资采购数据列表
     *
     * @param page 资产管理-物资采购明细数据列表
     * @return List<PageData> 资产管理-物资采购明细的数据
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception;


    /**
     * 资产管理-物资采购明细列表
     *
     * @param strId 物资采购主表ID
     * @return List<PageData> 资产管理-物资采购明细的数据
     * @throws Exception
     */
    public List<PageData> listMx(String strId) throws Exception;

    /**
     * 通过资产管理-物资采购明细id获取数据
     *
     * @param pd 资产管理-物资采购明细的数据
     * @return PageData 资产管理-物资采购明细的数据
     * @throws Exception
     */
    public PageData findById(PageData pd) throws Exception;

    /**
     * 批量删除资产管理-物资采购明细数据
     *
     * @param arrDataIds 资产管理-物资采购明细的数据
     * @throws Exception
     */
    public void deleteAll(String[] arrDataIds) throws Exception;

    /**
     * 资产管理-物资采购明细数据列表(全部)
     *
     * @param pd 资产管理-物资采购明细数据列表(全部)
     * @return List<PageData> 资产管理-物资采购明细的数据
     * @throws Exception
     */
    public List<Map> listAllForWord(PageData pd) throws Exception;

    /**
     * 批量保存资产管理-物资采购明细数据
     *
     * @param zbList
     * @throws Exception
     */
    public void insertXljhBatch(List<PageData> zbList) throws Exception;

    /**
     * 更新修理计划行
     *
     * @param pd
     * @throws Exception
     */
    public void updateRow(PageData pd) throws Exception;

    /**
     * 通过ID获取指定物资采购明细数据
     *
     * @param page
     * @return
     */
    List<PageData> findByMxId(Page page);
}

