package com.dyx.mapper.dsno1.status;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.TblProject;

import java.util.List;

public interface ProjectMapper {



    List<TblProject> listPageData(Page page);


}
