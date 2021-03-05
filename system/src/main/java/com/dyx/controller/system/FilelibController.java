package com.dyx.controller.system;

import com.dyx.controller.base.BaseController;
import com.dyx.service.system.FilelibService;
import org.apache.commons.io.IOUtils;
import com.dyx.entity.PageData;
import com.dyx.util.Const;
import com.dyx.util.FileUpload;
import com.dyx.util.PathUtil;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 说明：文件上传
 * 作者：FH Admin QQ313596790
 * 时间：2020-02-11
 * 官网：www.fhadmin.org
 */
@Controller
@RequestMapping("/filelib")
public class FilelibController extends BaseController {

    @Autowired
    private FilelibService filelibService;

    /**
     * 实现文件上传
     */
    @RequestMapping(value = "/uploads")
    @ResponseBody
    public Object uploads(@RequestParam(value = "files", required = false) MultipartFile[] files, @RequestParam(value = "bizid", required = false) String bizid) throws Exception {
        if (files != null || files.length > 0) {
            for (int i = 0; i < files.length; i++) {
                InputStream is = null;
                try {
                    //读取文件流
                    is = files[i].getInputStream();
                    byte[] bytes = FileCopyUtils.copyToByteArray(is);
                    String fileName = files[i].getOriginalFilename();
                    int size = (int) files[i].getSize();
                    System.out.println(fileName + "-->" + size);
                    PageData pd = new PageData();
                    pd = this.getPageData();
                    pd.put("FILELIB_ID", this.get32UUID());    //主键
                    pd.put("FILE", bytes);
                    pd.put("BIZID", bizid);
                    filelibService.save(pd);
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    IOUtils.closeQuietly(is);
                }
            }
        }
        Map<String, String> map = new HashMap<String, String>();
        String errInfo = "success";
        map.put("result", errInfo);                //返回结果
        return map;
    }

