package com.dyx.controller.status;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.system.SystemUtil;
import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.TblProject;
import com.dyx.entity.system.User;
import com.dyx.util.*;
import com.google.common.collect.Lists;
import org.apache.shiro.session.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.dyx.service.status.ProjectService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.xmind.core.*;

import javax.servlet.http.HttpServletResponse;
import java.util.*;

@Controller
@RequestMapping("/project")
public class ProjectController extends BaseController {

	/**
	 * 当前类路径
	 */
	public static final String CLASS_PATH = ProjectController.class.getResource("/").getPath();
	/**
	 * 文件分隔符
	 */
	public static final String FILE_SEPARATOR = SystemUtil.getOsInfo().getFileSeparator();

	private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

	@Autowired
	ProjectService projectService;


	/**
	 * 生成 路线图 xmind格式
	 * @throws Exception
	 */
	@RequestMapping(value="/markRouteFile")
	@ResponseBody
	public Object markRouteFile(@RequestParam("projectId") Integer projectId){
		//创建HashMap对象
		Map<String,String> map = new HashMap<String,String>();
		//返回参数
		String errInfo = "success";
		String filePath = "";
		try{
			// 读取目录
			String[]  pathList = new  String[]{"1.发展需求","2.建设目标","3.发展重点","4.技术路径","5.保障支撑"};
			// 创建思维导图的工作空间
			IWorkbookBuilder workbookBuilder = Core.getWorkbookBuilder();
			IWorkbook workbook = workbookBuilder.createWorkbook();
			// 获得默认sheet
			ISheet primarySheet = workbook.getPrimarySheet();

			// 获得根主题
			ITopic rootTopic = primarySheet.getRootTopic();
			// 设置根主题的标题
			rootTopic.setTitleText("技术发展路线");

			for(int i=0;i<pathList.length;i++){
				List<String> contents = FileUtil.readLines(CLASS_PATH +"/xmind/"+ pathList[i] + ".txt", "utf-8");
				ITopic topicRoot =  workbook.createTopic();
				topicRoot.setTitleText(pathList[i]);
				ArrayList<ITopic> chapterTopics = Lists.newArrayList();

				for (String content : contents) {
					// 如果是数字开头为章节名称
					if (ReUtil.isMatch("^[1-9].*?", content)) {
						// 创建章节节点
						ITopic topic = workbook.createTopic();
						topic.setTitleText(content);
						chapterTopics.add(topic);
					} else {
						// 创建小节节点
						ITopic topic = workbook.createTopic();
						topic.setTitleText(content);
						chapterTopics.get(chapterTopics.size() - 1).add(topic, ITopic.ATTACHED);
					}
				}
				chapterTopics.forEach(it -> topicRoot.add(it, ITopic.ATTACHED));
				rootTopic.add(topicRoot);
			}

			TblProject tblProject =  projectService.selectByPrimaryKey(projectId);

			filePath = CLASS_PATH +"/xmind/"+ FILE_SEPARATOR + tblProject.getProjectNo() + ".xmind";
			// 保存
			workbook.save(filePath);

			logger.info("########生成xmind文件成功######文件路径："+filePath);

			//执行保存
			if(filePath.length()>0){
				tblProject = new TblProject();
				tblProject.setProjectId(projectId);
				tblProject.setIsMaker(1);
				tblProject.setFilePath(filePath);
				projectService.updateByPrimaryKey(tblProject);

			}
		}catch (Exception e){
			e.printStackTrace();
			logger.info("########生成xmind文件异常######");
			errInfo = "exception";
		}
		//返回结果
		map.put("result", errInfo);
		return map;
	}
	/**
	 * 下载路线图 xmind格式
	 * @throws Exception
	 */
	@RequestMapping(value="/downRouteFile")
	@ResponseBody
	public Object downRouteFile(@RequestParam("projectId") Integer projectId,HttpServletResponse response){
		//创建HashMap对象
		Map<String,String> map = new HashMap<String,String>();
		//返回参数
		String errInfo = "success";
		try{
		    TblProject project  =  projectService.selectByPrimaryKey(projectId);
			FileDownload.fileDownload(response,project.getFilePath(),project.getProjectNo()+".xmind");
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
	  *  项目列表
	 *  @param page
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
		PageData pd = new PageData();
		//获取前台传来的pd数据
		pd = this.getPageData();
		//获取Session
		Session session = Jurisdiction.getSession();
		//获取当前登录用户
		User user = (User)session.getAttribute(Const.SESSION_USER);
		//获取当前用户ID
		String strUserId = user.getUSER_ID();
		//把当前用户id放入查询条件中
		pd.put("CJR",strUserId);
		//关键词检索条件
		if(pd.getString("keyWords")!=null && pd.getString("keyWords") !=""){
			String keyWords = pd.getString("keyWords").replace("%","\\%");
			//获取关键词
			if(Tools.notEmpty(keyWords)) {
				pd.put("keyWords", keyWords.trim());
			}
		}

		page.setPd(pd);
		List<TblProject>	projectList = projectService.selectPorjectList(page);
		//将数据 page返回到前台
		map.put("varList", projectList);
		//分页
		map.put("page", page);
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
	public Object save(TblProject tblProject) throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>();
		//返回参数
		String errInfo = "success";
		//获取session
		Session session = Jurisdiction.getSession();
		//获取当前登录用户
		User user = (User)session.getAttribute(Const.SESSION_USER);

		tblProject.setUserId(user.getUSER_ID());
		tblProject.setCreateTime(new Date());
		//技术资料保存方法
		projectService.save(tblProject);
		//返回结果
		map.put("result", errInfo);
		return map;
	}


	/**删除
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	public Object delete(@RequestParam("projectId") Integer projectId) throws Exception{
		//创建HashMap对象
		Map<String,String> map = new HashMap<String,String>();
		//返回参数
		String errInfo = "success";
		projectService.deleteByPrimaryKey(projectId);
		//返回结果
		map.put("result", errInfo);
		return map;
	}

	/**删除
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteBatch")
	@ResponseBody
	public Object deleteBatch(@RequestParam("projectIds") String projectIds) throws Exception{
		//创建HashMap对象
		Map<String,String> map = new HashMap<String,String>();
		//返回参数
		String errInfo = "success";
		if(!StringUtil.isNullOrEmptyOrNULLString(projectIds)){
			String[] ids = projectIds.split(",");
			for(String id:ids){
				projectService.deleteByPrimaryKey(Integer.parseInt(id));
			}
		}
		//返回结果
		map.put("result", errInfo);
		return map;
	}

	/**删除
	 * @throws Exception
	 */
	@RequestMapping(value="/edit")
	@ResponseBody
	public Object edit(TblProject tblProject) throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>();
		//返回参数
		String errInfo = "success";

		projectService.updateProjectById(tblProject);
		//返回结果
		map.put("result", errInfo);

		return map;
	}

	/**删除
	 * @throws Exception
	 */
	@RequestMapping(value="/goEdit")
	@ResponseBody
	public Object goEdit(@RequestParam("projectId") Integer projectId) throws Exception{
		//创建HashMap对象
		Map<String,Object> map = new HashMap<String,Object>();
		//返回参数
		String errInfo = "success";

		TblProject tblProject =  projectService.selectByPrimaryKey(projectId);
		//返回结果
		map.put("result", errInfo);
		map.put("pd",  tblProject);

		return map;
	}

}
