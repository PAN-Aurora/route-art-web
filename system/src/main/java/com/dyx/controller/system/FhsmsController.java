package com.dyx.controller.system;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.service.system.FhsmsService;
import com.dyx.util.DateUtil;
import com.dyx.util.Jurisdiction;
import com.dyx.util.Tools;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 说明：站内信处理类
 * 作者：FH Admin Q313 596-790
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/fhsms")
public class FhsmsController extends BaseController {
	
	@Autowired
	private FhsmsService fhsmsService;
	
	/**发送站内信
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/send")
	@RequiresPermissions("fhSms")
	@ResponseBody
	public Object save() throws Exception{
		PageData pd = new PageData();
		pd = this.getPageData();
		Map<String,Object> map = new HashMap<String,Object>();
		String result = "success";		//发送状态
		int count = 0;					//统计发送成功条数
		int zcount = 0;					//理论条数
		String USERNAME = pd.getString("USERNAME");				//对方用户名
		if(Tools.notEmpty(USERNAME)){
			USERNAME = USERNAME.replaceAll("；", ";");
			USERNAME = USERNAME.replaceAll(" ", "");
			String[] arrUSERNAME = USERNAME.split(";");
			zcount = arrUSERNAME.length;
			pd.put("STATUS", "2");										//状态
			for(int i=0;i<arrUSERNAME.length;i++){
				pd.put("SANME_ID", this.get32UUID());					//共同ID
				pd.put("SEND_TIME", DateUtil.getTime());				//发送时间
				pd.put("FHSMS_ID", this.get32UUID());					//主键1
				pd.put("TYPE", "2");									//类型2：发信
				pd.put("FROM_USERNAME", Jurisdiction.getUsername());	//发信人
				pd.put("TO_USERNAME", arrUSERNAME[i]);					//收信人
				fhsmsService.save(pd);									//存入发信
				pd.put("FHSMS_ID", this.get32UUID());					//主键2
				pd.put("TYPE", "1");									//类型1：收信
				pd.put("FROM_USERNAME", arrUSERNAME[i]);				//发信人
				pd.put("TO_USERNAME", Jurisdiction.getUsername());		//收信人
				fhsmsService.save(pd);
				count++;
			}
		}else{
			result = "error";
		}
		map.put("result", result);
		map.put("count", count);						//成功数
		map.put("ecount", zcount-count);				//失败数
		return map;
	}
	
	/**发送站内信(微服务端请求)
	 * @return
	 * @throws Exception
	 */
	@RequestMapping(value="/tosms")
	@ResponseBody
	public Object tosms(@RequestBody PageData pd) throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		String errInfo = "success";
		if(Tools.checkTokenKey("sendSms", pd.getString("tokenKey"))) {	//检验tokenKey
			fhsmsService.save(pd);
		}else {
			errInfo = "errer";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**删除
	 * @param out
	 * @throws Exception
	 */
	@RequestMapping(value="/delete")
	@ResponseBody
	public Object delete() throws Exception{
		Map<String,String> map = new HashMap<String,String>();
		PageData pd = new PageData();
		pd = this.getPageData();
		String errInfo = "success";
		fhsmsService.delete(pd);
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**列表
	 * @param page
	 * @throws Exception
	 */
	@RequestMapping(value="/list")
	@ResponseBody
	public Object list(Page page) throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		String keyWords = pd.getString("keyWords").replace("%","\\%");						//关键词检索条件
		if(Tools.notEmpty(keyWords))pd.put("keyWords", keyWords.trim());
		String startTime = pd.getString("startTime");					//开始时间
		String endTime = pd.getString("endTime");						//结束时间
		if(Tools.notEmpty(startTime))pd.put("startTime", startTime+" 00:00:00");
		if(Tools.notEmpty(endTime)) {
            pd.put("endTime", endTime+" 00:00:00");
        }
		if(!"2".equals(pd.getString("TYPE"))){							//1：收信箱 2：发信箱
			pd.put("TYPE", 1);
		}
		pd.put("FROM_USERNAME", Jurisdiction.getUsername()); 			//当前用户名
		page.setPd(pd);	
		List<PageData>	varList = fhsmsService.list(page);				//列出Fhsms列表
		map.put("varList", varList);
		map.put("page", page);
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}
	
	 /**去查看页面
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/goView")
	@ResponseBody
	public Object goView()throws Exception{
		Map<String,Object> map = new HashMap<String,Object>();
		String errInfo = "success";
		PageData pd = new PageData();
		pd = this.getPageData();
		if("1".equals(pd.getString("TYPE")) && "2".equals(pd.getString("STATUS"))){ //在收信箱里面查看未读的站内信时去数据库改变未读状态为已读
			fhsmsService.edit(pd);
		}
		pd = fhsmsService.findById(pd);	//根据ID读取
		map.put("pd", pd);
		map.put("result", errInfo);
		return map;
	}	
	
	 /**批量删除
	 * @param
	 * @throws Exception
	 */
	@RequestMapping(value="/deleteAll")
	@ResponseBody
	public Object deleteAll(){
		PageData pd = new PageData();		
		Map<String,Object> map = new HashMap<String,Object>();
		pd = this.getPageData();
		String errInfo = "success";
		String DATA_IDS = pd.getString("DATA_IDS");
		if(Tools.notEmpty(DATA_IDS)){
			try{
				String ArrayDATA_IDS[] = DATA_IDS.split(",");
				fhsmsService.deleteAll(ArrayDATA_IDS);
			} catch(Exception e){
				errInfo = "error";
			}
		}else{
			errInfo = "error";
		}
		map.put("result", errInfo);				//返回结果
		return map;
	}
	
	/**获取站内信未读总数
	 * @return
	 * @throws Exception 
	 */
	@RequestMapping(value="/getFhsmsCount")
	@ResponseBody
	public Object getFhsmsCount() throws Exception {
		Map<String,Object> map = new HashMap<String,Object>();
		map.put("fhsmsCount", fhsmsService.findFhsmsCount(Jurisdiction.getUsername()).get("fhsmsCount").toString());//站内信未读总数
		return map;
	}

}
