package com.dyx.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

public class TblAnalysis {
    private Integer id;

    private Integer projectId;

    private String analysisResult;

    private String analysisBase;

    private String analysisBaseName;

    private Integer type;

    private Integer status;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @DateTimeFormat(pattern ="yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    private String projectName;  //项目名称
    private String projectNo;  //项目名称

    public String getAnalysisBaseName() {
        return analysisBaseName;
    }

    public void setAnalysisBaseName(String analysisBaseName) {
        this.analysisBaseName = analysisBaseName;
    }

    public String getProjectNo() {
        return projectNo;
    }

    public void setProjectNo(String projectNo) {
        this.projectNo = projectNo;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getProjectId() {
        return projectId;
    }

    public void setProjectId(Integer projectId) {
        this.projectId = projectId;
    }

    public String getAnalysisResult() {
        return analysisResult;
    }

    public void setAnalysisResult(String analysisResult) {
        this.analysisResult = analysisResult == null ? null : analysisResult.trim();
    }

    public String getAnalysisBase() {
        return analysisBase;
    }

    public void setAnalysisBase(String analysisBase) {
        this.analysisBase = analysisBase == null ? null : analysisBase.trim();
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}