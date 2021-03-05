package com.dyx.service.system;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

/**
 * 说明：操作日志记录接口
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public interface FHlogService {

    /**
     * 新增
     *
     * @param pd
     * @throws Exception
     */
    public void save(String USERNAME, String CONTENT) throws Exception;

    /**
     * 删除
     *
     * @param pd
     * @throws Exception
     */
    public void delete(PageData pd) throws Exception;

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception;

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    public void deleteAll(String[] ArrayDATA_IDS) throws Exception;

    /**
     * 运维平台首页列表
     *
     * @param page
     * @return
     * @throws Exception
     */
    public List<PageData> ywptFhlogList(Page page) throws Exception;
}
