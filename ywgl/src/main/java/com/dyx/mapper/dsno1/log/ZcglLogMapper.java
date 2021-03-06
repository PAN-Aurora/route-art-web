package com.dyx.mapper.dsno1.log;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;

/**
 * Description：资产管理-日志记录 mapper
 * Author：孟凡星
 * Date：2021/1/8
 */
public interface ZcglLogMapper {

    /**
     * 资产管理-日志记录数据列表
     *
     * @param pd
     * @return List<PageData>根据CJR过滤后的资产管理-日志记录数据
     * @throws Exception
     */
    List<PageData> getList(Page pd);

    /**
     * 资产管理-保存物资日志
     *
     * @param lstPd
     * @return List<PageData>根据CJR过滤后的资产管理-日志记录数据
     * @throws Exception
     */
    void batchSave(List<PageData> lstPd);


    /**
     * 资产管理-添加物资登记日志
     *
     * @param pd
     * @return List<PageData>
     * @throws Exception
     */
    void batchInsertWzdj(PageData pd);


}

