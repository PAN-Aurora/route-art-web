package com.dyx.service.wzjj;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;
import java.util.Map;

/**
 * 说明：资产管理-物资交接明细Service接口
 * 作者：杨晨浩
 * 时间：2020-12-17
 */
public interface WzjjmxService {

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
     * 批量添加物资明细数据
     *
     * @param zbList
     */
    public void insertWzjjBatch(List<PageData> zbList);

    /**
     * 通过id获取物资明细
     *
     * @param page
     * @return
     */
    public List<PageData> findByMxId(Page page);

    /**
     * 资产管理-物资交接明细数据列表(全部)
     *
     * @param pd 资产管理-物资交接明细数据列表(全部)
     * @return List<PageData> 资产管理-物资交接明细的数据
     * @throws Exception
     */
    List<Map> listAllForWord(PageData pd) throws Exception;

    /**
     * 更新物资明细行
     *
     * @param pd
     * @throws Exception
     */
    public void updateRow(PageData pd) throws Exception;
}

