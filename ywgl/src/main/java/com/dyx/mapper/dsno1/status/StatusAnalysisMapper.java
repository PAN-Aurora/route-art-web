package com.dyx.mapper.dsno1.status;

import com.dyx.entity.Page;
import com.dyx.entity.TblAnalysis;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface StatusAnalysisMapper {

    public void saveAnalysis(TblAnalysis tblAnalysis);

    public void deleteByPrimaryKey(@Param("id") Integer id);


    public List<TblAnalysis> selectAnalysislistPage(Page page);

}
