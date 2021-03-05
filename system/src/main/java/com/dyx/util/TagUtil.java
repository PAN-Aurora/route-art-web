package com.dyx.util;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * Description：
 * Author：孟凡星
 * Date：2020/3/11
 */
public class TagUtil {
    public static String host = "http://192.168.0.100:83/api/htcf";
    /**
     * 获取sign令牌
     *
     * @param string
     * @param operation
     * @param key
     */
    public static String encrypt(String string, String operation, String key) {
        key = getMD5(key);
        int key_length = key.length();
        if (operation == "D") {
            try {
                byte[] base64decodedBytes = Base64.getDecoder().decode(string);
                string = new String(base64decodedBytes, "utf-8");
            } catch (UnsupportedEncodingException e) {
                System.out.println("Error :" + e.getMessage());
            } catch (Exception e) {
                System.out.println("Error :" + e.getMessage());
            }
        } else {
            String md5_string_key = getMD5(string + key);
            string = md5_string_key.substring(0, 8) + string;
        }

        int string_length = string.length();
        int rndkey[] = new int[260];
        int box[] = new int[260];
        String result = "";

        for (int i = 0; i <= 255; i++) {
            rndkey[i] = (int) (key.charAt(i % key_length));
            box[i] = i;
        }

        for (int j = 0, i = 0; i < 256; i++) {
            j = (j + box[i] + rndkey[i]) % 256;
            int tmp = box[i];
            box[i] = box[j];
            box[j] = tmp;
        }

        for (int a = 0, j = 0, i = 0; i < string_length; i++) {
            a = (a + 1) % 256;
            j = (j + box[a]) % 256;
            int tmp = box[a];
            box[a] = box[j];
            box[j] = tmp;
            result += (char) ((int) (string.charAt(i)) ^ box[(box[a] + box[j]) % 256]);
        }

        if (operation == "D") {
            String result_key_md5 = getMD5(result.substring(0, 8) + key);
            if (result.substring(0, 8) == result_key_md5.substring(0, 8)) {
                return result.substring(0, 8);
            } else {
                return "";
            }
        } else {
            try {
                String result_base64 = Base64.getEncoder().encodeToString(result.getBytes("utf-8"));
                return result_base64.replace("=", "");
            } catch (UnsupportedEncodingException e) {
                System.out.println("Error :" + e.getMessage());
            }
        }
        return null;
    }

    /**
     * STRING TO MD5
     *
     * @param str
     */
    private static String getMD5(String str) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(str.getBytes("utf-8"));
            return toHex(bytes);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * MD5 TO HEX
     *
     * @param bytes
     */
    private static String toHex(byte[] bytes) {
        final char[] HEX_DIGITS = "0123456789abcdef".toCharArray();
        StringBuilder ret = new StringBuilder(bytes.length * 2);
        for (int i = 0; i < bytes.length; i++) {
            ret.append(HEX_DIGITS[(bytes[i] >> 4) & 0x0f]);
            ret.append(HEX_DIGITS[bytes[i] & 0x0f]);
        }
        return ret.toString();
    }

    /**
     * http请求
     */
    public static String http(String path, Map<String, String> params) {
        try {
            URL url = new URL(path);
            StringBuilder postData = new StringBuilder();

            for (Map.Entry<String, String> param : params.entrySet()) {
                if (postData.length() != 0) {
                    postData.append('&');
                }
                postData.append(URLEncoder.encode(param.getKey(), "UTF-8"));
                postData.append('=');
                postData.append(URLEncoder.encode(String.valueOf(param.getValue()), "UTF-8"));
            }

            byte[] postDataBytes = postData.toString().getBytes("UTF-8");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("Content-Length", String.valueOf(postDataBytes.length));
            conn.setDoOutput(true);
            conn.getOutputStream().write(postDataBytes);

            Reader in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));

            StringBuilder sb = new StringBuilder();
            for (int c; (c = in.read()) >= 0; ) {
                sb.append((char) c);
            }
            String response = sb.toString();
            return response;
        } catch (UnsupportedEncodingException e) {
            System.out.println("Error :" + e.getMessage());
        } catch (IOException e) {
            System.out.println("Error :" + e.getMessage());
        }
        return null;
    }


    /**
     * 更新或添加商品
     *
     * @param suffix 后缀
     * @param map    商品信息
     */
    public static Object create(Map<String, String> map, String suffix) {
        if (host.length() == 0) {
            Map<String, String> res = new HashMap<>();
            res.put("error_code", "4");
            res.put("error_msg", "host not set");
            return res;
        }

        for (Map.Entry<String, String> entry : map.entrySet()) {
            if (entry.getKey() != "sign") {
                try {
                    String base64 = Base64.getEncoder().encodeToString((entry.getValue()).getBytes("utf-8"));
                    map.put(entry.getKey(), base64);
                } catch (UnsupportedEncodingException e) {
                    System.out.println("Error :" + e.getMessage());
                }
            }
        }

        String url = host + suffix;
        return http(url, map);
    }
}
