package com.dyx.controller.wjgl;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.User;
import com.dyx.service.wjgl.WjglService;
import com.dyx.util.Const;
import com.dyx.util.Jurisdiction;
import com.dyx.util.ObjectExcelView;
import com.dyx.util.Tools;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.session.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;

/**
 * Description：机动装备技术资料Controller
 * @author：何学斌
 * Date：2020/4/23
 */
@Controller
@RequestMapping("/wjgl")
public class WjglController extends BaseController {

	/**
	 * 机动装备技术资料接口
	 */
	@Autowired
	private WjglService wjglService;

	/**保存机动装备技术资料
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/add")
//	@RequiresPermissions("jszl:add")
	@ResponseBody
	public Object add() throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>(16);
		//返回参数
		String errInfo = "success";
		//创建pd对象
		PageData pd = new PageData();
		//获取前台传来的pd数据
		pd = this.getPageData();
		//获取session
		Session session = Jurisdiction.getSession();
		//获取当前登录用户
		User user = (User)session.getAttribute(Const.SESSION_USER);
		//创建人内码
		pd.put("CJR", user.getUSER_ID());
		//创建时间
		pd.put("CJSJ",new Date());
		//技术资料保存方法
		wjglService.save(pd);
		//返回结果
		map.put("result", errInfo);
		return map;
	}

	/**删除机动装备技术资料
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
//	@RequiresPermissions("jszl:del")
	@ResponseBody
	public Object delete() throws Exception{
		//创建HashMap对象
		Map<String,String> map = new HashMap<String,String>(16);
		//返回参数
		String errInfo = "success";
		//创建pd对象
		PageData pd = new PageData();
		//获取前台传来的pd数据
		pd = this.getPageData();
		//技术资料删除方法
		wjglService.delete(pd);
		//返回结果
		map.put("result", errInfo);
		return map;
	}

	/**修改机动装备技术资料
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
//	@RequiresPermissions("jszl:edit")
	@ResponseBody
	public Object edit() throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>(16);
		//返回参数
		String errInfo = "success";
		//创建pd对象
		PageData pd = new PageData();
		//获取前台传来的pd数据
		pd = this.getPageData();
		//获取session
		Session session = Jurisdiction.getSession();
		//获取当前登录用户
		User user = (User)session.getAttribute(Const.SESSION_USER);
		//修改人内码
		pd.put("XGR", user.getUSER_ID());
		//修改时间
		pd.put("XGSJ",new Date());
		//技术资料修改方法
		wjglService.edit(pd);
		//返回结果
		map.put("result", errInfo);
		return map;
	}

	/**机动装备技术资料列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
//	@RequiresPermissions("jszl:list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>(16);
		//返回参数
		String errInfo = "success";
		//创建pd对象
		PageData pd = new PageData();
		//获取前台传来的pd数据
		pd = this.getPageData();
		//获取Session
		Session session = Jurisdiction.getSession();
		//获取当前登录用户
		User user = (User)session.getAttribute(Const.SESSION_USER);
		//获取当前用户ID
		String strUserId = user.getUSER_ID();
		//把当前用户id放入查询条件中
		pd.put("CJR",strUserId);
		//关键词检索条件
		String keyWords = pd.getString("keyWords").replace("%","\\%");
		//获取关键词
		if(Tools.notEmpty(keyWords)) {
            pd.put("keyWords", keyWords.trim());
        }
		page.setPd(pd);
		//列出机动装备技术资料列表
		List<PageData>	varList = wjglService.list(page);
		//将数据 page返回到前台
		map.put("varList", varList);
		//分页
		map.put("page", page);
		//返回结果
		map.put("result", errInfo);
		return map;
	}

	 /**去修改页面获取机动装备技术资料数据
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
//	@RequiresPermissions("jszl:edit")
	@ResponseBody
	public Object goEdit() throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>(16);
		//返回参数
		String errInfo = "success";
		//创建pd对象
		PageData pd = new PageData();
		//获取前台传来的pd数据
		pd = this.getPageData();
		//根据ID读取技术资料数据
		pd = wjglService.findById(pd);
		//返回pd到前台
		map.put("pd", pd);
		//返回结果
		map.put("result", errInfo);
		return map;
	}

	 /**批量删除机动装备技术资料
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
//	@RequiresPermissions("jszl:del")
	@ResponseBody
	public Object deleteAll() throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>(16);
		//返回参数
		String errInfo = "success";
		//创建pd对象
		PageData pd = new PageData();
		//获取前台传来的pd数据
		pd = this.getPageData();
		//传来id
		String strDataIds = pd.getString("DATA_IDS");
		//分割删除
		if(Tools.notEmpty(strDataIds)){
			String [] arrDataIds= strDataIds.split(",");
			wjglService.deleteAll(arrDataIds);
			errInfo = "success";
		}else{
			errInfo = "error";
		}
		//返回结果
		map.put("result", errInfo);
		return map;
	}

	 /**导出机动装备技术资料到excel
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/excel")
//	@RequiresPermissions("toExcel")
	public ModelAndView exportExcel() throws Exception{
		//创建ModelAndView对象
		ModelAndView mv = new ModelAndView();
		//创建pd对象
		PageData pd = new PageData();
		//从前台中获取pd值
		pd = this.getPageData();
		//传来id
		String strDataIds = pd.getString("DATA_IDS");
		//分割id导出
		if (Tools.notEmpty(strDataIds)) {
			String[] arrDataIds = strDataIds.split(",");
			pd.put("arrDataIds",arrDataIds);
		}
		try {
			//获取session
			Session session = Jurisdiction.getSession();
			//获取当前登录用户
			User user = (User) session.getAttribute(Const.SESSION_USER);
			//获取当前用户ID
			String strUserId = user.getUSER_ID();
			//把当前用户id放入查询条件中
			pd.put("CJR", strUserId);
			//关键词检索条件
			String keyWords = pd.getString("keyWords").replace("%","\\%");
			//判空校验
			if (Tools.notEmpty(keyWords)) {
				//保存输入的关键字(去除前后空格)
				pd.put("keyWords", keyWords.trim());
			}
			//开始时间
			String startTime = pd.getString("startTime");
			//判空校验
			if(Tools.notEmpty(startTime)) {
				pd.put("startTime", startTime);
			}
			//结束时间
			String endTime = pd.getString("endTime");
			//判空校验
			if(Tools.notEmpty(endTime)) {
				pd.put("endTime", endTime);
			}
		//创建Map对象 用来存放导出的表头 表数据
		Map<String,Object> dataMap = new HashMap<String,Object>(16);
		//创建ArrayList 用来存放表头
		List<String> titles = new ArrayList<String>();
		titles.add("文档编号");
		titles.add("文档名称");
		titles.add("版本号");
		titles.add("生成单位");
		titles.add("密级名称");
		titles.add("编辑人");
		titles.add("编制时间");
		dataMap.put("titles", titles);
		//查询要导出的数据集
		List<PageData> varOList = wjglService.listAll(pd);
		//创建ArrayList用来存放数据集
		List<PageData> varList = new ArrayList<PageData>();
		//遍历varOList中的数据 获取并放到varList中
		for(int i=0;i<varOList.size();i++){
			PageData vpd = new PageData();
			vpd.put("var1", varOList.get(i).getString("WDBH"));
			vpd.put("var2", varOList.get(i).getString("WDMC"));
			vpd.put("var3", varOList.get(i).getString("BBH"));
			vpd.put("var4", varOList.get(i).getString("LSDWMC"));
			vpd.put("var5", varOList.get(i).getString("MJMC"));
			vpd.put("var6", varOList.get(i).getString("BJRMC"));
			vpd.put("var7", varOList.get(i).get("BZSJ").toString());
			//遍历数据放入集合中
			varList.add(vpd);
		}
		//将数据varList数据放到dataMap里
		dataMap.put("varList", varList);
		//创建ObjectExcelView对象
		ObjectExcelView erv = new ObjectExcelView();
		//返回结果到前台
		mv = new ModelAndView(erv,dataMap);
		} catch (Exception e){
			e.printStackTrace();
		}
		return mv;
	}

}
