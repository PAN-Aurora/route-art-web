package com.dyx.service.wzjj.impl;

import com.dyx.controller.act.AcStartComponent;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import com.dyx.mapper.dsno1.wzjj.WzjjMapper;
import com.dyx.service.wzjj.WzjjService;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 说明：资产管理-物资交接接口实现类
 * 作者：杨晨浩
 * 时间：2020-12-17
 */
@Service
@Transactional //开启事物
public class WzjjServiceImpl implements WzjjService {

    @Autowired
    private WzjjMapper wzjjMapper;

    @Autowired
    private AcStartComponent acStartComponent;

    /**
     * 新增
     *
     * @param pd
     * @throws Exception
     */
    public void save(PageData pd) throws Exception {
        wzjjMapper.save(pd);
    }

    /**
     * 删除
     *
     * @param pd
     * @throws Exception
     */
    public void delete(PageData pd) throws Exception {
        wzjjMapper.delete(pd);
    }

    /**
     * 修改
     *
     * @param pd
     * @throws Exception
     */
    public void edit(PageData pd) throws Exception {
        wzjjMapper.edit(pd);
    }
    /**
     * 物资交接审核通过后更新责任人
     *
     * @param pd
     * @throws Exception
     */
    public void updateZrr(PageData pd) throws Exception {
        wzjjMapper.updateZrr(pd);
    }

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception {
        return wzjjMapper.datalistPage(page);
    }

    /**
     * 列表(全部)
     *
     * @param pd
     * @throws Exception
     */
    public List<PageData> listAll(PageData pd) throws Exception {
        return wzjjMapper.listAll(pd);
    }

    /**
     * 通过id获取数据
     *
     * @param pd
     * @throws Exception
     */
    public PageData findById(PageData pd) throws Exception {
        return wzjjMapper.findById(pd);
    }

    /**
     * 提交物资交接
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void tjsave(PageData pd, Map<String, Object> map) throws Exception {
        wzjjMapper.edit(pd);
        map.put("tokenKey", Tools.creatTokenKey("startProByKey"));
        map.put("processKey", "KEY_wzjj");
        //启动流程
        acStartComponent.byKey(map);
    }
    /**
     * 物资交接审批完成修改库存状态
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void editWzkcZt(PageData pd) throws Exception {
        wzjjMapper.editWzkcZt(pd);
    }

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    public void deleteAll(String[] ArrayDATA_IDS) throws Exception {
        wzjjMapper.deleteAll(ArrayDATA_IDS);
    }

}



