/*window.onload=function() {
    alert(document.getElementById('box').innerHTML);
    alert(document.getElementsByName("sex")[0].value);
    alert(document.getElementsByTagName('p')[0].innerHTML);
    
    
   2---- Base.getId('box').css('color','red').css('backgroundColor','black').html('pox').click(function(){
        alert('a');
    });
    Base是一个基础库的核心对象
    Base.getId()返回的是一个divElement元素，这个对象是没有css方法的，将返回的对象改为Base即可，返回Base对象
    所有方法返回的都返回Base对象，就可以一直继续操作。
    
    在Base对象中添加css方法，html方法，click方法
    
    
    
}*/
window.onload = function () {
	//个人中心的下拉菜单
	$().getClass('member').hover(function () {
		//$().getClass('member').css('background', 'url(images/arrow2.png) no-repeat 55px center');
		//this.css('color', 'red');
		$(this).css('background', 'url(images/arrow2.png) no-repeat 55px center');
		$().getClass('member_ul').show();
	}, function () {
		//$().getClass('member').css('background', 'url(images/arrow.png) no-repeat 55px center');
		$(this).css('background', 'url(images/arrow.png) no-repeat 55px center');
		$().getClass('member_ul').hide();
	});
     //登陆框  
        /*var top=(document.documentElement.clientHeight-250)/2;
        var left=(document.documentElement.clientWidth-350)/2;
        $().getId('login').css('top',top+'px').css('left',left+'px');
    
    window.onresize=function() {
            var top=(document.documentElement.clientHeight-250)/2;
            var left=(document.documentElement.clientWidth-350)/2;
            $().getId('login').css('top',top+'px').css('left',left+'px');
    }*/
    var login=$().getId('login');
    var screen=$().getId('screen');
    login.center(250,350);
    $().resize(function(){
        login.center(250,350);
        if(login.css('display')=='block'){
            screen.lock();
            };
    });
    $().getClass('login').click(function(){
        login.center(250,350);
        login.css('display','block');
        screen.lock();
    })
    $().getClass('close').click(function(){
        login.css('display','none');
        screen.unlock();
    });
    
    
    
    // 拖拽  让某个物体抬起时点击具体元素即可，move和up是全剧作用域。
    /* 方法步骤var oDiv=document.getElementById('login');
    oDiv.onmousedown=function(e){
        var e=getEvent(e);
        //把这里的this: oDiv 赋值给_this，这样后面就可以直接调用
        var _this=this;
        var diffX=e.clientX-_this.offsetLeft;
        var diffY=e.clientY-_this.offsetTop;
        document.onmousemove=function(e){
             var e=getEvent(e);
            _this.style.left=e.clientX-diffX+'px';
            _this.style.top=e.clientY-diffY+'px';
        }
        document.onmouseup=function(){
            this.onmousemove=null;
            this.onmouseup=null;
        }
    }*/
    //login已经在上面赋值过了
    login.drag();
};








