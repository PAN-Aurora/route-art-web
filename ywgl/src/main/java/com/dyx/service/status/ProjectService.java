package com.dyx.service.status;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.TblProject;

import java.util.List;

public interface ProjectService {



    List<TblProject> selectPorjectList(Page page);
}
