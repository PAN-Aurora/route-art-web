package com.dyx.util;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import sun.misc.BASE64Decoder;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.dyx.util.FileUpload.copyFile;


/**
 * 说明：常用工具
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public class Tools {
	
	/**
	 * 随机生成六位数验证码 
	 * @return
	 */
	public static int getRandomNum(){
		 Random r = new Random();
		 return r.nextInt(900000)+100000;//(Math.random()*(999999-100000)+100000)
	}
	
	/**
	 * 随机生成四位数验证码 
	 * @return
	 */
	public static int getRandomNum4(){
		 Random r = new Random();
		 return r.nextInt(9000)+1000;
	}
	
	/**
	 * 检测字符串是否不为空(null,"","null")
	 * @param s
	 * @return 不为空则返回true，否则返回false
	 */
	public static boolean notEmpty(String s){
		return s!=null && !"".equals(s) && !"null".equals(s);
	}
	
	/**
	 * 检测字符串是否为空(null,"","null")
	 * @param s
	 * @return 为空则返回true，不否则返回false
	 */
	public static boolean isEmpty(String s){
		return s==null || "".equals(s) || "null".equals(s);
	}
	
	/**
	 * 字符串转换为字符串数组
	 * @param str 字符串
	 * @param splitRegex 分隔符
	 * @return
	 */
	public static String[] str2StrArray(String str,String splitRegex){
		if(isEmpty(str)){
			return null;
		}
		return str.split(splitRegex);
	}
	
	/**
	 * 用默认的分隔符(,)将字符串转换为字符串数组
	 * @param str	字符串
	 * @return
	 */
	public static String[] str2StrArray(String str){
		return str2StrArray(str,",\\s*");
	}
	
	/**
	 * 往文件里的内容
	 * @param filePath  文件路径
	 * @param content  写入的内容
	 */
	public static void writeFile(String fileP,String content){
		String filePath = String.valueOf(Thread.currentThread().getContextClassLoader().getResource(""))+"../../";	//项目路径
		filePath = filePath.replaceAll("file:/", "");
		filePath = filePath.replaceAll("%20", " ");
		filePath = filePath.trim() + fileP.trim();
		if(filePath.indexOf(":") != 1){
			filePath = File.separator + filePath;
		}
		try {
	        OutputStreamWriter write = new OutputStreamWriter(new FileOutputStream(filePath),"utf-8");      
	        BufferedWriter writer=new BufferedWriter(write);          
	        writer.write(content);      
	        writer.close(); 
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 往文件里的内容（Projectpath下）
	 * @param filePath  文件路径
	 * @param content  写入的内容
	 */
	public static void writeFileCR(String fileP,String content){
		String filePath = PathUtil.getProjectpath() + fileP;
		try {
	        OutputStreamWriter write = new OutputStreamWriter(new FileOutputStream(filePath),"utf-8");      
	        BufferedWriter writer=new BufferedWriter(write);          
	        writer.write(content);      
	        writer.close(); 
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	  * 验证邮箱
	  * @param email
	  * @return
	  */
	 public static boolean checkEmail(String email){
	  boolean flag = false;
	  try{
	    String check = "^([a-z0-9A-Z]+[-|_|\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$";
	    Pattern regex = Pattern.compile(check);
	    Matcher matcher = regex.matcher(email);
	    flag = matcher.matches();
	   }catch(Exception e){
	    flag = false;
	   }
	  return flag;
	 }
	
	 /**
	  * 验证手机号码
	  * @param mobiles
	  * @return
	  */
	 public static boolean checkMobileNumber(String mobileNumber){
	  boolean flag = false;
	  try{
	    Pattern regex = Pattern.compile("^(((13[0-9])|(15([0-3]|[5-9]))|(18[0,5-9]))\\d{8})|(0\\d{2}-\\d{8})|(0\\d{3}-\\d{7})$");
	    Matcher matcher = regex.matcher(mobileNumber);
	    flag = matcher.matches();
	   }catch(Exception e){
	    flag = false;
	   }
	  return flag;
	 }
	
	/**
	 * 检测KEY是否正确
	 * @param paraname  传入参数
	 * @param FKEY		接收的 KEY
	 * @return 为空则返回true，不否则返回false
	 */
	public static boolean checkTokenKey(String paraname, String FKEY){
		paraname = (null == paraname)? "":paraname;
		return MD5.md5(paraname+ DateUtil.getDays()+",fh,").equals(FKEY);
	}
	
	/**生成TokenKey
	 * @param paraname
	 * @return
	 */
	public static String creatTokenKey(String paraname){
		paraname = (null == paraname)? "":paraname;
		return MD5.md5(paraname+DateUtil.getDays()+",fh,");
	}
	
	/**读取txt里的全部内容
	 * @param fileP  文件路径
	 * @param encoding  编码
	 * @return
	 */
	public static String readTxtFileAll(String fileP, String encoding) {
		StringBuffer fileContent = new StringBuffer(); 
		try {
			String filePath = String.valueOf(Thread.currentThread().getContextClassLoader().getResource(""))+"../../";	//项目路径
			filePath = filePath.replaceAll("file:/", "");
			filePath = filePath.replaceAll("%20", " ");
			filePath = filePath.trim() + fileP.trim();
			if(filePath.indexOf(":") != 1){
				filePath = File.separator + filePath;
			}
			File file = new File(filePath);
			if (file.isFile() && file.exists()) { 		// 判断文件是否存在
				InputStreamReader read = new InputStreamReader(
				new FileInputStream(file), encoding);	// 考虑到编码格式
				BufferedReader bufferedReader = new BufferedReader(read);
				String lineTxt = null;
				while ((lineTxt = bufferedReader.readLine()) != null) {
					fileContent.append(lineTxt);
					fileContent.append("\n");
				}
				read.close();
			}else{
				System.out.println("找不到指定的文件,查看此路径是否正确:"+filePath);
			}
		} catch (Exception e) {
			System.out.println("读取文件内容出错");
		}
		return fileContent.toString();
	}
	
	/**
	 * 读取Projectpath某文件里的全部内容
	 * @param filePath  文件路径
	 */
	public static String readFileAllContent(String fileP) {
		StringBuffer fileContent = new StringBuffer(); 
		try {
			String encoding = "utf-8";
			File file = new File(PathUtil.getProjectpath() + fileP);//文件路径
			if (file.isFile() && file.exists()) { 		// 判断文件是否存在
				InputStreamReader read = new InputStreamReader(
				new FileInputStream(file), encoding);	// 考虑到编码格式
				BufferedReader bufferedReader = new BufferedReader(read);
				String lineTxt = null;
				while ((lineTxt = bufferedReader.readLine()) != null) {
					fileContent.append(lineTxt);
					fileContent.append("\n");
				}
				read.close();
			}else{
				System.out.println("找不到指定的文件,查看此路径是否正确:"+fileP);
			}
		} catch (Exception e) {
			System.out.println("读取文件内容出错");
		}
		return fileContent.toString();
	}
	
	public static void main(String[] args) {
		System.out.println(getRandomNum());
	}

	public static  String checkTrimString(String str){
	    String result="";
	    if(str!=null){
	        Pattern p = Pattern.compile("\\s*|\t|\r|\n");
	        Matcher m = p.matcher(str);
	        result = m.replaceAll("");
        }
	    return result;
    }

    /**
     * 去除空格
     * @param json  传值为json数据
     * @return
     */
    public static JSONObject checkTrim(JSONObject json) {
        JSONArray jarray = JSONArray.fromObject(json);
        JSONObject jsonObject =new JSONObject();
        Map map = (Map) jarray.get(0);
        Set set = map.entrySet();
        if (set != null) {
            Iterator it = set.iterator();
            while (it.hasNext()) {
                Map.Entry en = (Map.Entry) it.next();
                String key = en.getKey().toString();
                String value = "";
                if (en.getValue() != null && !"".equals(en.getValue())) {
                    value = en.getValue().toString().trim();
                    value =value.replaceAll(" ","");
                }
                jsonObject.put(key,value);
            }

        }
        return jsonObject;
    }

    /**
     * base64转换为图片
     * @param imgStr
     * @param path
     * @return
     */
    public static boolean generateTmage(String imgStr,String path,String filename){
        if(imgStr==null){
            return false;
        }
        BASE64Decoder decoder = new BASE64Decoder();
        try {
            byte[] b=decoder.decodeBuffer(imgStr);
            for (int i = 0; i < b.length; i++) {
                if(b[i]<0){
                    b[i]+=256;
                }
            }
            InputStream input = new ByteArrayInputStream(b);
            copyFile(input,path,filename);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

	/**
	 * 判断字符串是为空
	 *
	 * @param str 传入字符串
	 * @return 为空返回空字符串;否则返回原字符串
	 */
	public static String checkString(Object str) {
		return str == null || str.equals("null") ? "" : str.toString();
	}

	public static String getString(String key, String configFilePath) {

		Properties properties = new Properties();
		InputStream in = Tools.class.getClassLoader()
				.getResourceAsStream(configFilePath);
		try {
			properties.load(in);

		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			try {
				if (in != null) {
					in.close();
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		if (properties.getProperty(key) == null) {
			return "";
		}

		return properties.getProperty(key);
	}
	/**
	 * 字符串去重
	 *
	 * @param str
	 * @param suffix
	 * @return
	 */
	public static String[] getDistinct(String str, String suffix) {
		if (str == null || str.equals("")) {
			return new String[]{""};
		} else {
			String[] arrStr = str.split(suffix);
			Set set = new HashSet();
			for (int i = 0; i < arrStr.length; i++) {
				set.add(arrStr[i]);
			}
			arrStr = (String[]) set.toArray(new String[0]);

			return arrStr;
		}
	}

	/**
	 * 按照yyyy-MM-dd HH:mm:ss的格式，日期转字符串
	 * @param date
	 * @return yyyy-MM-dd HH:mm:ss
	 */
	public static String date2Str(Date date){
		if(date!=null){
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			return sdf.format(date);
		}else{
			return "";
		}
	}
}
