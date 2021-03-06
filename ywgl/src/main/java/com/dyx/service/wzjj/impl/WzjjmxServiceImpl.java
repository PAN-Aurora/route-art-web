package com.dyx.service.wzjj.impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import com.dyx.mapper.dsno1.wzjj.WzjjmxMapper;
import com.dyx.service.wzjj.WzjjmxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 说明：资产管理-物资明细接口实现类
 * 作者：杨晨浩
 * 时间：2020-12-17
 */
@Service
@Transactional//开启事物
public class WzjjmxServiceImpl implements WzjjmxService {

    @Autowired
    private WzjjmxMapper wzjjmxMapper;

    /**
     * 新增
     *
     * @param pd
     * @throws Exception
     */
    public void save(PageData pd) throws Exception {
        wzjjmxMapper.save(pd);
    }

    /**
     * 删除资产管理—物资交接明细数据
     *
     * @param pd 资产管理—物资交接明细数据
     * @throws Exception
     */
    public void delete(PageData pd) throws Exception {
        wzjjmxMapper.delete(pd);
    }

    /**
     * 修改资产管理—物资交接明细数据
     *
     * @param pd 资产管理—物资交接明细数据
     * @throws Exception
     */
    public void edit(PageData pd) throws Exception {
        wzjjmxMapper.edit(pd);
    }

    /**
     * 资产管理—物资交接明细数据列表
     *
     * @param page 资产管理—物资交接明细数据列表
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception {
        return wzjjmxMapper.datalistPage(page);
    }

    /**
     * 资产管理—物资交接明细数据列表(全部)
     *
     * @param pd
     * @throws Exception
     */
    public List<PageData> listAll(PageData pd) throws Exception {
        return wzjjmxMapper.listAll(pd);
    }

    /**
     * 通过id获取资产管理—物资交接明细数据数据
     *
     * @param pd
     * @throws Exception
     */
    public PageData findById(PageData pd) throws Exception {
        return wzjjmxMapper.findById(pd);
    }

    /**
     * 批量删除资产管理—物资交接明细数据
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    public void deleteAll(String[] ArrayDATA_IDS) throws Exception {
        wzjjmxMapper.deleteAll(ArrayDATA_IDS);
    }


    /**
     * 批量添加资产管理—物资交接明细数据
     *
     * @param zbList
     */
    @Override
    public void insertWzjjBatch(List<PageData> zbList) {
        wzjjmxMapper.insertWzjjBatch(zbList);
    }

    /**
     * 通过id获取资产管理—物资交接明细
     *
     * @param page
     * @return
     */
    @Override
    public List<PageData> findByMxId(Page page) {
        return wzjjmxMapper.findByMxId(page);
    }

    /**
     * 资产管理—物资交接明细数据列表(全部)
     *
     * @param pd 资产管理—物资交接明细数据列表(全部)
     * @return List<PageData> 资产管理—物资交接明细的数据
     * @throws Exception
     */
    @Override
    public List<Map> listAllForWord(PageData pd) throws Exception {
        return wzjjmxMapper.listAllForWord(pd);
    }

    /**
     * 更新物资交接行
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void updateRow(PageData pd) throws Exception {
        wzjjmxMapper.updateRow(pd);

    }
}

