package com.dyx.service.tjcx.Impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.tjcx.TjcxMapper;
import com.dyx.mapper.dsno1.wzdj.WzdjMapper;
import com.dyx.service.tjcx.TjcxService;
import com.dyx.service.wzdj.WzdjService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Description：资产管理-统计查询 ServiceImpl
 *
 * @author：孟凡星 Date：2020/12/31
 */
@Service
@Transactional
public class TjcxServiceImpl implements TjcxService {

    /**
     * 注入资产管理-统计查询的mapper层
     */
    @Autowired
    private TjcxMapper tjcxMapper;


    /**
     * 资产管理-汇总查询
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    @Override
    public List<PageData> list(Page page) throws Exception {
        return tjcxMapper.datalistPage(page);
    }

    /**
     * 资产管理-汇总明细查询
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    @Override
    public List<PageData> mxList(Page page) throws Exception {
        return tjcxMapper.getKcmx(page);
    }

    /**
     * 资产管理-库存查询
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    @Override
    public List<PageData> kclist(Page page) throws Exception {
        return tjcxMapper.kclistPage(page);
    }

    /**
     * 资产管理-物资库存数据列表(全部)
     *
     * @param pd
     * @return List<PageData>所有物资库存数据
     * @throws Exception
     */
    @Override
    public List<PageData> listAll(PageData pd) throws Exception {
        return tjcxMapper.listAll(pd);
    }

    /**
     * 资产管理-物资交接记录查询
     *
     * @param page
     * @return List<PageData>
     * @throws Exception
     */
    @Override
    public List<PageData> wzjjjlList(Page page) throws Exception {
        return tjcxMapper.wzjjjllistPage(page);
    }

}
