package com.dyx.controller.act;

import com.dyx.util.Tools;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashMap;
import java.util.Map;

@Component
public class AcStartComponent {

    //与正在执行的流程实例和执行对象相关的Service(执行管理，包括启动、推进、删除流程实例等操作)
    @Autowired
    private RuntimeService runtimeService;

    /**微服务端请求启动流程(通过流程KEY)
     * @param
     * @throws Exception
     */
    public Object byKey(@RequestBody Map<String,Object> pmap) throws Exception{
        Map<String,String> map = new HashMap<String,String>(16);
        String errInfo = "success";
        //检验tokenKey
        if(Tools.checkTokenKey("startProByKey", pmap.get("tokenKey").toString())) {
            String processKey = pmap.get("processKey").toString();
            //移除map中的流程实例tokenKey
            pmap.remove("tokenKey");
            //移除map中的流程实例key
            pmap.remove("processKey");
            //启动流程实例
            startProcessInstanceByKeyHasVariables(processKey,pmap);
        }else {
            errInfo = "errer";
        }
        map.put("result", errInfo);
        return map;
    }

    /**通过KEY启动流程实例(不带变量)
     * @param processInstanceKey //流程定义的KEY
     * @return 返回流程实例ID
     */
    protected String startProcessInstanceByKey(String processInstanceKey){
        //用流程定义的KEY启动，会自动选择KEY相同的流程定义中最新版本的那个(KEY为模型中的流程唯一标识)
        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(processInstanceKey);
        //返回流程实例ID
        return processInstance.getId();
    }

    /**通过KEY启动流程实例(带变量)
     * @param processInstanceKey //流程定义的KEY
     * @return 返回流程实例ID
     */
    protected String startProcessInstanceByKeyHasVariables(String processInstanceKey,Map<String,Object> map){
        //map存储变量 用流程定义的KEY启动，会自动选择KEY相同的流程定义中最新版本的那个(KEY为模型中的流程唯一标识)
        ProcessInstance processInstance = runtimeService.startProcessInstanceByKey(processInstanceKey, map);
        //返回流程实例ID
        return processInstance.getId();
    }

    /**通过ID启动流程实例
     * @param processInstanceId //流程定义的ID
     * @return 返回流程实例ID
     */
    protected String startProcessInstanceById(String processInstanceId){
        //用流程定义的ID启动
        ProcessInstance processInstance = runtimeService.startProcessInstanceById(processInstanceId);
        //返回流程实例ID
        return processInstance.getId();
    }

}
