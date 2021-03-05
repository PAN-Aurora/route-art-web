package com.dyx.controller.system;

import com.dyx.controller.base.BaseController;
import com.dyx.entity.Server;
import net.sf.json.JSONObject;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Description：服务器运行监控Controller层
 * @author：yufei
 * Date：2020-11-13
 */
@Controller
@RequestMapping("/monitor")
public class MonitorController extends BaseController {

    @RequestMapping(value = "/server")
    @ResponseBody
    public Object server()
    {
        JSONObject jsonObject = null;
        try {
            Server server = new Server();
            server.copyTo();
            jsonObject = JSONObject.fromObject(server);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return jsonObject;
    }
}
