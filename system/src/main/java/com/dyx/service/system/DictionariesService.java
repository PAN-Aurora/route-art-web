package com.dyx.service.system;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.Dictionaries;

import java.util.List;

/**
 * 说明：数据字典服务接口
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public interface DictionariesService {
	
	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)
	 * @param MENU_ID
	 * @return
	 * @throws Exception
	 */
	public List<Dictionaries> listAllDict(String parentId) throws Exception;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception;
	
	/**通过编码获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findByBianma(PageData pd)throws Exception;
	
	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception;
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception;
	
	/**
	 * 通过ID获取其子级列表
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	public List<Dictionaries> listSubDictByParentId(String parentId) throws Exception;

	/**
	 * 根据标识获取其子级列表
	 * @param bsId
	 * @return
	 * @throws Exception
	 */
	public List<Dictionaries> getDictByBsId(String bsId) throws Exception;

	/**
	 * 查询编码或者标识是否已存在
	 * @param pd
	 * @return
	 */
	public PageData findByMcBs(PageData pd) throws Exception;
	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)用于代码生成器引用数据字典
	 * @param MENU_ID
	 * @return
	 * @throws Exception
	 */
	public List<Dictionaries> listAllDictToCreateCode(String parentId) throws Exception;
	
	/**排查表检查是否被占用
	 * @param pd
	 * @throws Exception
	 */
	public PageData findFromTbs(PageData pd)throws Exception;
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception;

	/**
	 * 查询地区列表ztree
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
    public List<Dictionaries> listAllDqDict(String parentId)throws Exception;

	/**
	 * 左侧字典树（懒加载）
	 *
	 * @param pd 前台传递参数对象
	 * @return List<PageData>  对象
	 * @throws Exception
	 */
	public List<PageData> listLazyTree(PageData pd) throws Exception;

	/**
	 * 查询装备类型
	 * @return
	 */
    public List<PageData> getZblx()throws Exception;
}
