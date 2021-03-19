package com.dyx.mapper.dsno1.status;

import com.dyx.entity.Page;
import com.dyx.entity.TblProject;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface ProjectMapper {

    List<TblProject> listPageData(Page page);

    public void save(TblProject tblProject);

    public void updateByPrimaryKey(TblProject tblProject);

    public void updateProjectById(TblProject tblProject);

    public void deleteByPrimaryKey(@Param("projectId") Integer projectId);

    public TblProject selectByPrimaryKey(@Param("projectId") Integer projectId);
}
