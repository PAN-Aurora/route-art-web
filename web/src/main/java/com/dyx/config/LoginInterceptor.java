package com.dyx.config;

import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author Administrator
 */
public class LoginInterceptor extends HandlerInterceptorAdapter {
    /**
     * 在请求处理之前进行调用（Controller方法调用之前）
     * 基于URL实现的拦截器
     * @param request
     * @param response
     * @param handler
     * @return
     * @throws Exception
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String path = request.getServletPath();
//        if (path.matches(Const.NO_INTERCEPTOR_PATH)) {
//            //不需要的拦截直接过
//            return true;
//        } else {
//            // 这写你拦截需要干的事儿，比如取缓存，SESSION，权限判断等
//            System.out.println("====================================");
//            return true;
//        }
        return true;
    }
}
