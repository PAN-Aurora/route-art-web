package com.dyx.util;

import com.dyx.entity.PageData;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 说明：数据库操作，用于代码生成器反向生成
 * 作者：FH Admin QQ 313596790
 * 官网：www.fhadmin.org
 */
public class GENDbFH {

    /**
     * 获取本数据库的所有表名(通过PageData)
     *
     * @return
     * @throws SQLException
     * @throws ClassNotFoundException
     */
    public static Object[] getTables(PageData pd) throws ClassNotFoundException, SQLException {
        String dbtype = pd.getString("dbtype");                //数据库类型
        String username = pd.getString("username");            //用户名
        String password = pd.getString("password");            //密码
        String address = pd.getString("dbAddress");            //数据库连接地址
        String dbport = pd.getString("dbport");                //端口
        String databaseName = pd.getString("databaseName");    //数据库名
        Connection conn = GENDbFH.getCon(dbtype, username, password, address + ":" + dbport, databaseName);
        if ("oracle".equals(dbtype)) {
            databaseName = username.toUpperCase();
        }
        Object[] arrOb = {databaseName, GENDbFH.getTablesByCon(conn, "sqlserver".equals(dbtype) ? null : databaseName), dbtype};
        return arrOb;
    }

    /**
     * @return 获取conn对象(通过PageData)
     * @throws ClassNotFoundException
     * @throws SQLException
     */
    public static Connection getFHCon(PageData pd) throws ClassNotFoundException, SQLException {
        String dbtype = pd.getString("dbtype");                //数据库类型
        String username = pd.getString("username");            //用户名
        String password = pd.getString("password");            //密码
        String address = pd.getString("dbAddress");            //数据库连接地址
        String dbport = pd.getString("dbport");                //端口
        String databaseName = pd.getString("databaseName");    //数据库名
        return GENDbFH.getCon(dbtype, username, password, address + ":" + dbport, databaseName);
    }

