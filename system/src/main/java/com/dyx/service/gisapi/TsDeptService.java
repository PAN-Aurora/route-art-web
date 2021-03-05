package com.dyx.service.gisapi;

import com.dyx.entity.PageData;
import com.dyx.entity.system.Dept;

import java.util.List;

/**
 * 说明：态势-组织机构 接口
 *
 * @author 马志伟
 * @date ：2020年5月11日
 */
public interface TsDeptService {

    /**
     * 根据传来的部门ID查询其子部门信息列表
     *
     * @param strDeptId 前台传来的部门ID
     * @return List<PageData> 根据传来的部门ID查询其子部门信息集合
     */
    List<PageData> getListByParentId(String strDeptId, String strZq);

    /**
     * 获取通过单位内码获取下级单位id
     *
     * @param strDeptId 单位内码
     * @return String 查到的下级单位id
     */
    String getDeptId(String strDeptId);

    /**
     * 根据传来的部门ID查询其子部门信息集合 根据区域过滤
     *
     * @param strDeptId 前台传来的部门ID
     * @return List<PageData> 查询到的其子部门信息集合
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
     * 通过单位父节点和战区内码获取所有数据并填充每条数据的子级列表(递归处理)
     * @param
     * @return
     * @throws Exception
     */
    public List<Dept> listTree(String strParentId,String strZqnm) throws Exception;

    /**
     * 获取阵地实力图片数据
     *
     * @param
     * @throws Exception
     */
    List<PageData> getZdslTpList(String strZdslnm);
}

