package com.dyx.util;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import java.util.List;
import java.util.Map;

public class TreeUtil {

    /**
     * - listToTree
     * - <p>方法说明<p>
     * - 将JSONArray数组转为树状结构
     * - @param list 数据list
     * - @param parentId 父ID
     * - @param idKey ID唯一标识
     * - @param fidKey 父节点唯一标识
     * - @param childName 子节点名称
     * - @return JSONArray
     */
    public static JSONArray listToTree(List<Map<String, Object>> list, String parentId, String idKey, String fidKey, String childName) {

        JSONArray result = new JSONArray();
        for (Map<String, Object> map : list) {
            JSONObject json = JSONObject.fromObject(map);
            String id = json.getString(idKey);
            String fid = json.getString(fidKey);

            if (parentId.equals(fid)) {
                JSONArray c_node = listToTree(list, id, idKey, fidKey, childName);
                json.put(childName, c_node);
                result.add(json);
            }
        }
        return result;
    }
}
