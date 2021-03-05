package com.dyx.service.system;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.Dept;

import java.util.List;
import java.util.Map;

/** 
 * 说明： 组织机构接口
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-28
 * 官网：www.fhadmin.org
 * @version
 */
public interface DeptService{

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd)throws Exception;
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	public void delete(PageData pd)throws Exception;
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd)throws Exception;
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	public List<PageData> list(Page page)throws Exception;
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	public List<PageData> listAll(PageData pd)throws Exception;
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd)throws Exception;

	/**
	 * 根据单位名称全路径获取单位信息
	 *
	 * @param strSjdwPath 单位名称全路径
	 * @return
	 * @throws Exception
	 */
	public PageData findDeptByPath(String strSjdwPath) throws Exception;

	/**
	 * 通过ID获取其子级列表
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	public List<Dept> listByParentId(String parentId) throws Exception;

	/**
	 * 通过ID获取所有子级列表
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	public List<Dept> listZjlb(String parentId) throws Exception;
	
	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)
	 * @param
	 * @return
	 * @throws Exception
	 */
	public List<Dept> listTree(String parentId) throws Exception;

	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)
	 * @param
	 * @return
	 * @throws Exception
	 */
	public List<Dept> listZjjgTree(String deptId, int intBj) throws Exception;

	/**
	 * 根据父id获取数据
	 * @param strParentId
	 */
	PageData findByParentId(String strParentId);

	/**
	 * 根据id 查询列表
	 * @param dept_id
	 * @return
	 */
	List<PageData> listForParentId(String dept_id);

	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)
	 * @param
	 * @return
	 * @throws Exception
	 */
	public List<Dept> listZdslTree(String parentId) throws Exception;

	/**
	 * 获取通过单位内码获取下级单位id
	 *
	 * @return
	 */
	public List<PageData> getDeptId(Page page);

	/**
	 * 左侧组织机构树（懒加载）
	 *
	 * @param pd 前台传递参数对象
	 * @return List<PageData>  对象
	 * @throws Exception
	 */
	public List<PageData> listLazyTree(PageData pd) throws Exception;

	/**
	 * 单位弹出选择框
	 *
	 * @param pd
	 * @return
	 */
	public List<PageData> listLazyDwTree(PageData pd) throws Exception;

	public String getMaxPathByPid(String parentId) throws  Exception;

	/**
	 * 根据单位内码获取改单位下所有子单位
	 *
	 * @param pd 单位id
	 * @return
	 */
	public String getParentDeptIds(PageData pd) throws Exception;

	/**
	 * 向上递归获取所有上级单位信息
	 *
	 * @param arrDataIds 单位ids
	 * @return
	 * @throws Exception
	 */
	public List<Map<String, Object>> getDelegateParentDept(String[] arrDataIds) throws Exception;

	/**
	 * 选择单位查询
	 * @param pd
	 * @return
	 */
	public List<PageData> listLazyxzdwTree(PageData pd)throws Exception;
}

