package com.dyx.service.system;

import com.dyx.entity.PageData;

import java.util.List;

/**
 * Description：日历
 * Author：邹靓
 * Date：2020/3/31
 */
public interface CalendarService {


    /**日历列表
     * @param pd
     * @return
     * @throws Exception
     */
    public List<PageData> listByUser(PageData pd)throws Exception;

    /**日历列表(用于excel导出)
     * @param pd
     * @return
     * @throws Exception
     */
    public List<PageData> listToExcel(PageData pd)throws Exception;

    /**
     * 保存事项
     *
     * @param pd
     * @throws Exception
     */
    public void saveCalendar(PageData pd) throws Exception;

    /**
     * 删除事项
     *
     * @param pd
     * @throws Exception
     */
    public void deleteCalendar(PageData pd) throws Exception;
}
