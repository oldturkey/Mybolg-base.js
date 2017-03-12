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
var $=function(args){
    return new Base(args);
}
//基础库 防止elements变成公有内容，因此在构造函数内部上添加属性而不是放在原型上成为共有属性。
function Base (args) {
    this.elements=[];
    
    if(typeof args=='string'){
        //css模拟 通过是否有空格进行判断
        if(args.indexOf(' ')!=-1){   //如果空格不为-1表示有空格，在其他位置上
            var elements=args.split(' ');//把节点拆分开来保存到数组里去
            var childElements=[];  //存放临时节点对象的数组，解决被覆盖的问题
            var node=[];    //用于存放父节点
            for(var i=0;i<elements.length;i++){ 
                if(node.length==0)node.push(document);//没有父节点时父节点时document
              switch(elements[i].charAt(0)){
            case'#':
                childElements=[];  //清理掉临时节点，让父节点失效，子节点生效
                childElements.push(this.getId(elements[i].substring(1))); 
                node=childElements; //保存父节点，因为childElements需要清理，仅子节点生效
                break;
            case'.':
                childElements=[];
                      for(var j=0;j<node.length;j++){  //循环可能存在的多个父节点元素
                       var temps =  this.getClass(elements[i].substring(1),node[j]);
                          for(var k=0;k<temps.length;k++){
                            childElements.push(temps[k]); 
                          }
                      }
                        node=childElements;
                break;
            default://因为传入的元素节点没有前后缀
                      childElements=[];
                      for(var j=0;j<node.length;j++){  //循环可能存在的多个父节点元素
                       var temps =  this.getTagName(elements[i],node[j]);
                          for(var k=0;k<temps.length;k++){
                            childElements.push(temps[k]); 
                          }
                      }
                        node=childElements;
                    }  
                }
            this.elements=childElements;
        }else{
        
        //find模拟
        switch(args.charAt(0)){
            case'#':
              this.elements.push(this.getId(args.substring(1)));  
                break;
            case'.':
                this.elements=this.getClass(args.substring(1));
                break;
            default://因为传入的元素节点没有前后缀
                this.elements=this.getTagName(args);
        }
    }
        //通过测试，如果args是object的话，args就是传递了this对象
    }else if(typeof args=='object'){
        if(args!=undefined){
            this.elements[0]=args;
        }  //_this和undefined都是对象，和typeof 返回的undefined不同，后者返回的是一个值
    }else if(typeof args=='function'){
        this.ready(args);
    }
}

//addDomLoaded方法，DOM加载 备用方法
Base.prototype.ready=function(fn){
    addDomLoaded(fn);
}

//创建一个数组，来保存获取的节点和节点数组
    //Base.prototype.elements=[];
    

//获取ID节点
Base.prototype.getId= function(id){
        //this.elements.push(document.getElementById(id)); getId方法不止会用在Base上，如果只是返回到elements数组中，用途太短
        //return this; 因为基础库里只会调用该方法，会直接返回值给Base对象了，所以不需要这段话了
    return document.getElementById(id);
    };   
    //获取元素节点
Base.prototype.getTagName=function(tag,parentNode){
       var node=null;
    //同样的使用临时数组储存元素
    var temps=[];
     if(parentNode!=undefined){
         node=parentNode;
     }
     else{
         node=document;
     }
     var tags=node.getElementsByTagName(tag);
     for(var i=0;i<tags.length;i++){ 
             temps.push(tags[i]);
     }
    return temps;
         //return this; 因为基础库里只会调用该方法，会直接返回值给Base对象了，所以不需要这段话了
    };


//获取class节点数组  有父级元素的时候，把elements传给node来控制区域
Base.prototype.getClass=function(className,parentNode){
     var node=null;
    //同样的使用临时数组储存元素
    var temps=[];
     if(parentNode!=undefined){
         node=parentNode;
     }
     else{
         node=document;
     }
     var all=node.getElementsByTagName('*');
     for(var i=0;i<all.length;i++){
         if(all[i].className==className){
             temps.push(all[i]);
         }
     }
    return temps;
      //return this; 因为基础库里只会调用该方法，会直接返回值给Base对象了，所以不需要这段话了
 };
 
 //设置css节点
