package com.dyx.service.wzcg.impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.wzcg.WzcgMxMapper;
import com.dyx.service.wzcg.WzcgmxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Description：机动装备-修理计划明细接口实现类
 *
 * @author：李可 Date：2020-11-17
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class WzcgmxServiceImpl implements WzcgmxService {

    /**
     * 注入资产管理—物资采购明的mapper层
     */
    @Autowired
    private WzcgMxMapper wzcgMxMapper;

    /**
     * 新增资产管理—物资采购明数据
     *
     * @param pd 资产管理—物资采购明细的数据
     * @throws Exception
     */
    @Override
    public void save(PageData pd) throws Exception {
        wzcgMxMapper.save(pd);
    }

    /**
     * 删除资产管理—物资采购明数据
     *
     * @param pd 资产管理—物资采购明细的数据
     * @throws Exception
     */
    @Override
    public void delete(PageData pd) throws Exception {
        wzcgMxMapper.delete(pd);
    }

    /**
     * 关联物资采购明细数据
     *
     * @param pd 物资采购明细的数据
     * @throws Exception
     */
    @Override
    public void deleteByXljhID(PageData pd) throws Exception {
        wzcgMxMapper.deleteByXljhID(pd);
    }

    /**
     * 修改资产管理—物资采购明细数据
     *
     * @param pd 资产管理—物资采购明细的数据
     * @throws Exception
     */
    @Override
    public void edit(PageData pd) throws Exception {
        wzcgMxMapper.edit(pd);
    }

    /**
     * 资产管理—物资采购明细数据列表
     *
     * @param page 资产管理—物资采购明细数据列表
     * @return List<PageData> 资产管理—物资采购明细的数据
     * @throws Exception
     */
    @Override
    public List<PageData> list(Page page) throws Exception {
        return wzcgMxMapper.datalistPage(page);
    }

    /**
     * 资产管理-物资采购明细列表
     *
     * @param strId 物资采购主表ID
     * @return List<PageData> 资产管理-物资采购明细的数据
     * @throws Exception
     */
    @Override
    public List<PageData> listMx(String strId) throws Exception {
        return wzcgMxMapper.listMx(strId);
    }

    /**
     * 通过资产管理—物资采购明细id获取数据
     *
     * @param pd 资产管理—物资采购明细的数据
     * @return PageData 资产管理—物资采购明细的数据
     * @throws Exception
     */
    @Override
    public PageData findById(PageData pd) throws Exception {
        return wzcgMxMapper.findById(pd);
    }

    /**
     * 批量删除资产管理—物资采购明细数据
     *
     * @param arrDataIds 资产管理—物资采购明细的数据
     * @throws Exception
     */
    @Override
    public void deleteAll(String[] arrDataIds) throws Exception {
        wzcgMxMapper.deleteAll(arrDataIds);
    }

    /**
     * 资产管理—物资采购明细数据列表(全部)
     *
     * @param pd 资产管理—物资采购明细数据列表(全部)
     * @return List<PageData> 资产管理—物资采购明细的数据
     * @throws Exception
     */
    @Override
    public List<Map> listAllForWord(PageData pd) throws Exception {
        return wzcgMxMapper.listAllForWord(pd);
    }

    /**
     * 批量保存资产管理—物资采购明细数据
     *
     * @param zbList
     * @throws Exception
     */
    @Override
    public void insertXljhBatch(List<PageData> zbList) throws Exception {
        wzcgMxMapper.insertXljhBatch(zbList);
    }

    /**
     * 更新物资采购行
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void updateRow(PageData pd) throws Exception {
        wzcgMxMapper.updateRow(pd);
    }

    /**
     * 通过ID获取指定物资采购明细数据
     *
     * @param page
     * @return
     */
    @Override
    public List<PageData> findByMxId(Page page) {
        return wzcgMxMapper.findByMxId(page);
    }

}

