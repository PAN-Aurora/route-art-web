package com.dyx.service.wzjj;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;
import java.util.Map;

/**
 * 说明：资产管理-物资交接Service接口
 * 作者：杨晨浩
 * 时间：2020-12-17
 */
public interface WzjjService {

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
     * 物资交接审核通过后更新责任人
     *
     * @param pd
     * @throws Exception
     */
    public void updateZrr(PageData pd) throws Exception;

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
     * 提交物资交接
     *
     * @param pd
     * @param map
     */
    public void tjsave(PageData pd, Map<String, Object> map) throws Exception;

    /**
     * 物资交接审批完成修改库存状态
     *
     * @param pd
     * @throws Exception
     */
    public void editWzkcZt(PageData pd) throws Exception;

}