    @RequestMapping(value = "/upload")
    @ResponseBody
    public Object upload(@RequestParam(value = "file", required = true) MultipartFile file, @RequestParam(value = "bizid", required = true) String bizid,@RequestParam(value = "biztype", required = true) String biztype,@RequestParam(value = "bizname", required = true) String bizname) throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        if (file != null&& !file.isEmpty()&&Tools.notEmpty(biztype)&&Tools.notEmpty(bizid)&&Tools.notEmpty(bizname)) {
            String filePath = PathUtil.getClasspath() + Const.FILEPATHFILE;		//文件上传路径
            String fileid = this.get32UUID();
            String fileName = FileUpload.fileUp(file, filePath,fileid);					//执行上传
            PageData pd = new PageData();
            pd = this.getPageData();
            pd.put("FILELIB_ID", fileid);    //主键
            pd.put("ORIGNAME",file.getOriginalFilename());  //文件原名
            pd.put("FILENAME",fileName);    //文件名
            pd.put("FILEPATH", filePath);   //文件路径
            pd.put("FILETYPE",file.getContentType());  //文件类型
            pd.put("FILE", null);
            pd.put("BIZNAME", bizname); //业务名称
            pd.put("BIZID", bizid); //业务id
            pd.put("BIZTYPE", biztype); //业务类别
            pd.put("CREATETIME",new Date());
            filelibService.save(pd);
            map.put("file",pd);
        }
        else {
            errInfo="failed";
        }

        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 删除
     *
     * @throws Exception
     */
    @RequestMapping(value = "/delete")
    @ResponseBody
    public Object delete() throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        if (pd!=null&&!StringUtils.isEmpty(pd.get("FILENAME")))
        {
            filelibService.delete(pd);
            String filePath = PathUtil.getClasspath() + Const.FILEPATHFILE+ pd.get("FILENAME");
            File file = new File(filePath);
            if (file.exists())
            {
                file.delete();
            }
        }
        map.put("result", errInfo);                //返回结果
        return map;
    }


    /**
     * 根据业务id删除关联文件
     *
     * @throws Exception
     */
    @RequestMapping(value = "/delbyids")
    @ResponseBody
    public Object deletebyids() throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        if (pd!=null&&!StringUtils.isEmpty(pd.get("IDS")))
        {
            String [] strArr= pd.getString("IDS").split(",");
            //根据ids查询所有附件
            List<PageData> varList = filelibService.listByIds(strArr);
            //遍历删除
            for (PageData var: varList) {
                filelibService.delete(var);
                if(!Tools.isEmpty(var.getString("FILEPATH")))
                {
                    File file = new File(var.getString("FILEPATH"));
                    if (file.exists())
                    {
                        file.delete();
                    }
                }
            }
        }
        map.put("result", errInfo);                //返回结果
        return map;
    }

    /**
     * 根据业务删除无关联文件
     *
     * @throws Exception
     */
    @RequestMapping(value = "/delbybizname")
    @ResponseBody
    public Object delbybizname() throws Exception {
        Map<String, String> map = new HashMap<String, String>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        if (pd!=null&&!StringUtils.isEmpty(pd.get("BIZNAME")))
        {
            //根据业务查询所有无关联附件
            List<PageData> varList = filelibService.listNonBiz(pd);
            //遍历删除
            for (PageData var: varList) {
                filelibService.delete(var);
                File file = new File(var.getString("FILEPATH"));
                if (file.exists())
                {
                    file.delete();
                }
            }
        }
        map.put("result", errInfo);                //返回结果
        return map;
    }


    /**
     * 显示图片
     * @throws Exception
     */
    @RequestMapping(value = "/showimg")
    @ResponseBody
    public void showimg(HttpServletResponse response){
        try {
            PageData pd = new PageData();
            pd = this.getPageData();
            String filePath = PathUtil.getClasspath() + Const.FILEPATHFILE +pd.get("FILENAME");
            File file = new File(filePath);
            if (!file.exists())
            {
                return;
            }
            FileInputStream inputStream = new FileInputStream(file);
            if (inputStream != null){
                //得到文件大小
                int i = inputStream.available();
                byte[] data = new byte[i];
                //读数据
                inputStream.read(data);
                inputStream.close();
                OutputStream outputStream = response.getOutputStream();
                outputStream.write(data);
                outputStream.close();
            }
        }catch (IOException e){
            e.printStackTrace();
        }
    }

    /**
     * 下载文件
     * @throws Exception
     */
    @RequestMapping(value = "/download")
    @ResponseBody
    public void downloadfile(HttpServletResponse response) throws FileNotFoundException {
        PageData pd = new PageData();
        pd = this.getPageData();
        try {
            pd = filelibService.findById(pd);
            if (pd!=null)
            {
                // 下载本地文件
                String fileName = pd.getString("ORIGNAME"); // 文件的默认保存名
                // 读到流中
                InputStream inStream = new FileInputStream(pd.getString("FILEPATH")+pd.getString("FILENAME"));// 文件的存放路径
                // 设置输出的格式
                response.reset();
                response.setContentType("bin");
                response.addHeader("Content-Disposition", "attachment; filename=\"" + new String(fileName.getBytes("utf-8"),"ISO8859-1") + "\"");
                // 循环取出流中的数据
                byte[] b = new byte[1000];
                int len;
                while ((len = inStream.read(b)) > 0)
                    response.getOutputStream().write(b, 0, len);
                inStream.close();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    /**
     * 列表
     *
     * @throws Exception
     */
    @RequestMapping(value = "/list")
    @ResponseBody
    public Object list() throws Exception {
        Map<String, Object> map = new HashMap<String, Object>();
        String errInfo = "success";
        PageData pd = new PageData();
        pd = this.getPageData();
        if (!StringUtils.isEmpty(pd.get("BIZID"))&&!StringUtils.isEmpty(pd.get("BIZTYPE")))
        {
            List<PageData> varList = filelibService.listAll(pd);
            map.put("varList", varList);
            map.put("result", errInfo);
        }

        return map;
    }

}
