package com.dyx.service.log.Impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.mapper.dsno1.log.ZcglLogMapper;
import com.dyx.service.log.ZcglLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Description：资产管理-日志记录 ServiceImpl
 *
 * @author：杨晨浩 Date：2020/12/15
 */
@Service
@Transactional
public class ZcglLogServiceImpl implements ZcglLogService {

    /**
     * 注入资产管理-日志记录的mapper层
     */
    @Autowired
    private ZcglLogMapper zcglLogMapper;

    /**
     * 资产管理-日志记录数据列表
     *
     * @param pd
     * @return List<PageData>资产管理-日志记录
     * @throws Exception
     */
    @Override
    public List<PageData> list(Page pd) throws Exception {
        return zcglLogMapper.getList(pd);
    }

    /**
     * 资产管理-添加日志
     *
     * @param pd
     * @return List<PageData>资产管理-日志记录
     * @throws Exception
     */
    @Override
    public void saveData(String bs, PageData pd, List<PageData> lst) throws Exception {
        List<PageData> lstPd = new ArrayList<>();
        for (PageData o : lst) {
            PageData object = new PageData();
            //数据主键ID
            object.put("DATA_ID", o.get("WZKC_ID"));
            //创建人ID
            object.put("USER_ID", pd.get("CJR"));
            if ("WZDJ".equals(bs)) {
                //操作时间
                object.put("CZSJ", pd.get("DJRQ"));
                //创建人姓名
                object.put("USERNAME", pd.get("CJRMC"));
                //说明
                object.put("CONTENT", "完成登记。");
            } else if ("WZJJ".equals(bs)) {
                //操作时间
                object.put("CZSJ", pd.get("CZSJ"));
                //创建人姓名
                object.put("USERNAME", "审批人:" + pd.get("CJRMC"));
                String content = "责任人由" + o.getString("DQZRR") + "变更为" + o.getString("JJZRR");
                if (!o.getString("DQSSBM").equals(o.getString("JJSSBM"))) {
                    content += "；所属部门由" + o.getString("DQSSBM") + "变更为" + o.getString("JJSSBM");
                }
                content += "。";
                //说明
                object.put("CONTENT", content);

            } else if ("TYBF".equals(bs)) {
                //操作时间
                object.put("CZSJ", pd.get("CZSJ"));
                //创建人姓名
                object.put("USERNAME", "审批人:" + pd.get("CJRMC"));
                //说明
                object.put("CONTENT", "退役报废。");
            }

            lstPd.add(object);
        }
        zcglLogMapper.batchSave(lstPd);
    }

    /**
     * 资产管理-物资登记时添加日志
     *
     * @param pd
     * @return List<PageData>资产管理-日志记录
     * @throws Exception
     */
    @Override
    public void batchInsertWzdj(PageData pd) throws Exception {
        zcglLogMapper.batchInsertWzdj(pd);
    }
}
