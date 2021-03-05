
try { ace.settings.check('main-container', 'fixed') } catch (e) { }
if ('ontouchstart' in document.documentElement) document.write("<script src='../../../assets/js/jquery.mobile.custom.min.js'>" + "<" + "/script>");

var eventData;
jQuery(function ($) {

    $('#external-events div.external-event').each(function () {
        var eventObject = {
            // use the element's text as the event title
            title: $.trim($(this).text()) 
        };

        // store the Event Object in the DOM element so we can get to it later
        $(this).data('eventObject', eventObject);

        // make the event draggable using jQuery UI
        $(this).draggable({
            // will cause the event to go back to its
            zIndex: 999,
            revert: true, 
             //  original position after the drag     
            revertDuration: 0 
        });

    });

    /* initialize the calendar
    -----------------------------------------------------------------*/

    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
   
    var calendar = $('#calendar').fullCalendar({
        // 把日历组件的各个控件转化成中文格式
        buttonText: {
            today:'今天',
            month:'月视图',
            week:'周视图',
            day:'日视图',
            prev: '<i class="ace-icon fa fa-chevron-left"></i>',
            next: '<i class="ace-icon fa fa-chevron-right"></i>'
        },
        allDayText:'全天',
        timeFormate:{
            '':'H:mm{-H:mm}'
        },
        weekMode:'variable',
        columnFormat:{
            month:'dddd',
            week:'dddd M-d',
            day:'dddd M-d'
        },
        titleFormat:{
            month:'yyyy年 MM月',
            week:"[yyyy年] MM月d日 { '&#8212;' [yyyy年] MM月d日}",
            day:'yyyy年 MM月d日 dddd'
        },
        monthNames:["1","2","3","4","5","6","7","8","9","10","11","12"],
        dayNames:["星期天","星期一","星期二","星期三","星期四","星期五","星期六"],      
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
         local:'zh-cn',
         // 日历事件
         events:function(start,end,callback){
            // 查询日历事件
            $.ajax({
                xhrFields: {
                    withCredentials: true
                },
                type: "POST",
                url: httpurl + 'calendar/list',
                dataType: "json",
                success: function (data) {
                    var events = [];
                    $(data.list).each(function(){
                        events.push({
                            id:$(this).attr('ID'),
                            title:$(this).attr('TITLE'),
                            start:$(this).attr('STARTTIME'),
                            end:$(this).attr('ENDTIME'),
                            className:$(this).attr('CLASSNAME'),
                            allDay:$(this).attr('ALLDAY')=='1'? true : false,
                            color:$(this).attr('COLOR'),
                            sort:$(this).attr('SORT'),
                            zdtx:$(this).attr('ZDTX'),
                            url:$(this).attr('URL')
                        })
                    });
                    callback(events);     
                }
            });
         },        
         
        // 限制显示在一天的事件数
        eventLimit:true,  
        // 是否允许拖拽
        editable: true,  
        // 是否允许右侧事件拖拽 
        droppable: true, 

        // 日程事件拖拽
         eventResize: function(event,delta,revertFunc){
             // 格式化拖拽开始时间和结束时间
             event.start=vm.dateFormate(event.start);
             event.end=event.end!=null?vm.dateFormate(event.end):event.start;
             event.allDay=event.allDay==false?0:1;
             // 调用保存方法
             vm.save(event);
         },

         // 日程事件移动
         eventDrop:function(event,delta,revertFunc){
            // 格式化拖拽开始时间和结束时间
            event.start=vm.dateFormate(event.start);
            event.end=event.end!=null?vm.dateFormate(event.end):event.start;
            event.allDay=event.allDay==false?0:1;
            // 调用保存方法
            vm.save(event);
         },

        // 右侧事件拖动
        drop: function (date, allDay) { 

            // 赋值事件和className
            var originalEventObject = $(this).data('eventObject');
            var $extraEventClass = $(this).attr('data-class');
            
            // 赋值拖动的事件
            var copiedEventObject = $.extend({}, originalEventObject);

            // 赋值时间和是否全天
            copiedEventObject.start = vm.dateFormate(date);
            copiedEventObject.allDay = allDay == true?'1':'0';
            if ($extraEventClass) copiedEventObject.className= $extraEventClass;

            // 调用保存方法
            vm.save(copiedEventObject);

            // 如果选中拖动后删除事件
            if ($('#drop-remove').is(':checked')) {
                $(this).remove();
            }

        },
        selectable: true,
        selectHelper: true,
        // 单击空白处日历方法
        select: function (start, end, allDay) {
            vm.addFormVisible = true;
            var starttime = vm.dateFormate(start);
            var endtime = end!=null?vm.dateFormate(end):starttime;
            vm.form.start = starttime;
            vm.form.end = endtime;
            // vm.goAdd();
            calendar.fullCalendar('unselect');
        },


        // 事件单击方法
        eventClick: function (calEvent, jsEvent, view) {
            calEvent.start = vm.dateFormate(calEvent.start);
            // calEvent.end = calEvent.end!=null? vm.dateFormate(calEvent.end):calEvent.start;
            calEvent.end = calEvent.end!=null? vm.dateFormate(calEvent.end):calEvent.end;
            var sort = calEvent.allDay =='1'?"重要紧急":calEvent.allDay =='2'?"重要":"一般";
            calEvent.sort = sort;
            var allDay = calEvent.allDay == true? "1":"0";
            calEvent.allDay = allDay;
            vm.form = calEvent;
            vm.addFormVisible = true;

        },

    });
});
