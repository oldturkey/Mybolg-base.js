



$(function(){
    //个人中心的下拉菜单
   $('#header .member').hover(function () {
		//$().getClass('member').css('background', 'url(images/arrow2.png) no-repeat 55px center');
		//this.css('color', 'red');
		$(this).css('background', 'url(images/arrow2.png) no-repeat 55px center');
		$('#header .member_ul').show().animate({
            attr:'o',
            target:100,
            t:30,
            step:10
        });
	}, function () {
		//$().getClass('member').css('background', 'url(images/arrow.png) no-repeat 55px center');
		$(this).css('background', 'url(images/arrow.png) no-repeat 55px center');
		$('#header .member_ul').animate({
            attr:'o',
            start:100,
            target:0,
            t:30,
            step:10,
            fn:function(){
                $('#header .member_ul').hide();
            }
        });
	});
    
    //登陆框
    var login=$('#login');
    var screen=$('#screen');
    login.center(250,350);
    $().resize(function(){
        login.center(250,350);
        if(login.css('display')=='block'){
            screen.lock();
            };
    });
    $('#header .login').click(function(){
        login.center(250,350).css('display','block');
        screen.lock().animate({
            attr:'o',
            target:30,
            t:30,
            step:10
        });
    })
    $('#login .close').click(function(){
        login.css('display','none');
        screen.unlock().animate({
            attr:'o',
            target:0,
            t:30,
            step:10
        });
    });
    
    //拖拽 
    login.drag($('#login h2').first(),$('#login .other').first());
    
    
    //百度分享初始位置
    $('#share').css('top',(getInner().height-parseInt(getStyle($('#share').first(),'height')))/2+'px');
    
    //百度分享收缩效果
    $('#share').hover(function(){
        $(this).animate({
            attr:'x',
            target:0
        });
    },function(){
        $(this).animate({
            attr:'x',
            target:-211
        });
    });
});





/*
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
    
    
    
    
    
    login.drag([$().getTagName('h2').getElement(0),$().getTagName('span').getElement(0)]);
    
};*/