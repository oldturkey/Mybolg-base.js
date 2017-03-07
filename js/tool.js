//因为项目多次需要用到兼容浏览器的问题，为了避免重复书写冗余代码，所以对兼容问题进行封装

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


//获取event对象
function getEvent(event){
    return event||window.event;
}


//取消/阻止默认行为
function preDef(event){
    var e=getEvent(event);
    if(typeof e.preventDefault!='undefined'){//W3C
        e.preventDefault();
    }else{                      //IE
        e.returnValue=false;
    }
}




