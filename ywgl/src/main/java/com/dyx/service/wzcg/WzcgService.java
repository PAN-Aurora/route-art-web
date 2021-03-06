package com.dyx.service.wzcg;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;
import java.util.Map;

/**
 * Created by zhaozhiwei on 2020/12/15.
 */
public interface WzcgService {

    /**
     * 新增资产管理-物资采购数据
     *
     * @param pd 资产管理-物资采购接口
     * @throws Exception
     */
    public void save(PageData pd) throws Exception;

    /**
     * 删除资产管理-物资采购数据
     *
     * @param pd 资产管理-物资采购的数据
     * @throws Exception
     */
    public void delete(PageData pd) throws Exception;

    /**
     * 修改资产管理-物资采购数据
     *
     * @param pd 资产管理-物资采购的数据
     * @throws Exception
     */
    public void edit(PageData pd) throws Exception;

    /**
     * 资产管理-物资采购数据列表
     *
     * @param page 资产管理-物资采购数据列表
     * @return List<PageData> 资产管理-物资采购的数据
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception;

    /**
     * 资产管理-物资采购数据列表(全部)
     *
     * @param pd 资产管理-物资采购数据列表(全部)
     * @return List<PageData> 资产管理-物资采购的数据
     * @throws Exception
     */
    public List<PageData> listAll(PageData pd) throws Exception;

    /**
     * 通过资产管理-物资采购id获取数据
     *
     * @param pd 资产管理-物资采购的数据
     * @return PageData 资产管理-物资采购的数据
     * @throws Exception
     */
    public PageData findById(PageData pd) throws Exception;

    /**
     * 批量删除资产管理-物资采购数据
     *
     * @param arrDataIds 资产管理-物资采购的数据
     * @throws Exception
     */
    public void deleteAll(String[] arrDataIds) throws Exception;

    /**
     * 提交修理申请
     *
     * @param pd  传值
     * @param map
     * @throws Exception
     */
    public void flowSubmit(PageData pd, Map<String, Object> map) throws Exception;

    /**
     * 获取当前登录用户单位
     *
     * @throws Exception
     */
    public PageData getDeptName(PageData pd) throws Exception;

    /**
     * 修改资产管理-物资采购明细数据验证
     *
     * @param pd 资产管理-物资采购明细数据验证
     * @throws Exception
     */
    public int validateData(PageData pd) throws Exception;

    /**
     * 修改资产管理-物资采购登记状态
     *
     * @param pd
     * @throws Exception
     */
    public void updateCgZt(PageData pd) throws Exception;

}
