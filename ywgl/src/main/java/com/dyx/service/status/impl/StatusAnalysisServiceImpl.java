package com.dyx.service.status.impl;

import com.dyx.entity.Page;
import com.dyx.entity.TblAnalysis;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dyx.mapper.dsno1.status.StatusAnalysisMapper;
import com.dyx.service.status.StatusAnalysisService;

import java.util.List;

@Service
public class StatusAnalysisServiceImpl implements StatusAnalysisService {
		
	@Autowired
	StatusAnalysisMapper  statusAnalysisMapper;

	@Override
	public void saveAnalysis(TblAnalysis tblAnalysis) {
		statusAnalysisMapper.saveAnalysis(tblAnalysis);
	}

	@Override
	public void deleteByPrimaryKey(Integer id) {

		statusAnalysisMapper.deleteByPrimaryKey(id);

	}

	@Override
	public List<TblAnalysis> selectAnalysisListPage(Page page) {
		return statusAnalysisMapper.selectAnalysislistPage(page);
	}
}
