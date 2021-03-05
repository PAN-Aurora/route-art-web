package com.dyx.mapper.dsno1.system;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.Dept;

import java.util.List;
import java.util.Map;

/** 
 * 说明： 组织机构Mapper
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-28
 * 官网：www.fhadmin.org
 * @version
 */
public interface DeptMapper{

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	void save(PageData pd);
	
	/**删除
	 * @param pd
	 * @throws Exception
	 */
	void delete(PageData pd);
	
	/**修改
	 * @param pd
	 * @throws Exception
	 */
	void edit(PageData pd);
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	List<PageData> datalistPage(Page page);
	
	/**列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	List<PageData> listAll(PageData pd);
	
	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	PageData findById(PageData pd);

	/**
	 * 根据单位名称全路径获取单位信息
	 *
	 * @param strSjdwPath
	 * @return
	 */
	PageData findDeptByPath(String strSjdwPath);

	/**
	 * 通过ID获取其子级列表
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	List<Dept> listByParentId(String parentId);

	/**
	 * 通过ID获取数据
	 *
	 * @param dept_id
	 * @return
	 * @throws Exception
	 */
	List<Dept> lstfindById(String dept_id);

	/**
	 * 根据父id获取数据
	 * @param strParentId  父id
	 */
    PageData findByParentId(String strParentId);

	/**
	 * 通过ID获取所有子级列表
	 *
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
    List<Dept> listZjlb(String parentId);

	/**
	 * 根据id 查询列表
	 *
	 * @param dept_id
	 * @return
	 */
    List<PageData> listForParentId(String dept_id);

	/**
	 * 获取通过单位内码获取下级单位id
	 *
	 * @return
	 */
	List<PageData> getDeptId(Page page);

	/**
	 * 左侧组织机构树（懒加载）
	 *
	 * @param pd 前台传递参数对象
	 * @return List<PageData>  对象
	 * @throws Exception
	 */
	List<PageData> getChildrenByParentId(PageData pd);

	/**
	 * 单位选择树（懒加载）
	 *
	 * @param pd 前台传递参数对象
	 * @return List<PageData>  对象
	 * @throws Exception
	 */
	List<PageData> getDwChildrenByParentId(PageData pd);

	/**
	 * 查询该目录下子目录最大path
	 *
	 * @param parentId fid
	 * @return
	 * @throws Exception
	 */
	String getMaxPathByPid(String parentId);

	/**
	 * 根据单位内码获取改单位下所有子单位
	 *
	 * @param pd 单位id
	 * @return
	 */
	String getParentDeptIds(PageData pd);

	/**
	 * 向上递归获取所有上级单位信息
	 *
	 * @param arrDataIds 单位id
	 * @return
	 */
	List<Map<String, Object>> getDelegateParentDept(String[] arrDataIds);
}

