package com.dyx.service.status.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.dyx.mapper.dsno1.status.StatusAnalysisMapper;
import com.dyx.service.status.StatusAnalysisService;

@Service
public class StatusAnalysisServiceImpl implements StatusAnalysisService {
		
	@Autowired
	StatusAnalysisMapper  statusAnalysisMapper;
}
