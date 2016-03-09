$(document).ready(function(){ 
    
    //hidden on first load
    $('#map_options').css('display','none');
    $('#login_container').css('display','none');
    $('#login_box').css('display','none');
    $('#about_container').css('display','none');
    $('#about_box').css('display','none');
    $('#sign_upcontainer').css('display','none');
    $('#sign_up_box').css('display','none');
    
    d_browser();
    
    $(window).resize(function(){
        d_browser();
    });
    
    $('#map_selector').click(function(){
        $('#map_options').fadeIn(50,'swing',function(){
                setTimeout(function(){
                     $('#map_options').fadeOut(50,'swing');
                },7000);
        });
    });
    
    $('#map_options').mouseleave(function(){
        $(this).fadeOut(50,'swing');
    });
    
    $('#map_options a').hover(function(){
        $(this).css('background-color','#b7d7e8');
    },function(){
        $(this).css('background-color','');
    });
    
    /*login box appear*/
    $('#login_b').click(function(){
       // $(this).removeClass();
       // $(this).addClass('nav_a5_clicked');
        
        $('#login_container').fadeIn('fast','swing');
        $('#login_box').fadeIn('fast','swing');
    });
    
    /*login box close*/
    $('#login_box_close').click(function(){
        //$('#login_b').removeClass();
        //$('#login_b').addClass('nav_a5');
        
        $('#login_container').fadeOut('fast','swing');
        $('#login_box').fadeOut('fast','swing',function(){    
            $('#login_box input').val('').css({'background-color':'#f4fafd' , 'color':'#272727'});
        });
    });
    
    /*login process*/
    $('#login_box_submit').click(function(){
            var username = $('#login_box_input1').val();
            var password = $('#login_box_input2').val();
            
            $.ajax({
                type: "POST",
                url: base_url+"index.php/login/checkAccount",
                cache:false,
                data:{
                    username:username,
                    password:password
                },
                beforeSend: function(){
                    
                },
                complete: function(){
                    
                },
                success: function(result){
                   if(result=='true')//if credentials is ok
                   {
                        window.location = base_url+"index.php/main_controller";
                   }
                   else if(result=='false')//if wrong credentials
                   {
                        $('#login_box_input1').css({'background-color':'#ff3c3c' , 'color':'#ffffff'});
                        $('#login_box_input2').css({'background-color':'#ff3c3c' , 'color':'#ffffff'});
                   }
                },
                error: function(){
                    alert('error');
                }
            });
    });
    
    /*input field changed*/
    $('#login_box input').keydown(function(e){
        if(e.keyCode!=13 || e.which!=13)//if enter not pressed
        {
            $('#login_box_input1').css({'background-color':'#f4fafd' , 'color':'#272727'});
            $('#login_box_input2').css({'background-color':'#f4fafd' , 'color':'#272727'});
        }
        else if(e.keyCode==13 || e.which==13)//if pressed enter
        {
            $('#login_box_submit').click();
        }
    });
    
    //about open
    getInfoHazard();
    $('#about_b').click(function(){
            $('#about_container').fadeIn('fast','swing');
            $('#about_box').fadeIn('fast','swing');
    });
    
    //about close
    $('#about_close').click(function(){
            $('#about_container').fadeOut('fast','swing');
            $('#about_box').fadeOut('fast','swing');
    });


    //sign up open
    $('#sign_b').click(function(){        
        $('#sign_upcontainer').fadeIn('fast','swing');
        $('#sign_up_box').fadeIn('fast','swing');
    });
    
    //sign up close
    $('#reg_cancel').click(function(){        
        $('#sign_upcontainer').fadeOut('fast','swing');
        $('#sign_up_box').fadeOut('fast','swing');
    });
    
    //check if username exists
    $('#u_name').focusout(function(){
            checkUsername2($(this).val());
    });
    
    //check if password is confirmed or not
    $('#conf_pass1').focusout(function(){
           if($(this).val() != $('#u_pass').val())//not the same
           {
                $(this).css('background-color','#ff0000');
                $('#u_pass').css('background-color','#ff0000');
                
                $('#reg_submit').prop('disabled',true);
           }
           else//the same
           {
                $(this).css('background-color','#f4fafd');
                $('#u_pass').css('background-color','#f4fafd');
                
                $('#reg_submit').prop('disabled',false);
           }
    });
    
    $('#u_pass').focusout(function(){
           if($(this).val() != $('#conf_pass1').val() && $('#conf_pass1').val())//not the same
           {
                $(this).css('background-color','#ff0000');
                $('#conf_pass1').css('background-color','#ff0000');
                
                $('#reg_submit').prop('disabled',true);
           }
           else//the same
           {
                $(this).css('background-color','#f4fafd');
                $('#conf_pass1').css('background-color','#f4fafd');
                
                $('#reg_submit').prop('disabled',false);
           }
    });
    
    $('#reg_submit').click(function(){
            newAccount2();
    });
});

