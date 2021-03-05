package com.dyx.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * 说明：web服务器启动后立即执行
 * 作者：FH Admin Q313596790
 * 官网：www.fhadmin.org
 */
@Component
@Order(value = 1) // 1 代表启动顺序
public class StartServer implements ApplicationRunner{
	
	@Override
    public void run(ApplicationArguments var1) throws Exception{
		System.out.println("---------------------------系统启动成功---------------------------");
    }

}
