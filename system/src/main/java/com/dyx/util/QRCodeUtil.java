package com.dyx.util;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeWriter;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Hashtable;

/**
 * @author chaoyou
 * @email
 * @date 2019-11-22 16:04
 * @Description
 */
public class QRCodeUtil {

    private static final String CHARSET = "utf-8";

    /**
     * 生成二维码
     *
     * @param text     二维码中存放的文本内容
     * @param width    长度
     * @param height   宽度
     * @param filePath 二维码存放途径
     * @throws Exception
     */
    public static void generateQRCodeImage(String text, int width, int height, String filePath) throws Exception {
        // 初始化QRC对象
        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        // 加密文本数据
        //text = EncryptUtil.encryptAES(text);
        // 生成二维码
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
        // 获取指定路径的操作权限
        Path path = FileSystems.getDefault().getPath(filePath);
        // 把生成的二维码写入到指定的路径
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
    }


    /**
     * 生成包含中文的二维码
     *
     * @param text     二维码中存放的文本内容
     * @param width    长度
     * @param height   宽度
     * @param filePath 二维码存放途径
     * @throws Exception
     */
    public static void generateQRCodeImgByChinese(String text, int width, int height, String filePath) throws Exception {
        // 初始化QRC对象
        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        HashMap<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.CHARACTER_SET, "utf-8");
        // 加密文本数据
        //text = EncryptUtil.encryptAES(text);
        // 生成二维码
        BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height, hints);
        // 获取指定路径的操作权限
        Path path = FileSystems.getDefault().getPath(filePath);
        // 把生成的二维码写入到指定的路径
        MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);
    }


    /**
     * 解析二维码
     *
     * @param path 二维码图片地址
     * @return
     * @throws Exception
     */
    public static String decode(String path) throws Exception {
        // 获取指定路径图片资源的IO
        File file = new File(path);
        BufferedImage image;
        image = ImageIO.read(file);
        if (image == null) {
            return null;
        }
        BufferedImageLuminanceSource source = new BufferedImageLuminanceSource(
                image);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
        Result result;
        Hashtable<DecodeHintType, Object> hints = new Hashtable<DecodeHintType, Object>();
        hints.put(DecodeHintType.CHARACTER_SET, CHARSET);
        hints.put(DecodeHintType.TRY_HARDER, Boolean.TRUE);
        hints.put(DecodeHintType.PURE_BARCODE, Boolean.TRUE);
        result = new MultiFormatReader().decode(bitmap, hints);
        String resultStr = result.getText();
        return resultStr;
    }

}