//get hazards for info
function getInfoHazard()
{
        $.ajax({
            type: "GET",
            url: base_url+"index.php/main_controller/getInfoHazard",
            cache:false,
            dataType:'json',
            success: function(result){
               for(var x=0;x<result.length;x++)
               {
                    var img1 = base_url+"../uploads/default_ev.jpg";
                    var img2 = base_url+"../uploads/default_ev.jpg";
                    var img3 = base_url+"../uploads/default_ev.jpg";
                    
                    if(result[x]['h_img1'])
                        img1 = base_url+"../uploads/geohazard/"+result[x]['h_img1'];
                    if(result[x]['h_img2'])
                        img1 = base_url+"../uploads/geohazard/"+result[x]['h_img2'];
                    if(result[x]['h_img3'])
                        img1 = base_url+"../uploads/geohazard/"+result[x]['h_img3'];
                    
                    $('#about_box_content').append(function(){
                                                                                  //hazard name                                                                            //img1                                                                                //img2                                                                          //img3                      //desc                                                                                        
                        return "<div id='about_box_block'> <div id='about_box_block_header'>"+result[x]['h_name']+"</div>  <div id='about_box_block_img' style='background-image:url("+img1+")'></div>  <div id='about_box_block_img' style='background-image:url("+img2+")'></div> <div id='about_box_block_img' style='background-image:url("+img3+")'></div> <p>"+result[x]['h_desc']+"</p> </div>";
                    });
               }
            },
            error: function(){
                   alert('Unexpected error occured');
            }
        });
}

function d_browser()
{
    $('#login_container').css('height',window.innerHeight);
    $('#about_container').css('height',window.innerHeight);
    $('#about_box').css('height',window.innerHeight*0.60);
    $('#about_box_content').css('height',(window.innerHeight*0.60)-30);
    
    $('#sign_upcontainer').css('height',window.innerHeight);
    $('#sign_up_box').css('height',window.innerHeight*0.47);
    $('#sign_up_box_content').css('height',(window.innerHeight*0.47)-52);
}

function checkUsername2(uname)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_uname',
        data:{u_name:uname},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            
            if(chk_res=='exists')
            {
                $('#u_name').css('background-color','#ff0000');
                $('#reg_submit').prop('disabled',true);
            }
            else
            {
                $('#u_name').css('background-color','#f4fafd');
                $('#reg_submit').prop('disabled',false);
            }
        }
    });
}

function newAccount2()
{
    var u_sername  = $('#u_name').val();
    var p_assword  = $('#u_pass').val();
    var c_assword = $('#conf_pass1').val();
    var l_name = $('#l_name').val();
    var f_name = $('#f_name').val();
    var m_name = $('#m_name').val();
    
    var iserror2 = $('#u_name').css('background-color');
    
    //if everthing is ok
    if((u_sername && p_assword && l_name && f_name && m_name && c_assword) && iserror2!="rgb(255, 0, 0)" && p_assword==c_assword)
    {
        $.ajax({
            type:'POST',
            url:base_url+'index.php/adm_controller/new_account2',
            data:{u_name:u_sername,
                  u_lvl:2,
                  l_name:l_name,
                  f_name:f_name,
                  m_name:m_name,
                  address:"",
                  contct:"",
                  compny:"",
                  pass:p_assword
                 },
            cache:false,
            success:function(){
                alert('Account Registered!');
                $('#sign_upcontainer').fadeOut('fast','swing');
                $('#sign_up_box').fadeOut('fast','swing');
                $('#sign_up_box input').val("");
            },
            error:function(){
                alert('newaccounterror');
            }
        });
    }
    else
    {
       var emptyboxes = $('#sign_up_box input').filter(function(){    return $(this).val()=="";       });
       
       emptyboxes.each(function(){
            $(this).css({'background-color':'#ff0000','color':'#ffffff'}).val("REQUIRED");
       });
       setTimeout(function(){
            emptyboxes.each(function(){
                $(this).css({'background-color':'#f4fafd','color':'#272727'}).val("");
            });
       },700);
    }
}