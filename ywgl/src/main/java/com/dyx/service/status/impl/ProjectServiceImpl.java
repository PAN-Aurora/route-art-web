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
        return routeArtMapper.selectListPage(page);
    }
}
