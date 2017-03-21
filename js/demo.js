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
    reg.resize(function(){
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
    
    //初始化操作，发现ie浏览器刷新后不会初始化导致一些问题
    $('form').first().reset();
    
    //用户名验证功能
    $('form').form('user').bind('focus', function () {
		$('#reg .info_user').css('display', 'block');
		$('#reg .error_user').css('display', 'none');
		$('#reg .succ_user').css('display', 'none');
	}).bind('blur', function () {
		if (trim($(this).value()) == '') {
			$('#reg .info_user').css('display', 'none');
			$('#reg .error_user').css('display', 'none');
			$('#reg .succ_user').css('display', 'none');
		} else if (!user_check()) {
			$('#reg .error_user').css('display', 'block');
			$('#reg .info_user').css('display', 'none');
			$('#reg .succ_user').css('display', 'none');
		} else {
			$('#reg .succ_user').css('display', 'block');
			$('#reg .error_user').css('display', 'none');
			$('#reg .info_user').css('display', 'none');
		}
	});
    function user_check(){
        var flag = true;
		if (!/[\w]{2,20}/.test(trim($('form').eq(0).form('user').value()))) {
			$('#reg .error_user').html('输入不合法，请重新输入！');
			return false;
		} else {
            $('#reg .info_user').css('display', 'none');
			$('#reg .loading').css('display', 'block');
			ajax({
				method : 'post',
				url : 'is_user.php',
				data : $('form').eq(0).serialize(),
				success : function (text) {
					if (text == 1) {
						$('#reg .error_user').html('用户名被占用！');
						flag = false;
					} else {
						flag = true;
					}
					$('#reg .loading').css('display', 'none');
				},
				async : false
			});
		}
		return flag;
	}
    
    //密码验证功能
     $('form').form('pass').bind('focus', function () {
         $('#reg .info_pass').css('display', 'block');
		$('#reg .error_pass').css('display', 'none');
		$('#reg .succ_pass').css('display', 'none');
        }).bind('blur', function () {
         if (trim($(this).value()) == '') {
             $('#reg .info_pass').css('display', 'none');
         }else{
             if(check_pass()){
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
    $('form').form('pass').bind('keyup',check_pass);
    //密码验证函数
    function check_pass(){
        var code_length=0;//每次触发事件都会有一个计数器，来统计不同类型数据的个数
        var value=trim($('form').form('pass').value());
        var value_length=value.length;
        //最开始打算写在外面，但是考虑到全局变量会污染全局环境，可能和其他业务逻辑变量重名，所以要封装成函数
        //var flag=false;
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
        
        if(/[\d]/.test(value)){
            code_length++;
        }
        if(/[a-z]/.test(value)){
            code_length++;
        }
        if(/[A-Z]/.test(value)){
            code_length++;
        }
        if(/[^\w]/.test(value)){
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
        if(code_length>=2&&value_length>=6&&value_length<=20&&(!/\s/.test(value))){
            return true;
        }else{
            return false;
        }
    }
    
    //密码再次确认
    $('form').form('notpass').bind('focus', function () {
         $('#reg .info_notpass').css('display', 'block');
		$('#reg .error_notpass').css('display', 'none');
		$('#reg .succ_notpass').css('display', 'none');
        }).bind('blur', function () {
        if (trim($(this).value()) == '') {
             $('#reg .info_notpass').css('display', 'none');
         }else if(check_notpass()){
             $('#reg .info_notpass').css('display', 'none');
             $('#reg .error_notpass').css('display', 'none');
		     $('#reg .succ_notpass').css('display', 'block');
         }else{
             $('#reg .info_notpass').css('display', 'none');
             $('#reg .error_notpass').css('display', 'block');
		     $('#reg .succ_notpass').css('display', 'none');
         }
    });
    
    function check_notpass(){
        if(trim($('form').form('notpass').value())==trim($('form').form('pass').value()))return true;
    }
    
    //验证提问
    function check_ques(){
        if($('form').form('ques').value()!=0)return true;
    }
    $('form').form('ques').bind('change',function(){
        if(check_ques)
        $('#reg .error_ques').css('display', 'none');
    });
    
    //验证生日
    function check_birthday(){
        if($('form').form('birthday').value()!=0)return true;
    }
    $('form').form('birthday').bind('change',function(){
        if(check_birthday)
        $('#reg .error_birthday').css('display', 'none');
    });
    //回答验证
    $('form').form('ans').bind('focus', function () {
         $('#reg .info_ans').css('display', 'block');
		$('#reg .error_ans').css('display', 'none');
		$('#reg .succ_ans').css('display', 'none');
        }).bind('blur', function () {
        if (trim($(this).value()) == '') {
             $('#reg .info_ans').css('display', 'none');
         }else if(check_ans()){
             $('#reg .info_ans').css('display', 'none');
             $('#reg .error_ans').css('display', 'none');
		     $('#reg .succ_ans').css('display', 'block');
         }else{
             $('#reg .info_ans').css('display', 'none');
             $('#reg .error_ans').css('display', 'block');
		     $('#reg .succ_ans').css('display', 'none');
         }
    });
    function check_ans(){
        if(trim($('form').form('ans').value()).length>=2&&trim($('form').form('ans').value()).length<=32)return true;
    }
    //电子邮件验证
    $('form').form('email').bind('focus', function () {
        //补全界面
        if($(this).value().indexOf('@')==-1)$('#reg .all_email').css('display','block');
        
         $('#reg .info_email').css('display', 'block');
		$('#reg .error_email').css('display', 'none');
		$('#reg .succ_email').css('display', 'none');
        }).bind('blur', function () {
        $('#reg .all_email').css('display','none');
        
        if (trim($(this).value()) == '') {
             $('#reg .info_email').css('display', 'none');
         }else if(/^\w+@[0-9a-z]+(\.[a-z]{2,4}){1,2}$/.test(trim($(this).value()))){
             $('#reg .info_email').css('display', 'none');
             $('#reg .error_email').css('display', 'none');
		     $('#reg .succ_email').css('display', 'block');
         }else{
             $('#reg .info_email').css('display', 'none');
             $('#reg .error_email').css('display', 'block');
		     $('#reg .succ_email').css('display', 'none');
         }
    });
    function check_email(){
        if(/^\w+@[0-9a-z]+(\.[a-z]{2,4}){1,2}$/.test(trim($('form').form('email').value())))return true;
    }
    //电子邮件键入功能
    $('form').form('email').bind('keyup',function(event){
        if($(this).value().indexOf('@')==-1){
            $('#reg .all_email').css('display','block');
            $('#reg .all_email li span').html($(this).value());
        }else{
            $('#reg .all_email').css('display','none');
        }    
        
            $('#reg .all_email li').css('background','none');
            $('#reg .all_email li').css('color','#666');
        
        if(event.keyCode==40){
           if(this.index==undefined||this.index>=$('#reg .all_email li').length()-1){
               this.index=0;
           }else{
            this.index++;
               }
            //$('#reg .all_email li').css('background','none');
            //$('#reg .all_email li').css('color','#666');
            $('#reg .all_email li').eq(this.index).css('background','#e5edf2');
            $('#reg .all_email li').eq(this.index).css('color','#369'); 
        }
        
        if(event.keyCode==38){
           if(this.index==undefined||this.index<=0){
               this.index=$('#reg .all_email li').length();
           }else{
            this.index--;
               }
            //$('#reg .all_email li').css('background','none');
            //$('#reg .all_email li').css('color','#666');
            $('#reg .all_email li').eq(this.index).css('background','#e5edf2');
            $('#reg .all_email li').eq(this.index).css('color','#369'); 
        }
        
        if(event.keyCode==13){
            $(this).value($('#reg .all_email li').eq(this.index).text());
            $('#reg .all_email').css('display','none');
            this.index=undefined;
        }
    });
    
    //电子邮件补全系统点击获取
    //点击事件是鼠标点击弹起后才触发，而blur在失去焦点后就会触发隐藏，导致点击事件失效
     /*$('#reg .all_email li').click(function(){
         alert('');
     });*/
    $('#reg .all_email li').bind('mousedown',function(){
        $('form').form('email').value($(this).text());
    });
     
    //电子邮件补全系统，鼠标移入移出效果
    $('#reg .all_email li').hover(function(){
        $(this).css('background','#e5edf2');
        $(this).css('color','#369');     
    },function(){
       $(this).css('background','none');
        $(this).css('color','#666'); 
    });
    
    //备注
    $('form').form('ps').bind('keyup',check_ps).bind('paste',function(){
        //粘贴事件会在内容粘贴到文本框之前触发
        setTimeout(check_ps,50)
    });
    //点击清尾功能
    $('#reg .ps .clear').bind('click',function(){
        $('form').form('ps').value($('form').form('ps').value().substring(0,5));
        check_ps();
    });
    
    function check_ps(){
        var num=200-$('form').form('ps').value().length;
        if(num>=0){
            $('#reg .ps').eq(1).css('display','none');
           $('#reg .ps').eq(0).css('display','block'); 
            $('#reg .ps .num').eq(0).html(num);
            return true;
        }
        if(num<0){
            $('#reg .ps').eq(0).css('display','none');
            $('#reg .ps .num').eq(1).html(Math.abs(num)).css('color','red');
            $('#reg .ps').eq(1).css('display','block');
            return false;
        }
    }
    
    //提交表单验证
    $('form').form('sub').click(function(){
        var flag=true;
        if(!user_check()){
            flag=false;
            $('#reg .error_user').css('display', 'block');
        }
        if(!check_pass()){
            flag=false;
            $('#reg .error_pass').css('display', 'block');
        }
        if(!check_notpass()){
            flag=false;
            $('#reg .error_notpass').css('display', 'block');
        }
        if(!check_ques()){
            flag=false;
            $('#reg .error_ques').css('display', 'block');
        }
        if(!check_ans()){
            flag=false;
            $('#reg .error_ans').css('display', 'block');
        }
        if(!check_email()){
            flag=false;
            $('#reg .error_email').css('display', 'block');
        }
        if(!check_birthday()){
            flag=false;
            $('#reg .error_birthday').css('display', 'block');
        }
        if(!check_ps()){
            flag=false;
        }
        
        if (flag) {
<<<<<<< HEAD
            var _this=this;
            $('#loading').css('display','block').center(200,40);
            $('#loading p').html('正在提交注册中...');
            _this.disabled=true;
            $(_this).css('backgroundPosition','right');
=======
>>>>>>> origin/master
			ajax({
				method : 'post',
				url : 'demo.php',
				data : $('form').eq(0).serialize(),
<<<<<<< HEAD
				success : function (text) { 
					if(text==1){
                         $('#loading').css('display','none');
                         $('#success').css('display','block').center(200,40);
                        $('#success p').html('注册成功，请登录！');
                        setTimeout(function(){
                            $('#success').css('display','none') ;
                            $('#reg').css('display','none');
                            $('#reg .succ').css('display','none');
                            $('form').first().reset();
                            _this.disabled=false;
                            $(_this).css('backgroundPosition','left');
                            screen.unlock().animate({
                            attr:'o',
                            target:0,
                            t:30,
                            step:10
                        });
                        },1500);
                    }
=======
				success : function (text) {
					alert(text);
>>>>>>> origin/master
				},
				async : true
			});
		}
    });
    
    
    //登陆框
    var login=$('#login');
    var screen=$('#screen');
    login.resize(function(){
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
        setTimeout(function(){
           $('#share').animate({
            attr:'y',
            target:getScroll().top+(getInner().height-parseInt(getStyle($('#share').first(),'height')))/2
        }); 
        },100)
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
    //轮播器初始化
    //$('#banner img').css('display','none');
    //$('#banner img').eq(0).css('display','block');
    $('#banner img').opacity(0);
    $('#banner img').eq(0).opacity(100);
    $('#banner ul li').eq(0).css('color','#333');
    $('#banner strong').html($('#banner img').eq(0).attr('alt'));
    
    var banner_type=2;
    var  banner_index=1;
    //自动轮播器
    var banner_timer=setInterval(banner_fn,2000);
    //手动轮播器
    $('#banner ul li').hover(function(){
        clearInterval(banner_timer);
        
        if($(this).css('color') != 'rgb(51, 51, 51)' && $(this).css('color')!='#333'){
        banner(this,banner_index==0?$('#banner ul li').length()-1:banner_index-1);
            }
    },function(){
        banner_index=$(this).index()+1;
        banner_timer=setInterval(banner_fn,2000);
    });
    
    function banner(obj,prev){
        //$('#banner img').css('display','none');
        //$('#banner img').eq($(obj).index()).css('display','block');
        $('#banner ul li').css('color','#999');
        $(obj).css('color','#333');
        $('#banner strong').html($('#banner img').eq($(obj).index()).attr('alt'));
        
    if(banner_type==1){    
        //$('#banner img').opacity(0);使用opacity切换图片时会从白底开始，影响体验
        $('#banner img').eq(prev).animate({
            attr:'o',
            target:0,
            t:50,
            step:10
        }).css('z-index','1');
        $('#banner img').eq($(obj).index()).animate({
            attr:'o',
            target:100,
            t:50,
            step:10
        }).css('z-index','2');
      }else if(banner_type==2){
        $('#banner img').eq(prev).animate({
            attr:'y',
            target:150,
            t:50,
            step:10
        }).css('z-index','1').opacity(100);
        $('#banner img').eq($(obj).index()).animate({
            attr:'y',
            target:0,
            t:50,
            step:10
        }).css('z-index','2').css('top','-150px').opacity(100);  
      }
        
    }
    function banner_fn(){
        if(banner_index>=$('#banner ul li').length())banner_index=0; 
        banner($('#banner ul li').eq(banner_index).first(),banner_index==0?$('#banner ul li').length()-1:banner_index-1);
        banner_index++;
    }
    
   /*延迟加载图片*/
    //1.图片距离浏览器顶点的距离  
    //$('.wait_load').eq(0).first().offsetTop; 927
    //低版本的ie和火狐不兼容的问题，所以封装了offsetTop方法 offsetTop($('.wait_load').eq(0).first())
    //2.浏览器可视区域的宽度
    //(getInner().height);  794
    //3.滚动条滚动的距离
    //(getScroll().top);0
    var wait_load=$('.wait_load');//先赋值，防止后面重复调用浪费内存
    //透明度动画效果初始化
    wait_load.opacity(0);
    $(window).bind('scroll',_wait_load);
    $(window).bind('resize',_wait_load);//放大缩小屏幕也会加载
    
    function _wait_load(){
       setTimeout(function(){
            for(var i=0;i<wait_load.length();i++){
                var _this=wait_load.ge(i);//先获取原生对象并保存，防止循环后被当作一个值
                if(getInner().height+getScroll().top>=offsetTop($(_this).first())){
                $(_this).attr('src',$(_this).attr('xsrc')).animate({
                    attr:'o',
                    target:100,
                    t:30,
                    step:10
                });
                }
        }
        },100)   
    }
    
    
    //图片预加载弹窗
    var photo_big = $('#photo_big');
    photo_big.resize(function () {
		if (photo_big.css('display') == 'block') {
			screen.lock();
		}
	});
    $('#photo dl dt img').click(function(){
        photo_big.center(620,511).css('display','block');
        screen.lock().animate({
            attr:'o',
            target:30,
            t:30,
            step:10
        });
        var temp_img=new Image();
     $(temp_img).bind('load',function(){
        $('#photo_big .big img').attr('src',temp_img.src).animate({
        attr:'o',
        target:100,
        t:30,
        step:10
    }).css('width','600px').css('height','450px').css('top','0').opacity(0);
    }); 
        temp_img.src=$(this).attr('bigsrc'); 
        
        var children=this.parentNode.parentNode;
        prev_next_img(children);
        
        
    });
    $('#photo_big .close').click(function(){
        photo_big.css('display','none');
        screen.unlock().animate({
            attr:'o',
            target:0,
            t:30,
            step:10
        });
       $('#photo_big .big img').attr('src','images/loading.gif').css('width','32px').css('height','32px').css('top','190px'); 
    });
    
    //拖拽 
    photo_big.drag($('#photo_big h2').first());
    
    
    
    //图片预加载
    /*$('#photo_big .big img').attr('src','http://image52.360doc.com/DownloadImg/2012/06/0316/24581213_1.jpg').animate({
        attr:'o',
        target:100,
        t:30,
        step:10
    }).css('width','600px').css('height','450px').css('top','0').opacity(0);
    
    //问题1：网速太快，图片瞬间加载完成。
    //问题2：动画的渐变效果没有出现
    
    
    //创建一个临时的图片对象，用于保存图片
    //alert($('#photo_big .big img').first())
    //alert(new Image());
    
    var temp_img=new Image();//创建一个临时区域的图片对象
    temp_img.src='http://img31.mtime.cn/pi/2013/09/04/100217.51367077_1000X1000.jpg';
    
    $(temp_img).bind('load',function(){
        $('#photo_big .big img').attr('src',temp_img.src).animate({
        attr:'o',
        target:100,
        t:30,
        step:10
    }).css('width','600px').css('height','450px').css('top','0').opacity(0);
    });*/
    
    
    //鼠标移入，箭头渐变效果   考虑体验问题，后续是否要修改
	$('#photo_big .big .left').hover(function () {
		$('#photo_big .big .sl').animate({
			attr : 'o',
			target : 50,
			t : 30,
			step : 10
		});		
	}, function () {
		$('#photo_big .big .sl').animate({
			attr : 'o',
			target : 0,
			t : 30,
			step : 10
		});
	});
	
	//鼠标移入，箭头渐变效果
	$('#photo_big .big .right').hover(function () {
		$('#photo_big .big .sr').animate({
			attr : 'o',
			target : 50,
			t : 30,
			step : 10
		});		
	}, function () {
		$('#photo_big .big .sr').animate({
			attr : 'o',
			target : 0,
			t : 30,
			step : 10
		});
	});
    
    
    //点击左边，上一张图片显示
    $('#photo_big .big .left').click(function(){
         $('#photo_big .big img').attr('src','images/loading.gif').css('width','32px').css('height','32px').css('top','190px'); 
        var current_img = new Image();
        $(current_img).bind('load',function(){
            $('#photo_big .big img').attr('src',current_img.src).animate({
            attr:'o',
            target:100,
            t:30,
            step:10
        }).opacity(0).opacity(0).css('width', '600px').css('height', '450px').css('top', 0);
        });
        
        current_img.src = $(this).attr('src');
        var children = $('#photo dl dt img').ge(prevIndex($('#photo_big .big img').attr('index'), $('#photo').first())).parentNode.parentNode;
      
        prev_next_img(children);
    });
    
    //点击右边，下一张图片显示
    $('#photo_big .big .right').click(function () {
         $('#photo_big .big img').attr('src','images/loading.gif').css('width','32px').css('height','32px').css('top','190px'); 
        var current_img = new Image();
        $(current_img).bind('load',function(){
            $('#photo_big .big img').attr('src',current_img.src).animate({
            attr:'o',
            target:100,
            t:30,
            step:10
        }).opacity(0).opacity(0).css('width', '600px').css('height', '450px').css('top', 0);
        });
        
        current_img.src = $(this).attr('src');
        
        var children = $('#photo dl dt img').ge(nextIndex($('#photo_big .big img').attr('index'), $('#photo').first())).parentNode.parentNode;
		
		prev_next_img(children);
    });
    
    
    function prev_next_img(children){
        var prev=prevIndex($(children).index(),children.parentNode);
        var next=nextIndex($(children).index(),children.parentNode);
        
        var prev_img=new Image();
        var next_img=new Image();
        //缓存上一张和下一张图片
        prev_img.src=$('#photo dl dt img').eq(prev).attr('bigsrc');
        next_img.src=$('#photo dl dt img').eq(next).attr('bigsrc');
        
        //把图片的链接缓存在左右滑块中
        $('#photo_big .big .left').attr('src',prev_img.src);
        $('#photo_big .big .right').attr('src',next_img.src);
        $('#photo_big .big img').attr('index', $(children).index());
        $('#photo_big .big .index').html(parseInt($(children).index())+1+'/'+$('#photo dl dt img').length());
    }
    
});

