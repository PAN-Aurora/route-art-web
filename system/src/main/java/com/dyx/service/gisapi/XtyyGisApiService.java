package com.dyx.service.gisapi;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;

/**
 * Description：态势机动装备 系统应用接口
 *
 * @author：何学斌
 * @date 2020年5月18日
 */
public interface XtyyGisApiService {

    /**
     * 根据单位查询系统应用的 获取访问量 返回前台。
     *
     * @param page
     * @return
     */
    List<PageData> getXtyyfwlByDw(Page page);

    /**
     * 根据单位查询系统应用的 本周访问量 返回前台。

    /**
     * 根据单位查询系统应用的 本周访问量（含单位数量） 返回前台。
     *
     * @param page
     * @return
     */
    List<PageData> getBzfwByDwCount(Page page);

    /**
     * 根据单位查询系统应用的 本月访问量（含单位数量） 返回前台。
     *
     * @param page
     * @return
     */
    List<PageData> getByfwByDwCount(Page page);

    /**
     * 根据单位查询系统应用的 2020年度系统月度访问量统计 返回前台。
     *
     * @param page
     * @return
     */
    List<PageData> getXtydfwByDwCount(Page page);

    /**
     * 根据单位查询系统应用的 2020年度各单位系统累计访问量 返回前台。
     *
     * @param page
     * @return
     */
    List<PageData> getNdxtByDwCount(Page page);
}
