package com.dyx.util;

import com.dyx.entity.PageData;

import javax.servlet.http.HttpServletResponse;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Description：SQL文件生成导出工具类
 * Author：孟凡星
 * Date：2020/12/1
 */
public class SqlExportUtil {
    //文件名后缀
    private static String strSuffix = ".sql";

    /**
     * 生成并导出数据sql文件
     *
     * @param lstInsertSql sql insert语句List集合
     * @param strFileName  文件名
     * @param strFilePath  文件生成路径
     * @param response     HttpServletResponse
     */
    public static void generateSqlFile(List<String> lstInsertSql, String strFilePath, String strFileName, HttpServletResponse response) throws Exception {

        //生成文件名称+后缀
        String filenName = strFileName + strSuffix;
        //生成文件全路径
        strFilePath = strFilePath + "/" + filenName;

        //定义文件输出流
        FileWriter fw = null;
        BufferedWriter bw = null;

        System.out.println(strFilePath);
        try {
            //目录不存在时创建
            FileUtil.createDir(strFilePath);
            ///文件不存在时创建
            File file = new File(strFilePath);

            if (!file.exists()) {
                file.createNewFile();
            } else {
                file.delete();
                file.createNewFile();
            }
            //输出流
            fw = new FileWriter(file);
            bw = new BufferedWriter(fw);
            //list判断
            if (lstInsertSql != null && lstInsertSql.size() > 0) {
                for (int i = 0; i < lstInsertSql.size(); i++) {
                    bw.append(lstInsertSql.get(i));
                    //拼接空行
                    bw.append("\n");
                }
            }
            //刷新写入
            bw.flush();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            bw.close();
            fw.close();
        }
    }

}
