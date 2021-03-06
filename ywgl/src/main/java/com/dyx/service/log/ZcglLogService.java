package com.dyx.service.log;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import oshi.software.os.linux.LinuxFileSystem;

import java.util.List;

/**
 * Description：Description：资产管理-日志记录数据 Service
 * Author：孟凡星
 * Date：2021/1/8
 */
public interface ZcglLogService {

    /**
     * 资产管理-日志记录数据列表
     *
     * @param pd
     * @return List<PageData>资产管理-日志记录
     * @throws Exception
     */
    public List<PageData> list(Page pd) throws Exception;

    /**
     * 资产管理-添加日志
     *
     * @param pd
     * @return List<PageData>资产管理-日志记录
     * @throws Exception
     */
    public void saveData(String bs, PageData pd, List<PageData> lst) throws Exception;

    /**
     * 资产管理-物资登记时添加日志
     *
     * @param pd
     * @return List<PageData>资产管理-日志记录
     * @throws Exception
     */
    public void batchInsertWzdj(PageData pd) throws Exception;


}

