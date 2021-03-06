package com.dyx.mapper.dsno1.wzcg;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;

public interface WzcgMapper {
    /**
     * 新增资产管理-物资采购数据
     *
     * @param pd 资产管理-物资采购的数据
     * @throws Exception
     */
    void save(PageData pd);

    /**
     * 资产管理-物资采购数据
     *
     * @param pd 资产管理-物资采购的数据
     * @throws Exception
     */
    void delete(PageData pd);

    /**
     * 修改资产管理-物资采购数据
     *
     * @param pd 资产管理-物资采购的数据
     * @throws Exception
     */
    void edit(PageData pd);

    /**
     * 资产管理-物资采购数据列表
     *
     * @param page 机资产管理-物资采购数据列表
     * @return List<PageData> 资产管理-物资采购的数据
     * @throws Exception
     */
    List<PageData> datalistPage(Page page);

    /**
     * 资产管理-物资采购数据列表(全部)
     *
     * @param pd 资产管理-物资采购数据列表(全部)
     * @return List<PageData> 资产管理-物资采购的数据
     * @throws Exception
     */
    List<PageData> listAll(PageData pd);

    /**
     * 资产管理-物资采购id获取数据
     *
     * @param pd 资产管理-物资采购的数据
     * @return PageData 资产管理-物资采购的数据
     * @throws Exception
     */
    PageData findById(PageData pd);

    /**
     * 批量删除资产管理-物资采购数据
     *
     * @param arrDataIds 资产管理-物资采购的数据
     * @throws Exception
     */
    void deleteAll(String[] arrDataIds);


    /**
     * 获取当前登录用户单位
     *
     * @throws Exception
     */
    PageData getDeptName(PageData pd);

    /**
     * 修改资产管理-物资采购明细数据验证
     *
     * @param pd 资产管理-物资采购明细数据验证
     * @throws Exception
     */
    int validateData(PageData pd);

    /**
     * 修改资产管理-物资采购登记状态
     *
     * @param pd
     * @throws Exception
     */
    void updateCgZt(PageData pd);

}

