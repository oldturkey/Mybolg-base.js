$(function(){
    //个人中心的下拉菜单
   $('#header .member').hover(function () {
		//$().getClass('member').css('background', 'url(images/arrow2.png) no-repeat 55px center');
		//this.css('color', 'red');
		$(this).css('background', 'url(images/arrow2.png) no-repeat 55px center');
		$('#header .member_ul').show().animate({
            t:30,
            step:10,
            mul:{
                o:100,
                h:120
            }
        });
	}, function () {
		//$().getClass('member').css('background', 'url(images/arrow.png) no-repeat 55px center');
		$(this).css('background', 'url(images/arrow.png) no-repeat 55px center');
		$('#header .member_ul').animate({
            //完成了同步动画和队列动画并解决了问题之后，可以是实现下拉菜单收缩的效果
            t:30,
            step:10,
            mul:{
                o:0,
                h:0
            },
            fn:function(){
                $('#header .member_ul').hide();
            }
        });
	});
    //注册框
    var reg=$('#reg');
    var screen=$('#screen');
    reg.center(600,550);
    $().resize(function(){
        reg.center(600,550);
        if(reg.css('display')=='block'){
            screen.lock();
            };
    });
    $('#header .reg').click(function(){
        reg.center(600,550).css('display','block');
        screen.lock().animate({
            attr:'o',
            target:30,
            t:30,
            step:10
        });
    })
    $('#reg .close').click(function(){
        reg.css('display','none');
        screen.unlock().animate({
            attr:'o',
            target:0,
            t:30,
            step:10
        });
    });
    
    //表单验证
    $('form').form('user').bind('focus', function () {
		$('#reg .info_user').css('display', 'block');
		$('#reg .error_user').css('display', 'none');
		$('#reg .succ_user').css('display', 'none');
	}).bind('blur', function () {
		if (trim($(this).value()) == '') {
			$('#reg .info_user').css('display', 'none');
			$('#reg .error_user').css('display', 'none');
			$('#reg .succ_user').css('display', 'none');
		} else if (!/^[a-zA-Z0-9_]{2,20}$/.test(trim($(this).value()))) {
			$('#reg .error_user').css('display', 'block');
			$('#reg .info_user').css('display', 'none');
			$('#reg .succ_user').css('display', 'none');
		} else {
			$('#reg .succ_user').css('display', 'block');
			$('#reg .error_user').css('display', 'none');
			$('#reg .info_user').css('display', 'none');
		}
	});
    //密码验证功能
     $('form').form('pass').bind('focus', function () {
         $('#reg .info_pass').css('display', 'block');
		$('#reg .error_pass').css('display', 'none');
		$('#reg .succ_pass').css('display', 'none');
        }).bind('blur', function () {
         if (trim($(this).value()) == '') {
             $('#reg .info_pass').css('display', 'none');
         }else{
             if(check_pass(this)){
                  $('#reg .info_pass').css('display', 'none');
		          $('#reg .error_pass').css('display', 'none');
		          $('#reg .succ_pass').css('display', 'block'); 
             }else{
                 $('#reg .info_pass').css('display', 'none');
		          $('#reg .error_pass').css('display', 'block');
		          $('#reg .succ_pass').css('display', 'none'); 
             }
         }
         });
    //验证密码强度
    $('form').form('pass').bind('keyup',function(){
        check_pass(this);
    });
    //密码验证函数
    function check_pass(_this){
        var code_length=0;//每次触发事件都会有一个计数器，来统计不同类型数据的个数
        var value=trim($(_this).value());
        var value_length=value.length;
        //最开始打算写在外面，但是考虑到全局变量会污染全局环境，可能和其他业务逻辑变量重名，所以要封装成函数
        var flag=false;
        //第一个条件，输入的值大于6位小于20位
        if(value_length>=6&&value_length<=20){
            $('#reg .info_pass .q1').html('●').css('color','green');
        }else{
            $('#reg .info_pass .q1').html('○').css('color','#666');
        }
         //第二个条件，不能有非空字符，不能为空
        if(value_length>0&&(!/\s/.test(value))){
            $('#reg .info_pass .q2').html('●').css('color','green');
        }else{
            $('#reg .info_pass .q2').html('○').css('color','#666');
        }
        
        if(/[0-9]/.test(value)){
            code_length++;
        }
        if(/[a-z]/.test(value)){
            code_length++;
        }
        if(/[A-Z]/.test(value)){
            code_length++;
        }
        if(/[^0-9a-zA-Z]/.test(value)){
            code_length++;
        }
        //第三个条件  大、小写字母、数字、非空字符，至少两种
        if(code_length>=2){
           $('#reg .info_pass .q3').html('●').css('color','green'); 
        }else{
            $('#reg .info_pass .q3').html('○').css('color','#666');
        }
        
        //安全级别
        if(value.length>=10&&code_length>=3){
            $('#reg .info_pass .s1').css('color','green');
            $('#reg .info_pass .s2').css('color','green');
            $('#reg .info_pass .s3').css('color','green');
           $('#reg .info_pass .s4').html('高').css('color','green');
        }else if(value.length>=8&&code_length>=2){
            $('#reg .info_pass .s1').css('color','#f60');
            $('#reg .info_pass .s2').css('color','#f60');
            $('#reg .info_pass .s3').css('color','#ccc');
            $('#reg .info_pass .s4').html('中').css('color','f60');
        }else if(value.length>=1){
            $('#reg .info_pass .s1').css('color','maroon');
            $('#reg .info_pass .s2').css('color','#ccc');
            $('#reg .info_pass .s3').css('color','#ccc');
            $('#reg .info_pass .s4').html('低').css('color','maroon');
        }else{
            $('#reg .info_pass .s1').css('color','#ccc');
            $('#reg .info_pass .s2').css('color','#ccc');
            $('#reg .info_pass .s3').css('color','#ccc');
            $('#reg .info_pass .s4').html('');
        }
        if(code_length>=2&&value_length>=6&&value_length<=20&&(!/\s/.test(value)))return flag=true;
    }
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
    login.drag($('#login h2').first());
    reg.drag($('#reg h2').first());
    
    //百度分享初始位置
    $('#share').css('top',getScroll().top+(getInner().height-parseInt(getStyle($('#share').first(),'height')))/2+'px');  
    $(window).bind('scroll',function(){
        $('#share').animate({
            attr:'y',
            target:getScroll().top+(getInner().height-parseInt(getStyle($('#share').first(),'height')))/2
        });
    });
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
    
  //滑动导航栏特效
    $('#nav .about li').hover(function(){
        var target=$(this).first().offsetLeft;
        $('#nav .nav_bg').animate({
            attr:'x',
            target:target+20,
            t:30,
            step:10,
            fn:function(){
                $('#nav .white').animate({
                   attr:'x',
                    target:-target
                });
            }
        });
    },function(){
        $('#nav .nav_bg').animate({
            attr:'x',
            target:20,
            t:30,
            step:10,
            fn:function(){
               $('#nav .white').animate({
                   attr:'x',
                    target:0
                }); 
            }
        });
    });
    
    //侧边栏菜单切换
    $('#sidebar h2').toggle(function(){
        $(this).next().animate({
           mul:{
                h : 0,
				o : 0
            }
        });
    },function(){
        $(this).next().animate({
            mul:{
                h:150,
                o:100
            }
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
