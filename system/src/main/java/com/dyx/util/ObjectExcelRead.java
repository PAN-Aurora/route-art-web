package com.dyx.util;

import com.dyx.entity.PageData;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;


/**
 * 说明：从EXCEL导入到系统
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
public class ObjectExcelRead {

    /**
     * @param filepath //文件路径
     * @param filename //文件名
     * @param startrow //开始行号
     * @param startcol //开始列号
     * @param sheetnum //sheet
     * @return list
     */
    public static List<Object> readExcel(String filepath, String filename, int startrow, int startcol, int sheetnum) {
        List<Object> varList = new ArrayList<Object>();

        try {
            File target = new File(filepath, filename);
            FileInputStream fi = new FileInputStream(target);
            XSSFWorkbook wb = new XSSFWorkbook(fi);
            //seet 从0开始
            XSSFSheet sheet = wb.getSheetAt(sheetnum);
            //取得最后一行的行号
            int rowNum = sheet.getLastRowNum() + 1;

            //行循环开始
            for (int i = startrow; i < rowNum; i++) {

                PageData varpd = new PageData();
                //行
                XSSFRow row = sheet.getRow(i);
                //每行的最后一个单元格位置
                int cellNum = row.getLastCellNum();

                //列循环开始
                for (int j = startcol; j < cellNum; j++) {

                    XSSFCell cell = row.getCell(Short.parseShort(j + ""));
                    String cellValue = null;
                    if (null != cell) {
                        // 判断excel单元格内容的格式，并对其进行转换，以便插入数据库
                        switch (cell.getCellType()) {
                            case 0:
                                cellValue = String.valueOf((int) cell.getNumericCellValue());
                                break;
                            case 1:
                                cellValue = cell.getStringCellValue();
                                break;
                            case 2:
                                cellValue = cell.getNumericCellValue() + "";
                                // cellValue = String.valueOf(cell.getDateCellValue());
                                break;
                            case 3:
                                cellValue = "";
                                break;
                            case 4:
                                cellValue = String.valueOf(cell.getBooleanCellValue());
                                break;
                            case 5:
                                cellValue = String.valueOf(cell.getErrorCellValue());
                                break;
                        }
                    } else {
                        cellValue = "";
                    }

                    varpd.put("var" + j, cellValue);

                }
                varList.add(varpd);
            }

        } catch (Exception e) {
            System.out.println(e);
        }
        return varList;
    }


    /**
     * @return list
     */
    public static List<PageData> getExcelListByColumn( MultipartFile file,String strColumnArr[],int intStartRowNum,int startcol,int intSheetNum) {

        try {
            //获取文件流
            InputStream inputStream = file.getInputStream();
            //FileInputStream fs = new FileInputStream(inputStream);
            //POIFSFileSystem fs = new POIFSFileSystem(inputStream);
            XSSFWorkbook wb = new XSSFWorkbook(inputStream);
            //获取工作薄
            XSSFSheet sheet = wb.getSheetAt(intSheetNum);

            //定义返回集合对象
            List<PageData> lstPageData = new ArrayList<>();
            //定义集合对象（数据封装）
            PageData oData = null;
            //sheet 从0开始
            for (int i = intStartRowNum; i <= sheet.getLastRowNum(); i++) {
                //获取行对象
                XSSFRow row = sheet.getRow(i);
                //获取列数
                int cellNum = row.getLastCellNum();
                //new PageData
                oData = new PageData();
                //遍历列单元格
                for (int k = startcol; k < cellNum; k++) {
                    //获取当前单元格
                    XSSFCell cell = row.getCell(Short.parseShort(k + ""));
                    String cellValue = null;
                    if (null != cell) {
                        // 判断excel单元格内容的格式，并对其进行转换，以便插入数据库
                        switch (cell.getCellType()) {
                            case 0:
                                cellValue = String.valueOf((int) cell.getNumericCellValue());
                                break;
                            case 1:
                                cellValue = cell.getStringCellValue();
                                break;
                            case 2:
                                cellValue = cell.getNumericCellValue() + "";
                                // cellValue = String.valueOf(cell.getDateCellValue());
                                break;
                            case 3:
                                cellValue = "";
                                break;
                            case 4:
                                cellValue = String.valueOf(cell.getBooleanCellValue());
                                break;
                            case 5:
                                cellValue = String.valueOf(cell.getErrorCellValue());
                                break;
                        }
                    } else {
                        cellValue = "";
                    }
                    //当前单元格值
                    //String strCellValue = cell.getStringCellValue();
                    //放置值 与列一一对应
                    oData.put(strColumnArr[k], cellValue);
                }
                lstPageData.add(oData);
            }
            //返回值
            return lstPageData;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
