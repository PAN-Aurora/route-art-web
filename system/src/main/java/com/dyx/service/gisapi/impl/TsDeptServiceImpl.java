package com.dyx.service.gisapi.impl;

import com.dyx.entity.PageData;
import com.dyx.entity.system.Dept;
import com.dyx.mapper.dsno1.gisapi.TsDeptMapper;
import com.dyx.service.gisapi.TsDeptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 说明：态势-组织机构 接口实现
 *
 * @author 马志伟
 * @date ：2020年5月11日
 */
@Service
@Transactional
public class TsDeptServiceImpl implements TsDeptService {

    /**
     * 注入组织机构mapper
     */
    @Autowired
    private TsDeptMapper tsDeptMapper;

    /**
     * 根据传来的部门ID查询其子部门信息列表
     *
     * @param strDeptId 前台传来的部门ID
     * @return List<PageData> 根据传来的部门ID查询其子部门信息集合
     */
    @Override
    public List<PageData> getListByParentId(String strDeptId, String strZq) {
        return tsDeptMapper.getListByParentId(strDeptId ,strZq);
    }

    /**
     * 根据id查询其所有子部门id
     *
     * @param strDeptId 部门id
     * @return String  根据id查询到的其所有子部门id
     */
    @Override
    public String getDeptId(String strDeptId) {
        return tsDeptMapper.getDeptId(strDeptId);
    }

    /**
     * 根据传来的部门ID查询其子部门信息集合 根据区域过滤
     *
     * @param strDeptId 前台传来的部门ID
     * @return List<PageData> 查到的根据部门ID查询其子部门信息集合
     */
    @Override
    public List<PageData> getListByQy(String strDeptId) {
        return tsDeptMapper.getListByQy(strDeptId);
    }

    /**
     * 获取单位部署数据 调用根据所属区域名称，单位ID查询单位部署数据
     *
     * @param pd 所属区域名称，单位ID
     * @return PageData 查询到的部署单位，单位id
     */
    @Override
    public PageData getDwbs(PageData pd) {
        return tsDeptMapper.getDwbs(pd);
    }

    /**
     * 根据单位id 获取该单位的经纬度数据
     *
     * @param strDwid 单位id
     * @return PageData 查到的经纬度数据
     */
    @Override
    public PageData getDeptJwd(String strDwid) {
        return tsDeptMapper.getDeptJwd(strDwid);
    }

    /**
     * 通过单位父节点和战区内码获取所有数据并填充每条数据的子级列表(递归处理)
     *
     * @param strParentId
     * @param strZqnm
     * @return
     * @throws Exception
     */
    @Override
    public List<Dept> listTree(String strParentId, String strZqnm) throws Exception {
        List<Dept> valueList = new ArrayList<>();
        if(strParentId.equals("0")){
            valueList = this.listByParentId(strParentId,null);
        }else{
            valueList = this.listByParentId(strParentId,strZqnm);
        }
        for (Dept fhentity : valueList) {
            String strChildrens = this.strHasChildrens(fhentity.getDEPT_ID(),strZqnm);
            fhentity.setStrChildrens(strChildrens!=""?strChildrens:"");
            fhentity.setSubDept(this.listTree(fhentity.getDEPT_ID(),strZqnm));
            fhentity.setTarget("treeFrame");
        }
        return valueList;
    }

    /**
     * 通过单位父节点和战区内码获取其子级列表
     *
     * @param strParentId
     * @param strZqnm
     * @return
     * @throws Exception
     */
    public List<Dept> listByParentId(String strParentId,String strZqnm) throws Exception {
        return tsDeptMapper.listByParentId(strParentId,strZqnm);
    }

    /**
     * 通过单位父节点获取
     *
     * @param strParentId
     * @param strZqnm
     * @return
     * @throws Exception
     */
    public String strHasChildrens(String strParentId,String strZqnm) throws Exception {
        return tsDeptMapper.strHasChildrens(strParentId,strZqnm);
    }

    /**
     * 获取阵地实力图片数据
     *
     * @param
     * @throws Exception
     */
    @Override
    public List<PageData> getZdslTpList(String strZdslnm) {
        return tsDeptMapper.getZdslTpList(strZdslnm);
    }
}

