package com.dyx;

import com.dyx.util.PdfUtil;
import org.activiti.spring.boot.SecurityAutoConfiguration;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

import java.io.*;

@MapperScan("com.dyx.mapper")
@EnableCaching
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class WebApplication {

    public static void main(String[] args) throws  Exception {
    	System.setProperty("es.set.netty.runtime.available.processors", "false");
        SpringApplication.run(WebApplication.class, args);
    }

}
