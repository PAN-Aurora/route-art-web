package com.dyx.service.tybf.impl;

import com.dyx.controller.act.AcStartComponent;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.tybf.TybfMapper;
import com.dyx.service.tybf.TybfService;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 说明： 退役报废计划接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2020-12-07
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class TybfServiceImpl implements TybfService {

    @Autowired
    private TybfMapper tybfMapper;

    @Autowired
    private AcStartComponent acStartComponent;

    /**
     * 新增
     *
     * @param pd
     * @throws Exception
     */
    public void save(PageData pd) throws Exception {
        tybfMapper.save(pd);
    }

    /**
     * 删除
     *
     * @param pd
     * @throws Exception
     */
    public void delete(PageData pd) throws Exception {
        tybfMapper.delete(pd);
    }

    /**
     * 修改
     *
     * @param pd
     * @throws Exception
     */
    public void edit(PageData pd) throws Exception {
        tybfMapper.edit(pd);
    }

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception {
        return tybfMapper.datalistPage(page);
    }

    /**
     * 列表(全部)
     *
     * @param pd
     * @throws Exception
     */
    public List<PageData> listAll(PageData pd) throws Exception {
        return tybfMapper.listAll(pd);
    }

    /**
     * 通过id获取数据
     *
     * @param pd
     * @throws Exception
     */
    public PageData findById(PageData pd) throws Exception {
        return tybfMapper.findById(pd);
    }

    /**
     * @param pd
     * @throws Exception
     */
    @Override
    public void tjsave(PageData pd, Map<String, Object> map) throws Exception {
        tybfMapper.edit(pd);
        map.put("tokenKey", Tools.creatTokenKey("startProByKey"));
        map.put("processKey", "KEY_tybf");
        //启动流程
        acStartComponent.byKey(map);
    }

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    public void deleteAll(String[] ArrayDATA_IDS) throws Exception {
        tybfMapper.deleteAll(ArrayDATA_IDS);
    }

    /**
     * 获取当前登录用户单位
     *
     * @throws Exception
     */
    @Override
    public PageData getDeptName(PageData pd) throws Exception {
        return tybfMapper.getDeptName(pd);
    }

    /**
     * 退役报废审批完成修改库存状态
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void updateKcwzzt(PageData pd) throws Exception {
         tybfMapper.updateKcwzzt(pd);
    }
}

