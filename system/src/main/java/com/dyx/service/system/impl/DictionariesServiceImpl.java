package com.dyx.service.system.impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.Dictionaries;
import com.dyx.mapper.dsno1.system.DictionariesMapper;
import com.dyx.service.system.DictionariesService;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 说明：按钮权限服务接口实现类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class DictionariesServiceImpl implements DictionariesService {


	@Autowired
	private DictionariesMapper dictionariesMapper;

	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)
	 * @param MENU_ID
	 * @return
	 * @throws Exception
	 */
	@Override
	public List<Dictionaries> listAllDict(String parentId) throws Exception {
		List<Dictionaries> dictList = this.listSubDictByParentId(parentId);
		for(Dictionaries dict : dictList){
			dict.setTreeurl("dictionaries_list.html?DICTIONARIES_ID="+dict.getDICTIONARIES_ID());
			dict.setSubDict(this.listAllDict(dict.getDICTIONARIES_ID()));
			dict.setTarget("treeFrame");
		}
		return dictList;
	}

	/**
	 * 通过ID获取其子级列表
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	@Override
	public List<Dictionaries> listSubDictByParentId(String parentId) throws Exception {
		return dictionariesMapper.listSubDictByParentId(parentId);
	}

	/**
	 * 根据标识获取其子级列表
	 * @param bsId
	 * @return
	 * @throws Exception
	 */
	@Override
	public List<Dictionaries> getDictByBsId(String bsId) throws Exception {
		return dictionariesMapper.getDictByBsId(bsId);
	}

	/**
	 * 查询标识或者编码是否已存在
	 *
	 * @param pd 前端传递参数
	 * @return
	 */
	@Override
	public PageData findByMcBs(PageData pd) throws Exception {
		return dictionariesMapper.findByMcBs(pd);
	}
	/**
	 * 获取所有数据并填充每条数据的子级列表(递归处理)用于代码生成器引用数据字典
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	@Override
	public List<Dictionaries> listAllDictToCreateCode(String parentId) throws Exception {
		List<Dictionaries> dictList = this.listSubDictByParentId(parentId);
		for(Dictionaries dict : dictList){
			dict.setTreeurl("setDID('"+dict.getDICTIONARIES_ID()+"');");
			dict.setSubDict(this.listAllDictToCreateCode(dict.getDICTIONARIES_ID()));
			dict.setTarget("treeFrame");
		}
		return dictList;
	}

	/**列表
	 * @param page
	 * @throws Exception
	 */
	@Override
	public List<PageData> list(Page page)throws Exception{
		return dictionariesMapper.datalistPage(page);
	}

	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	@Override
	public PageData findById(PageData pd)throws Exception{
		return dictionariesMapper.findById(pd);
	}

	/**通过编码获取数据
	 * @param pd
	 * @throws Exception
	 */
	@Override
	public PageData findByBianma(PageData pd)throws Exception{
		return dictionariesMapper.findByBianma(pd);
	}

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	@Override
	public void save(PageData pd)throws Exception{
		dictionariesMapper.save(pd);
		pd.put("tokenKey", Tools.creatTokenKey("dictionariesAdd"));
//		LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-dbsync", "dictionaries/add", pd);	//请求数据库表同步微服务
	}

	/**修改
	 * @param pd
	 * @throws Exception
	 */
	@Override
	public void edit(PageData pd)throws Exception{
		dictionariesMapper.edit(pd);
		pd.put("tokenKey", Tools.creatTokenKey("dictionariesEdit"));
//		LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-dbsync", "dictionaries/edit", pd);	//请求数据库表同步微服务
	}

	/**排查表检查是否被占用
	 * @param pd
	 * @throws Exception
	 */
	@Override
	public PageData findFromTbs(PageData pd)throws Exception{
		return dictionariesMapper.findFromTbs(pd);
	}

	/**删除
	 * @param pd
	 * @throws Exception
	 */
	@Override
	public void delete(PageData pd)throws Exception{
		dictionariesMapper.delete(pd);
		pd.put("tokenKey", Tools.creatTokenKey("dictionariesDel"));
//		LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-dbsync", "dictionaries/delete", pd);	//请求数据库表同步微服务
	}


	/**
	 * 查询地区列表ztree
	 * @param parentId
	 * @return
	 * @throws Exception
	 */
	@Override
	public List<Dictionaries> listAllDqDict(String parentId) throws Exception {
		List<Dictionaries> valueList = this.listSubDictByParentId(parentId);
		if (valueList.size() > 0) {
			for (Dictionaries fhentity : valueList) {
				fhentity.setSubDict(this.listAllDqDict(fhentity.getDICTIONARIES_ID()));
			}
		}
		return valueList;
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
		pd.put("DICTIONARIES_ID",Tools.checkString(pd.get("DICTIONARIES_ID")).equals("") ? "0" : pd.getString("DICTIONARIES_ID"));
		//获取传递过来的TreeUrl
		String strTreeUrl = Tools.isEmpty(pd.getString("TREEURL")) ? null : pd.getString("TREEURL");
		//查询数据
		List<PageData> lstSjzd = dictionariesMapper.getChildrenByParentId(pd);
		//遍历赋值
		for (PageData oPd : lstSjzd) {
			//获取isParent的值
			String strIsParent = Tools.checkString(oPd.get("isParent"));
			if (strTreeUrl != null) {
				//设置跳转路径和target目标区域
				oPd.put("url", strTreeUrl + "?id=" + oPd.getString("DICTIONARIES_ID"));
				oPd.put("target", "treeFrame");
				//判断是父节点还是子节点并添加对应的图标
				if ("true".equals(strIsParent)) {
//					oPd.put("icon","../../../plugins/zTree/3.5/css/zTreeStyle/img/diy/9.png");
				}else{
					oPd.put("icon","../../../plugins/zTree/3.5/css/zTreeStyle/img/diy/2.png");
				}
			}
		}
		//返回值
		return lstSjzd;
	}

	/**
	 * 查询装备类型
	 * @return
	 * @throws Exception
	 */
	@Override
	public List<PageData> getZblx() throws Exception {
		return dictionariesMapper.getZblx();
	}

}
