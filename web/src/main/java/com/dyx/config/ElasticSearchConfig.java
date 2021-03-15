package com.dyx.config;

import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.common.settings.Settings;
import org.elasticsearch.common.transport.TransportAddress;
import org.elasticsearch.transport.client.PreBuiltTransportClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import io.netty.util.internal.StringUtil;

import java.net.InetAddress;

@Configuration
public class ElasticSearchConfig {

    private static final Logger LOGGER = LoggerFactory.getLogger(ElasticSearchConfig.class);
    /**
     * es集群地址
     */
    @Value("${elasticsearch.hostName}")
    private String hostName;

    /**
     * 端口
     */
    @Value("${elasticsearch.port}")
    private String port;

    /**
     * 集群名称
     */
    @Value("${elasticsearch.cluster.name}")
    private String clusterName;

    /**
     * 连接池
     */
    @Value("${elasticsearch.pool}")
    private String poolSize;

    /**
     *  注册 es 连接client
     *  TransportClient
     * @return
     */
    @Bean
    public TransportClient transportClient() {
        LOGGER.info("Elasticsearch初始化开始。。。。。");
        TransportClient transportClient = null;
        try {
            // 配置信息
            Settings esSetting = Settings.builder()
                    .put("cluster.name", clusterName) //集群名字
                    .put("client.transport.sniff", true)//增加嗅探机制寻找ES集群
                    .put("thread_pool.search.size", Integer.parseInt(poolSize))//增加线程池个数，暂时设为5
                    .build();
            //配置信息Settings自定义
            transportClient = new PreBuiltTransportClient(esSetting);

            if(!StringUtil.isNullOrEmpty(hostName) && hostName.contains(",")){
                  String[] hostNameArray = hostName.split(",");
                  String[] portArray = port.split(",");
                  //集群模块 多个节点
                  for(int i=0; i<hostNameArray.length ;i++){
                      TransportAddress transportAddress = new TransportAddress(
                              InetAddress.getByName(hostNameArray[i]),
                              Integer.valueOf(portArray[i]));
                      transportClient.addTransportAddresses(transportAddress);
                  }
            }else{
                TransportAddress transportAddress = new TransportAddress(
                        InetAddress.getByName(hostName),
                        Integer.valueOf(port));
                transportClient.addTransportAddresses(transportAddress);
            }


        } catch (Exception e) {
            LOGGER.error("获取 TransportClient失败!", e);
        }
        return transportClient;
    }
}
