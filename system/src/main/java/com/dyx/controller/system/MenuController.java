package com.dyx.controller.system;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.PageData;
import com.dyx.entity.system.Menu;
import com.dyx.service.system.FHlogService;
import com.dyx.service.system.MenuService;
import com.dyx.util.Const;
import com.dyx.util.Jurisdiction;
import com.dyx.util.RightsHelper;
import com.dyx.util.Tools;
import net.sf.json.JSONArray;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 说明：菜单管理处理类
 * 作者：FH Admin Q 31-3596-790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/menu")
public class MenuController extends BaseController {

	@Autowired
    private MenuService menuService;
	@Autowired
    private FHlogService FHLOG;

	/**
	 * 菜单列表ztree(菜单管理)
	 * @return
	 */
	@RequestMapping(value="/listAllMenu")
//	@RequiresPermissions("menu:list")
	@ResponseBody
	public Object listAllMenu()throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		JSONArray arr = JSONArray.fromObject(menuService.listAllMenu("0"));
		String json = arr.toString();
		json = json.replaceAll("MENU_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("MENU_NAME", "name").replaceAll("subMenu", "nodes").replaceAll("hasMenu", "checked").replaceAll("MENU_URL", "url");
		map.put("zTreeNodes", json);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 左侧菜单树/懒加载
	 */
	@RequestMapping(value = "/listLazyTree")
	@ResponseBody
	public String listLazyTree() throws Exception {
		//获取仓库树形结构数据（递归处理并转为json字符串）
		PageData pd = this.getPageData();
		//查询数据
		List<PageData> lstCdgl = menuService.listLazyTree(pd);
		//转换为json数据
		JSONArray arrTreeNodes = JSONArray.fromObject(lstCdgl);
		//返回树节点数据
		return arrTreeNodes.toString();
	}



	/**
	 * 左侧菜单树/懒加载
	 */
	@RequestMapping(value = "/aaa")
	@ResponseBody
	public String aaa() throws Exception {
		//获取仓库树形结构数据（递归处理并转为json字符串）
//		PageData pd = this.getPageData();
//		查询数据
//		List<PageData> lstCdgl = menuService.listLazyTree(pd);
		//转换为json数据
//		JSONArray arrTreeNodes = JSONArray.fromObject(lstCdgl);
		//返回树节点数据
//		return arrTreeNodes.toString();

		String str = "[{\"isParent\":\"false\", \"MENU_ID\":209, \"MENU_NAME\":\" 方法一\", \"url\":\" ffmx_list.html?MENU_ID=209&APPID=null\", \"PARENT_ID\":\" 0\", \"target\":\" treeFrame\"},\n" +
				" {\"isParent\":\"false\", \"MENU_ID\":187, \"MENU_NAME\":\" 方法二\", \"url\":\" ffmx_list.html?MENU_ID=187&APPID=null\", \"PARENT_ID\":\" 0\", \"target\":\" treeFrame\"}, \n" +
				" {\"isParent\":\"false\", \"MENU_ID\":187, \"MENU_NAME\":\" 方法三\", \"url\":\" ffmx_list.html?MENU_ID=187&APPID=null\", \"PARENT_ID\":\" 0\", \"target\":\" treeFrame\"}, \n" +
				" {\"isParent\":\"false\", \"MENU_ID\":187, \"MENU_NAME\":\" 方法四\", \"url\":\" ffmx_list.html?MENU_ID=187&APPID=null\", \"PARENT_ID\":\" 0\", \"target\":\" treeFrame\"}, \n" +
				" {\"isParent\":\"false\", \"MENU_ID\":187, \"MENU_NAME\":\" 方法五\", \"url\":\" ffmx_list.html?MENU_ID=187&APPID=null\", \"PARENT_ID\":\" 0\", \"target\":\" treeFrame\"}]";
		return str;

	}



	/**
	 * 菜单列表
	 * @return
	 */
	@RequestMapping(value="/list")
//	@RequiresPermissions("menu:list")
	@ResponseBody
	public Object list(String MENU_ID)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		List<Menu> menuList = menuService.listSubMenuByParent(pd);
		map.put("menuList", menuList);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 请求新增菜单页面
	 * @return
	 */
	@RequestMapping(value="/toAdd")
//	@RequiresPermissions("menu:add")
	@ResponseBody
	public Object toAdd()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String MENU_ID = (null == pd.get("MENU_ID") || "".equals(pd.get("MENU_ID").toString()))?"0":pd.get("MENU_ID").toString();//接收传过来的上级菜单ID,如果上级为顶级就取值“0”
		pd.put("MENU_ID",MENU_ID);
		map.put("pds", menuService.getMenuById(pd));	//传入父菜单所有信息
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 新增菜单
	 * @param menu
	 * @return
	 */
	@RequestMapping(value="/add")
//	@RequiresPermissions("menu:add")
	@ResponseBody
	public Object add(Menu menu)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		menu.setMENU_ID(String.valueOf(Integer.parseInt(menuService.findMaxId(pd).get("MID").toString())+1));
		menu.setMENU_ICON("");													//默认无菜单图标
		menuService.addMenu(menu); 												//新增菜单
		FHLOG.save(Jurisdiction.getUsername(), "新增菜单:"+menu.getMENU_NAME());	//记录日志
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 请求编辑菜单页面
	 * @param
	 * @return
	 */
	@RequestMapping(value="/toEdit")
//	@RequiresPermissions("menu:edit")
	@ResponseBody
	public Object toEdit(String MENU_ID)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		pd = menuService.getMenuById(pd);						//读取此ID的菜单数据
		map.put("pd", pd);
		pd.put("MENU_ID",pd.get("PARENT_ID").toString());		//用作读取父菜单信息
		map.put("pds", menuService.getMenuById(pd));			//传入父菜单所有信息
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 保存编辑
	 * @param
	 * @return
	 */
	@RequestMapping(value="/edit")
//	@RequiresPermissions("menu:edit")
	@ResponseBody
	public Object edit(Menu menu)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		menuService.edit(menu);
		FHLOG.save(Jurisdiction.getUsername(), "修改菜单:"+menu.getMENU_NAME());				//记录日志
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 删除菜单
	 * @param MENU_ID
	 * @param out
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
//	@RequiresPermissions("menu:del")
	public Object delete(@RequestParam String MENU_ID)throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		if(menuService.listSubMenuByParentId(MENU_ID).size() > 0){//判断是否有子菜单，是：不允许删除
			errInfo = "error";
		}else{
			menuService.deleteMenuById(MENU_ID);
			errInfo = "success";
			FHLOG.save(Jurisdiction.getUsername(), "删除的菜单ID为:"+MENU_ID);				//记录日志
		}
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 保存菜单图标
	 * @param
	 * @return
	 */
	@RequestMapping(value="/editicon")
//	@RequiresPermissions("menu:edit")
	@ResponseBody
	public Object editicon()throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		menuService.editicon(pd);
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 显示菜单列表ztree(拓展左侧四级菜单)
	 * @return
	 */
	@RequestMapping(value="/otherlistMenu")
	@ResponseBody
	public Object otherlistMenu(String MENU_ID)throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd.put("MENU_ID", MENU_ID);
		String MENU_URL = menuService.getMenuById(pd).getString("MENU_URL");
		if("#".equals(MENU_URL.trim()) || "".equals(MENU_URL.trim()) || null == MENU_URL){
			MENU_URL = "../index/default.html";
		}
		String roleRights = Jurisdiction.getSession().getAttribute(Jurisdiction.getUsername() + Const.SESSION_ROLE_RIGHTS).toString();	//获取本角色菜单权限
		List<Menu> athmenuList = menuService.listAllMenuQx(MENU_ID);					//获取某菜单下所有子菜单
		athmenuList = this.readMenu(athmenuList, roleRights);							//根据权限分配菜单
		JSONArray arr = JSONArray.fromObject(athmenuList);
		String json = arr.toString();
		json = json.replaceAll("MENU_ID", "id").replaceAll("PARENT_ID", "pId").replaceAll("MENU_NAME", "name").replaceAll("subMenu", "nodes").replaceAll("hasMenu", "checked").replaceAll("MENU_URL", "url").replaceAll("#", "");
		map.put("zTreeNodes", json);
		map.put("MENU_URL",MENU_URL);		//本ID菜单链接
		map.put("result", errInfo);
		return map;
	}

	/**根据角色权限获取本权限的菜单列表(递归处理)
	 * @param menuList：传入的总菜单
	 * @param roleRights：加密的权限字符串
	 * @return
	 */
	public List<Menu> readMenu(List<Menu> menuList,String roleRights){
		for(int i=0;i<menuList.size();i++){
			menuList.get(i).setHasMenu(RightsHelper.testRights(roleRights, menuList.get(i).getMENU_ID()));
			if(menuList.get(i).isHasMenu() && "1".equals(menuList.get(i).getMENU_STATE())){	//判断是否有此菜单权限并且是否隐藏
				this.readMenu(menuList.get(i).getSubMenu(), roleRights);					//是：继续排查其子菜单
			}else{
				menuList.remove(i);
				i--;
			}
		}
		return menuList;
	}

	/**
	 * 校验菜单名称是否重复
	 */
	@RequestMapping(value = "/checkMenuName")
	@ResponseBody
	public Object checkMenuName() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>(16);
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		int count = menuService.checkMenuName(pd);
		if(count > 0){
			errInfo = "error";
		}
		map.put("result", errInfo);
		return map;
	}

}
