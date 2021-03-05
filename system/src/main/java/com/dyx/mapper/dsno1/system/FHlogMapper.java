package com.dyx.mapper.dsno1.system;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

/**
 * 说明：操作日志记录Mapper
 * 作者：FH Admin Q313 596-790
 * 官网：www.fhadmin.org
 */
public interface FHlogMapper {

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
     * 列表
     *
     * @param page
     * @throws Exception
     */
    List<PageData> datalistPage(Page page);

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    void deleteAll(String[] ArrayDATA_IDS);

    /**
     * 运维平台首页列表
     *
     * @param page
     * @return
     */
    List<PageData> ywptFhloglistPage(Page page);
}
