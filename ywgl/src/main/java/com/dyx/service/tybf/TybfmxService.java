package com.dyx.service.tybf;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;
import java.util.Map;

/**
 * 说明： 退役报废明细接口
 * 作者：陈磊
 * 时间：2020-12-017
 */
public interface TybfmxService {

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
     * 通过id获取退役报废明细
     *
     * @param page
     * @return
     */
    public List<PageData> findByMxId(Page page);

    /**
     * 退役报废提交后导出word
     *
     * @param pd
     * @return
     * @throws Exception
     */
    public List<Map> listAllForWord(PageData pd) throws Exception;

    /**
     * 更新修理计划行
     *
     * @param pd
     * @throws Exception
     */
    public void updateRow(PageData pd) throws Exception;

    /**
     * 关联删除资产管理-物资采购数据
     *
     * @throws Exception
     */
    public void deleteByXljhID(PageData pd) throws Exception;

    /**
     * 批量保存退役报废明细数据
     *
     * @param zbList
     * @throws Exception
     */
    public void insertTybfmxBatch(List<PageData> zbList) throws Exception;

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    public void deleteAll(String[] ArrayDATA_IDS) throws Exception;

}

