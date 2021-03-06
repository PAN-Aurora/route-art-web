package com.dyx.service.wzcg.impl;

import com.dyx.controller.act.AcStartComponent;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.wzcg.WzcgMapper;
import com.dyx.service.wzcg.WzcgService;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by zhaozhiwei on 2020/12/10.
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class WzcgServiceImpl implements WzcgService {

    /**
     * 注入资产管理-物资采购的mapper层
     */
    @Autowired
    private WzcgMapper wzcgMapper;
    @Autowired
    private AcStartComponent acStartComponent;

    /**
     * 新增资产管理-物资采购数据
     *
     * @param pd 资产管理-物资采购的数据
     * @throws Exception
     */
    @Override
    public void save(PageData pd) throws Exception {
       wzcgMapper.save(pd);
    }

    /**
     * 删除资产管理-物资采购数据
     *
     * @param pd 资产管理-物资采购的数据
     * @throws Exception
     */
    @Override
    public void delete(PageData pd) throws Exception {
        wzcgMapper.delete(pd);
    }

    /**
     * 修改资产管理-物资采购数据
     *
     * @param pd 资产管理-物资采购的数据
     * @throws Exception
     */
    @Override
    public void edit(PageData pd) throws Exception {
        wzcgMapper.edit(pd);
    }

    /**
     * 资产管理-物资采购数据列表
     *
     * @param page 资产管理-物资采购数据列表
     * @return List<PageData> 资产管理-物资采购的数据
     * @throws Exception
     */
    @Override
    public List<PageData> list(Page page) throws Exception {
        return wzcgMapper.datalistPage(page);
    }

    /**
     * 资产管理-物资采购数据列表(全部)
     *
     * @param pd 资产管理-物资采购数据列表(全部)
     * @return List<PageData> 资产管理-物资采购的数据
     * @throws Exception
     */
    @Override
    public List<PageData> listAll(PageData pd) throws Exception {
        return wzcgMapper.listAll(pd);
    }

    /**
     * 通过资产管理-物资采购id获取数据
     *
     * @param pd 资产管理-物资采购的数据
     * @return PageData 资产管理-物资采购的数据
     * @throws Exception
     */
    @Override
    public PageData findById(PageData pd) throws Exception {
        return wzcgMapper.findById(pd);
    }

    /**
     * 批量删除资产管理-物资采购数据
     *
     * @param arrDataIds 资产管理-物资采购的数据
     * @throws Exception
     */
    @Override
    public void deleteAll(String[] arrDataIds) throws Exception {
        wzcgMapper.deleteAll(arrDataIds);
    }

    /**
     * 提交资产管理-物资采购
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void flowSubmit(PageData pd, Map<String, Object> map) throws Exception {
        wzcgMapper.edit(pd);
        map.put("tokenKey", Tools.creatTokenKey("startProByKey"));
        map.put("processKey", "KEY_wzcg");
        //启动流程
        acStartComponent.byKey(map);
    }

    /**
     * 获取当前登录用户单位
     *
     * @throws Exception
     */
    @Override
    public PageData getDeptName(PageData pd) throws Exception {
        return wzcgMapper.getDeptName(pd);
    }

    /**
     * 修改资产管理-物资采购明细数据验证
     *
     * @param pd 资产管理-物资采购明细数据验证
     * @throws Exception
     */
    @Override
    public int validateData(PageData pd) throws Exception {
        return wzcgMapper.validateData(pd);
    }

    @Override
    public void updateCgZt(PageData pd) throws Exception {
         wzcgMapper.updateCgZt(pd);
    }
}
