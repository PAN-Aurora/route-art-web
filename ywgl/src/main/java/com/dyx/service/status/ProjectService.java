package com.dyx.service.status;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.TblProject;

import java.util.List;

public interface ProjectService {
    /**
     * 查询项目管理列表
     * @param page
     * @return
     */
    List<TblProject> selectPorjectList(Page page);

    /**
     * 保存项目管理信息
     * @throws Exception
     */
    public void save(TblProject tblProject)throws Exception;

    /**
     * 修改
     * @param tblProject
     * @throws Exception
     */
    public void updateByPrimaryKey(TblProject tblProject)throws Exception;

    public void updateProjectById(TblProject tblProject)throws Exception;

    /**
     * 删除
     * @param projectId
     */
    public void deleteByPrimaryKey(Integer projectId);

    /**
     * 查询单个对象
     * @param projectId
     * @return
     */
    public TblProject selectByPrimaryKey( Integer projectId);
}
