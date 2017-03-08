//因为项目多次需要用到兼容浏览器的问题，为了避免重复书写冗余代码，所以对兼容问题进行封装


//跨浏览器添加事件绑定
// JS一切基于对象的思路创建，看得更加清晰，为每个事件分配一个计数器实现累加
addEvent.ID=1;
function addEvent(obj,type,fn) {
    if(typeof obj.addEventListener!='undefined'){
        obj.addEventListener(type,fn,false);
    }
    else {
        //创建一个存放事件的哈希表（散列表）,一切基于对象的思路，通过obj作为中介，再remove的时候可以找到
        //为了避免每次绑定事件都穿件一次events，所以检测判断，让第一次进入时才执行
        if(!obj.events)obj.events={};
        if(!obj.events[type]){
            //创建一个存放事件处理函数的数组
            obj.events[type]=[];
            //把第一次的事件处理程序先储存到第一个位置上
            if(obj['on'+type])obj.events[type][0]=fn;
        }else{
            //同一个注册函数进行屏蔽，不添加到计数器
            if(addEvent.equeal(obj.events[type],fn))return false;
        }
        //从第二次开始，我们使用之前创建的事件计数器来储存 addEvent.ID
        obj.events[type][addEvent.ID++]=fn;
        //执行事件处理函数 下面会分离出去
        obj['on'+type]=addEvent.exec;
      /*   为了解决id浏览器事件绑定执行的随机性和无法无法删除冒充对象造成的fn混淆，因此放弃attach方法，采用传统的添加事件的方法来进行封装，解决IE的问题
      (typeof obj.attachEvent!='undefined'){  //IE
        //attachEvent本身带有event，所以传入event对象就不需要标准化event对象
        obj.attachEvent('on'+type,function(){
            fn.call(obj,window.event);//传入第二个参数，标准化event
        });
        fn.call(123,456) 使用call方法冒充对象，传入的代码为 function fn(){alert this.value}
        所以可以用对象冒充的方法解决IE浏览器this对象指向window的兼容问题，call的第一个参数为this
        但是使用对象冒充的话，在移出事件的时候，查找不到这个fn，所以就没办法移出，并且无法标准化event
        */
    }
}

//执行事件处理函数  用时间对象e来获取事件类型type的值
addEvent.exec=function(event){
   //遍历执行所有events[type]里存储的事件处理函数
    e=event||addEvent.fixEvent(window.event);
    var es=this.events[e.type];
    for(i in es){
        es[i].call(this,e);    //使用冒充对象，让IE下this不会指向window，传入第二个参数e，可以打印时                          间对象的属性
    }
    
};

//同一个注册函数屏蔽
addEvent.equeal=function(es,fn){
    for(var i in es){
        if(es[i]==fn){
            return true;
        }else{
            return false;
        }
    }
}

//把IE常用的Event对象配对到W3C中去  增加配对模式把IE没有的preventDefault和stopPropagation方法赋予IE浏览器兼容IE浏览器的问题
addEvent.fixEvent=function(event){
        event.preventDefault=addEvent.fixEvent.preventDefault;
        event.stopPropagation=addEvent.fixEvent.stopPropagation;
        event.target=event.srcElement;
    return event;
}

//IE阻止默认行为
addEvent.fixEvent.preventDefault=function(){
    this.returnValue=false;
}

//IE取消事件冒泡
addEvent.fixEvent.stopPropagation=function(){
    this.cancelBubble=true;
}
//跨浏览器删除事件 IE下也使用一般方法进行查询遍历
function removeEvent(obj,type,fn){
    if(typeof removeEventListener!='undefined'){
        obj.removeEventListener(type,fn,false);
    }
    else{
        //判断有events的情况下才可以移除
        if(obj.events){
        for(var i in obj.events[type]){
            if(obj.events[type][i]==fn){
                delete obj.events[type][i];
            }
        }
    }
}
}


//兼容不同浏览器获取视口的大小
function getInner(){
    if(typeof window.innerWidth!='undefined'){
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }else {
        return {
            width: document.documentElement.clientWidth,
            height:document.documentElement.clientHeight
        }
    }
}


//跨浏览器获得style
function getStyle(element,attr){
    if(typeof window.getComputedStyle!='undefined'){
               return window.getComputedStyle(element,null)[attr];
           }else if(typeof element.currentStyle!='undefined'){
               return element.currentStyle[attr];
}
}

//判断class是否存在
function hasClass(element,className){
    return element.className.match(new RegExp('(\\s|^)'+className+'(\\s|$)'));
}

//跨浏览器添加link规则  
function insertRule(sheet,selectorText,cssText,postion){
    if(typeof sheet.insertRule!='undefined'){//W3C
        //sheet.insertRule('body{background:red}',0);
        sheet.insertRule(selectorText+'{'+cssText+'}',postion);
    }else if(typeof sheet.addRule!='underfined'){//IE
        //sheet.addRule('body','background:red',0);
        sheet.addRule(selectorText,cssText,postion);
}
}


/*
//获取Event对象 已经使用配对模式将IE的event对象和方法进行了配对
function getEvent(event) {
	return event || window.event;
}

//阻止默认行为
function preDef(event) {
	var e = getEvent(event);
	if (typeof e.preventDefault != 'undefined') {//W3C
		e.preventDefault();
	} else {//IE
		e.returnValue = false;
	}
}
*/

//删除左右空格
 function trim(str){
     return str.replace(/(^\s*)|(\s*$)/g,'');
 }
