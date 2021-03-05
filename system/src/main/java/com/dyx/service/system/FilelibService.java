package com.dyx.service.system;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

/**
 * 说明： 文件上传接口
 * 作者：FH Admin QQ313596790
 * 时间：2020-02-11
 * 官网：www.fhadmin.org
 */
public interface FilelibService {

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
     * 根据业务查询无关联文件
     *
     * @param pd
     * @throws Exception
     */
    public List<PageData> listNonBiz(PageData pd) throws Exception;

    /**
     * 根据业务id查询
     *
     * @param ArrayDATA_IDS
     * @return
     * @throws Exception
     */
    public List<PageData> listByIds(String[] ArrayDATA_IDS) throws Exception;

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
     * 批量插入文件上传
     *
     * @param list
     */
    public Integer insertBatch(List<PageData> list) throws Exception;

    /**
     * 通过bigId查询filelib表
     *
     * @param pd
     * @throws Exception
     */
    public PageData findByBizId(PageData pd) throws Exception;
}

