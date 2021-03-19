package com.dyx.service.status.impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.TblProject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dyx.mapper.dsno1.status.ProjectMapper;
import com.dyx.service.status.ProjectService;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

	@Autowired
    ProjectMapper routeArtMapper;

    @Override
    public List<TblProject> selectPorjectList(Page page) {
        return routeArtMapper.listPageData(page);
    }

    @Override
    public void save(TblProject tblProject) throws Exception {
        routeArtMapper.save(tblProject);
    }

    @Override
    public void deleteByPrimaryKey(Integer projectId) {
        routeArtMapper.deleteByPrimaryKey(projectId);
    }

    @Override
    public TblProject selectByPrimaryKey(Integer projectId) {
        return routeArtMapper.selectByPrimaryKey(projectId);
    }

    @Override
    public void updateByPrimaryKey(TblProject tblProject) throws Exception {
          routeArtMapper.updateByPrimaryKey(tblProject);
    }

    @Override
    public void updateProjectById(TblProject tblProject) throws Exception {
          routeArtMapper.updateProjectById(tblProject);
    }
}
