package com.dyx.controller.status;

import java.io.File;
import java.util.*;

import com.dyx.entity.TblAnalysis;
import com.dyx.util.*;
import org.apache.shiro.session.Session;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.EsPageModel;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.User;
import com.dyx.service.es.FileEsService;
import com.dyx.service.status.StatusAnalysisService;
import com.dyx.service.wjgl.WjglService;

import javax.servlet.http.HttpServletResponse;

/**
 * 发展需求  国际现状分析
 *
 */
@Controller
@RequestMapping("/statusAnalysis")
public class StatusAnalysisController extends BaseController {
	
    private static final Logger logger = LoggerFactory.getLogger(StatusAnalysisController.class);

	@Autowired
    StatusAnalysisService statusAnalysisService;
    
    @Autowired
    FileEsService fileEsService;
    
    @Autowired
    WjglService wjglService;
    
    @Value("${es.file_index}")
    String  fileIndex;
    
    @Value("${es.file_type}")
    String  fileType;
    
    /***
     * 
     * @param page
     * @return
     * @throws Exception
     */
	@RequestMapping(value="/list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>();
		//返回参数
		String errInfo = "success";
		//创建pd对象
		PageData pd = this.getPageData();
		//获取前台传来的pd数据
		//获取Session
		Session session = Jurisdiction.getSession();
		//获取当前登录用户
		User user = (User)session.getAttribute(Const.SESSION_USER);
		//获取当前用户ID
		String strUserId = user.getUSER_ID();
		//把当前用户id放入查询条件中
		pd.put("CJR",strUserId);
		
		//关键词检索条件
		String keyWords = pd.getString("keyWords").replace("%","\\%");
		QueryBuilder matchQuery = null;
		//获取关键词
		if(Tools.notEmpty(keyWords)) {
           //QueryBuilder matchQuery = QueryBuilders.matchQuery("file_content",keyWords);
            matchQuery = QueryBuilders
        			.matchPhraseQuery("file_content",keyWords.trim());
        }
		page.setPd(pd);
		
		int size = Integer.parseInt(pd.getString("showCount"))==-1?10:Integer.parseInt(pd.getString("showCount"));
		int from = (Integer.parseInt(pd.getString("currentPage"))-1) * size;

		 String fileds = "id,file_id,file_name,file_no,file_type,file_url,file_url_pdf,file_size,created_time";
		 //从es中分页查询出数据
		 EsPageModel pageModel =   fileEsService.searchDataPage(
			 fileIndex
		    ,fileType
		    ,from
		    ,size
		    ,matchQuery
				 ,fileds,"",""
		   );
	    //将返回参数填充到相关返回参数中
		page.setCurrentPage(pageModel.getCurrentPage());
		page.setShowCount(pageModel.getPageSize());
		page.setTotalPage(pageModel.getPageCount());
		page.setTotalResult(pageModel.getRecordCount());
		
		//将数据 page返回到前台
		map.put("varList", pageModel.getRecordList());
		//分页
		map.put("page", page);
		//返回结果
		map.put("result", errInfo);
	    return map;
	}
    
	
	/**
	 * 删除文件资料
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	public Object delete() throws Exception{
		//创建HashMap对象
		Map<String,String> map = new HashMap<String,String>();
		//返回参数
		String errInfo = "success";
		//创建pd对象
		PageData pd = this.getPageData();
		//获取前台传来的pd数据

		if(!StringUtil.isNullOrEmptyOrNULLString(pd.getString("JSZL_ID"))) {
			//技术资料删除方法
			wjglService.delete(pd);
		}
		if(!StringUtil.isNullOrEmptyOrNULLString(pd.getString("fileId"))) {
			//根据id删除es对应数据
			fileEsService.deleteDataById( fileIndex
					,fileType, pd.getString("fileId"));
		}
		//返回结果
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 下载
	 * @throws Exception
	 */
	@RequestMapping(value="/downFile/{file_id}")
	@ResponseBody
	public Object downFile(@PathVariable("file_id") String fileId, HttpServletResponse response){
		//创建HashMap对象
		Map<String,String> map = new HashMap<String,String>();
		//返回参数
		String errInfo = "success";
		try{
			Map<String, Object> mapEs  =  fileEsService.searchDataById( fileIndex,fileType,fileId,null);
			FileDownload.fileDownload(response,mapEs.get("file_url").toString(),mapEs.get("file_name").toString());
			//获取前台传来的pd数据
		}catch (Exception e){
			e.printStackTrace();
			logger.info("########下载文件异常######");
			errInfo = "exception";
		}
		//返回结果
		map.put("result", errInfo);
		return map;
	}

