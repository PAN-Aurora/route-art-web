

var vm = new Vue({
    el: '#app',

    data: {
        // 是否显示新增框
        addFormVisible:false,  
        // 默认日历事件表单
        ysform:{              
            id:'',
            title:'',
            start:'',
            end:'',
            allDay:'1',
            zdtx:'0',
            className:[],
            color:'#3a87ad',
            sort:''
        },
        // 日历事件表单
        form:{             
            id:'',
            title:'',
            start:'',
            end:'',
            allDay:'1',
            zdtx:'0',
            className:[],
            color:'#3a87ad',
            sort:''
        },
        formLabelWidth:'100px',
        // 时间选择框类型
        dateType:'date',
        // 自定义默认颜色
        predefineColors:[ 
            {col:'#a0a0a0',value:'label-grey',label:'事件1'},
            {col:'#82af6f',value:'label-success',label:'事件2'},
            {col:'#d15b47',value:'label-danger',label:'事件3'},
            {col:'#9585bf',value:'label-purple',label:'事件4'},
            {col:'#fee188',value:'label-yellow',label:'事件5'},
            {col:'#d6487e',value:'label-pink',label:'事件6'},
            {col:'#3a87ad',value:'label-info',label:'事件7'}
        ],
        // 结束时间日期选择器特有方法
        endPickerOptions:{
            // 设置结束时间不能早于开始时间
            disabledDate(time){
                return time.getTime() < new Date($("#start").val());
            }
        },
        // 开始时间日期选择器特有方法
        startPickerOptions:{
            // 设置开始时间不能晚于结束时间
            disabledDate(time){
                return time.getTime() > new Date($("#end").val());
            }
        }
    },

    methods: {
        //初始化方法
        init(){
            
        },

        /**
         * 保存事件
         */
        save: function(f){   
            
            // 判断是否是拖拽等事件调用save方法，是的话给把传过来的值赋给form
            if(f.title != null){
                this.form=f;
            }; 
            // 校验任务名称不能为空
            if(this.form.title == ""){
                this.$message({
                    showClose:true,
                    message:'请输入任务名称',
                    type:'warning'
                })
                return;
            }
            // 校验任务名称长度
            if(this.form.title.length > 500){
                this.$message({
                    showClose:true,
                    message:'任务名称过长，请重新输入',
                    type:'warning'
                })
                return;
            }
            // 校验开始时间不能为空
            if(this.form.start == "" || this.form.start == undefined){
                this.$message({
                    showClose:true,
                    message:'请选择开始时间',
                    type:'warning'
                })
                return;
            }  
            // 校验结束时间不能早于开始时间
            if(this.form.end != "" || this.form.end != undefined){
                if(this.form.end<this.form.start){
                    this.$message({
                        showClose:true,
                        message:'结束时间不能早于开始时间，请重新选择',
                        type:'warning'
                    })
                    return;
                }
            }    
            // 调用保存方法
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'calendar/saveCalendar',
                data: { 
                    ID:this.form.id,
                    TITLE:this.form.title,
                    STARTTIME:this.form.start,
                    ENDTIME:this.form.end,
                    ALLDAY:this.form.allDay,
                    ZDTX:this.form.zdtx,
                    CLASSNAME:this.form.className,
                    SORT:this.form.sort=="重要紧急"?"1":this.form.sort=="重要"?"2":this.form.sort=="一般"?"3":this.form.sort,
                    URL:this.form.url,
                 },
                dataType: "json",
                success: function (data) {
                    if ("success" == data.result) {
                        // 关闭弹出框
                        vm.addFormVisible=false;
                        // 重新渲染日历
                        $('#calendar').fullCalendar('refetchEvents');
                        // $('#calendar').fullCalendar('renderEvent', vm.form, true);
                        // 清空表单
                        vm.form=vm.ysform;                      
                    } else if ("exception" == data.result) {
                        // 显示异常
                        showException('保存事件', data.exception);
                    }
                }
            });
        },
        
         /**
         * 删除日历事项
         */
        deleteCal: function(){
            this.$confirm('确认删除该日历事项？','提示',{
                confirmButtonText:'确定',
                cancelButtonText:'取消',
                type:'warning',
                cancelButtonClass: 'el-button--info', 
            }).then(() => {
                $.ajax({
                    xhrFields: {
                        withCredentials: true
                    },
                    type: "POST",
                    url: httpurl + 'calendar/deleteCalendar',
                    data: { 
                        ID:this.form.id
                    },
                    dataType: "json",
                    success: function (data) {
                        if ("success" == data.result) {
                            // 关闭弹出框
                            vm.addFormVisible=false;
                            // 重新渲染日历
                            $('#calendar').fullCalendar('refetchEvents');
                            // 清空表单
                            vm.form=vm.ysform;  
                            this.$message({
                                type:'success',
                                message:'删除成功'
                            });              
                        } else if ("exception" == data.result) {
                            //显示异常
                            showException('删除事件', data.exception);
                        }
                    }
                });
            }).catch(() => {
            })

            
        },

        // 关闭弹出框时清空form表单
        resert: function(){
            this.addFormVisible = false;
            this.form=this.ysform;
        },

        // 弹出框关闭按钮
        handleClose: function(){
            this.addFormVisible = false;
            this.form=this.ysform;
        },

        /**
         * 导出excel
         */
        goExcel: function () {
            this.$confirm('确定要导出到excel吗', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                cancelButtonClass: 'el-button--info',
            }).then(() => {
                window.location.href = httpurl + 'calendar/excel';
            }).catch(() => {
            });
        },

        // 格式化时间，把Date类型转换为yyyy-MM-dd hh:mm:ss
        dateFormate(time){
            if(time instanceof Date){
                var date = time.getFullYear() + '-' +vm.p(time.getMonth()+1) + '-' + vm.p(time.getDate()) + 
            ' ' + vm.p(time.getHours()) + ':' + vm.p(time.getMinutes()) + ':' + vm.p(time.getSeconds());
            return date;
            } else{
                return time;
            }
        },
        // 校验时间的月、日、时、分、秒是不是两位数，不是的话在前面拼接一位0
        p(s){
            return s<10?'0'+s:s
        },

    },

    mounted() {
        this.init();
    },
    
})


