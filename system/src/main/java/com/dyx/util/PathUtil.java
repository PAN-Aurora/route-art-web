package com.dyx.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.File;

/**
 * 说明：路径工具类
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */

@Component
public class PathUtil {

	private static String dataPath;

	@Value("${web.file-path}")
	public void setDataPath(String dataPath) {
		PathUtil.dataPath = dataPath;
	}

	/**获取Projectpath
	 * @return
	 */
	public static String getProjectpath(){
		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
		String path = request.getServletContext().getRealPath("/").replaceAll("%20", " ").replaceAll("file:/", "").trim();
		return path;
	}

	public static String getClasspath2(){
		if (dataPath==null||dataPath.length()<=0)
		{
			String path = (String.valueOf(Thread.currentThread().getContextClassLoader().getResource(""))+"META-INF/resources/").replaceAll("file:/", "").replaceAll("%20", " ").trim();
			System.out.println(path);
			if(path.indexOf(":") != 1){
				path = File.separator + path;
			}
			return path + Const.FILEPATHFILE;
		}
		//当项目以jar、war包运行时，路径改成实际硬盘位置
		else
		{
			return dataPath;
		}
	}

	/**获取Classpath
	 * @return
	 */
	public static String getClasspath(){
		if (dataPath==null||dataPath.length()<=0)
		{
			String path =  (String.valueOf(Thread.currentThread().getContextClassLoader().getResource(""))).replaceAll("file:/", "").replaceAll("%20", " ").trim();
			if(path.indexOf(":") != 1){
				path = File.separator + path;

			}
			return path;
		}
		//当项目以jar、war包运行时，路径改成实际硬盘位置
		else
		{
			return dataPath;
		}

	}

}
