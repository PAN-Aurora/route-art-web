package com.dyx.service.system.impl;

import com.dyx.service.system.CalendarService;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.system.CalendarMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Description：日历
 * Author：邹靓
 * Date：2020/3/31
 */
@Service
@Transactional
public class CalendarServiceImpl implements CalendarService {

    @Autowired
    private CalendarMapper calendarMapper;

    /**日历列表
     * @param pd
     * @return
     * @throws Exception
     */
    public List<PageData> listByUser(PageData pd)throws Exception{
        return calendarMapper.listByUser(pd);
    }

    /**日历列表(用于excel导出)
     * @param pd
     * @return
     * @throws Exception
     */
    public List<PageData> listToExcel(PageData pd)throws Exception{
        return calendarMapper.listToExcel(pd);
    }

    /**
     * 保存事项
     *
     * @param pd
     * @throws Exception
     */
    public void saveCalendar(PageData pd) throws Exception {
        calendarMapper.saveCalendar(pd);
    }

    /**
     * 删除事项
     *
     * @param pd
     * @throws Exception
     */
    public void deleteCalendar(PageData pd) throws Exception {
        calendarMapper.deleteCalendar(pd);
    }
}
