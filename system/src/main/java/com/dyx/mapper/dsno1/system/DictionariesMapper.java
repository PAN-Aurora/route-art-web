package com.dyx.mapper.dsno1.system;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.Dictionaries;

import java.util.List;

/**
 * 说明：数据字典Mapper
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public interface DictionariesMapper {

	/**
	 * 通过ID获取其子级列表
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	List<Dictionaries> listSubDictByParentId(String parentId);

	/**
	 * 根据标识获取其子级列表
	 * @param bsId
	 * @return
	 * @throws Exception
	 */
	List<Dictionaries> getDictByBsId(String bsId);

	/**
	 * 查询编码或者标识是否已存在
	 *
	 * @param pd
	 * @return
	 */
	PageData findByMcBs(PageData pd);
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	List<PageData> datalistPage(Page page);
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	PageData findById(PageData pd);
	
	/**通过编码获取数据
	 * @param pd
	 * @throws Exception
	 */
	PageData findByBianma(PageData pd);
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	void save(PageData pd);
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	void edit(PageData pd);
	
	/**排查表检查是否被占用
	 * @param pd
	 * @throws Exception
	 */
	PageData findFromTbs(PageData pd);
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	void delete(PageData pd);

	/**
	 * 左侧字典树（懒加载）
	 *
	 * @param pd 前台传递参数对象
	 * @return List<PageData>  对象
	 * @throws Exception
	 */
	List<PageData> getChildrenByParentId(PageData pd);

	/**
	 * 查询装备类型
	 * @return
	 */
    List<PageData> getZblx();
}
