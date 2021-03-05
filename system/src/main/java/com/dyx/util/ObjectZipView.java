package com.dyx.util;

import com.dyx.entity.PageData;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.servlet.view.document.AbstractXlsView;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * Description：
 *
 * @Author 潘福进
 * @Date：2020/3/11
 */
public class ObjectZipView extends AbstractXlsView {


    @Override
    protected void buildExcelDocument(Map<String, Object> model,
                                      Workbook workbook, HttpServletRequest request,
                                      HttpServletResponse response) throws Exception {
        // TODO Auto-generated method stub
        //response 输出流
        ServletOutputStream out = response.getOutputStream();
        //压缩输出流 -- 将response输出流填入压缩输出流
        ZipOutputStream zipOutputStream = new ZipOutputStream(out);
        try {
            /*********************start 打印表*********************/

            //创建工作簿
            Date date = new Date();
            String filename = DateUtil.date2Str(date, "yyyyMMddHHmmss");
            response.setContentType("application/octet-stream;charset=utf-8");
            response.setHeader("Content-Disposition", "attachment;filename=" + filename + ".zip");
            //创建表对象
            HSSFWorkbook book = (HSSFWorkbook) workbook;
            HSSFSheet sheet1;
            HSSFSheet sheet2;
            //主表
            sheet1 = book.createSheet("sheet1");
            //明细表
            sheet2 = book.createSheet("sheet2");
            //主表表头
            List<String> titles = (List<String>) model.get("titles");
            int len = titles.size();
            //明细表表头
            List<String> mxtitles = (List<String>) model.get("mxtitles");
            int lenmx = mxtitles.size();

            //表格式 公共的
            HSSFCellStyle headerStyle = book.createCellStyle();
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            //标题字体
            HSSFFont headerFont = book.createFont();
            headerFont.setBold(true);
            headerFont.setFontHeightInPoints((short) 11);
            headerStyle.setFont(headerFont);
            short height = 25 * 20;

            /***************************打印表头**************************************/
            //主表
            HSSFRow row = sheet1.createRow(0);
            for (int i = 0; i < len; i++) { //设置标题
                String title = titles.get(i);
                row.setRowStyle(headerStyle);
                row.createCell(i).setCellValue(title);
            }
            sheet1.getRow(0).setHeight(height);

            //明细表
            HSSFRow row1 = sheet2.createRow(0);
            //设置标题
            for (int i = 0; i < lenmx; i++) {
                String title = mxtitles.get(i);
                row1.setRowStyle(headerStyle);
                row1.createCell(i).setCellValue(title);
            }
            sheet2.getRow(0).setHeight(height);

            /***************************打印表数据**************************************/
            //内容样式 公共的
            HSSFCellStyle contentStyle = book.createCellStyle();
            contentStyle.setAlignment(HorizontalAlignment.CENTER);

            //获取所有数据
            //所有数据
            ArrayList varList = (ArrayList) model.get("varList");
            //获取主表数据列表
            List<PageData> list = (List<PageData>) varList.get(0);
            //获取明细表数据列表
            List<PageData> listmx = (List<PageData>) varList.get(1);
            //遍历表格数据，开始打印
            for (int i = 0; i < list.size(); i++) {
                //从第一个表开始打印
                PageData vpd = list.get(i);
                HSSFRow rows = sheet1.createRow(i + 1);
                for (int k = 0; k < len; k++) {
                    String varstr = vpd.getString("var" + (k + 1)) != null ? vpd.getString("var" + (k + 1)) : "";
                    rows.setRowStyle(contentStyle);
                    rows.createCell(k).setCellValue(varstr);
                }
                //从第一个表面明细数据开始打印
                for (int j = 0; j < listmx.size(); j++) {
                    PageData vpdmx = listmx.get(j);
                    HSSFRow rowsmx = sheet2.createRow(j + 1);
                    //根据关键字段匹配明细
                    if (vpdmx.getString("var1").equals(vpd.getString("var1"))) {
                        for (int l = 0; l < lenmx; l++) {
                            String varstr = vpdmx.getString("var" + (l + 2)) != null ? vpdmx.getString("var" + (l + 2)) : "";
                            rowsmx.setRowStyle(contentStyle);
                            rowsmx.createCell(l).setCellValue(varstr);
                        }
                    }
                }
                /************重点 创建压缩文件，并进行打包*************************/
                ZipEntry entry = new ZipEntry(i + ".xls");
                zipOutputStream.putNextEntry(entry);
                book.write(zipOutputStream);
            }
            /*********************end 打印表*********************/
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            //注意关闭顺序，否则可能我那件错误，先开的后关
            if (zipOutputStream != null) {
                zipOutputStream.close();
            }
            if (out != null) {
                out.close();
            }
        }

    }


}
