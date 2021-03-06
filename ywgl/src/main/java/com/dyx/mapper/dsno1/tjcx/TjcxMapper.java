package com.dyx.mapper.dsno1.tjcx;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;

/**
 * Description：资产管理-统计查询 mapper
 *
 * @author：孟凡星 Date：2020/12/31
 */
public interface TjcxMapper {

    /**
     * 资产管理-统计查询数据列表
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    List<PageData> datalistPage(Page page);

    /**
     * 资产管理-汇总明细查询
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    List<PageData> getKcmx(Page page);


    /**
     * 资产管理-库存查询数据列表
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    List<PageData> kclistPage(Page page);

    /**
     * 资产管理-物资库存数据查询（全部）
     *
     * @param pd
     * @return List<PageData>
     * @throws Exception
     */
    List<PageData> listAll(PageData pd);


    /**
     * 资产管理-物资交接记录数据列表
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    List<PageData> wzjjjllistPage(Page page);


}

