package com.dyx.service.tybf.impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.tybf.TybfmxMapper;
import com.dyx.service.tybf.TybfmxService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 说明： 退役报废明细接口实现类
 * 作者：陈磊
 * 时间：2020-12-07
 */
@Service
//开启事物
@Transactional
public class TybfmxServiceImpl implements TybfmxService {

    @Autowired
    private TybfmxMapper tybfmxMapper;

    /**
     * 新增
     *
     * @param pd
     * @throws Exception
     */
    public void save(PageData pd) throws Exception {
        tybfmxMapper.save(pd);
    }

    /**
     * 删除
     *
     * @param pd
     * @throws Exception
     */
    public void delete(PageData pd) throws Exception {
        tybfmxMapper.delete(pd);
    }

    /**
     * 修改
     *
     * @param pd
     * @throws Exception
     */
    public void edit(PageData pd) throws Exception {
        tybfmxMapper.edit(pd);
    }

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception {
        return tybfmxMapper.datalistPage(page);
    }

    /**
     * 列表(全部)
     *
     * @param pd
     * @throws Exception
     */
    public List<PageData> listAll(PageData pd) throws Exception {
        return tybfmxMapper.listAll(pd);
    }

    /**
     * 通过id获取数据
     *
     * @param pd
     * @throws Exception
     */
    public PageData findById(PageData pd) throws Exception {
        return tybfmxMapper.findById(pd);
    }

    /**
     * 通过id获取退役报废明细
     *
     * @param page
     * @return
     */
    @Override
    public List<PageData> findByMxId(Page page) {
        return tybfmxMapper.findByMxId(page);
    }

    /**
     * 退役报废计划提交后导出
     *
     * @param pd
     * @return
     * @throws Exception
     */
    @Override
    public List<Map> listAllForWord(PageData pd) throws Exception {
        return tybfmxMapper.listAllForWord(pd);
    }

    /**
     * 更新物资采购行
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void updateRow(PageData pd) throws Exception {
        tybfmxMapper.updateRow(pd);
    }
    /**
     * 关联物资采购明细数据
     *
     * @param pd 物资采购明细的数据
     * @throws Exception
     */
    @Override
    public void deleteByXljhID(PageData pd) throws Exception {
        tybfmxMapper.deleteByXljhID(pd);
    }

    /**
     * 批量保存退役报废明细数据
     *
     * @param zbList
     * @throws Exception
     */
    @Override
    public void insertTybfmxBatch(List<PageData> zbList) throws Exception {
        tybfmxMapper.insertTybfmxBatch(zbList);
    }

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    public void deleteAll(String[] ArrayDATA_IDS) throws Exception {
        tybfmxMapper.deleteAll(ArrayDATA_IDS);
    }

}