Base.prototype.find =function(str){
    //建立一个临时数组，用于存放第二次循环得到的数据
    var childElements=[];
    for(var i=0;i<this.elements.length;i++){
         switch(str.charAt(0)){
            case'#':
               childElements.push(this.getId(str.substring(1)));
                break;
            case'.':
               /*var all=this.elements[i].getElementsByTagName('*');
                for(var j=0;j<all.length;j++){
                    if(all[j].className==str.substring(1)){
                            childElements.push(all[j]);
                               }
     }*/
                 var temps=this.getClass(str.substring(1),this.elements[i]);//传的是classname和父节点，返回的还是elements但是数组元素换成了子元素
                 //直接赋值第二次循环会覆盖掉第一次的结果
                 for(var j=0;j<temps.length;j++){
                     childElements.push(temps[j]);
                 }           
                break;
            default://因为传入的元素节点没有前后缀
              var tags=this.getTagName(str,this.elements[i]);
                 //注意两次循环不能都是用i来作为循环的常量，要换一个参数,否则就没办法循环两次了
                for(var j=0;j<tags.length;j++){
                    childElements.push(tags[j]);
                }
            }
        }
    //把存放第二次查找到的各项的临时数组交给Base的elements数组
    this.elements=childElements;
    return this;
}    



//获取某一个节点 并且返回这个节点对象
Base.prototype.ge=function(num){
    return this.elements[num];
};


 //获取某一个节点，并且返回Base
Base.prototype.eq = function(num) {
     var element =this.elements[num];
     this.elements=[];
     this.elements[0]=element;
     return this;
 };
 

//获取首个节点，并返回该节点
Base.prototype.first=function(){
    return this.elements[0];
}

//获取最后一个节点，并返回该节点对象
Base.prototype.last=function(){
    return this.elements[this.elements.length-1];
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
};



//添加Class  用正则判断是否传入了已经拥有的class，这个class可能出现在开头，结尾或者两边都是空格的中间
Base.prototype.addClass=function(className){
    for(var i=0;i<this.elements.length;i++){
        if(!hasClass(this.elements[i],className)){
           this.elements[i].className+=' '+className;
           }  
    }
    return this;
};

//移除class
Base.prototype.removeClass=function(className){
    for(var i=0;i<this.elements.length;i++){
        if(hasClass(this.elements[i],className)){
            this.elements[i].className=this.elements[i].className.replace(new RegExp('(\\s|^)'+className+'(\\s|$)'),'');
           }  
    }
        return this;
};

//添加link或style里的style规则
Base.prototype.addRule = function(num,selectorText,cssText,postion) {
    var sheet=document.styleSheets[num];
    insertRule(sheet,selectorText,cssText,postion);
    return this;
};



//移除link或style的css规则
Base.prototype.removeRule =function(num,index) {
    var sheet=document.styleSheets[num];
    if(typeof sheet.deleteRule!='undefined'){
        sheet.deleteRule(index);
    }else if(typeof sheet.removeRule){
        sheet.removeRule(index);
    }
    return this;
};


//设置html
Base.prototype.html=function(str){
    for(var i=0;i<this.elements.length;i++){
        if(arguments.length==0){
            return this.elements[i].innerHTML;
        }
        this.elements[i].innerHTML=str;
    }
    return this;
};


//设置鼠标移入移出事件 注意，把事件加到元素上只是对目标元素生效，如果离开目标元素就会触发事件，所以如果是显示新的区块，希望移到显示出来的元素上的时候也能维持事件就要把新的元素包含在目标元素中。例如下拉菜单，要把ul列表放在div内
Base.prototype.hover=function(over,out){
    for(var i=0;i<this.elements.length;i++){
        //this.elements[i].onmouseover=over;
        //this.elements[i].onmouseout=out;改成现代事件绑定
        addEvent(this.elements[i],'mouseover',over);
        addEvent(this.elements[i],'mouseout',out);
    }
    return this;
};

//设置显示
Base.prototype.show=function(){
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].style.display="block";
    }
    return this;
};


//设置隐藏
Base.prototype.hide=function(){
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].style.display="none";
    }
    return this;
};


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
};


//设置点击事件
Base.prototype.click = function (fn) {
	for (var i = 0; i < this.elements.length; i ++) {
		this.elements[i].onclick = fn;
	}
	return this;
};


//设置物体居中
Base.prototype.center=function(width,height){
    var top=(getInner().height-width)/2;
    var left=(getInner().width-height)/2;
    for(var i=0;i<this.elements.length;i++){
        this.elements[i].style.top=top+'px';
        this.elements[i].style.left=left+'px';
    }
    return this;
};

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
    
};


/*拖拽功能 转为插件，在需要的时候引入
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
}   */


