/**
 * Description：页面样式与校验方法
 * Author：yufei
 * Date：2020/3/30
 */

/**
 * 初始化表单控件
 */
$(document).ready(function () {
    // 调整新增、编辑页面输入框（input框/下拉选择框/时间框）宽度自适应
    inputWidth();
    // 增加必填项标记*
    notnullFlag();
    // 初始化时间控件
    initDateControl();
});

/**
 * 调整新增、编辑页面输入框宽度自适应
 */
function inputWidth() {
    // 获取所有input-group-sm节点遍历，input-group-sm的宽度相当于一行的宽度
    $(".input-group-sm").each(function () {
        // 获取标题头的宽度
        var titleW = $(this).find(".input-group-prepend:nth-child(1) .input-group-text").innerWidth();
        // 获取一行有几列输入框
        var count = $(this).find(".input-group-prepend").length;
        // 获取一行的宽度
        var groupW = $(this).width();
        // 输入框的宽度等于一行的宽度除于列数，再减去标题头的狂赌，最后减去滚动条的宽度10
        var width = (groupW - 20) / count - titleW;
        $(this).children("select").addClass("form-control");
        // 赋值
        $(this).children("input,select,.form-width,.form-control").css("width", width);
    })
}

/**
 * 增加必填*项标记
 */
function notnullFlag() {
    var html = "<span style='color:red'>*</span>";
    // 获取所有带有 notnullflag 属性的节点遍历
    $("[notnullflag]").each(function () {
        // 拼接 * 标记
        $(this).prepend(html);
    });
}

/**
 * 初始化时间类型控件
 */
function initDateControl() {
    // 获取所有带有 dateformat 属性的节点遍历
    $("[dateformat]").each(function () {
        // 获取dateformat的值
        var format = $(this).attr("dateformat");
        // 根据长度判读时间类型，yyyy-mm-dd为日期类型长度为10，yyyy-mm-dd hh:ii为时间类型长度大于10
        if (format.length > 10) {
            // 时间类型初始化
            $(this).datetimepicker({
                format: format,
                language: 'zh-CN',
                autoclose: true,
                todayHighLight: "linked",
                //设置分钟间隔 1 为1-60分钟都可选
                // minuteStep:1
            }).on('click',function(e){
                //此方法用来解决点击input日期框选择器不显示
                e.currentTarget.blur();
            });
        } else {
            // 日期类型初始化
            $(this).datepicker({
                format: format,
                language: 'zh-CN',
                autoclose: true,
                todayHighLight: "linked"
            });
        }
    });

    // 获取所有带有 dateformat 属性的节点遍历  今天之前的时间不可选
    $("[toDayStartDateFormat]").each(function () {
        // 获取dateformat的值
        var format = $(this).attr("toDayStartDateFormat");
        // 根据长度判读时间类型，yyyy-mm-dd为日期类型长度为10，yyyy-mm-dd hh:ii为时间类型长度大于10
        // 时间类型初始化
        $(this).datetimepicker({
            format: format,
            language: 'zh-CN',
            autoclose: true,
            todayHighLight: "linked",
            startDate:new Date()
            //设置分钟间隔 1 为1-60分钟都可选
            // minuteStep:1
        });
    });

    // 获取所有带有 dateformat 属性的节点遍历  今天之后的时间不可选
    $("[toDayEndDateFormat]").each(function () {
        // 获取dateformat的值
        var format = $(this).attr("toDayEndDateFormat");
        // 根据长度判读时间类型，yyyy-mm-dd为日期类型长度为10，yyyy-mm-dd hh:ii为时间类型长度大于10
        // 时间类型初始化
        $(this).datetimepicker({
            format: format,
            language: 'zh-CN',
            autoclose: true,
            todayHighLight: "linked",
            endDate:new Date()
            //设置分钟间隔 1 为1-60分钟都可选
            // minuteStep:1
        });
    });

    // 获取所有带有 startDateformat 属性的节点遍历
    $("[startDateformat]").each(function () {
        // 获取startDateformat的值
        var format = $(this).attr("startDateformat");
        // 日期类型初始化
        $(this).datepicker({
            format: format,
            language: 'zh-CN',
            autoclose: true,
            todayHighLight: "linked",
        }).on('changeDate', function (e) {
            var startTime = e.date;
            if (startTime != null) {
                $("[endDateformat]").each(function () {
                    $(this).datepicker('setStartDate', startTime)
                })
            } else {
                $("[endDateformat]").each(function () {
                    $(this).datepicker('setStartDate', null)
                })
            }
        });
    });

    // 获取所有带有 endDateformat 属性的节点遍历
    $("[endDateformat]").each(function () {
        // 获取startDateformat的值
        var format = $(this).attr("endDateformat");
        // 日期类型初始化
        $(this).datepicker({
            format: format,
            language: 'zh-CN',
            autoclose: true,
            todayHighLight: "linked",
        }).on('changeDate', function (e) {
            var endTime = e.date;
            if (endTime != null) {
                $("[startDateformat]").each(function () {
                    $(this).datepicker('setEndDate', endTime)
                })
            } else {
                $("[startDateformat]").each(function () {
                    $(this).datepicker('setEndDate', null)
                })
            }
        });
    });
}

