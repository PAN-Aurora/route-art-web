package com.dyx.mapper.dsno1.tybf;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;
import java.util.Map;

/**
 * 说明： 退役报废明细Mapper
 * 作者：陈磊
 * 时间：2020-12-17
 */
public interface TybfmxMapper {

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
     * 通过id获取退役报废明细
     *
     * @param page
     * @return
     */
    List<PageData> findByMxId(Page page);

    /**
     * 退役报废计划提交后导出
     *
     * @param pd
     * @return
     */
    List<Map> listAllForWord(PageData pd);

    /**
     * 更新修理计划行
     *
     * @param pd
     */
    void updateRow(PageData pd);


    /**
     * 关联资产管理-物资采购明细数据
     *
     * @throws Exception
     */
    void deleteByXljhID(PageData pd);

    /**
     * 批量保存退役报废明细数据
     *
     * @param zbList
     */
    void insertTybfmxBatch(List<PageData> zbList);

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    void deleteAll(String[] ArrayDATA_IDS);
}

