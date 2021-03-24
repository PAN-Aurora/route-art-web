package com.dyx.service.es;

import java.util.List;
import java.util.Map;

import org.elasticsearch.index.query.QueryBuilder;

import com.alibaba.fastjson.JSONObject;
import com.dyx.entity.EsPageModel;

public interface FileEsService {
   
	
	 /**
     * 通过ID删除数据
     *
     * @param index 索引，类似数据库
     * @param type  类型，类似表
     * @param id    数据ID
     */
    public  void deleteDataById(String index, String type, String id);
    /**
     * 通过ID获取数据
     *
     * @param index  索引，类似数据库
     * @param type   类型，类似表
     * @param id     数据ID
     * @param fields 需要显示的字段，逗号分隔（缺省为全部字段）
     * @return
     */
    public  Map<String, Object> searchDataById(String index, String type, String id, String fields) ;

    /**
     * 通过多个id返回多条数据
     * @param index  索引，类似数据库
     * @param type 类型，类似表
     * @param idList  id集合
     * @return
     */
    public  List<Map<String, Object>> searchDataByIdBatch(String index, String type, String[] idList);
    
    /**
     * 使用分词查询,并分页
     *
     * @param index          索引名称
     * @param type           类型名称,可传入多个type逗号分隔
     * @param startPage      当前页
     * @param pageSize       每页显示条数
     * @param query          查询条件
     * @param fields         需要显示的字段，逗号分隔（缺省为全部字段）
     * @param sortField      排序字段
     * @param highlightField 高亮字段
     * @return
     */
    public  EsPageModel searchDataPage(
            String index,
            String type,
            int startPage,
            int pageSize,
            QueryBuilder query,
            String fields,
            String sortField,
            String highlightField
            );
    /**
     * 使用分词查询,并分页
     *
     * @param index          索引名称
     * @param type           类型名称,可传入多个type逗号分隔
     * @param startPage      当前页
     * @param pageSize       每页显示条数
     * @param query          查询条件
     * @return
     */
    public  EsPageModel searchDataPage(
    		String index,
    		String type,
    		int startPage,
    		int pageSize,
    		QueryBuilder query
    	);
    /**
     * 使用分词查询
     *
     * @param index          索引名称
     * @param type           类型名称,可传入多个type逗号分隔
     * @param query          查询条件
     * @param size           文档大小限制
     * @param fields         需要显示的字段，逗号分隔（缺省为全部字段）
     * @param sortField      排序字段
     * @param highlightField 高亮字段
     * @return
     */
    public  List<Map<String, Object>> searchListData(
            String index, String type, QueryBuilder query, Integer size,
            String fields, String sortField, String highlightField);
}
