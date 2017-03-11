//拖拽插件
$().extend('drag',function(){
    var tags=arguments;
    for (var i = 0; i < this.elements.length; i ++) {
         addEvent(this.elements[i],'mousedown',function(e){
             //判断div是否为空来决定是否组织默认行为来解决空div的bug
        if(trim(this.innerHTML).length==0)e.preventDefault();
             
        //把这里的this: oDiv 赋值给_this，这样后面就可以直接调用
        var _this=this;
        var diffX=e.clientX- _this.offsetLeft;
        var diffY=e.clientY- _this.offsetTop;
             
         //自定义拖拽区域 用flag来判断是否执行后续事件
             var flag = false;
             for(var i=0;i<tags.length;i++){
                 if(e.target==tags[i]){
                     flag=true;    //只要事件目标有一个符合，就立刻返回true
                        break;
                 }
             }
             
             
           //仅鼠标放在H2头部的时候才能拖动  
             //if(e.target.tagName=='H2'||e.target.tagName=='SPAN')判断事件对象
         if(flag){
            addEvent(document,'mousemove',move);
            addEvent(document,'mouseup',up);
         } else{
             removeEvent(document,'mousemove',move);
            removeEvent(document,'mouseup',up);
         }  
             
        //document.onmousemove=function(e){
            
        //因为mouseup执行的函数无法读取到上面的匿名函数，所以将执行的函数分离出来进行操作
        function move(e){
            var h=e.clientX-diffX;
            var v=e.clientY-diffY;
            if(h<0){
                   h=0;
               }else if(h>document.documentElement.clientWidth - _this.offsetWidth){
                   h=document.documentElement.clientWidth - _this.offsetWidth;
               };
             if(v<0){
                 v=0;
             }else if(v>document.documentElement.clientHeight - _this.offsetHeight){
                 v=document.documentElement.clientHeight - _this.offsetHeight;
             }      
            _this.style.left=h+'px';
            _this.style.top=v+'px';
               //解决ie浏览器鼠标移出可视范围后停止捕获事件的bug
        if(typeof _this.setCapture !='undefined'){
            _this.setCapture();
        }
        }
             function up(){
                    removeEvent(document,'mousemove',move);
                    removeEvent(document,'mouseup',up);
                    if(typeof releaseCapture!='undefined'){
                        _this.releaseCapture();
                            }
                        }
        
            });
        }
	return this;
});