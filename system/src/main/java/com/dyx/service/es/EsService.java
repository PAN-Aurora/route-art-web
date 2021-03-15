package com.dyx.service.es;

import java.util.Map;

import com.alibaba.fastjson.JSONObject;

public interface EsService {
    
   
    public  String addData(JSONObject jsonObject, String index, String type) ;
    /**
     * 通过ID删除数据
     *
     * @param index 索引，类似数据库
     * @param type  类型，类似表
     * @param id    数据ID
     */
    public  void deleteDataById(String index, String type, String id);

    /**
     * 通过ID 更新数据
     *
     * @param jsonObject 要增加的数据
     * @param index      索引，类似数据库
     * @param type       类型，类似表
     * @param id         数据ID
     * @return
     */
    public  void updateDataById(JSONObject jsonObject, String index, String type, String id) ; 


}