	/**
	 * 预览
	 * @throws Exception
	 */
	@RequestMapping(value="/showFile/{file_id}")
	@ResponseBody
	public Object showFile(@PathVariable("file_id") String fileId, HttpServletResponse response){
		//创建HashMap对象
		Map<String,String> map = new HashMap<String,String>();
		//返回参数
		String errInfo = "success";
		try{
			Map<String, Object> mapEs  =  fileEsService.searchDataById( fileIndex,fileType,fileId,null);
			FileDownload.fileDownload(response,mapEs.get("file_url_pdf").toString(),mapEs.get("file_name").toString());
			//获取前台传来的pd数据
		}catch (Exception e){
			e.printStackTrace();
			logger.info("########下载文件异常######");
			errInfo = "exception";
		}
		//返回结果
		map.put("result", errInfo);
		return map;
	}


	/**保存
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/save")
	@ResponseBody
	public Object save(TblAnalysis tblAnalysis) throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>();
		//返回参数
		String errInfo = "success";

		if(!StringUtil.isNullOrEmptyOrNULLString(tblAnalysis.getAnalysisBase())){
			String[] ids = tblAnalysis.getAnalysisBase().split(",");
			List<Map<String,Object>> list =  fileEsService.searchDataByIdBatch( fileIndex,fileType,ids);
			StringBuilder sql = new StringBuilder();
			for(int i=0;i<list.size();i++){
				sql.append(list.get(i).get("file_name")).append(";");
			}
			tblAnalysis.setAnalysisBaseName(sql.toString());
		}
		tblAnalysis.setType(1);
		tblAnalysis.setCreateTime(new Date());
		//技术资料保存方法
		statusAnalysisService.saveAnalysis(tblAnalysis);
		//返回结果
		map.put("result", errInfo);
		return map;
	}


	/**
	 *  需求分析
	 *  @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/getDatalist")
	@ResponseBody
	public Object getDatalist(Page page) throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>();
		//返回参数
		String errInfo = "success";
		//创建pd对象
		PageData pd = new PageData();
		//获取前台传来的pd数据
		pd = this.getPageData();
		//获取Session
		String analysisResult = pd.getString("analysisResult").replace("%","\\%");
		//获取关键词
		if(Tools.notEmpty(analysisResult)) {
			pd.put("analysisResult", analysisResult.trim());
		}
		String projectName = pd.getString("projectName").replace("%","\\%");
		if(Tools.notEmpty(projectName)) {
			pd.put("projectName", projectName.trim());
		}
		pd.put("type", 1);

		page.setPd(pd);

		List<TblAnalysis>	projectList = statusAnalysisService.selectAnalysisListPage(page);
		//将数据 page返回到前台
		map.put("varList", projectList);
		//分页
		map.put("page", page);
		//返回结果
		map.put("result", errInfo);

		return map;
	}

	/**
	 * 删除需求分析
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAnalysisById")
	@ResponseBody
	public Object deleteAnalysisById() throws Exception{
		//创建HashMap对象
		Map<String,String> map = new HashMap<String,String>();
		//返回参数
		String errInfo = "success";
		//创建pd对象
		PageData pd = this.getPageData();
		//获取前台传来的pd数据
		if(!StringUtil.isNullOrEmptyOrNULLString(pd.getString("id"))) {
			//根据id删除es对应数据
			statusAnalysisService.deleteByPrimaryKey(Integer.parseInt(pd.getString("id").toString()));
		}
		//返回结果
		map.put("result", errInfo);
		return map;
	}


}
