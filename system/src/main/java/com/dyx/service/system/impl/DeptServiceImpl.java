package com.dyx.service.system.impl;

import com.dyx.entity.Page;
import com.dyx.entity.PageData;
import com.dyx.entity.system.Dept;
import com.dyx.mapper.dsno1.system.DeptMapper;
import com.dyx.service.system.DeptService;
import com.dyx.util.Tools;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 说明： 组织机构接口实现类
 * 作者：FH Admin Q313596790
 * 时间：2019-08-28
 * 官网：www.fhadmin.org
 */
@Service
@Transactional //开启事物
public class DeptServiceImpl implements DeptService {

    @Autowired
    private DeptMapper deptMapper;

    /**
     * 新增
     *
     * @param pd
     * @throws Exception
     */
    public void save(PageData pd) throws Exception {
        deptMapper.save(pd);
    }

    /**
     * 删除
     *
     * @param pd
     * @throws Exception
     */
    public void delete(PageData pd) throws Exception {
        deptMapper.delete(pd);
    }

    /**
     * 修改
     *
     * @param pd
     * @throws Exception
     */
    public void edit(PageData pd) throws Exception {
        deptMapper.edit(pd);
    }

    /**
     * 列表
     *
     * @param page
     * @throws Exception
     */
    public List<PageData> list(Page page) throws Exception {
        return deptMapper.datalistPage(page);
    }

    /**
     * 列表(全部)
     *
     * @param pd
     * @throws Exception
     */
    public List<PageData> listAll(PageData pd) throws Exception {
        return deptMapper.listAll(pd);
    }

    /**
     * 通过id获取数据
     *
     * @param pd
     * @throws Exception
     */
    public PageData findById(PageData pd) throws Exception {
        return deptMapper.findById(pd);
    }

    /**
     * 根据单位名称全路径获取单位信息
     *
     * @param strSjdwPath 单位名称全路径
     * @return
     * @throws Exception
     */
    @Override
    public PageData findDeptByPath(String strSjdwPath) throws Exception {
        return deptMapper.findDeptByPath(strSjdwPath);
    }

    /**
     * 通过ID获取其子级列表
     *
     * @param parentId
     * @return
     * @throws Exception
     */
    public List<Dept> listByParentId(String parentId) throws Exception {
        return deptMapper.listByParentId(parentId);
    }


    /**
     * 通过ID获取所有子级列表
     *
     * @param parentId
     * @return
     * @throws Exception
     */
    public List<Dept> listZjlb(String parentId) throws Exception {
        return deptMapper.listZjlb(parentId);
    }

    /**
     * 获取所有数据并填充每条数据的子级列表(递归处理)
     *
     * @param MENU_ID
     * @return
     * @throws Exception
     */
    public List<Dept> listTree(String parentId) throws Exception {
        List<Dept> valueList = this.listByParentId(parentId);
        for (Dept fhentity : valueList) {
            fhentity.setTreeurl("dept_list.html?DEPT_ID=" + fhentity.getDEPT_ID());
            fhentity.setSubDept(this.listTree(fhentity.getDEPT_ID()));
            fhentity.setTarget("treeFrame");
        }
        return valueList;
    }

    /**
     * 获取所有数据并填充每条数据的子级列表(递归处理)
     * @param parentId
     * @return
     * @throws Exception
     */
    @Override
    public List<Dept> listZdslTree(String parentId) throws Exception {
        List<Dept> valueList = this.listByParentId(parentId);
        for (Dept fhentity : valueList) {
            fhentity.setTreeurl("zdsl_list.html?id=" + fhentity.getDEPT_ID());
            fhentity.setSubDept(this.listZdslTree(fhentity.getDEPT_ID()));
            fhentity.setTarget("treeFrame");
        }
        return valueList;
    }

    /**
     * 获取通过单位内码获取下级单位id
     *
     * @return
     */
    @Override
    public List<PageData> getDeptId(Page page) {
        return deptMapper.getDeptId(page);
    }

    /**
     * 获取所有数据并填充每条数据的子级列表(递归处理)
     *
     * @param
     * @return
     * @throws Exception
     */
    @Override
    public List<Dept> listZjjgTree(String parentId, int intBj) throws Exception {
        //获取本级数据
        List<Dept> lstBjValue = new ArrayList<>();
        //第一次加载
        if (intBj == 0) {
            intBj++;
            //获取本级数据
            lstBjValue = deptMapper.lstfindById(parentId);
            for (Dept fhentity : lstBjValue) {
                fhentity.setSubDept(this.listZjjgTree(fhentity.getDEPT_ID(), intBj));
            }
            return lstBjValue;
        } else {
            //定义下级数据
            List<Dept> lstXjValue = new ArrayList<>();
            lstXjValue = this.listByParentId(parentId);
            if (lstXjValue.size() > 0) {
                for (Dept fhentity : lstXjValue) {
                    fhentity.setSubDept(this.listZjjgTree(fhentity.getDEPT_ID(), intBj));
                }
            }
            return lstXjValue;
        }
    }

    /**
     * 根据父id获取数据
     *
     * @param strParentId
     */
    @Override
    public PageData findByParentId(String strParentId) {
        return deptMapper.findByParentId(strParentId);
    }

