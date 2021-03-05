package com.dyx.entity.system;

import java.util.List;

 /** 
 * 说明：组织机构实体类
 * 作者：FH Admin QQ313596790
 * 时间：2019-08-28
 * 官网：www.fhadmin.org
 */
public class Dept{ 
	
	private String DEPT_ID;	//主键
	private String target;
	private Dept dept;
	private List<Dept> subDept;
	private boolean hasDept = false;
	private String treeurl;
	private String ZQMC;
	private String ZQNM;
	private String NAME;//名称
	 //定义子节点拼接字符串
	 private String strChildrens;

	 public String getZQMC() {
		 return ZQMC;
	 }

	 public void setZQMC(String ZQMC) {
		 this.ZQMC = ZQMC;
	 }

	 public String getZQNM() {
		 return ZQNM;
	 }

	 public void setZQNM(String ZQNM) {
		 this.ZQNM = ZQNM;
	 }

	 public String getFNAME() {
		return NAME;
	}
	public void setFNAME(String NAME) {
		this.NAME = NAME;
	}
	private String NAME_EN;			//英文
	public String getFNAME_EN() {
		return NAME_EN;
	}
	public void setFNAME_EN(String NAME_EN) {
		this.NAME_EN = NAME_EN;
	}
	private String BIANMA;			//编码
	public String getFBIANMA() {
		return BIANMA;
	}
	public void setFBIANMA(String BIANMA) {
		this.BIANMA = BIANMA;
	}
	private String PARENT_ID;			//上级ID
	public String getFPARENT_ID() {
		return PARENT_ID;
	}
	public void setFPARENT_ID(String PARENT_ID) {
		this.PARENT_ID = PARENT_ID;
	}
	private String BZ;			//备注
	public String getFBZ() {
		return BZ;
	}
	public void setFBZ(String BZ) {
		this.BZ = BZ;
	}
	private String HEADMAN;			//负责人
	public String getFHEADMAN() {
		return HEADMAN;
	}
	public void setFHEADMAN(String HEADMAN) {
		this.HEADMAN = HEADMAN;
	}
	private String TEL;			//电话
	public String getFTEL() {
		return TEL;
	}
	public void setFTEL(String TEL) {
		this.TEL = TEL;
	}
	private String FUNCTIONS;			//部门职能
	public String getFFUNCTIONS() {
		return FUNCTIONS;
	}
	public void setFFUNCTIONS(String FUNCTIONS) {
		this.FUNCTIONS = FUNCTIONS;
	}
	private String ADDRESS;			//地址
	public String getFADDRESS() {
		return ADDRESS;
	}
	public void setFADDRESS(String ADDRESS) {
		this.ADDRESS = ADDRESS;
	}
	private String ZT;			//状态
	public String getFZT() {
		return ZT;
	}
	public void setFZT(String ZT) {
		this.ZT = ZT;
	}
	private String LON;			//经度
	public String getFLON() {
		return LON;
	}
	public void setFLON(String LON) {
		this.LON = LON;
	}
	private String LAT;			//纬度
	public String getFLAT() {
		return LAT;
	}
	public void setFLAT(String LAT) {
		this.LAT = LAT;
	}

	public String getDEPT_ID() {
		return DEPT_ID;
	}
	public void setDEPT_ID(String DEPT_ID) {
		this.DEPT_ID = DEPT_ID;
	}
	public String getNAME() {
		return NAME;
	}
	public void setNAME(String NAME) {
		this.NAME = NAME;
	}
	public String getPARENT_ID() {
		return PARENT_ID;
	}
	public void setPARENT_ID(String PARENT_ID) {
		this.PARENT_ID = PARENT_ID;
	}
	public String getTarget() {
		return target;
	}
	public void setTarget(String target) {
		this.target = target;
	}
	public Dept getDept() {
		return dept;
	}
	public void setDept(Dept dept) {
		this.dept = dept;
	}
	public List<Dept> getSubDept() {
		return subDept;
	}
	public void setSubDept(List<Dept> subDept) {
		this.subDept = subDept;
	}
	public boolean isHasDept() {
		return hasDept;
	}
	public void setHasDept(boolean hasDept) {
		this.hasDept = hasDept;
	}
	public String getTreeurl() {
		return treeurl;
	}
	public void setTreeurl(String treeurl) {
		this.treeurl = treeurl;
	}

	 public String getStrChildrens() {
		 return strChildrens;
	 }

	 public void setStrChildrens(String strChildrens) {
		 this.strChildrens = strChildrens;
	 }
 }
