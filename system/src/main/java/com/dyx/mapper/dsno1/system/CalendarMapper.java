package com.dyx.mapper.dsno1.system;

import com.dyx.entity.PageData;

import java.util.List;

/**
 * Description：日历
 * Author：邹靓
 * Date：2020/3/31
 */
public interface CalendarMapper {

	
	/**日历列表
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	List<PageData> listByUser(PageData pd);

	/**日历列表(用于excel导出)
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	List<PageData> listToExcel(PageData pd);

    /**
     * 保存事项
     *
     * @param pd
     * @throws Exception
     */
    void saveCalendar(PageData pd);

    /**
     * 删除事项
     *
     * @param pd
     * @throws Exception
     */
    void deleteCalendar(PageData pd);


}
