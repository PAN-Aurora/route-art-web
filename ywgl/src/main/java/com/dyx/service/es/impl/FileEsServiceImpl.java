package com.dyx.service.es.impl;
import com.alibaba.fastjson.JSONObject;
import com.dyx.entity.EsPageModel;
import com.dyx.service.es.FileEsService;
import com.dyx.util.StringUtil;

import org.elasticsearch.action.ActionFuture;
import org.elasticsearch.action.admin.indices.create.CreateIndexResponse;
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsRequest;
import org.elasticsearch.action.admin.indices.exists.indices.IndicesExistsResponse;
import org.elasticsearch.action.bulk.BulkRequestBuilder;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.get.*;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequestBuilder;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchType;
import org.elasticsearch.action.update.UpdateRequest;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.text.Text;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.fetch.subphase.highlight.HighlightBuilder;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class FileEsServiceImpl  implements  FileEsService {
	
    private static final Logger LOGGER = LoggerFactory.getLogger(FileEsServiceImpl.class);
    @Autowired
    private TransportClient transportClient ;
    private static TransportClient client ;

    @PostConstruct
    public void init() {
           client = this.transportClient;
    }

    /**
     * 通过ID删除数据
     *
     * @param index 索引，类似数据库
     * @param type  类型，类似表
     * @param id    数据ID
     */
    public  void deleteDataById(String index, String type, String id) {

        DeleteResponse response = client.prepareDelete(index, type, id).execute().actionGet();

        LOGGER.info("deleteDataById response status:{},id:{}", response.status().getStatus(), response.getId());
    }


    /**
     * 通过ID获取数据
     *
     * @param index  索引，类似数据库
     * @param type   类型，类似表
     * @param id     数据ID
     * @param fields 需要显示的字段，逗号分隔（缺省为全部字段）
     * @return
     */
    public  Map<String, Object> searchDataById(String index, String type, String id, String fields) {

        GetRequestBuilder getRequestBuilder = client.prepareGet(index, type, id);

        if (StringUtil.isNotEmpty(fields)) {
            getRequestBuilder.setFetchSource(fields.split(","), null);
        }

        GetResponse getResponse = getRequestBuilder.execute().actionGet();

        return getResponse.getSource();
    }

    public  List<Map<String, Object>> searchDataByIdBatch(String index, String type, String[] idList) {

        List<Map<String, Object>> List = new ArrayList<Map<String, Object>>();

        MultiGetRequestBuilder builder =  client.prepareMultiGet();
        if(idList.length>0){
            for(String id:idList){
                 builder.add(index,type,id);
            }
            MultiGetResponse response =builder.get();
            for(MultiGetItemResponse item:response){
                GetResponse gr = item.getResponse();
                if(gr!=null && gr.isExists()){
                    List.add(gr.getSource());
                }
            }
        }
        return List;
    }


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
            String highlightField) {
        SearchRequestBuilder searchRequestBuilder = client.prepareSearch(index);
        if (StringUtil.isNotEmpty(type)) {
            searchRequestBuilder.setTypes(type.split(","));
        }
        //搜索类型 默认使用QUERY_THEN_FETCH
        searchRequestBuilder.setSearchType(SearchType.QUERY_THEN_FETCH);

        // 需要显示的字段，逗号分隔（缺省为全部字段）
        if (StringUtil.isNotEmpty(fields)) {
            searchRequestBuilder.setFetchSource(fields.split(","), null);
        }

        //排序字段
        if (StringUtil.isNotEmpty(sortField)) {
            searchRequestBuilder.addSort(sortField, SortOrder.DESC);
        }

        // 高亮（xxx=111,aaa=222）
        if (StringUtil.isNotEmpty(highlightField)) {
            HighlightBuilder highlightBuilder = new HighlightBuilder();

            //highlightBuilder.preTags("<span style='color:red' >");//设置前缀
            //highlightBuilder.postTags("</span>");//设置后缀

            // 设置高亮字段
            highlightBuilder.field(highlightField);
            searchRequestBuilder.highlighter(highlightBuilder);
        }

        //searchRequestBuilder.setQuery(QueryBuilders.matchAllQuery());
        if(query!=null) {
        	  searchRequestBuilder.setQuery(query);
        }
        // 分页应用
        searchRequestBuilder.setFrom(startPage).setSize(pageSize);

        // 设置是否按查询匹配度排序
        searchRequestBuilder.setExplain(true);

        //打印的内容 可以在 Elasticsearch head 和 Kibana  上执行查询
        LOGGER.info("\n{}", searchRequestBuilder);

        // 执行搜索,返回搜索响应信息
        SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();

        long totalHits = searchResponse.getHits().totalHits;
        long length = searchResponse.getHits().getHits().length;

        LOGGER.debug("共查询到[{}]条数据,处理数据条数[{}]", totalHits, length);

        if (searchResponse.status().getStatus() == 200) {
            // 解析对象
            List<Map<String, Object>> sourceList = setSearchResponse(searchResponse, highlightField);

            return new EsPageModel(startPage, pageSize, (int) totalHits, sourceList);
        }

        return null;

    }
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
    		QueryBuilder query) {
    	SearchRequestBuilder searchRequestBuilder = client.prepareSearch(index);
    	if (StringUtil.isNotEmpty(type)) {
    		searchRequestBuilder.setTypes(type.split(","));
    	}
    	//搜索类型 默认使用QUERY_THEN_FETCH
    	searchRequestBuilder.setSearchType(SearchType.QUERY_THEN_FETCH);
    	
    	if(query!=null) {
    		searchRequestBuilder.setQuery(query);
    	}
    	// 分页应用
    	searchRequestBuilder.setFrom(startPage).setSize(pageSize);
    	
    	// 设置是否按查询匹配度排序
    	searchRequestBuilder.setExplain(true);
    	
    	//打印的内容 可以在 Elasticsearch head 和 Kibana  上执行查询
    	LOGGER.info("\n{}", searchRequestBuilder);
    	
    	// 执行搜索,返回搜索响应信息
    	SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();
    	
    	long totalHits = searchResponse.getHits().totalHits;
    	long length = searchResponse.getHits().getHits().length;
    	
    	LOGGER.debug("共查询到[{}]条数据,处理数据条数[{}]", totalHits, length);
    	
    	if (searchResponse.status().getStatus() == 200) {
    		// 解析对象
    		List<Map<String, Object>> sourceList = setSearchResponse(searchResponse);
    		
    		return new EsPageModel(startPage, pageSize, (int) totalHits, sourceList);
    	}
    	
    	return null;
    	
    }


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
            String fields, String sortField, String highlightField) {

        SearchRequestBuilder searchRequestBuilder = client.prepareSearch(index);
        if (StringUtil.isNotEmpty(type)) {
            searchRequestBuilder.setTypes(type.split(","));
        }

        if (StringUtil.isNotEmpty(highlightField)) {
            HighlightBuilder highlightBuilder = new HighlightBuilder();
            // 设置高亮字段
            highlightBuilder.field(highlightField);
            searchRequestBuilder.highlighter(highlightBuilder);
        }

        searchRequestBuilder.setQuery(query);

        if (StringUtil.isNotEmpty(fields)) {
            searchRequestBuilder.setFetchSource(fields.split(","), null);
        }
        searchRequestBuilder.setFetchSource(true);

        if (StringUtil.isNotEmpty(sortField)) {
            searchRequestBuilder.addSort(sortField, SortOrder.DESC);
        }

        if (size != null && size > 0) {
            searchRequestBuilder.setSize(size);
        }

        //打印的内容 可以在 Elasticsearch head 和 Kibana  上执行查询
        LOGGER.info("\n{}", searchRequestBuilder);

        SearchResponse searchResponse = searchRequestBuilder.execute().actionGet();

        long totalHits = searchResponse.getHits().totalHits;
        long length = searchResponse.getHits().getHits().length;

        LOGGER.info("共查询到[{}]条数据,处理数据条数[{}]", totalHits, length);

        if (searchResponse.status().getStatus() == 200) {
            // 解析对象
            return setSearchResponse(searchResponse, highlightField);
        }
        return null;

    }


    /**
     * 高亮结果集 特殊处理
     *
     * @param searchResponse
     * @param highlightField
     */
    private static List<Map<String, Object>> setSearchResponse(SearchResponse searchResponse, String highlightField) {
        List<Map<String, Object>> sourceList = new ArrayList<Map<String, Object>>();
        StringBuffer stringBuffer = new StringBuffer();

        for (SearchHit searchHit : searchResponse.getHits().getHits()) {
            searchHit.getSourceAsMap().put("id", searchHit.getId());

            if (StringUtil.isNotEmpty(highlightField)) {

                System.out.println("遍历 高亮结果集，覆盖 正常结果集" + searchHit.getSourceAsMap());
                Text[] text = searchHit.getHighlightFields().get(highlightField).getFragments();

                if (text != null) {
                    for (Text str : text) {
                        stringBuffer.append(str.string());
                    }
                    //遍历 高亮结果集，覆盖 正常结果集
                    searchHit.getSourceAsMap().put(highlightField, stringBuffer.toString());
                }
            }
            sourceList.add(searchHit.getSourceAsMap());
        }
        return sourceList;
    }
    /**
     * 从es结果获取list集合
     * @param searchResponse
     * @return
     */
    private static List<Map<String, Object>> setSearchResponse(SearchResponse searchResponse) {
    	List<Map<String, Object>> sourceList = new ArrayList<Map<String, Object>>();
    	for (SearchHit searchHit : searchResponse.getHits().getHits()) {
    		searchHit.getSourceAsMap().put("id", searchHit.getId());
    		sourceList.add(searchHit.getSourceAsMap());
    	}
    	return sourceList;
    }
}
