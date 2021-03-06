package com.dyx.service.tjcx;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;

/**
 * Description：资产管理-物资登记数据 Service
 *
 * @author：孟凡星 Date：2020/12/31
 */
public interface TjcxService {

    /**
     * 资产管理-汇总查询
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception;

    /**
     * 资产管理-汇总明细查询
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    public List<PageData> mxList(Page page) throws Exception;


    /**
     * 资产管理-库存查询
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    public List<PageData> kclist(Page page) throws Exception;


    /**
     * 资产管理-物资库存数据列表(全部)
     *
     * @param pd
     * @return List<PageData>所有物资库存数据
     * @throws Exception
     */
    public List<PageData> listAll(PageData pd) throws Exception;


    /**
     * 资产管理-物资交接记录查询
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    public List<PageData> wzjjjlList(Page page) throws Exception;


}

