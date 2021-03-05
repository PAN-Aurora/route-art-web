package com.dyx.service.system.impl;

import com.dyx.service.system.PhotoService;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.system.PhotoMapper;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 说明：头像编辑服务接口实现类
 * 作者：FH Admin Q 31359679 0
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class PhotoServiceImpl implements PhotoService {

	@Autowired
	private PhotoMapper photoMapper;

	/**新增
	 * @param pd
	 * @throws Exception
	 */
	public void save(PageData pd) throws Exception {
		photoMapper.save(pd);
		pd.put("tokenKey", Tools.creatTokenKey("photoAdd"));
		//LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-dbsync", "photo/add", pd);			//请求数据库表同步微服务
		//LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-im", "friends/photoAdd", pd);		//IM微服务同步头像
	}

	/**修改
	 * @param pd
	 * @throws Exception
	 */
	public void edit(PageData pd, PageData ypd) throws Exception {
		photoMapper.edit(pd);
		pd.put("tokenKey", Tools.creatTokenKey("photoEdit"));
		//LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-dbsync", "photo/edit", pd);		//请求数据库表同步微服务
		//LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-im", "friends/photoEdit", pd);		//IM微服务同步头像
		ypd.put("tokenKey", Tools.creatTokenKey("photoDel"));
		//LoadBalancerUtil.responseByPost(this.loadBalancerClient, "fh-im", "friends/photoDel", ypd);		//IM微服务删除原头像
	}

	/**通过id获取数据
	 * @param pd
	 * @throws Exception
	 */
	public PageData findById(PageData pd) throws Exception {
		return photoMapper.findById(pd);
	}

}
