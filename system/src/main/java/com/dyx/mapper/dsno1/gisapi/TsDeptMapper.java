package com.dyx.mapper.dsno1.gisapi;

import com.dyx.entity.PageData;
import com.dyx.entity.system.Dept;

import java.util.List;

/**
 * 说明：态势-组织机构 mapper
 *
 * @author 马志伟
 * @date ：2020年5月11日
 */
public interface TsDeptMapper {

    /**
     * 根据传来的部门ID查询其子部门信息列表
     *
     * @param strDeptId 前台传来的部门ID
     * @return List<PageData> 根据传来的部门ID查询其子部门信息集合
     */
    List<PageData> getListByParentId(String strDeptId, String strZq);

    /**
     * 根据id查询其所有子部门id
     *
     * @param strDeptId 部门id
     * @return String  根据id查询到的其所有子部门id
     */
    String getDeptId(String strDeptId);

    /**
     * 根据传来的部门ID查询其子部门信息集合 根据区域过滤
     *
     * @param strDeptId 前台传来的部门ID
     * @return List<PageData> 查到的根据部门ID查询其子部门信息集合
     */
    List<PageData> getListByQy(String strDeptId);

    /**
     * 获取单位部署数据 调用根据所属区域名称，单位ID查询单位部署数据
     *
     * @param pd 所属区域名称，单位ID
     * @return PageData 查询到的部署单位，单位id
     */
    PageData getDwbs(PageData pd);

    /**
     * 根据单位id 获取该单位的经纬度数据
     *
     * @param strDwid 单位id
     * @return PageData 查到的经纬度数据
     */
    PageData getDeptJwd(String strDwid);

    /**
     * 通过ID获取其子级列表
     * @param strParentId
     * @param strZqnm
     * @return
     * @throws Exception
     */
    List<Dept> listByParentId(String strParentId,String strZqnm);

    /**
     * 通过ID获取其子级列表
     * @param strParentId
     * @param strZqnm
     * @return
     * @throws Exception
     */
    String strHasChildrens(String strParentId,String strZqnm);

    /**
     * 获取阵地实力图片数据
     *
     * @param strZdslnm
     * @throws Exception
     */
    List<PageData> getZdslTpList(String strZdslnm);
}

