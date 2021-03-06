package com.dyx.service.wzdj;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;

/**
 * Description：资产管理-物资登记数据 Service
 *
 * @author：杨晨浩 Date：2020/12/15
 */
public interface WzdjService {

    /**
     * 获取已审批的采购单
     */
    public List<PageData> getCgdh(Page page) throws Exception;

    /**
     * 根据采购单号获取采购明细列表
     *
     * @throws Exception
     */
    public List<PageData> wzcgList(Page page) throws Exception;

    /**
     * 根据添加选取的WZCGMX_ID查询数据
     *
     * @param pd
     * @return
     * @throws Exception
     */
    public List<PageData> findByIds(PageData pd) throws Exception;

    /**
     * 根据WZJD_ID查询数据
     *
     * @param pd
     * @return
     * @throws Exception
     */
    public List<PageData> findById(PageData pd) throws Exception;

    /**
     * 批量插入物资信息
     *
     * @param lstDjsj
     * @throws Exception
     */
    public void insertWzBatch(List<PageData> lstDjsj) throws Exception;

    /**
     * 将已登记物资插入物资库存表
     *
     * @param
     * @throws Exception
     */
    public void insertKcBatch(PageData pd) throws Exception;

    /**
     * 二维码数据回传 更新
     *
     * @param
     * @throws Exception
     */
    public void updateWzdj(PageData pd) throws Exception;

    /**
     * 更改已插入到物资登记表中的数据在物资采购明细表的状态
     *
     * @throws Exception
     */
    public void updateWzcgmxZt(PageData pd) throws Exception;

    /**
     * 批量更新
     *
     * @throws Exception
     */
    public void editAll(PageData pd) throws Exception;

    /**
     * 修改物资登记数据
     *
     * @throws Exception
     */
    public void edit(PageData pd) throws Exception;

    /**
     * 更改物资状态
     *
     * @throws Exception
     */
    public void updateZt(PageData pd) throws Exception;


    /**
     * 资产管理-物资登记数据列表
     *
     * @param page
     * @return List<PageData>根据CJR过滤后的资产管理-物资登记
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception;

    /**
     * 资产管理-物资登记数据列表(全部)
     *
     * @param pd
     * @return List<PageData>所有物资登记数据
     * @throws Exception
     */
    public List<PageData> listAll(PageData pd) throws Exception;

    /**
     * 物资库存信息列表  用于弹出选择物资数据
     *
     * @param page
     * @throws Exception
     */
    public List<PageData> wzkcList(Page page) throws Exception;

    /**
     * 根据物资库存ids查询实力
     *
     * @param pd
     * @return
     * @throws Exception
     */
    public List<PageData> findWzkcByIds(PageData pd) throws Exception;

    /**
     * 修改资产管理-物资登记明细数据验证
     *
     * @param pd 资产管理-物资登记明细数据验证
     * @throws Exception
     */
    public int validateData(PageData pd) throws Exception;


    /**
     * 修改资产管理-物资登记 登记日期
     *
     * @param pd
     * @throws Exception
     */
    public void updateDjrq(PageData pd) throws Exception;

}

