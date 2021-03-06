package com.dyx.mapper.dsno1.wjgl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;

/** 
 * 说明： 技术资料管理Mapper
 * 作者：FH Admin QQ313596790
 * 时间：2020-02-12
 * 官网：www.fhadmin.org
 * @version
 */

/**
 * Description：机动装备技术资料实现类
 * @author：何学斌
 * Date：2020/4/23
 */
public interface WjglMapper {

	/**新增机动装备技术资料
	 * @param pd
	 * @throws Exception
	 */
	void save(PageData pd);
	
	/**删除机动装备技术资料
	 * @param pd
	 * @throws Exception
	 */
	void delete(PageData pd);
	
	/**修改机动装备技术资料
	 * @param pd
	 * @throws Exception
	 */
	void edit(PageData pd);
	
	/**机动装备技术资料列表
	 * @param page
	 * @throws Exception
	 */
	List<PageData> datalistPage(Page page);
	
	/**机动装备技术资料列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	List<PageData> listAll(PageData pd);
	
	/**通过id获取机动装备技术资料数据
	 * @param pd
	 * @throws Exception
	 */
	PageData findById(PageData pd);
	
	/**批量删除机动装备技术资料
	 * @param arrDataIds
	 * @throws Exception
	 */
	void deleteAll(String[] arrDataIds);
	
}

