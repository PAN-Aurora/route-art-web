package com.dyx.service.wjgl.impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.wjgl.WjglMapper;
import com.dyx.service.wjgl.WjglService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/** 
 * 说明： 技术资料管理接口实现类
 * 作者：
 * 时间：2020-02-12
 * 官网：www.fhadmin.org
 * @version
 */

/**
 * Description：机动装备技术资料实现类
 * @author：何学斌
 * Date：2020/4/23
 */
@Service
@Transactional
public class WjglServiceImpl implements WjglService {

	/**
	 * 机动装备技术资料Mapper
	 */
	@Autowired
	private WjglMapper wjglMapper;
	
	/**新增机动装备技术资料
	 * @param pd
	 * @throws Exception
	 */
	@Override
    public void save(PageData pd)throws Exception{
		wjglMapper.save(pd);
	}
	
	/**删除机动装备技术资料
	 * @param pd
	 * @throws Exception
	 */
	@Override
    public void delete(PageData pd)throws Exception{
		wjglMapper.delete(pd);
	}
	
	/**修改机动装备技术资料
	 * @param pd
	 * @throws Exception
	 */
	@Override
    public void edit(PageData pd)throws Exception{
		wjglMapper.edit(pd);
	}
	
	/**机动装备技术资料列表
	 * @param page
	 * @throws Exception
	 */
	@Override
    public List<PageData> list(Page page)throws Exception{
		return wjglMapper.datalistPage(page);
	}
	
	/**机动装备技术资料列表(全部)
	 * @param pd
	 * @throws Exception
	 */
	@Override
    public List<PageData> listAll(PageData pd)throws Exception{
		return wjglMapper.listAll(pd);
	}
	
	/**通过id获取机动装备技术资料数据
	 * @param pd
	 * @throws Exception
	 */
	@Override
    public PageData findById(PageData pd)throws Exception{
		return wjglMapper.findById(pd);
	}
	
	/**批量删除机动装备技术资料
	 * @param arrDataIds
	 * @throws Exception
	 */
	@Override
    public void deleteAll(String[] arrDataIds)throws Exception{
		wjglMapper.deleteAll(arrDataIds);
	}
	
}

