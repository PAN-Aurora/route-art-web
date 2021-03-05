var dictValue;
var commontools = {
    methods: {
        //时间格式化
        formatDateUtil: function (date, fmt) {
            if (/(y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
            }
            var o = {
                'M+': date.getMonth() + 1,
                'd+': date.getDate(),
                'h+': date.getHours(),
                'm+': date.getMinutes(),
                's+': date.getSeconds()
            }
            for (var k in o) {
                if (new RegExp(`(${k})`).test(fmt)) {
                    var str = o[k] + ''
                    fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
                }
            }
            return fmt
        },
        //错误提示tip
        showDangerTips: function (id, msg) {
            $("#" + id).tips({
                side: 1,
                msg: msg,
                bg: '#AE81FF',
                time: 3
            });
        },
        //根据url参数名称获取参数值
        getUrlKey: function (name) {
            return decodeURIComponent(
                (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
        },
        // 生成GUID
        newGuid36: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        // 生成GUID(32)
        newGuid32: function () {
            return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        //判断字符串为空
        isEmpty: function (obj) {
            if (typeof obj == "undefined" || obj == null || obj == "" || obj == 'null') {
                return true;
            } else {
                return false;
            }
        },
        //根据ID删除所有附件
        delFilesByids(ids) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                url: httpurl + 'filelib/delbyids',
                type: 'POST',
                data: {IDS: ids},
                dataType: 'json',
                success: function (data) {
                    console.log(data);
                }
            });
        },
        //获取数据字典数据
        getDict: function (dictParam, callback) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'dictionaries/getLevels',
                data: {DICTIONARIES_ID: dictParam, tm: new Date().getTime()},//使用性质
                dataType: 'json',
                success: function (data) {
                    dictValue = data.list;
                    callback(dictValue);
                }
            });
        },
        //获取常量
        getConst: function (dictParam, callback) {
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'dictionaries/getConst',
                data: {DICTIONARIES_ID: dictParam, tm: new Date().getTime()},
                dataType: 'json',
                success: function (data) {
                    dictValue = data.strValue;
                    callback(dictValue);
                }
            });
        },
        //查询之前 判断时间。
        BeforGetList: function () {
            //获取到两个时间
            var kssj = $("#startTime").val();
            var jssj = $("#endTime").val();
            //如果开始时间为空 直接进行查询
            if (this.isEmpty(kssj)) {
                vm.getList();
                //如果结束时间为空 直接进行查询
            } else if (this.isEmpty(jssj)) {
                vm.getList();
            } else {
                kssj = Number(kssj.replace('-', '').replace('-', '').replace(' ', '').replace(':', ''));
                jssj = Number(jssj.replace('-', '').replace('-', '').replace(' ', '').replace(':', ''));
                if (kssj - jssj > 0) {
                    $("#endTime").tips({
                        side: 3,
                        msg: '结束时间必须大于开始时间',
                        bg: '#AE81FF',
                        time: 1
                    });
                    this.pd.endTime = '';
                } else {
                    vm.getList();
                }
            }
        },

        //时间校验方法
        sjjy: function (kssj, jssj) {
            $(jssj).datetimepicker().on('change', function () {
                var varkssj = $(kssj).val();
                var varjssj = $(jssj).val();
                varkssj = Number(varkssj.replace('-', '').replace('-', '').replace(' ', '').replace(':', ''));
                varjssj = Number(varjssj.replace('-', '').replace('-', '').replace(' ', '').replace(':', ''));
                if (varkssj - varjssj > 0) {
                    $(jssj).tips({
                        side: 3,
                        msg: '结束时间必须大于开始时间',
                        bg: '#AE81FF',
                        time: 1
                    });
                    $(jssj).val('');
                    $(jssj).focus();
                }
            });
            $(kssj).datetimepicker().on('change', function () {
                var varkssj = $(kssj).val();
                var varjssj = $(jssj).val();
                varkssj = Number(varkssj.replace('-', '').replace('-', '').replace(' ', '').replace(':', ''));
                varjssj = Number(varjssj.replace('-', '').replace('-', '').replace(' ', '').replace(':', ''));
                if (varkssj - varjssj > 0) {
                    $(kssj).tips({
                        side: 3,
                        msg: '结束时间必须大于开始时间',
                        bg: '#AE81FF',
                        time: 1
                    });
                    $(kssj).val('');
                    $(kssj).focus();
                }
            });
        },

        //校验输入的是数字
        checkIsNumber: function (id) {
            //获取到当前input框
            var check = $(id).val();
            if (check.length == 0) {
                return;
            }

            //正则表达式验证
            var pattern = /^(\-|\+)?\d+(\.\d+)?$/;
            if (pattern.test(check) == false) {
                //将input框赋空值
                $(id).val('');
                $(id).tips({
                    side: 3,
                    msg: '请输入数字',
                    bg: '#AE81FF',
                    time: 1
                });
            }
        },

        //校验输入的是整数
        checkIsPositiveInt: function (id) {
            //获取到当前input框
            var check = $(id).val();
            if (check.length == 0) {
                return;
            }

            //正则表达式验证
            var pattern = /^[1-9]\d*$/;
            if (pattern.test(check) == false) {
                //将input框赋空值
                $(id).val('');
                $(id).tips({
                    side: 3,
                    msg: '请输入整数',
                    bg: '#AE81FF',
                    time: 1
                });
            }
        },

        //message提示框
        message: function(type,message,time){
            this.$message({
                //success/warning/info/error
                type:type,
                message:message,
                duration:time
            });   
        }


    },
};
