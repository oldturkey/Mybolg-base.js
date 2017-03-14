//年月日
var year=$('form').form('year');
var mouth=$('form').form('mouth');
var day=$('form').form('day');

var day30=[4,6,9,11];
var day31=[1,3,5,7,8,10,12];
//注入年
for(var i=1950;i<2017;i++){
    year.first().add(new Option(i,i),undefined);
}
//注入月
for(var i=1;i<12;i++){
    mouth.first().add(new Option(i,i),undefined);
}

//inArray(day31,1);
 year.bind('change',select_day);

 mouth.bind('change',select_day);
            
            
function select_day(){
   if(year.value()!=0&&mouth.value()!=0){
         //注入之前清空
         day.first().options.length=1;
         var cur_day=0;
         //注入日
         if(inArray(day31,parseInt(mouth.value()))){
             cur_day=31;
         }else if(inArray(day30,parseInt(mouth.value()))){
             cur_day=30;
         }else {
             if((parseInt(year.value())%4==0&&parseInt(year.value())%100!=0)||parseInt(year.value())%400==0){
                 cur_day=29;
             }
             else{
                 cur_day=28;
         }
         }
         for(var i=1;i<=cur_day;i++){
             day.first().add(new Option(i,i),undefined);
         }
         
     }else{
         //输入后取消年也会清空日的注入
         day.first().options.length=1;
     } 
}