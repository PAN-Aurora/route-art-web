package com.dyx.mapper.dsno1.wzdj;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;

/**
 * Description：资产管理-物资登记 mapper
 *
 * @author：杨晨浩 Date：2020/12/15
 */
public interface WzdjMapper {

    /**
     * 获取已审批的采购单号
     */
    List<PageData> getCgdhlistPage(Page page);

    /**
     * 根据采购单号获取采购明细列表
     *
     * @throws Exception
     */
    List<PageData> wzcglistPage(Page page);

    /**
     * 根据添加选取的WZCGMX_ID查询数据
     *
     * @return
     */
    List<PageData> findByIds(PageData pd);

    /**
     * 根据WZDJ_ID查询数据
     *
     * @return
     */
    List<PageData> findById(PageData pd);

    /**
     * 批量插入物资信息
     *
     * @param lstDjsj
     */
    void insertWzBatch(List<PageData> lstDjsj);

    /**
     * 更改已插入到物资登记表中的数据在物资采购明细表的状态
     *
     * @param pd
     * @throws Exception
     */
    void updateWzcgmxZt(PageData pd);

    /**
     * 批量更新
     *
     * @param pd
     * @throws Exception
     */
    void editAll(PageData pd);

    /**
     * 将已登记物资插入物资库存表
     *
     * @param pd
     */
    void insertKcBatch(PageData pd);

    /**
     * 扫描二维码进行物资登记
     *
     * @param pd
     */
    void updateWzdj(PageData pd);

    /**
     * 修改物资登记数据
     *
     * @param pd
     * @throws Exception
     */
    void edit(PageData pd);

    /**
     * 修改物资状态
     *
     * @param pd
     * @throws Exception
     */
    void updateZt(PageData pd);

    /**
     * 资产管理-物资登记数据列表
     *
     * @param page
     * @return List<PageData>根据CJR过滤后的资产管理-物资登记数据
     * @throws Exception
     */
    List<PageData> datalistPage(Page page);

    /**
     * 资产管理-物资登记数据列表(全部)
     *
     * @param pd
     * @return List<PageData>所有资产管理-物资登记数据
     * @throws Exception
     */
    List<PageData> listAll(PageData pd);

    /**
     * 物资库存列表  用于弹出选择物资数据
     *
     * @param page
     * @throws Exception
     */
    List<PageData> wzkcList(Page page);

    /**
     * 根据物资ids查询装备实力
     *
     * @param pd
     * @return
     */
    List<PageData> findWzkcByIds(PageData pd);

    /**
     * 修改资产管理-物资登记明细数据验证
     *
     * @param pd 资产管理-物资登记明细数据验证
     * @throws Exception
     */
    int validateData(PageData pd);

    /**
     * 修改资产管理-物资登记 登记日期
     *
     * @param pd
     * @throws Exception
     */
    void updateDjrq(PageData pd);

}