//设置动画
Base.prototype.animate = function (obj) {
	for (var i = 0; i < this.elements.length; i ++) {
		var element = this.elements[i];
		var attr = obj['attr'] == 'x' ? 'left' : obj['attr'] == 'y' ? 'top' : 
					   obj['attr'] == 'w' ? 'width' : obj['attr'] == 'h' ? 'height' : 
					   obj['attr'] == 'o' ? 'opacity' :'left';

		
		var start = obj['start'] != undefined ? obj['start'] : 
						attr == 'opacity' ? parseFloat(getStyle(element, attr)) * 100 : 
												   parseInt(getStyle(element, attr));
		
		var t = obj['t'] != undefined ? obj['t'] : 10;												//可选，默认10毫秒执行一次
		var step = obj['step'] != undefined ? obj['step'] : 20;								//可选，每次运行10像素
		
		var alter = obj['alter'];
		var target = obj['target'];
        //mul用来执行同步动画，只接受attr和target的键值对，来让多个属性同时变化
		var mul=obj['mul'];
		
		var speed = obj['speed'] != undefined ? obj['speed'] : 6;							//可选，默认缓冲速度为6
		var type = obj['type'] == 0 ? 'constant' : obj['type'] == 1 ? 'buffer' : 'buffer';		//可选，0表示匀速，1表示缓冲，默认缓冲
		
		
		if (alter != undefined && target == undefined) {
			target = alter + start;
		} else if (alter == undefined && target == undefined&&mul==undefined) {
			throw new Error('alter增量或target目标量必须传一个！');
		}
		
		
		
		if (start > target) step = -step;
		
		if (attr == 'opacity') {
			element.style.opacity = parseInt(start) / 100;
			element.style.filter = 'alpha(opacity=' + parseInt(start) +')';
		} else {
			element.style[attr] = start + 'px';
		}
		
        //没有传入mul的时候，创造一个mul数组，并且把传入的attr和target变成键值对
        if(mul==undefined){
                mul={};
                mul[attr]=target;
            }
		//将定时器绑定在事件对象上，这样不同物体运动就不会互相干扰了
		clearInterval(element.timer);
		element.timer = setInterval(function () {
		/*
            问题1：多个同步动画执行的时候，如果要执行队列动画，就会造成多次执行队列动画：解决=不管同步多少次，都执行一次队列
            问题2：多个动画数值差别大的时候，导致定时器提前清理，部分动画达不到目标值：解决=最后一个对话执行完毕后清理定时器
            */
            //创建一个布尔值，来了解多个动画是否全都执行完毕
            var flag=true;
            
			if (type == 'buffer') {
				step = attr == 'opacity' ? (target - parseFloat(getStyle(element, attr)) * 100) / speed :
													 (target - parseInt(getStyle(element, attr))) / speed;
				step = step > 0 ? Math.ceil(step) : Math.floor(step);
			}
			//循环mul里的所有属性键值对
			for(i in mul){
                attr=i=='x'?'left':i=='y'?'top':i=='w'?'width':i=='h'?'height':i=='o'?'opacity':i!=undefined?i:'left';
                target=mul[i];
            
			if (attr == 'opacity') {
				if (step == 0) {
					setOpacity();
				} else if (step > 0 && Math.abs(parseFloat(getStyle(element, attr)) * 100 - target) <= step) {
					setOpacity();
				} else if (step < 0 && (parseFloat(getStyle(element, attr)) * 100 - target) <= Math.abs(step)) {
					setOpacity();
				} else {
					var temp = parseFloat(getStyle(element, attr)) * 100;
					element.style.opacity = parseInt(temp + step) / 100;
					element.style.filter = 'alpha(opacity=' + parseInt(temp + step) + ')';
				}
                if(parseInt(target)!=parseInt(parseFloat(getStyle(element,attr))*100))flag=false;
			} else {
				if (step == 0) {
					setTarget();
				} else if (step > 0 && Math.abs(parseInt(getStyle(element, attr)) - target) <= step) {
					setTarget();
				} else if (step < 0 && (parseInt(getStyle(element, attr)) - target) <= Math.abs(step)) {
					setTarget();
				} else {
					element.style[attr] = parseInt(getStyle(element, attr)) + step + 'px';
				}
                if(parseInt(target)!=parseInt(getStyle(element, attr)))flag=false;
			}
            }   
            if(flag){
                clearInterval(element.timer);
            if(obj.fn!=undefined)obj.fn();//检测是否传入了fn，传入了就可以做异步动画
		      }
            
			//document.getElementById('aaa').innerHTML += step + '<br />';
		}, t);
		
		function setTarget() {
			element.style[attr] = target + 'px';
        }	
		
		function setOpacity() {
			element.style.opacity = parseInt(target) / 100;
			element.style.filter = 'alpha(opacity=' + parseInt(target) + ')';
			
		}
	}
	return this;
};


//插件引入入口
 Base.prototype.extend=function(name,fn){
     Base.prototype[name]=fn;
 };