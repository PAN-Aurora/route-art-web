package com.dyx.mapper.dsno1.system;

import java.util.List;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

/**
 * 说明： 文件上传Mapper
 * 作者：FH Admin QQ313596790
 * 时间：2020-02-11
 * 官网：www.fhadmin.org
 */
public interface FilelibMapper {

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
     * 修改
     *
     * @param pd
     * @throws Exception
     */
    void edit(PageData pd);

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    List<PageData> datalistPage(Page page);

    /**
     * 列表(全部)
     *
     * @param pd
     * @throws Exception
     */
    List<PageData> listAll(PageData pd);

    /**
     * 根据业务查询无关联文件
     *
     * @param pd
     * @throws Exception
     */
    public List<PageData> listNonBiz(PageData pd);

    /**
     * 根据业务id查询
     *
     * @param ArrayDATA_IDS
     * @return
     * @throws Exception
     */
    List<PageData> listByIds(String[] ArrayDATA_IDS);


    /**
     * 通过id获取数据
     *
     * @param pd
     * @throws Exception
     */
    PageData findById(PageData pd);

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    void deleteAll(String[] ArrayDATA_IDS);

    /**
     * 批量插入文件上传
     *
     * @param list
     */
    Integer insertBatch(List<PageData> list);

    /**
     * 通过bigId查询filelib表
     *
     * @param pd
     */
    PageData findByBizId(PageData pd);
}

