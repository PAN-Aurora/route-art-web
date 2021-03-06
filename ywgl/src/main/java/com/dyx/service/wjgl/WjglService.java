package com.dyx.service.wjgl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;

import java.util.List;

/** 
 * 说明： 技术资料管理接口
 * 作者：FH Admin QQ313596790
 * 时间：2020-02-12
 * 官网：www.fhadmin.org
 * @version
 */

/**
 * Description：机动装备技术资料接口
 * @author：何学斌
 * Date：2020/4/23
 */
public interface WjglService {

	/**新增机动装备技术资料
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception;
	
	/**删除机动装备技术资料
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception;
	
	/**修改机动装备技术资料
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception;

	/**
	 * 机动装备技术资料列表
	 * @param page
	 * @return
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;

	/**
	 * 机动装备技术资料列表(全部)
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception;

	/**
	 * 通过id获取机动装备技术资料数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception;
	
	/**批量删除机动装备技术资料
	 * @param arrDataIds
	 * @throws Exception
	 */
	public void deleteAll(String[] arrDataIds)throws Exception;
	
}

