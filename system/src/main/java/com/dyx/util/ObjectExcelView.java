package com.dyx.util;

import com.dyx.entity.PageData;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.springframework.web.servlet.view.document.AbstractXlsxStreamingView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Description：导出到Excel表格
 *
 * @author：李可 Date：2020/5/12
 */
public class ObjectExcelView extends AbstractXlsxStreamingView {

	/**
	 * 重写继承AbstractXlsxStreamingView父类的 buildExcelDocument 方法
	 * @param model  创建Map
	 * @param workbook  创建的Excel表格 HSSF模式使用的Excel版本为2007版之前 XSSF SXSSF模式使用2007版之后的
	 * @param request  初始化HttpServletRequest
	 * @param response 初始化HttpServletResponse
	 * @throws Exception
	 */
	@Override
	protected void buildExcelDocument(Map<String, Object> model,
									  Workbook workbook, HttpServletRequest request,
									  HttpServletResponse response) throws Exception {
		//生成以当前日期为名称的文件名
		String filename = DateUtil.date2Str(new Date(), "yyyyMMddHHmmss");
		//设置类型
		response.setContentType("application/octet-stream");
		//设置表格扩展名：2007版之后使用‘xlsx’ 2007版之前使用 ‘xls’
		response.setHeader("Content-Disposition", "attachment;filename=" + filename + ".xlsx");

		//创建Excel表格
		SXSSFWorkbook book = (SXSSFWorkbook) workbook;
		//创建Excel表格中工作簿名
		SXSSFSheet sheet = book.createSheet("sheet1");

		//获取表头数据
		List<String> titles = (List<String>) model.get("titles");
		titles.add(0,"序号");
		//标题样式
		XSSFCellStyle headerStyle = (XSSFCellStyle) book.createCellStyle();
		//表头居中设置和边框
		headerStyle.setAlignment(HorizontalAlignment.CENTER);
		headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		headerStyle.setBorderBottom(BorderStyle.THIN);
		headerStyle.setBorderLeft(BorderStyle.THIN);
		headerStyle.setBorderRight(BorderStyle.THIN);
		headerStyle.setBorderTop(BorderStyle.THIN);
		//标题字体
		XSSFFont headerFont = (XSSFFont) book.createFont();
		//字体加粗设置
		headerFont.setBold(true);
		//字体字号设置
		headerFont.setFontHeightInPoints((short) 12);
		headerStyle.setFont(headerFont);
		//设置行高
		SXSSFRow row = sheet.createRow(0);
		//表头行高 35
		short titleHeight = 700;
		//内容行高 30
		short varListHeight = 600;
		//创建单元格
		SXSSFCell cell = null;
		// 定义列宽集合
		List<Integer> lstWidth = new ArrayList<>();
		//插入表头数据信息
		for (int i = 0; i < titles.size(); i++) {
			cell = row.createCell(i);
			//设置表头格式
			cell.setCellValue(titles.get(i));
			cell.setCellStyle(headerStyle);
			//获取默认列宽
			lstWidth.add(cell.getStringCellValue().getBytes().length);
		}
		//设置标题行高 35
		sheet.getRow(0).setHeight(titleHeight);

		//内容样式
		XSSFCellStyle contentStyle = (XSSFCellStyle) book.createCellStyle();
		//内容设置居中显示和边框
		contentStyle.setAlignment(HorizontalAlignment.CENTER);
		contentStyle.setVerticalAlignment(VerticalAlignment.CENTER);
		contentStyle.setBorderBottom(BorderStyle.THIN);
		contentStyle.setBorderLeft(BorderStyle.THIN);
		contentStyle.setBorderRight(BorderStyle.THIN);
		//自动换行
		contentStyle.setWrapText(true);
		//获取内容数据
		List<PageData> varList = (List<PageData>) model.get("varList");
		//插入内容数据信息
		for (int i = 0; i < varList.size(); i++) {
			//创建Pd存放遍历的数据
			PageData vpd = varList.get(i);
			vpd.put("var0",i+1);
			//创建行单元格
			SXSSFRow rows = sheet.createRow(i + 1);
			//将遍历获取的数据插入表格
			for (int j = 0; j < titles.size(); j++) {
				String strVar = vpd.get("var" + (j)) != null ? vpd.get("var" + (j)).toString() : "";
				cell = rows.createCell(j);
				//设置表格内容格式
				cell.setCellValue(strVar);
				cell.setCellStyle(contentStyle);

				//根据文本长度更新列宽
				int length = strVar.getBytes().length;
				//当列宽最大值大于50时，设置列宽为50
				if(length >= 50) {
					lstWidth.set(j,50);
				}else {
					/**
					 * 判断比较如果表头列宽值是否小于内容列宽值，
					 * 如果小于则将当前列宽值更新为内容列宽值
					 * 不小于继续使用表头列宽值为默认值
					 */
					if (lstWidth.get(j) < length) {
						lstWidth.set(j, length);
					}
				}
			}
			//设置内容行行高 30
			sheet.getRow(i+1).setHeight(varListHeight);
		}


		//设置列宽（先获取表头数据长度和内容数据长度）
		for (int columnNum = 0; columnNum < titles.size(); columnNum++) {
			sheet.setColumnWidth((short) columnNum, (short) (lstWidth.get(columnNum) * 300));
		}
	}
}
