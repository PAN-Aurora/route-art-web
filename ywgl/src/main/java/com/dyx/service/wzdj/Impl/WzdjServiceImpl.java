package com.dyx.service.wzdj.Impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.wzdj.WzdjMapper;
import com.dyx.service.wzdj.WzdjService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Description：资产管理-物资登记 ServiceImpl
 *
 * @author：杨晨浩 Date：2020/12/15
 */
@Service
@Transactional
public class WzdjServiceImpl implements WzdjService {

    /**
     * 注入资产管理-物资登记的mapper层
     */
    @Autowired
    private WzdjMapper wzdjMapper;

    /**
     * 获取已审批的采购单
     */
    @Override
    public List<PageData> getCgdh(Page page) throws Exception {
        return wzdjMapper.getCgdhlistPage(page);
    }

    /**
     * 根据采购单号获取采购明细列表
     *
     * @throws Exception
     */
    @Override
    public List<PageData> wzcgList(Page page) throws Exception {
        return wzdjMapper.wzcglistPage(page);
    }

    /**
     * 根据添加选取的WZCGMX_ID查询数据
     *
     * @throws Exception
     */
    @Override
    public List<PageData> findByIds(PageData pd) throws Exception {
        return wzdjMapper.findByIds(pd);
    }

    /**
     * 根据WZDJ_ID查询数据
     *
     * @throws Exception
     */
    @Override
    public List<PageData> findById(PageData pd) throws Exception {
        return wzdjMapper.findById(pd);
    }

    /**
     * 批量插入物资信息
     *
     * @param lstDjsj
     * @throws Exception
     */
    @Override
    public void insertWzBatch(List<PageData> lstDjsj) throws Exception {
        wzdjMapper.insertWzBatch(lstDjsj);
    }

    /**
     * 更改已插入到物资登记表中的数据在物资采购明细表的状态
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void updateWzcgmxZt(PageData pd) throws Exception {
        wzdjMapper.updateWzcgmxZt(pd);
    }

    /**
     * 批量更新
     *
     * @throws Exception
     */
    @Override
    public void editAll(PageData pd) throws Exception {
        wzdjMapper.editAll(pd);
    }

    /**
     * 将已登记物资插入物资库存表
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void insertKcBatch(PageData pd) throws Exception {
        wzdjMapper.insertKcBatch(pd);
    }

    /**
     * 二维码数据回传 更新
     *
     * @param
     * @throws Exception
     */
    @Override
    public void updateWzdj(PageData pd) throws Exception {
        wzdjMapper.updateWzdj(pd);
    }

    /**
     * 修改物资登记数据
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void edit(PageData pd) throws Exception {
        wzdjMapper.edit(pd);
    }

    /**
     * 修改物资状态
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void updateZt(PageData pd) throws Exception {
        wzdjMapper.updateZt(pd);
    }

    @Override
    public List<PageData> list(Page page) throws Exception {
        return wzdjMapper.datalistPage(page);
    }

    @Override
    public List<PageData> listAll(PageData pd) throws Exception {
        return wzdjMapper.listAll(pd);
    }

    /**
     * 列表  用于弹出选择物资数据
     *
     * @param page
     * @throws Exception
     */
    @Override
    public List<PageData> wzkcList(Page page) throws Exception {
        return wzdjMapper.wzkcList(page);
    }

    /**
     * 根据物资ids查询物资数据
     *
     * @param pd
     * @return
     * @throws Exception
     */
    @Override
    public List<PageData> findWzkcByIds(PageData pd) throws Exception {
        return wzdjMapper.findWzkcByIds(pd);
    }

    @Override
    public int validateData(PageData pd) throws Exception {
        return wzdjMapper.validateData(pd);
    }

    /**
     * 修改资产管理-物资登记 登记日期
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public void updateDjrq(PageData pd) throws Exception {
        wzdjMapper.updateDjrq(pd);
    }
}