/**
 * 校验控件空值
 * @param {*} control
 */
function validateNotNull(control) {
    // 定义返回结果
    var result = true;
    // 获取控件值
    var value = control.val();
    if (value == null || value.length <= 0) {
        result = false;
        // 显示错误提示
        showErrorTip(control, "");
    }

    return result;
}

/**
 * 校验控件输入值长度
 * @param {*} control
 */
function validateValueLen(control) {
    // 定义返回结果
    var result = true;
    // 获取控件值
    var value = control.val();
    if (value != null && value.length > 0 && control.attr("checklength") != null) {
        // 如果长度值不是非负整数或者设定长度小于输入长度
        if (!(regexEnum.negint).test(control.attr("checklength")) || control.attr("checklength") < value.length) {
            // 校验失败，设置返回结果为false
            result = false;
            // 显示错误提示
            showErrorTip(control, "");
        }
    }

    return result;
}

/**
 * 控件值类型校验方法
 * @param {*} control 校验控件
 */
function validateValueType(control) {
    // 定义返回结果
    var result = true;
    // 类型属性
    var type = control.attr("checktype");
    // 类型为空，返回false
    if (type == null || type.length < 1) {
        // 显示错误提示
        showErrorTip(control, "");
        return false;
    }
    // 获取控件值
    var value = control.val();
    $.each(regexEnum, function (i, m) {
        // 校验类型比较
        if (type == i) {
            // 进行校验
            if (value == null || value.length < 1 || !m.test(value)) {
                // 校验失败，设置返回结果为false
                result = false;
                // 显示错误提示
                showErrorTip(control, "");
            }
            // 跳出循环
            return false;
        }
    });

    return result;
}

/**
 * 校验特殊字符
 * @param {*} control
 */
function validateIllegChar(control) {
    // 定义返回结果
    var result = true;
    // 获取控件值
    var value = control.val();
    var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
        regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    var regKg = /\s/;
    if (regKg.test(value)) {
        result = false;
        // 提示错误信息
        showErrorTip(control, "输入值中不能有空格");
    }
    if (regEn.test(value) || regCn.test(value)) {
        result = false;
        // 提示错误信息
        showErrorTip(control, "输入值中包含特殊字符");
    }

    return result;
}

/**
 * 时间比较方法
 * @param {*} control 结束时间控件
 */
function compareDate(control) {
    // 定义返回结果
    var result = true;
    // 获取开始时间控件
    var begin = $("#" + control.attr("begintime"));
    if (begin == null) {
        showErrorTip(control);
        return false;
    }
    // 开始时间
    var begintime = begin.val();
    // 结束时间
    var endtime = control.val();
    if (begintime >= endtime) {
        // 校验失败，返回结果为false
        result = false;
        // 提示错误信息
        showErrorTip(control);
    }

    return result;
}

/**
 * 正则校验
 * @param {*} control
 */
function validateReg(control) {
    // 定义返回结果
    var result = true;
    // 校验正则
    var reg = control.attr("checkreg");
    // 获取控件值
    var value = control.val();
    if (reg != null && value != null) {
        // 校验控件输入值
        result = reg.test(value);
        if (!result) {
            // 提示错误信息
            showErrorTip(control, "");
        }
    }

    return result;
}

/**
 * 表单校验方法
 */
