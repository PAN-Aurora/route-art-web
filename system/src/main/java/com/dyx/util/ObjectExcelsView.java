package com.dyx.util;

import com.dyx.entity.PageData;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.springframework.web.servlet.view.document.AbstractXlsView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * 说明：导出到EXCEL
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public class ObjectExcelsView extends AbstractXlsView {


    @Override
    protected void buildExcelDocument(Map<String, Object> model,
                                      Workbook workbook, HttpServletRequest request,
                                      HttpServletResponse response) throws Exception {
        // TODO Auto-generated method stub
        /*********************start 打印表*********************/
        //创建工作簿
        Date date = new Date();
        String filename = DateUtil.date2Str(date, "yyyyMMddHHmmss");
        HSSFSheet sheet1;
        HSSFSheet sheet2;
        response.setContentType("application/octet-stream;charset=utf-8");
        response.setHeader("Content-Disposition", "attachment;filename=" + filename + ".xls");
        //创建表对象
        HSSFWorkbook book = (HSSFWorkbook) workbook;
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


        /*********************打印表有头**********************************/
        //主表表头
        HSSFRow row = sheet1.createRow(0);
        for (int i = 0; i < len; i++) { //设置标题
            String title = titles.get(i);
            row.setRowStyle(headerStyle);
            row.createCell(i).setCellValue(title);
        }
        sheet1.getRow(0).setHeight(height);

        //明细表表头
        HSSFRow row1 = sheet2.createRow(0);
        //设置标题
        for (int i = 0; i < lenmx; i++) {
            String title = mxtitles.get(i);
            row1.setRowStyle(headerStyle);
            row1.createCell(i).setCellValue(title);
        }
        sheet2.getRow(0).setHeight(height);


        /*********************打印表数据**********************************/
        //内容样式 公共的
        HSSFCellStyle contentStyle = book.createCellStyle();
        contentStyle.setAlignment(HorizontalAlignment.CENTER);

        //所有数据
        ArrayList varList = (ArrayList) model.get("varList");
        //获取主表数据
        List<PageData> list = (List<PageData>) varList.get(0);
        int varCount = list.size();
        for (int i = 0; i < varCount; i++) {
            PageData vpd = list.get(i);
            HSSFRow rows = sheet1.createRow(i + 1);
            for (int j = 0; j < len; j++) {
                String varstr = vpd.getString("var" + (j + 1)) != null ? vpd.getString("var" + (j + 1)) : "";
                rows.setRowStyle(contentStyle);
                rows.createCell(j).setCellValue(varstr);
            }
        }
        //获取明细表数据
        List<PageData> listmx = (List<PageData>) varList.get(1);
        int varMxCount = listmx.size();
        for (int i = 0; i < varMxCount; i++) {
            PageData vpd = listmx.get(i);
            HSSFRow rows = sheet2.createRow(i + 1);
            for (int j = 0; j < lenmx; j++) {
                String varstr = vpd.getString("var" + (j + 1)) != null ? vpd.getString("var" + (j + 1)) : "";
                rows.setRowStyle(contentStyle);
                rows.createCell(j).setCellValue(varstr);
            }
        }

        /*********************end 打印表*********************/


    }


}
