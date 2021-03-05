package com.dyx.service.system.impl;

import com.dyx.entity.PageData;
import com.dyx.entity.system.Menu;
import com.dyx.mapper.dsno1.system.MenuMapper;
import com.dyx.service.system.MenuService;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 说明：菜单服务接口实现类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class MenuServiceImpl implements MenuService {

	@Autowired
	private MenuMapper menuMapper;

	/**新增菜单
	 * @param menu
	 * @throws Exception
	 */
	@CacheEvict(value="menucache", allEntries=true)
	public void addMenu(Menu menu) throws Exception{
		menuMapper.addMenu(menu);
	}

	/**保存修改菜单
	 * @param menu
	 * @throws Exception
	 */
	@CacheEvict(value="menucache", allEntries=true)
	public void edit(Menu menu) throws Exception{
		menuMapper.edit(menu);
	}


	/**
	 * 通过菜单ID获取数据
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData getMenuById(PageData pd) throws Exception {
		return menuMapper.getMenuById(pd);
	}

	/**获取最大的菜单ID
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public PageData findMaxId(PageData pd) throws Exception{
		return menuMapper.findMaxId(pd);
	}

	/**
	 * 通过ID获取其子一级菜单
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	@Cacheable(key="'menu-'+#parentId",value="menucache")
	public List<Menu> listSubMenuByParentId(String parentId) throws Exception {
		return menuMapper.listSubMenuByParentId(parentId);
	}

	public List<Menu> listSubMenuByParent(PageData pd) throws Exception {
		return menuMapper.listSubMenuByParent(pd);
	}

	/**
	 * 获取所有菜单并填充每个菜单的子菜单列表(菜单管理)(递归处理)
	 * @param MENU_ID
	 * @return
	 * @throws Exception
	 */
	public List<Menu> listAllMenu(String MENU_ID) throws Exception {
		List<Menu> menuList = this.listSubMenuByParentId(MENU_ID);
		for(Menu menu : menuList){
			menu.setMENU_URL("menu_edit.html?MENU_ID="+menu.getMENU_ID());
			menu.setSubMenu(this.listAllMenu(menu.getMENU_ID()));
			menu.setTarget("treeFrame");
		}
		return menuList;
	}

	/**
	 * 左侧字典树（懒加载）
	 *
	 * @param pd 前台传递参数对象
	 * @return List<PageData>  对象
	 * @throws Exception
	 */
	@Override
	public List<PageData> listLazyTree(PageData pd) throws Exception {
		//parentId 父节点ID
		pd.put("MENU_ID", Tools.checkString(pd.get("MENU_ID")).equals("") ? "0" : pd.getString("MENU_ID"));
		//获取传递过来的TreeUrl
		String strTreeUrl = Tools.isEmpty(pd.getString("TREEURL")) ? null : pd.getString("TREEURL");
		//查询数据
		List<PageData> lstCdgl = menuMapper.getChildrenByParentId(pd);
		//遍历赋值
		for (PageData oPd : lstCdgl) {
			//获取isParent的值
			String strIsParent = Tools.checkString(oPd.get("isParent"));
			if (strTreeUrl != null) {
				//设置跳转路径和target目标区域
				oPd.put("url", strTreeUrl + "?MENU_ID=" + oPd.get("MENU_ID").toString()+"&APPID=" +pd.get("APPID") );
				oPd.put("target", "treeFrame");
			}
		}
		//返回值
		return lstCdgl;
	}

	/**
	 * 获取所有菜单并填充每个菜单的子菜单列表(系统菜单列表)(递归处理)
	 * @param MENU_ID
	 * @return
	 * @throws Exception
	 */
	public List<Menu> listAllMenuQx(String MENU_ID) throws Exception {
		List<Menu> menuList = this.listSubMenuByParentId(MENU_ID);
		for(Menu menu : menuList){
			menu.setSubMenu(this.listAllMenuQx(menu.getMENU_ID()));
			menu.setTarget("treeFrame");
		}
		return menuList;
	}

	/**删除菜单
	 * @param MENU_ID
	 * @throws Exception
	 */
	@CacheEvict(value="menucache", allEntries=true)
	public void deleteMenuById(String MENU_ID) throws Exception{
		menuMapper.deleteMenuById(MENU_ID);
	}

	/**保存菜单图标
	 * @param pd
	 * @throws Exception
	 */
	@CacheEvict(value="menucache", allEntries=true)
	public void editicon(PageData pd) throws Exception{
		menuMapper.editicon(pd);
	}

	/**
	 * 获取所有菜单并填充每个菜单的子菜单列表(系统菜单列表)(递归处理)
	 * @param pd
	 * @return
	 * @throws Exception
	 */
	public int checkMenuName(PageData pd) throws Exception {
		return menuMapper.checkMenuName(pd);
	}
}
