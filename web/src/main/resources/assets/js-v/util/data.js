/**
 * Description：获取数据字典、常量类型公共方法
 * Author：yufei
 * Date：2020/3/30
 */

/**
 * 获取数据字典数据
 * @param {*} dictParam 数据字典id
 * @param {*} callback  回调函数
 */
 function getDict(dictParam, callback) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "POST",
        url: httpurl + 'dictionaries/getDict',
        data: {NAME_EN: dictParam, tm: new Date().getTime()},
        dataType: 'json',
        success: function (data) {
            // 回调查询到的数据字典
            callback(data.list);
        }
    });
}
/**
 * 获取常量类型
 * @param {*} dictParam 数据字典id
 * @param {*} callback 回调函数
 */
/*function getConst(dictParam, callback) {
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        type: "POST",
        url: httpurl + 'dictionaries/getConst',
        data: {DICTIONARIES_ID: dictParam, tm: new Date().getTime()},
        dataType: 'json',
        success: function (data) {
            // 回调查询到的常量类型
            callback(data.strValue);
        }
    });
}*/


