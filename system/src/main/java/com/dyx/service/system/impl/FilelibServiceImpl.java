package com.dyx.service.system.impl;

import java.util.List;

import com.dyx.service.system.FilelibService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.system.FilelibMapper;

/**
 * 说明： 文件上传接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2020-02-11
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class FilelibServiceImpl implements FilelibService {

    @Autowired
    private FilelibMapper filelibMapper;

    /**
     * 新增
     *
     * @param pd
     * @throws Exception
     */
    public void save(PageData pd) throws Exception {
        filelibMapper.save(pd);
    }

    /**
     * 删除
     *
     * @param pd
     * @throws Exception
     */
    public void delete(PageData pd) throws Exception {
        filelibMapper.delete(pd);
    }

    /**
     * 修改
     *
     * @param pd
     * @throws Exception
     */
    public void edit(PageData pd) throws Exception {
        filelibMapper.edit(pd);
    }

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception {
        return filelibMapper.datalistPage(page);
    }

    /**
     * 列表(全部)
     *
     * @param pd
     * @throws Exception
     */
    public List<PageData> listAll(PageData pd) throws Exception {
        return filelibMapper.listAll(pd);
    }

    /**
     * 根据业务查询无关联文件
     *
     * @param pd
     * @throws Exception
     */
    public List<PageData> listNonBiz(PageData pd) throws Exception {
        return filelibMapper.listNonBiz(pd);
    }

    ;

    /**
     * 根据业务id查询
     *
     * @param ArrayDATA_IDS
     * @return
     * @throws Exception
     */
    public List<PageData> listByIds(String[] ArrayDATA_IDS) throws Exception {
        return filelibMapper.listByIds(ArrayDATA_IDS);
    }

    /**
     * 通过id获取数据
     *
     * @param pd
     * @throws Exception
     */
    public PageData findById(PageData pd) throws Exception {
        return filelibMapper.findById(pd);
    }

    /**
     * 批量删除
     *
     * @param ArrayDATA_IDS
     * @throws Exception
     */
    public void deleteAll(String[] ArrayDATA_IDS) throws Exception {
        filelibMapper.deleteAll(ArrayDATA_IDS);
    }


    /**
     * 批量插入文件上传
     *
     * @param list
     */
    @Override
    public Integer insertBatch(List<PageData> list) throws Exception {
        return filelibMapper.insertBatch(list);
    }

    /**
     * 通过bigId查询filelib表
     *
     * @param pd
     * @throws Exception
     */
    @Override
    public PageData findByBizId(PageData pd) throws Exception {
        return filelibMapper.findByBizId(pd);
    }
}

