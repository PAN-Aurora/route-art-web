package com.dyx.service.gisapi.impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.gisapi.XtyyGisApiMapper;
import com.dyx.service.gisapi.XtyyGisApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Description：态势机动装备 系统应用接口实现
 *
 * @author：何学斌
 * @date 2020年5月18日
 */
@Service
@Transactional
public class XtyyGisApiServiceImpl implements XtyyGisApiService {
    /**
     * 装备数质量GisMapper
     */
    @Autowired
    private XtyyGisApiMapper xtyyGisApiMapper;

    /**
     * 根据单位查询系统应用的 获取访问量 返回前台。
     *
     * @param page
     * @return
     */
    @Override
    public List<PageData> getXtyyfwlByDw(Page page) {
        return xtyyGisApiMapper.getXtyyfwlByDw(page);
    }

    /**
     * 根据单位查询系统应用的 本周访问量（含单位数量） 返回前台。
     *
     * @param page
     * @return
     */
    @Override
    public List<PageData> getBzfwByDwCount(Page page) {
        return xtyyGisApiMapper.getBzfwByDwCount(page);
    }

    /**
     * 根据单位查询系统应用的 本月访问量（含单位数量） 返回前台。
     *
     * @param page
     * @return
     */
    @Override
    public List<PageData> getByfwByDwCount(Page page) {
        return xtyyGisApiMapper.getByfwByDwCount(page);
    }

    /**
     * 根据单位查询系统应用的 2020年度系统月度访问量统计 返回前台。
     *
     * @param page
     * @return
     */
    @Override
    public List<PageData> getXtydfwByDwCount(Page page) {
        return xtyyGisApiMapper.getXtydfwByDwCount(page);
    }

    /**
     * 根据单位查询系统应用的 2020年度各单位系统累计访问量 返回前台。
     *
     * @param page
     * @return
     */
    @Override
    public List<PageData> getNdxtByDwCount(Page page) {
        return xtyyGisApiMapper.getNdxtByDwCount(page);
    }
}
