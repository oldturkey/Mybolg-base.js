/*function $(id) {
    return document.getElementById(id);
    
    
    var Base ={
    getId:function(id) {
        return document.getElementById(id);
    },
    getName:function(name){
        return document.getElementsByName(name);
    },
    getTag:function(tag) {
        return document.getElementsByTagName(tag);
    }
    
}
}*/

//前台调用  1.因为直接使用this会导致用的不是Base而是dom元素，就没有了对象的方法，所以检测有this传入时，将this的值赋值给对象数组中的第一项，相当于Base.elements[0]
var $=function(_this){
    return new Base(_this);
}
//基础库 防止elements变成公有内容，因此在构造函数内部上添加属性而不是放在原型上成为共有属性。
function Base (_this) {
    this.elements=[];
    if(_this!=undefined){
        this.elements[0]=_this;
    };  //_this和undefined都是对象，和typeof 返回的undefined不同，后者返回的是一个值
}


//创建一个数组，来保存获取的节点和节点数组
    //Base.prototype.elements=[];
    
    


//获取ID节点
Base.prototype.getId= function(id){
        this.elements.push(document.getElementById(id));
        return this;
    };   
    //获取元素节点
Base.prototype.getTagName=function(tag){
        var tags=document.getElementsByTagName(tag);
        for(var i=0;i<tags.length;i++){
            this.elements.push(tags[i]);
        }
        return this;
    };


//获取class节点数组  有父级元素的时候，把elements传给node来控制区域
Base.prototype.getClass=function(className,parent){
     var node=null;
     if(arguments.length==2){
         node=document.getElementById(parent);
     }
     else{
         node=document;
     }
     var all=node.getElementsByTagName('*');
     for(var i=0;i<all.length;i++){
         if(all[i].className==className){
             this.elements.push(all[i]);
         }
     }
     return this;
 }
 
 
 //获取某一个节点
Base.prototype.getElement = function(num) {
     var element =this.elements[num];
     this.elements=[];
     this.elements[0]=element;
     return this;
 }
 
//设置css
Base.prototype.css=function(attr,value){
    for(var i=0;i<this.elements.length;i++){
        if(arguments.length==1){
           return getStyle(this.elements[i],attr);
           }
              
        this.elements[i].style[attr]=value;
    }
    return this;
}



//添加Class  用正则判断是否传入了已经拥有的class，这个class可能出现在开头，结尾或者两边都是空格的中间
Base.prototype.addClass=function(className){
    for(var i=0;i<this.elements.length;i++){
        if(!hasClass(this.elements[i],className)){
           this.elements[i].className+=' '+className;
           }  
    }
    return this;
}

//移除class
Base.prototype.removeClass=function(className){
    for(var i=0;i<this.elements.length;i++){
        if(hasClass(this.elements[i],className)){
            this.elements[i].className=this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),'');
           }  
    }
        return this;
}

//添加link或style里的style规则
Base.prototype.addRule = function(num,selectorText,cssText,postion) {
    var sheet=document.styleSheets[num];
    insertRule(sheet,selectorText,cssText,postion);
    return this;
}



//移除link或style的css规则
Base.prototype.removeRule =function(num,index) {
    var sheet=document.styleSheets[num];
    if(typeof sheet.deleteRule!='undefined'){
        sheet.deleteRule(index);
    }else if(typeof sheet.removeRule){
        sheet.removeRule(index);
    }
    return this;
}


//设置html
Base.prototype.html=function(str){
    for(var i=0;i<this.elements.length;i++){
        if(arguments.length==0){
            return this.elements[i].innerHTML;
        }
        this.elements[i].innerHTML=str;
    }
    return this;
}


//设置鼠标移入移出事件 注意，把事件加到元素上只是对目标元素生效，如果离开目标元素就会触发事件，所以如果是显示新的区块，希望移到显示出来的元素上的时候也能维持事件就要把新的元素包含在目标元素中。例如下拉菜单，要把ul列表放在div内
Base.prototype.hover=function(over,out){
    for(var i=0;i<this.elements.length;i++){
        //this.elements[i].onmouseover=over;
        //this.elements[i].onmouseout=out;改成现代事件绑定
        addEvent(this.elements[i],'mouseover',over);
        addEvent(this.elements[i],'mouseout',out);
    }
    return this;
}

//设置显示
Base.prototype.show=function(){
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].style.display="block";
    }
    return this;
}


//设置隐藏
Base.prototype.hide=function(){
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].style.display="none";
    }
    return this;
}


//锁屏功能
Base.prototype.lock=function(){
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].style.width=getInner().width+'px';
        this.elements[i].style.height=getInner().height+'px';
        this.elements[i].style.display="block";
        document.documentElement.style.overflow="hidden";
       /* 解决不了火狐浏览器锁屏的时候还是可以下拉的问题
        addEvent(this.elements[i],'mousedown',function(e){
            e.preventDefault();
            addEvent(document,'mousemove',function(e){
               e.preventDefault(); 
            });
        });
        */
        addEvent(window,'scroll',scrollTop);
        }
    return this;
};


//解锁功能
Base.prototype.unlock=function(){
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].style.display="none";
        document.documentElement.style.overflow="auto";
        removeEvent(window,'scroll',scrollTop);
        }
    return this;
}


//设置点击事件
Base.prototype.click = function (fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].onclick = fn;
	}
	return this;
}


//设置物体居中
Base.prototype.center=function(width,height){
    var top=(getInner().height-width)/2;
    var left=(getInner().width-height)/2;
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].style.top=top+'px';
        this.elements[i].style.left=left+'px';
    }
    return this;
}
//获取屏幕变化信息
Base.prototype.resize=function(fn){
     for (var i = 0; i < this.elements.length; i ++) {
         var element=this.elements[i];
        /* 改为现代事件绑定
        window.onresize=function(){
             fn();
             if(element.offsetLeft>getInner().width-element.offsetWidth){
                 element.style.left=getInner().width-element.offsetWidth+'px';
             }
             if(element.offsetLeft<0){
                 element.style.left=0;
             }
             if(element.offsetTop>getInner().height-element.offsetHeight){
                 element.style.top=getInner().height-element.offsetHeight+'px';
             }
             if(element.offsetTop<0){
                 element.style.top=0;
             }
         };
         */
         addEvent(window,'resize',function(){
             fn();
             if(element.offsetLeft>getInner().width-element.offsetWidth){
                 element.style.left=getInner().width-element.offsetWidth+'px';
             }
             if(element.offsetLeft<0){
                 element.style.left=0;
             }
             if(element.offsetTop>getInner().height-element.offsetHeight){
                 element.style.top=getInner().height-element.offsetHeight+'px';
             }
             if(element.offsetTop<0){
                 element.style.top=0;
             }
         });
         }
    return this;
    
}


//拖拽功能
 Base.prototype.drag=function(){
    for (var i = 0; i < this.elements.length; i ++) {
         addEvent(this.elements[i],'mousedown',function(e){
             //判断div是否为空来决定是否组织默认行为来解决空div的bug
        if(trim(this.innerHTML).length==0)e.preventDefault();
             
        //把这里的this: oDiv 赋值给_this，这样后面就可以直接调用
        var _this=this;
        var diffX=e.clientX- _this.offsetLeft;
        var diffY=e.clientY- _this.offsetTop;
           //仅鼠标放在H2头部的时候才能拖动  
         if(e.target.tagName=='H2'){
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
}

 function scrollTop(){
     document.documentElement.scrollTop=0;
            document.body.scrollTop=0;
}