    /**
     * 根据id 查询列表
     *
     * @param dept_id
     * @return
     */
    @Override
    public List<PageData> listForParentId(String dept_id) {
        return deptMapper.listForParentId(dept_id);
    }

    /**
     * 左侧组织机构树（懒加载）
     *
     * @param pd 前台传递参数对象
     * @return List<PageData>  对象
     * @throws Exception
     */
    @Override
    public List<PageData> listLazyTree(PageData pd) throws Exception {
        //parentId 父节点ID
        pd.put("DEPT_ID", Tools.checkString(pd.get("DEPT_ID")).equals("") ? "0" : pd.getString("DEPT_ID"));
        //获取传递过来的TreeUrl
        String strTreeUrl = Tools.isEmpty(pd.getString("TREEURL")) ? null : pd.getString("TREEURL");
        //查询数据
        List<PageData> lstZzjg = deptMapper.getChildrenByParentId(pd);
        //遍历赋值
        for (PageData oPd : lstZzjg) {
            //获取isParent的值
            String strIsParent = Tools.checkString(oPd.get("isParent"));
            if (strTreeUrl != null) {
                //设置跳转路径和target目标区域
                oPd.put("url", strTreeUrl + "?id=" + oPd.getString("DEPT_ID"));
                oPd.put("target", "treeFrame");
                //判断是父节点还是子节点并添加对应的图标
                if ("true".equals(strIsParent)) {
                    oPd.put("icon","../../../plugins/zTree/3.5/css/zTreeStyle/img/diy/1_open.png");
                }else{
                    oPd.put("icon","../../../plugins/zTree/3.5/css/zTreeStyle/img/diy/3.png");
                }
            }
        }
        //返回值
        return lstZzjg;
    }

    /**
     * 单位弹出选择框
     *
     * @param pd
     * @return
     * @throws Exception
     */
    @Override
    public List<PageData> listLazyDwTree(PageData pd) throws Exception {
        //获取传递过来的TreeUrl
        String strTreeUrl = Tools.isEmpty(pd.getString("TREEURL")) ? null : pd.getString("TREEURL");
        //查询数据
        List<PageData> lstZbml = deptMapper.getDwChildrenByParentId(pd);
        //遍历赋值
        for (PageData oPd : lstZbml) {
            //获取isParent的值
            String strIsParent = Tools.checkString(oPd.get("isParent"));
            if (strTreeUrl != null) {
                //设置跳转路径和target目标区域
                oPd.put("url", strTreeUrl + "?id=" + oPd.getString("DEPT_ID"));
                oPd.put("target", "treeFrame");
                //判断是父节点还是子节点并添加对应的图标
                if ("true".equals(strIsParent)) {
                    oPd.put("icon", "../../../plugins/zTree/3.5/css/zTreeStyle/img/diy/1_open.png");
                } else {
                    oPd.put("icon", "../../../plugins/zTree/3.5/css/zTreeStyle/img/diy/3.png");
                }
            }
        }
        //返回值
        return lstZbml;
    }

    /**
     * 查询该目录下子目录最大path
     *
     * @param parentId pid
     * @return
     * @throws Exception
     */
    @Override
    public String getMaxPathByPid(String parentId) throws Exception {
        return deptMapper.getMaxPathByPid(parentId);
    }

    /**
     * 根据单位内码获取改单位下所有子单位
     *
     * @param pd 单位id
     * @return
     */
    @Override
    public String getParentDeptIds(PageData pd) {
        return deptMapper.getParentDeptIds(pd);
    }


    /**
     * 向上递归获取所有上级单位信息
     *
     * @param arrDataIds 单位id
     * @return
     * @throws Exception
     */
    @Override
    public List<Map<String, Object>> getDelegateParentDept(String[] arrDataIds) throws Exception {
        return deptMapper.getDelegateParentDept(arrDataIds);
    }

    /**
     * 选择单位查询
     * @param pd
     * @return
     * @throws Exception
     */
    @Override
    public List<PageData> listLazyxzdwTree(PageData pd) throws Exception {
        //parentId 父节点ID
        pd.put("DEPT_ID", Tools.checkString(pd.get("DEPT_ID")).equals("") ? "0" : pd.getString("DEPT_ID"));
        //获取传递过来的TreeUrl
        String strTreeUrl = Tools.isEmpty(pd.getString("TREEURL")) ? null : pd.getString("TREEURL");
        //查询数据
        List<PageData> lstZzjg = deptMapper.getChildrenByParentId(pd);
        //遍历赋值
        for (PageData oPd : lstZzjg) {
            //获取isParent的值
            String strIsParent = Tools.checkString(oPd.get("isParent"));
            if (strTreeUrl != null) {
                //设置跳转路径和target目标区域
                oPd.put("url", strTreeUrl + "?DEPT_ID=" + oPd.getString("DEPT_ID"));
                oPd.put("target", "treeFrame");
                //判断是父节点还是子节点并添加对应的图标
                if ("true".equals(strIsParent)) {
                    oPd.put("icon","../../../plugins/zTree/3.5/css/zTreeStyle/img/diy/1_open.png");
                }else{
                    oPd.put("icon","../../../plugins/zTree/3.5/css/zTreeStyle/img/diy/3.png");
                }
            }
        }
        //返回值
        return lstZzjg;
    }


}

