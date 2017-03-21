<<<<<<< HEAD
<?php
	require 'config.php';
    
    $query = "INSERT INTO blog_user (user, pass, ques, ans, email, birthday, ps) 
												VALUES ('{$_POST['user']}', sha1('{$_POST['pass']}'), '{$_POST['ques']}', '{$_POST['ans']}', '{$_POST['email']}', '{$_POST['birthday']}', '{$_POST['ps']}')";
      
    mysql_query($query) or die('新增失败！'.mysql_error());
      
    sleep(3);

    echo mysql_affected_rows();

    mysql_close();
?>
=======
﻿<?php
	//echo 'www.ycku.com';
	print_r($_POST);
?>
>>>>>>> origin/master