function validateForm() {
    // 定义返回结果
    var result = true;

    // 空校验
    if (result) {
        $("[checknull]").each(function () {
            // 控件隐藏不校验
            if ($(this).is(":hidden")) {
                return true;
            }
            // 调用空值校验
            result = validateNotNull($(this));
            // 跳出循环
            return result;
        });
    }

    // 长度校验
    if (result) {
        $("[checklength]").each(function () {
            // 控件隐藏不校验
            if ($(this).is(":hidden")) {
                return true;
            }
            // 调用输入长度校验
            result = validateValueLen($(this));
            // 跳出循环
            return result;
        });
    }

    // 特殊字符校验
    if (result) {
        $("[checkillegal]").each(function () {
            var control = $(this);
            // 控件隐藏不校验
            if (control.is(":hidden")) {
                return true;
            }
            // 调用类型校验方法
            result = validateIllegChar(control);
            // 跳出循环
            return result;
        });
    }

    // 值类型校验
    if (result) {
        $("[checktype]").each(function () {
            var control = $(this);
            // 控件隐藏不校验
            if (control.is(":hidden")) {
                return true;
            }
            // 调用类型校验方法
            result = validateValueType(control);
            // 跳出循环
            return result;
        });
    }

    // 自定义正则校验
    if (result) {
        $("[checkreg]").each(function () {
            var control = $(this);
            // 控件隐藏不校验
            if (control.is(":hidden")) {
                return true;
            }
            // 调用类型校验方法
            result = validateReg(control);
            // 跳出循环
            return result;
        });
    }

    // 开始-结束时间比较
    if (result) {
        $("[begintime]").each(function () {
            var control = $(this);
            // 判断控件是否显示
            if (control.is(":hidden")) {
                return true;
            }
            // 调用时间比较方法
            result = compareDate(control);
            // 跳出循环
            return result;
        });
    }

    return result;
}

/**
 * 控件错误提示
 * @param {*} control 显示控件
 */
function showErrorTip(control, error) {
    // 错误提示
    error = error == null || error == "" ? control.attr("checkerror") == null ? "校验失败" : control.attr("checkerror") : error;
    control.tips({
        side: 3,
        msg: error,
        bg: tipsColor,
        time: 2
    });
    control.focus();
}

// 校验类型枚举
var regexEnum =
    {
        // 整数
        int: /^-?[1-9]\d*$/,
        // 非负整数
        negint: /^\d+$/,
        // 浮点数
        float: /^(-?\d+)(\.\d+)?$/,
        // 正浮点数
        posfloat: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/,
        // 非负浮点数（正浮点数 + 0）用这个
        negfloat: /^\d+(\.\d+)?$/,
        //正则表达式校验金额最多保留两位小数
        Money: /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/,
        // 邮件　
        email: /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/,
        // 仅中文
        chinese: /^[\u4e00-\u9fa5]{0,}$/,
        // 邮编
        zipcode: /^[0-9]\d{5}(?!\d)$/,
        // 国内电话号码 例：（0511-4405222、021-87888822）
        tel: /\d{3}-\d{8}|\d{4}-\d{7}/,
        // 手机
        mobile: /^(\+\d{2}-)?(\d{2,3}-)?([1][3,4,5,7,8][0-9]\d{8})$/,
        // 日期(格式 2020-02-02)
        date: /^[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))$/,//日期
        // QQ号码
        qq: /^[1-9]*[1-9][0-9]*$/,
        // 用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
        username: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/,
        //密码（以字母开头，长度在6-18之间，只能包含字符、数字和下划线）
        password: /^[a-zA-Z]\w{5,17}/,
        // 字母
        letter: /^[A-Za-z]+$/,
        // 大写字母
        letupper: /^[A-Z]+$/,
        // 小写字母
        letlower: /^[a-z]+$/,
        // 身份证
        idcard: /^([0-9]){7,18}(x|X)?$/,
        //软件版本号
        VersionNum: /^\d(\.\d+){1,2}$/,
        //IP地址正则表达式
        ipNum: /^((25[0-5]|2[0-4]\d|[1]{1}\d{1}\d{1}|[1-9]{1}\d{1}|\d{1})($|(?!\.$)\.)){4}$/,
        //MAC地址正则表达式
        MACNum: /((([a-f0-9]{2}:){5})|(([a-f0-9]{2}-){5}))[a-f0-9]{2}/gi,
        //英文加数字
        BM:/^(([a-z]+[0-9]+)|([0-9]+[a-z]+))[a-z0-9]*$/i,
        //CPU序列号正则表达式

        //主板序列号正则表达式

        //经度正则表达式
        JD:/^(([1-9]\d?)|(1[0-7]\d))(\.\d{1,6})|180|0(\.\d{1,6})?/,
        //纬度正则表达式
        WD:/^(([1-8]\\d?)|([1-8]\\d))(\\.\\d{1,6})|90|0(\\.\\d{1,6})?$/
    }