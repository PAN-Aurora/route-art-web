package com.dyx.service.status;

import com.dyx.entity.Page;
import com.dyx.entity.TblAnalysis;

import java.util.List;

public interface StatusAnalysisService {

    public void saveAnalysis(TblAnalysis tblAnalysis);

    public void deleteByPrimaryKey(Integer id);

    public List<TblAnalysis> selectAnalysisListPage(Page page);
}