    /**
     * (字段名、类型、长度)列表
     *
     * @param conn
     * @param table
     * @return
     * @throws SQLException
     */
    public static List<Map<String, String>> getFieldParameterLsit(Connection conn, String table, String dbtype) throws SQLException {
        if ("oracle".equals(dbtype)) {
            PreparedStatement pstmt = (PreparedStatement) conn.prepareStatement("select * from " + table);
            pstmt.execute();
            PreparedStatement pstmtc = (PreparedStatement) conn.prepareStatement("select * from user_col_comments where Table_Name='" + table + "'");
            pstmtc.execute();
            List<Map<String, String>> columnList = new ArrayList<Map<String, String>>();    //存放字段
            ResultSetMetaData rsmd = (ResultSetMetaData) pstmt.getMetaData();
            ResultSet rs = pstmtc.getResultSet();
            List<Map<String, String>> commentList = new ArrayList<Map<String, String>>();    //字段的注释
            while (rs.next()) {
                Map<String, String> cmap = new HashMap<String, String>();
                cmap.put("COLUMN_NAME", rs.getString("COLUMN_NAME"));                //字段名称
                cmap.put("COMMENTS", rs.getString("COMMENTS"));                        //字段注释备注
                commentList.add(cmap);
            }
            for (int i = 1; i < rsmd.getColumnCount() + 1; i++) {
                Map<String, String> fmap = new HashMap<String, String>();
                String columnName = rsmd.getColumnName(i);                                //字段名称
                fmap.put("fieldNanme", columnName);
                fmap.put("fieldType", rsmd.getColumnTypeName(i));                        //字段类型名称
                fmap.put("fieldLength", String.valueOf(rsmd.getColumnDisplaySize(i)));    //长度
                fmap.put("fieldSccle", String.valueOf(rsmd.getScale(i)));                //小数点右边的位数
                for (int n = 0; n < commentList.size(); n++) {
                    if (columnName.equals(commentList.get(n).get("COLUMN_NAME").toString())) {
                        String fieldComment = "备注" + i;
                        if (null != commentList.get(n).get("COMMENTS")) {
                            fieldComment = commentList.get(n).get("COMMENTS").toString();
                            fieldComment = "".equals(fieldComment.trim()) ? "备注" + i : fieldComment;
                        }
                        fmap.put("fieldComment", fieldComment);                        //字段注释备注
                    }
                }
                columnList.add(fmap);                                                    //把字段名放list里
            }
            return columnList;
        } else if ("mysql".equals(dbtype)) {
            PreparedStatement pstmt = (PreparedStatement) conn.prepareStatement("show full fields from " + table);
            pstmt.execute();                                                            //这点特别要注意:如果是Oracle而对于mysql可以不用加.
            List<Map<String, String>> columnList = new ArrayList<Map<String, String>>();    //存放字段
            ResultSet rs = pstmt.getResultSet();
            while (rs.next()) {
                Map<String, String> fmap = new HashMap<String, String>();
                fmap.put("fieldNanme", rs.getString("Field"));                            //字段名称
                //截取
                String typeStr = rs.getString("Type"); //varchar(30)
                String typName = "", length = "0", sccle = "0";
                if (typeStr.indexOf("(") != -1 && typeStr.indexOf("") != -1) {
                    typName = typeStr.substring(0, typeStr.indexOf("("));
                    String numStr = typeStr.substring(typeStr.indexOf("(") + 1, typeStr.indexOf(")"));
                    if (numStr.contains(",")) { //3,3
                        length = numStr.split(",")[0];
                        sccle = numStr.split(",")[1];
                    } else {
                        length = numStr;
                    }
                } else {
                    typName = typeStr;
                }
                fmap.put("fieldType", typName);                                //字段类型名称
                fmap.put("fieldLength", length);                                //长度
                fmap.put("fieldSccle", sccle);                                    //小数点右边的位数
                fmap.put("fieldComment", rs.getString("Comment"));                //字段注释
                columnList.add(fmap);
            }
            return columnList;
        } else { //sqlserver类型
            String sql = "SELECT " +
                    "CONVERT(varchar(200),B.name) AS column_name," +
                    "CONVERT(varchar(200),C.value) AS column_description" +
                    " FROM sys.tables A" +
                    " INNER JOIN sys.columns B ON B.object_id = A.object_id" +
                    " LEFT JOIN sys.extended_properties C ON C.major_id = B.object_id AND C.minor_id = B.column_id" +
                    " WHERE A.name = '" + table + "'";
            PreparedStatement fullpstmt = (PreparedStatement) conn.prepareStatement(sql);
            fullpstmt.execute();
            ResultSet rs = fullpstmt.getResultSet();
            PreparedStatement pstmt = (PreparedStatement) conn.prepareStatement("select * from " + table);
            pstmt.execute();                                                            //这点特别要注意:如果是Oracle而对于mysql可以不用加.
            List<Map<String, String>> columnList = new ArrayList<Map<String, String>>();    //存放字段
            ResultSetMetaData rsmd = (ResultSetMetaData) pstmt.getMetaData();
            for (int i = 1; i < rsmd.getColumnCount() + 1; i++) {
                Map<String, String> fmap = new HashMap<String, String>();
                fmap.put("fieldComment", "");
                fmap.put("fieldNanme", rsmd.getColumnName(i));                            //字段名称
                while (rs.next()) {
                    if (rsmd.getColumnName(i).equals(rs.getString("column_name"))) {
                        fmap.put("fieldComment", rs.getString("column_description") == null ? "" : rs.getString("column_description"));//字段注释
                        break;
                    }
                }
                fmap.put("fieldType", rsmd.getColumnTypeName(i));                        //字段类型名称
                fmap.put("fieldLength", String.valueOf(rsmd.getColumnDisplaySize(i)));    //长度
                fmap.put("fieldSccle", String.valueOf(rsmd.getScale(i)));                //小数点右边的位数
                columnList.add(fmap);                                                    //把字段名放list里
            }
            return columnList;
        }
    }

    /**
     * @param dbtype       数据库类型
     * @param username     用户名
     * @param password     密码
     * @param dburl        数据库连接地址:端口
     * @param databaseName 数据库名
     * @return
     * @throws SQLException
     * @throws ClassNotFoundException
     */
    public static Connection getCon(String dbtype, String username, String password, String dburl, String databaseName) throws SQLException, ClassNotFoundException {
        if ("mysql".equals(dbtype)) {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection("jdbc:mysql://" + dburl + "/" + databaseName + "?user=" + username + "&password=" + password + "&serverTimezone=UTC&nullCatalogMeansCurrent=true");
        } else if ("oracle".equals(dbtype)) {
            Class.forName("oracle.jdbc.driver.OracleDriver");
            return DriverManager.getConnection("jdbc:oracle:thin:@" + dburl + ":" + databaseName, username, password);
        } else if ("sqlserver".equals(dbtype)) {
            Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
            return DriverManager.getConnection("jdbc:sqlserver://" + dburl + "; DatabaseName=" + databaseName, username, password);
        } else {
            return null;
        }
    }

    /**
     * 获取某个conn下的所有表
     *
     * @param conn   数据库连接对象
     * @param schema mysql:数据库名; oracle:用户名;sqlserver:null
     * @return
     */
    public static List<String> getTablesByCon(Connection conn, String schema) {
        try {
            List<String> listTb = new ArrayList<String>();
            DatabaseMetaData meta = conn.getMetaData();
            ResultSet rs = meta.getTables(null, schema, null, new String[]{"TABLE"});
            while (rs.next()) {
                listTb.add(rs.getString(3));
            }
            return listTb;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                conn.close();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return null;
    }

}


//创建人：FH Q 3 135 9 67 90