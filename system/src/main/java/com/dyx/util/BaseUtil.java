package com.dyx.util;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

/**
 *
 */
public class BaseUtil {

    /**
     * Base64解密
     *
     * @param str
     * @return
     */
    public static String decrypt(String str) {

        byte[] b = null;
        String result = null;

        if (str != null) {
            BASE64Decoder decoder = new BASE64Decoder();

            try {
                b = decoder.decodeBuffer(str);

                result = new String(b, "utf-8");

            } catch (IOException e) {
                e.printStackTrace();
            }

        }

        return result;
    }

    /**
     * Base64加密
     *
     * @param str
     * @return
     */
    public static String encryption(String str) {
        byte[] b = null;
        String result = null;

        try {
            if (str != null) {
                b = str.getBytes("utf-8");
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }

        if (str != null) {
            result = new BASE64Encoder().encode(b);
        }

        return result;
    }

}
