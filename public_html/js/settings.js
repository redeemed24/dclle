var haz_img_stat=new Array();
var haz_info_res=new Array();
var haz_lvl=new Array();
var rmap=new Array();
var rstruct=new Array();
var rockgroup_res=new Array();
var rockage_res=new Array();
var m_soil=new Array();
var haz_count=0;
var haz_lvl_count=0;
var haz_edit_click=0;
var rmap_count=0;
var rstruct_count=0;
var msoil_count=0;
var srch_uname;

function det_brow()
{
    document.getElementById('settings_base').style.height=(window.innerHeight-100)+"px";
    document.getElementById('settings_list_base').style.height=(window.innerHeight-132)+"px";
    document.getElementById('settings_base_1').style.height=(window.innerHeight-132)+"px";
}

$(document).ready(function(){
    $.ajaxSetup({ cache: false });
    
    $(window).resize(function(){
	det_brow();
    });
    
    if(u_lvl==2)
    {
        $('#profile_label').css('visibility','visible');
        $('#settings_label').css('visibility','hidden');
        $('#settings_label').css('display','none');
        $('#settings_list_base').css('visibility','hidden');
    }
    else
    {
        $('#profile_label').css('visibility','hidden');
        $('#profile_label').css('display','none');
    }
    $('#acct_mgt').hide();
    $('#haz_mgt').hide();
    $('#rock_mgt').hide();
    $('#soil_mgt').hide();
    $('.edit_loading_bar').hide();
    $('#adm_prof,#adm_acct,#adm_new_acct').hide();
    
    document.getElementById('settings_base').style.height=(window.innerHeight-100)+"px";
    document.getElementById('settings_list_base').style.height=(window.innerHeight-132)+"px";
    document.getElementById('settings_base_1').style.height=(window.innerHeight-132)+"px";
    $('#settings_list_base').hide();
    $('#settings_base_1').css('width','100%');
    $('#settings_base_1').css('overflow-y','auto');
    
    haz_img_stat.push({'haz_id':'0','haz_image1_stat':'0','haz_image2_stat':'0','haz_image3_stat':'0'});
    haz_img_stat.push({'haz_id':'0','hazlgnd_image1_stat':'0','hazlgnd_image2_stat':'0','hazlgnd_image3_stat':'0'});
    haz_img_stat.push({'rockid':'0','rock_img1_stat':'0','rock_img2_stat':'0','rock_img3_stat':'0'});
    haz_img_stat.push({'structid':'0','struct_img1_stat':'0','struct_img2_stat':'0','struct_img3_stat':'0'});
    haz_img_stat.push({'soilid':'0','soil_img1_stat':'0','soil_img2_stat':'0','soil_img3_stat':'0'});
    
    //-------------------------------------------------------settings-----------------------------------------------------------------------
      
    $('.nav_a4').click(function(e){
        e.preventDefault();
        $('#settings_container').fadeIn('fast','swing');
        $('#settings_base').fadeIn('fast','swing');
        getUserProfile(1,username);
        prof_readOnly();
    });
    
    $('closeButton').click(function(){
        if(haz_edit_click!=0)
        {
            var ans = confirm('Are you sure you don\'t want to save the changes?');
	    if(ans==true)
            {
                haz_edit_click=0;
                $('#settings_container').fadeIn('fast','swing').delay(100).fadeOut('fast','swing');
                $('#settings_base').fadeIn('fast','swing').delay(100).fadeOut('fast','swing');
	        location.reload();
            }
            else
            return;
        }
        else if(haz_edit_click==0)
        {
            haz_edit_click=0;
            $('#settings_container').fadeIn('fast','swing').delay(100).fadeOut('fast','swing');
            $('#settings_base').fadeIn('fast','swing').delay(100).fadeOut('fast','swing');
            location.reload();
        }
    });
    
    $('#haz_drpwdwn').change(function(){
        haz_lvl_count=0;
        get_haz_lvl(2,$('#haz_drpwdwn').val());
    });
    
    $('#settings_label').on('click',function(){
        $('#settings_label').attr('disabled','disabled');
        var width = Math.round($("#settings_base_1").width() / $('#settings_base_1').parent().width() * 100);
        $('#settings_base_1').css('width','80%');
        if((width==100 || width==80) && $('#settings_label').attr('disabled')=='disabled')
        {
            $('#settings_list_base').slideToggle('600',function(){if(width>100)location.reload();}); 
        }
        $('#settings_list_base').promise().done(function(){
            if(width==100)$('#settings_base_1').css('width','80%');
            if(width==80)$('#settings_base_1').animate({width:'+=20%'},'slow');
            $('#settings_label').removeAttr('disabled');
        });
    });
    
    $('#profile').click(function(){
        nav_hide();
	
        $('#acct_mgt').fadeOut('fast','swing');
        $('#rock_mgt').fadeOut('fast','swing');
        $('#soil_mgt').fadeOut('fast','swing');
        $('#haz_mgt').fadeOut('fast','swing');
        
        $('#acct_container').fadeIn('fast','swing').delay(100);
        $('#prof_container').fadeIn('fast','swing').delay(100);
	prof_readOnly();
    });
    
    $('#acct_mgt_button').click(function(){
        nav_hide();
        $('#acct_container').fadeOut('fast','swing');
        $('#prof_container').fadeOut('fast','swing');
        $('#haz_mgt').fadeOut('fast','swing');
        $('#rock_mgt').fadeOut('fast','swing');
        $('#soil_mgt').fadeOut('fast','swing');
        $('#acct_mgt').fadeIn('fast','swing').delay(100);
    });
    
    $('#haz_mgt_button').click(function(){
        nav_hide();
        $('#acct_container').fadeOut('fast','swing');
        $('#prof_container').fadeOut('fast','swing');
        $('#acct_mgt').fadeOut('fast','swing');
        $('#rock_mgt').fadeOut('fast','swing');
        $('#soil_mgt').fadeOut('fast','swing');
        $('#haz_mgt').fadeIn('fast','swing').delay(100);
        haz_edit_click=0;
        haz_readOnly(0);
        getHazInfoResult(haz_count,1);
    });
    
    $('#toggle_haz_info').click(function(){
        $('#haz_info_cont').slideToggle();
            $('#haz_info_left,#haz_info_right').slideToggle();
        if( document.getElementById('toggle_haz_info').innerHTML=='-')
            document.getElementById('toggle_haz_info').innerHTML='+';
        else
            document.getElementById('toggle_haz_info').innerHTML='-';
    });
    
    $('#toggle_haz_legnd').click(function(){
        $('#haz_legnd_cont').slideToggle();
            $('#haz_lgnd_left,#haz_lgnd_right').slideToggle();
        if( document.getElementById('toggle_haz_legnd').innerHTML=='-')
            document.getElementById('toggle_haz_legnd').innerHTML='+';
        else
            document.getElementById('toggle_haz_legnd').innerHTML='-';
    });
    
    $('#rock_mgt_button').click(function(){
        nav_hide();
        $('#acct_container').fadeOut('fast','swing');
        $('#prof_container').fadeOut('fast','swing');
        $('#acct_mgt').fadeOut('fast','swing');
        $('#haz_mgt').fadeOut('fast','swing');
        $('#soil_mgt').fadeOut('fast','swing');
        $('#rock_mgt').fadeIn('fast','swing').delay(100);
        
        getRockInfoResult(rmap_count,0);
        getRockStruct(rstruct_count);
       
        r_readOnly(0);
        rStruct_readOnly(0);
        get_rock_age(2);
        get_rock_group(2);
    });
    
    $('#toggle_rock_info').click(function(){
        $('#rock_info_cont').slideToggle();
            $('#rock_info_left,#rock_info_right').slideToggle();
        if( document.getElementById('toggle_rock_info').innerHTML=='-')
            document.getElementById('toggle_rock_info').innerHTML='+';
        else
            document.getElementById('toggle_rock_info').innerHTML='-';
    });
    
    $('#toggle_struct_group').click(function(){
        $('#rock_struct_cont').slideToggle();
            $('#rock_struct_left,#rock_struct_right').slideToggle();
        if( document.getElementById('toggle_struct_group').innerHTML=='-')
            document.getElementById('toggle_struct_group').innerHTML='+';
        else
            document.getElementById('toggle_struct_group').innerHTML='-';
    });
    
    $('#toggle_rock_age').click(function(){
        $('#rock_age_cont').slideToggle();
        if( document.getElementById('toggle_rock_age').innerHTML=='-')
            document.getElementById('toggle_rock_age').innerHTML='+';
        else
            document.getElementById('toggle_rock_age').innerHTML='-';
    });
    
    $('#toggle_rock_group').click(function(){
        $('#rock_group_cont').slideToggle();
        if( document.getElementById('toggle_rock_group').innerHTML=='-')
            document.getElementById('toggle_rock_group').innerHTML='+';
        else
            document.getElementById('toggle_rock_group').innerHTML='-';
    });
    
    $('#toggle_soil_info').click(function(){
        $('#soillgnd_cont').slideToggle();
            $('#soillgnd_left,#soillgnd_right').slideToggle();
        if( document.getElementById('toggle_soil_info').innerHTML=='-')
            document.getElementById('toggle_soil_info').innerHTML='+';
        else
            document.getElementById('toggle_soil_info').innerHTML='-';
    });
    
    $('#toggle_soil_symbol').click(function(){
        $('#soil_symbol_cont').slideToggle();
        if( document.getElementById('toggle_soil_symbol').innerHTML=='-')
            document.getElementById('toggle_soil_symbol').innerHTML='+';
        else
            document.getElementById('toggle_soil_symbol').innerHTML='-';
    });
    
    $('#soil_mgt_button').click(function(){
        nav_hide();
        $('#acct_container').fadeOut('fast','swing');
        $('#prof_container').fadeOut('fast','swing');
        $('#acct_mgt').fadeOut('fast','swing');
        $('#haz_mgt').fadeOut('fast','swing');
        $('#rock_mgt').fadeOut('fast','swing');
        $('#soil_mgt').fadeIn('fast','swing').delay(100);
        getSoilInfo();
        soilLgnd_readOnly();
    });
    
    //-------------------------------------------------------hazard map-----------------------------------------------------------------------
    
    $('#haz_stat').click(function(){
        if(haz_info_res[haz_count]['haz_stat']==0)
            haz_change_stat(1);
        else
            haz_change_stat(0);
    });
    
    $('#hazlgnd_stat').click(function(){
        if(haz_lvl[haz_lvl_count]['hazlgnd_stat']==0)
            hazLgnd_change_stat(1);
        else
            hazLgnd_change_stat(0);
    });
    
    $('#haz_info_base').hover(
        function(){$('#haz_info_base').css('background-color','#fbfbfb');},
        function(){if(haz_edit_click==0)$('#haz_info_base').css('background-color','#ffffff');}
    );
    
    $('#haz_lgnd_base').hover(
        function(){$('#haz_lgnd_base').css('background-color','#fbfbfb');},
        function(){if(haz_edit_click==0)$('#haz_lgnd_base').css('background-color','#ffffff');}
    );
    
    $('#haz_info_left').click(function(){
        if(haz_count!=0)
        {
            haz_count--;
            get_haz_lvl_info(haz_info_res[haz_count]['haz_id']);
            loadHazData(haz_count);
            haz_img_stat[0]={'haz_id':haz_info_res[haz_count]['haz_id'],'haz_image1_stat':'0','haz_image2_stat':'0','haz_image3_stat':'0'};
        }
    });

    $('#haz_info_right').click(function(){
        if(haz_info_res.length>haz_count+1)
        {
            haz_count++;
            get_haz_lvl_info(haz_info_res[haz_count]['haz_id']);
            loadHazData(haz_count);
            haz_img_stat[0]={'haz_id':haz_info_res[haz_count]['haz_id'],'haz_image1_stat':'0','haz_image2_stat':'0','haz_image3_stat':'0'};
        }
    });
    
    $('#haz_lgnd_left').click(function(){
        if(haz_lvl_count!=0)
        {
            haz_lvl_count--;
            loadHazLvl(haz_lvl_count);
            haz_img_stat[1]={'haz_id':haz_lvl[haz_lvl_count]['haz_id'],'hazlgnd_image1_stat':'0','hazlgnd_image2_stat':'0','hazlgnd_image3_stat':'0'}
        }
    });
    
    $('#haz_lgnd_right').click(function(){
        if(haz_lvl.length>haz_lvl_count+1)
        {
            haz_lvl_count++;
            loadHazLvl(haz_lvl_count);
            haz_img_stat[1]={'haz_id':haz_lvl[haz_lvl_count]['haz_id'],'hazlgnd_image1_stat':'0','hazlgnd_image2_stat':'0','hazlgnd_image3_stat':'0'}
        }
    });
    
    $('#edit_haz_img1, #edit_haz_img2, #edit_haz_img3, #edit_hazlgnd_img1, #edit_hazlgnd_img2, #edit_hazlgnd_img3').click(function(){
        var f_id;
        if(this.id=='edit_haz_img1')f_id='f_edit_haz_img1';
        else if(this.id=='edit_haz_img2') f_id='f_edit_haz_img2';
        else if(this.id=='edit_haz_img3') f_id='f_edit_haz_img3';
        else if(this.id=='edit_hazlgnd_img1') f_id='f_edit_hazlgnd_img1';
        else if(this.id=='edit_hazlgnd_img2') f_id='f_edit_hazlgnd_img2';
        else if(this.id=='edit_hazlgnd_img3') f_id='f_edit_hazlgnd_img3';
        $('#'+f_id).click();
    });
    
    $('#f_edit_haz_img1, #f_edit_haz_img2, #f_edit_haz_img3, #f_edit_hazlgnd_img1, #f_edit_hazlgnd_img2, #f_edit_hazlgnd_img3').change(function(){
        var prev_id;
        if(this.id=='f_edit_haz_img1'){ prev_id='haz_info_img1'; haz_img_stat[0]['haz_image1_stat']='0'; }
        else if(this.id=='f_edit_haz_img2'){ prev_id='haz_info_img2'; haz_img_stat[0]['haz_image2_stat']='0'; }
        else if(this.id=='f_edit_haz_img3'){ prev_id='haz_info_img3'; haz_img_stat[0]['haz_image3_stat']='0'; }
        else if(this.id=='f_edit_hazlgnd_img1'){prev_id='haz_lgnd_img1', haz_img_stat[1]['hazlgnd_image1_stat']='0';}
        else if(this.id=='f_edit_hazlgnd_img2'){prev_id='haz_lgnd_img2', haz_img_stat[1]['hazlgnd_image2_stat']='0';}
        else if(this.id=='f_edit_hazlgnd_img3'){prev_id='haz_lgnd_img3', haz_img_stat[1]['hazlgnd_image3_stat']='0';}
        previewImg(this,prev_id);
    });
    
    $('#rem_haz_img1, #rem_haz_img2, #rem_haz_img3 ,#rem_hazlgnd_img1, #rem_hazlgnd_img2, #rem_hazlgnd_img3').click(function(){
        var rem_id;
        var inp_id;
        haz_img_stat[0]['haz_id']=haz_info_res[haz_count]['haz_id'];
        haz_img_stat[1]['haz_id']=$('#haz_drpwdwn').val();

        if(this.id=='rem_haz_img1')
        {
            haz_img_stat[0]['haz_image1_stat']='2';
            rem_id='haz_info_img1';
            inp_id='f_edit_haz_img1';
        }
        else if(this.id=='rem_haz_img2')
        {
            haz_img_stat[0]['haz_image2_stat']='2';
            rem_id='haz_info_img2';
            inp_id='f_edit_haz_img2';
        }
        else if(this.id=='rem_haz_img3')
        {
            haz_img_stat[0]['haz_image3_stat']='2';
            rem_id='haz_info_img3';
            inp_id='f_edit_haz_img3';
        }
        else if(this.id=='rem_hazlgnd_img1')
        {
            haz_img_stat[1]['hazlgnd_image1_stat']='2';
            rem_id='haz_lgnd_img1';
            inp_id='f_edit_hazlgnd_img1';
        }
        else if(this.id=='rem_hazlgnd_img2')
        {
            haz_img_stat[1]['hazlgnd_image2_stat']='2';
            rem_id='haz_lgnd_img2';
            inp_id='f_edit_hazlgnd_img2';
        }
        else if(this.id=='rem_hazlgnd_img3')
        {
            haz_img_stat[1]['hazlgnd_image3_stat']='2';
            rem_id='haz_lgnd_img3';
            inp_id='f_edit_hazlgnd_img3';
        }
        reset_form($('#'+inp_id));
        removeImg(rem_id);
    });
    
    $('#save_haz').click(function(){
        $('.txt_styles_2').removeClass('error').filter(function(){ return !$.trim(this.value).length}).addClass('error');
    });
    
    $('#save_haz_lgnd').click(function(){
        $('.txt_styles_2_1').removeClass('error').filter(function(){ return !$.trim(this.value).length}).addClass('error');
        if($('#hazlgnd_clr').val()=='')$('#hazlgnd_clr').css('border-color','#df0000');
    });
    
    $('#haz_info_form').submit(function(e){
        e.preventDefault();
        if(!$('#haz_name').hasClass('error'))
        {
            if(haz_edit_click==1) haz_save_info();
            else if(haz_edit_click==2)
            {
                haz_save_info();
                save_img(1,haz_info_res[haz_count]['haz_id'],0,0,1,'f_edit_haz_img1','f_edit_haz_img2','f_edit_haz_img3');
            }
        }
    });
    
    $('#haz_lgnd_form').submit(function(e){
        e.preventDefault();
        if(!$('#hazlgnd_name').hasClass('error') && !$('#hazlgnd_lvl').hasClass('error') && !$('#hazlgnd_clr').hasClass('error') && $('#hazlgnd_clr').css('border-color')!='rgb(223, 0, 0)')
        {
            $('#hazlgnd_clr').css('border-color','#a2a2a2');
            hazlgnd_save_info();
        }
    });
    
    $('#new_haz_info').click(function(){
        if(haz_edit_click!=1 && haz_edit_click!=2)
        {
            haz_editable(1);
            haz_edit_click=1;
            $('#haz_info_left,#haz_info_right').slideToggle('slow');
        }
    });
    
    $('#new_haz_lgnd').click(function(){
        if(haz_edit_click!=4 && haz_edit_click!=5)
        {
            haz_editable(4)
            haz_edit_click=4;
            haz_lvl_count=0;
            $('#haz_lgnd_left,#haz_lgnd_right').slideToggle('slow');
        }
    });
    
    $('#haz_name').focusout(function(){
        if($(this).val()=="") $(this).attr('class','txt_styles_2');
        if(haz_edit_click==1)checkHazName(2,$(this).val(),haz_info_res[haz_count]['haz_name']);
        else if(haz_edit_click==2)checkHazName(1,$(this).val(),haz_info_res[haz_count]['haz_name']);
    });
    
    
    $('#hazlgnd_name').focusout(function(){
        if($(this).val()=="") $(this).attr('class','txt_styles_2_1');
        if(haz_edit_click==5) checkLegendName(1,$(this).val(),$('#haz_drpwdwn').val(),haz_lvl[haz_lvl_count]['hazlgnd_name']);
        else if(haz_edit_click==4)checkLegendName(2,$(this).val(),$('#haz_drpwdwn').val(),haz_lvl[haz_lvl_count]['hazlgnd_name']);
    });
    
    $('#hazlgnd_lvl').focusout(function(){
        if($(this).val()=="") $(this).attr('class','txt_styles_2_1');
        if(haz_edit_click==5) checkLgndLvl(1,$('#haz_drpwdwn').val(),$(this).val(),haz_lvl[haz_lvl_count]['hazlgnd_lvl']);
        else if(haz_edit_click==4) checkLgndLvl(2,$('#haz_drpwdwn').val(),$(this).val(),haz_lvl[haz_lvl_count]['hazlgnd_lvl']);
    });
    
    $('#rock_legnd').focusout(function(){
        if($(this).val()=="") $(this).attr('class','txt_styles_2');
        if(haz_edit_click==7)checkRockLgnd(1,$(this).val(),rmap[rmap_count]['mlgnd_name'],1);
        else if(haz_edit_click==8) checkRockLgnd(2,$(this).val(),rmap[rmap_count]['mlgnd_name'],1);
    });
    
    $('#rock_struct_name').focusout(function(){
        if($(this).val()=="") $(this).attr('class','txt_styles_2_2');
        if(haz_edit_click==10)checkRockLgnd(3,$(this).val(),rstruct[rstruct_count]['mlgnd_name'],2);
        else if(haz_edit_click==11)checkRockLgnd(4,$(this).val(),rstruct[rstruct_count]['mlgnd_name'],2);
    });
    
    $('#rock_age').focusout(function(){
        if($(this).val()=="") $(this).css('class','txt_styles_2_1');
        checkRockAge($(this).val());
    });
    
    $('#rock_group').focusout(function(){
        if($(this).val()=="") $(this).css('class','txt_styles_2_1');
        checkRockGroup($(this).val());
    });
    
    $('#soil_name').focusout(function(){
        if($(this).val()=="") $(this).attr('class','txt_styles_2');
        if(haz_edit_click==13)checkSoilLgnd(1,$(this).val(),m_soil[msoil_count]['soil_name']);
        else if(haz_edit_click==14) checkSoilLgnd(2,$(this).val(),m_soil[msoil_count]['soil_name']);
    });
    
    $('#soil_symbol1').focusout(function(){
        if($(this).val()=="") $(this).attr('class','txt_styles_2_1');
        checkSoilSymbol($(this).val());
    });
    
    $('#hazlgnd_lvl').keypress(function(e){
        e = e || window.event;
        var chk;
        if (window.event){
            if(e.which)chk=window.event.which ;
            else chk=window.event.keyCode;
        }
        if(e.which==46 || e.which==48||e.which==49||e.which==50||e.which==51||e.which==52||e.which==53||e.which==54||e.which==55||e.which==56||e.which==57||e.which==8||e.which==9)
            return true;
        else
            return false;
    });
    
    $('#hazlgnd_lvl').focusout(function(e){
        var val=parseFloat($(this).val());
        if(isNaN(val)==true)
            $(this).val('0');
        else
            $(this).val(val);
    });
    
    $('#haz_info_img1,#haz_info_img2,#haz_info_img3').error(function(){
        $(this).attr('src',base_url+'./images/img_not_available.jpg');
    });
    
    $('#haz_lgnd_img1,#haz_lgnd_img2,#haz_lgnd_img3').error(function(){
        $(this).attr('src',base_url+'./images/img_not_available.jpg');
    });
    
    //-------------------------------------------------------rock map-----------------------------------------------------------------------
    
    $('#rock_stat').click(function(){
        if(rmap[rmap_count]['mlstate']==0)
            rock_change_stat(1,rmap[rmap_count]['maplgnd_id'],1);
        if(rmap[rmap_count]['mlstate']==1)
            rock_change_stat(1,rmap[rmap_count]['maplgnd_id'],0);
    });
    
    $('#struct_stat').click(function(){
        if(rstruct[rstruct_count]['mlstate']==0)
            rock_change_stat(2,rstruct[rstruct_count]['maplgnd_id'],1);
        if(rstruct[rstruct_count]['mlstate']==1)
            rock_change_stat(2,rstruct[rstruct_count]['maplgnd_id'],0);
    });
    
    $('#rock_img1,#rock_img2,#rock_img3').error(function(){
        $(this).attr('src',base_url+'./images/img_not_available.jpg');
    });
    
    $('#haz_rock_base,#rock_age_base,#rock_group_base,#rock_struct_base').hover(
        function(){$(this).css('background-color','#fbfbfb');},
        function(){if(haz_edit_click==0)$(this).css('background-color','#ffffff');}
    );
    
    $('#rock_info_left').click(function(){
        if(rmap_count!=0)
        {
            rmap_count--;
            loadRmapData(rmap_count,0);
        }
    });
    
    $('#rock_info_right').click(function(){
        if(rmap.length>rmap_count+1)
        {
            rmap_count++;
            loadRmapData(rmap_count,0);
        }
    });
    
    $('#edit_rock_img1, #edit_rock_img2, #edit_rock_img3').click(function(){
        var f_id;
        if(this.id=='edit_rock_img1')f_id='f_edit_rock_img1';
        else if(this.id=='edit_rock_img2') f_id='f_edit_rock_img2';
        else if(this.id=='edit_rock_img3') f_id='f_edit_rock_img3';
        $('#'+f_id).click();
    });
    
    $('#f_edit_rock_img1, #f_edit_rock_img2, #f_edit_rock_img3').change(function(){
        var prev_id;
        if(this.id=='f_edit_rock_img1'){ prev_id='rock_img1'; haz_img_stat[2]['rock_img1_stat']='0'; }
        else if(this.id=='f_edit_rock_img2'){ prev_id='rock_img2'; haz_img_stat[2]['rock_img2_stat']='0'; }
        else if(this.id=='f_edit_rock_img3'){ prev_id='rock_img3'; haz_img_stat[2]['rock_img3_stat']='0'; }
        previewImg(this,prev_id);
    });
    
    $('#rem_rock_img1, #rem_rock_img2, #rem_rock_img3').click(function(){
        var rem_id;
        var inp_id;
        haz_img_stat[2]['rockid']=rmap[rmap_count]['maplgnd_id'];
        if(this.id=='rem_rock_img1')
        {
            haz_img_stat[2]['rock_img1_stat']='2';
            rem_id='rock_img1';
            inp_id='f_edit_rock_img1';
        }
        else if(this.id=='rem_rock_img2')
        {
            haz_img_stat[2]['rock_img2_stat']='2';
            rem_id='rock_img2';
            inp_id='f_edit_rock_img2';
        }
        else if(this.id=='rem_rock_img3')
        {
            haz_img_stat[2]['rock_img3_stat']='2';
            rem_id='rock_img3';
            inp_id='f_edit_rock_img3';;
        }
        reset_form($('#'+inp_id));
        removeImg(rem_id);
    });
    
    $('#new_rock_info').click(function(){
        if(haz_edit_click!=8 && haz_edit_click!=9)
        {
            r_editable(2);
            haz_edit_click=7;
            $('#rock_info_left,#rock_info_right').slideToggle('slow');
        }
    });
    
    $('#rock_info_form').click(function(){
        $('.txt_styles_2').removeClass('error').filter(function(){ return !$.trim(this.value).length}).addClass('error');
        if($('#rock_clr').val()=='')$('#rock_clr').css('border-color','#df0000');
    });
    
    $('#rock_info_form').submit(function(e){
        e.preventDefault();
        if(!$('#rock_legnd').hasClass('error') && !$('#rock_clr').hasClass('error') && $('#rock_clr').css('border-color')!='rgb(223, 0, 0)')
        {
            $('#rock_clr').css('border-color','#a2a2a2');
            if(haz_edit_click==7)
            {
                rockSaveInfo(1);
                $('#rock_info_left,#rock_info_right').slideToggle('slow');
                r_readOnly(1);
            }
            else if(haz_edit_click==8 )
            {
                save_img(3,0,0,rmap[rmap_count]['maplgnd_id'],2,'f_edit_rock_img1','f_edit_rock_img2','f_edit_rock_img3');
                rockSaveInfo(2);
                $('#rock_info_left,#rock_info_right').slideToggle('slow');
                r_readOnly(1);
            }
        }
    });
    
    $('#save_rock_age').click(function(){
        if($('#rock_age').val()!='' && !$('#rock_age').hasClass('error')) new_rock_age();
    });
    
    $('#save_rockgroup').click(function(){
        if($('#rock_group').val()!='' && !$('#rock_group').hasClass('error')) new_rock_group();
    });
    
    //-----------------------------rock structures---------------------------------------------
    
    $('#rock_struct_img1,#rock_struct_img2,#rock_struct_img3').error(function(){
        $(this).attr('src',base_url+'./images/img_not_available.jpg');
    });
    
    $('#rock_struct_left').click(function(){
        if(rstruct_count!=0)
        {
            rstruct_count--;
            loadRmapStructData(rstruct_count);
        }
    });
    
    $('#rock_struct_right').click(function(){
        if(rstruct.length>rstruct_count+1)
        {
            rstruct_count++;
            loadRmapStructData(rstruct_count);
        }
    });
    
    $('#save_rock_struct_info').click(function(){
        $('.txt_styles_2_2').removeClass('error').filter(function(){ return !$.trim(this.value).length}).addClass('error');
        if($('#rock_struct_clr').val()=='') $('#rock_struct_clr').css('border-color','#df0000');
    });
    
    $('#rock_struct_form').submit(function(e){
        e.preventDefault();
        if(!$('#rock_struct_name').hasClass('error') && !$('#rock_struct_clr').hasClass('error') && $('#rock_struct_clr').css('border-color')!='rgb(223, 0, 0)')
        {
            $('#rock_struct_clr').css('border-color','#a2a2a2');
            if(haz_edit_click==10)
            {
                new_rock_struct();
                rStruct_readOnly(1);
                $('#rock_struct_left,#rock_struct_right').slideToggle('slow');
            }
            else if(haz_edit_click==11)
            {
                save_img(4,0,0,rstruct[rstruct_count]['maplgnd_id'],2,'f_edit_rock_struct_img1','f_edit_rock_struct_img2','f_edit_rock_struct_img3');
                edit_rock_struct();
                rStruct_readOnly(1);
                $('#rock_struct_left,#rock_struct_right').slideToggle('slow');
            }
        }
    });
    
    $('#new_rock_struct').click(function(){
        if(haz_edit_click!=11 && haz_edit_click!=10)
        {
            rStruct_editable(2);
            haz_edit_click=10; 
        }
    });
    
    //-----------------------------
    
    $('#edit_rock_struct_img1, #edit_rock_struct_img2, #edit_rock_struct_img3').click(function(){
        var f_id;
        if(this.id=='edit_rock_struct_img1')f_id='f_edit_rock_struct_img1';
        else if(this.id=='edit_rock_struct_img2') f_id='f_edit_rock_struct_img2';
        else if(this.id=='edit_rock_struct_img3') f_id='f_edit_rock_struct_img3';
        $('#'+f_id).click();
    });
    
    $('#f_edit_rock_struct_img1, #f_edit_rock_struct_img2, #f_edit_rock_struct_img3').change(function(){
        var prev_id;
        if(this.id=='f_edit_rock_struct_img1'){ prev_id='rock_struct_img1'; haz_img_stat[3]['struct_img1_stat']='0'; }
        else if(this.id=='f_edit_rock_struct_img2'){ prev_id='rock_struct_img2'; haz_img_stat[3]['struct_img2_stat']='0'; }
        else if(this.id=='f_edit_rock_struct_img3'){ prev_id='rock_struct_img3'; haz_img_stat[3]['struct_img3_stat']='0'; }
        previewImg(this,prev_id);
    });
    
    $('#rem_rock_struct_img1, #rem_rock_struct_img2, #rem_rock_struct_img3').click(function(){
        var rem_id;
        var inp_id;
        haz_img_stat[3]['structid']=rstruct[rstruct_count]['maplgnd_id'];
        if(this.id=='rem_rock_struct_img1')
        {
            haz_img_stat[3]['struct_img1_stat']='2';
            rem_id='rock_struct_img1';
            inp_id='f_edit_rock_struct_img1';
        }
        else if(this.id=='rem_rock_struct_img2')
        {
            haz_img_stat[3]['struct_img2_stat']='2';
            rem_id='rock_struct_img2';
            inp_id='f_edit_rock_struct_img2';
        }
        else if(this.id=='rem_rock_struct_img3')
        {
            haz_img_stat[3]['struct_img3_stat']='2';
            rem_id='rock_struct_img3';
            inp_id='f_edit_rock_struct_img3';;
        }
        reset_form($('#'+inp_id));
        removeImg(rem_id);
    });
    
    //----------------------------------soil map----------------------------------------
    
    $('#soillgnd_base,#soil_symbol_base').hover(
        function(){$(this).css('background-color','#fbfbfb');},
        function(){if(haz_edit_click==0)$(this).css('background-color','#ffffff');}
    );
    
    $('#soillayer_stat').click(function(){
        if(m_soil[msoil_count]['mlstate']==0)
            rock_change_stat(3,m_soil[msoil_count]['soil_id'],1);
        if(m_soil[msoil_count]['mlstate']==1)
            rock_change_stat(3,m_soil[msoil_count]['soil_id'],0);
    });
    
    $('#soil_img1,#soil_img2,#soil_img3').error(function(){
        $(this).attr('src',base_url+'./images/img_not_available.jpg');
    });
    
    $('#soillgnd_left').click(function(){
        if(msoil_count!=0)
        {
            msoil_count--;
            soilLgnd_loadData(msoil_count);
        }
    });
    
    $('#soillgnd_right').click(function(){
        if(m_soil.length>msoil_count+1)
        {
            msoil_count++;
            soilLgnd_loadData(msoil_count);
        }
    });
    
    $('#edit_soil_img1, #edit_soil_img2, #edit_soil_img3').click(function(){
        var f_id;
        if(this.id=='edit_soil_img1')f_id='f_edit_soil_img1';
        else if(this.id=='edit_soil_img2') f_id='f_edit_soil_img2';
        else if(this.id=='edit_soil_img3') f_id='f_edit_soil_img3';
        $('#'+f_id).click();
    });
    
    $('#f_edit_soil_img1, #f_edit_soil_img2, #f_edit_soil_img3').change(function(){
        var prev_id;
        if(this.id=='f_edit_soil_img1'){ prev_id='soil_img1'; haz_img_stat[4]['soil_img1_stat']='0'; }
        else if(this.id=='f_edit_soil_img2'){ prev_id='soil_img2'; haz_img_stat[4]['soil_img2_stat']='0'; }
        else if(this.id=='f_edit_soil_img3'){ prev_id='soil_img3'; haz_img_stat[4]['soil_img3_stat']='0'; }
        previewImg(this,prev_id);
    });
    
    $('#rem_soil_img1, #rem_soil_img2, #rem_soil_img3').click(function(){
        var rem_id;
        var inp_id;
        haz_img_stat[4]['soilid']=m_soil[msoil_count]['soil_id'];
        if(this.id=='rem_soil_img1')
        {
            haz_img_stat[4]['soil_img1_stat']='2';
            rem_id='soil_img1';
            inp_id='f_edit_soil_img1';
        }
        else if(this.id=='rem_soil_img2')
        {
            haz_img_stat[4]['soil_img2_stat']='2';
            rem_id='soil_img2';
            inp_id='f_edit_rock_img2';
        }
        else if(this.id=='rem_soil_img3')
        {
            haz_img_stat[4]['soil_img3_stat']='2';
            rem_id='soil_img3';
            inp_id='f_edit_soil_img3';;
        }
        reset_form($('#'+inp_id));
        removeImg(rem_id);
    });
    
    $('#new_soil_lgnd').click(function(){
        if(haz_edit_click!=13 && haz_edit_click!=14)
        {
            haz_edit_click=13;
            soilLgnd_editable();
        }
    });
    
    $('#save_soil_lgnd').click(function(){
        $('.txt_styles_2').removeClass('error').filter(function(){ return !$.trim(this.value).length}).addClass('error');
        if($('#soil_clr').val()=='') $('#soil_clr').css('border-color','#df0000');
    });
    
    $('#soil_form').submit(function(e){
        e.preventDefault();
        var layer1="";
        var layer2="";
        var layer3="";
        var layer4="";
        $('#soillayer_cont1 span').each(function(){
            layer1+=$(this).find('label').text()+'%';
        });
            
        $('#soillayer_cont2 span').each(function(){
            layer2+=$(this).find('label').text()+'%';
        });
            
        $('#soillayer_cont3 span').each(function(){
            layer3+=$(this).find('label').text()+'%';
        });
           
        $('#soillayer_cont4 span').each(function(){
            layer4+=$(this).find('label').text()+'%';
        });
        if(!$('#soil_name').hasClass('error') && !$('#soil_clr').hasClass('error') && $('#soil_clr').css('border-color')!='rgb(223, 0, 0)')
        {
            $('#soil_clr').css('border-color','#a2a2a2');
            if(haz_edit_click==13)
            {
                soillgnd_new(layer1,layer2,layer3,layer4);
                $('#soillgnd_left,#soillgnd_right').slideToggle('slow');
            }
            else if(haz_edit_click==14)
            {
                save_img(5,0,0,m_soil[msoil_count]['soil_id'],3,'f_edit_soil_img1','f_edit_soil_img2','f_edit_soil_img3');
                soilLgnd_edit(m_soil[msoil_count]['soil_id'],$('#soil_name').val(),$('#soil_desc').val(),$('#soil_clr').val(),m_soil[msoil_count]['layer_id'],layer1,layer2,layer3,layer4);
                soilLgnd_readOnly();
                $('#soillgnd_left,#soillgnd_right').slideToggle('slow');
            }
        }
    });
    
    $('#addLayer_1').click(function(){
        if($('#soilSymbol_drpdwn1').val()!=null)
        {
            document.getElementById('soillayer_cont1').innerHTML+='<span id="'+$('#soilSymbol_drpdwn1 option:selected').attr('id')+'"><label>'+$('#soilSymbol_drpdwn1').val()+'</label><button onclick="removeSoilLayer(\'soilSymbol_drpdwn1\', \''+$('#soilSymbol_drpdwn1 option:selected').attr('id')+'\', \''+$('#soilSymbol_drpdwn1').val()+'\')">X</button></span>';
            $('#soilSymbol_drpdwn1 option[value="'+$('#soilSymbol_drpdwn1').val()+'"]').remove();
        }
    });
    
    $('#addLayer_2').click(function(){
        if($('#soilSymbol_drpdwn2').val()!=null)
        {
            document.getElementById('soillayer_cont2').innerHTML+='<span id="'+$('#soilSymbol_drpdwn2 option:selected').attr('id')+'"><label>'+$('#soilSymbol_drpdwn2').val()+'</label><button onclick="removeSoilLayer(\'soilSymbol_drpdwn2\', \''+$('#soilSymbol_drpdwn2 option:selected').attr('id')+'\', \''+$('#soilSymbol_drpdwn2').val()+'\')">X</button></span>';
            $('#soilSymbol_drpdwn2 option[value="'+$('#soilSymbol_drpdwn2').val()+'"]').remove();
        }
    });
    
    $('#addLayer_3').click(function(){
        if($('#soilSymbol_drpdwn3').val()!=null)
        {
            document.getElementById('soillayer_cont3').innerHTML+='<span id="'+$('#soilSymbol_drpdwn3 option:selected').attr('id')+'"><label>'+$('#soilSymbol_drpdwn3').val()+'</label><button onclick="removeSoilLayer(\'soilSymbol_drpdwn3\', \''+$('#soilSymbol_drpdwn3 option:selected').attr('id')+'\', \''+$('#soilSymbol_drpdwn3').val()+'\')">X</button></span>';
            $('#soilSymbol_drpdwn3 option[value="'+$('#soilSymbol_drpdwn3').val()+'"]').remove();
        }
    });
    
    $('#addLayer_4').click(function(){
        if($('#soilSymbol_drpdwn4').val()!=null)
        {
            document.getElementById('soillayer_cont4').innerHTML+='<span id="'+$('#soilSymbol_drpdwn4 option:selected').attr('id')+'"><label>'+$('#soilSymbol_drpdwn4').val()+'</label><button onclick="removeSoilLayer(\'soilSymbol_drpdwn4\', \''+$('#soilSymbol_drpdwn4 option:selected').attr('id')+'\', \''+$('#soilSymbol_drpdwn4').val()+'\')">X</button></span>';
            $('#soilSymbol_drpdwn4 option[value="'+$('#soilSymbol_drpdwn4').val()+'"]').remove();
        }
    });
    
    $('#save_soilsym').click(function(){
        if($('#soil_symbol1').val()!='' && !$('#soil_symbol1').hasClass('error')) soilSymbol_new();
    });
    
    //-------------------------profile--------------------------
    
    $('#profile').click(function(){
       getUserProfile(1,username);
    });
    
    $('#manage_acct').click(function(){
        $('#changePass').fadeIn('fast','swing');
    });
    
    $('#change_pass').click(function(){
        if($('#new_pass').val()==$('#conf_pass').val() && $('#new_pass').val()!="" && $('#conf_pass').val()!="")
            changePass(2,username);
        else
        {
            $('#new_pass').animate({backgroundColor:'#ff0000'});
            $('#conf_pass').animate({backgroundColor:'#ff0000'});  
        }
    });
    
    $('#cancel_pass').click(function(){
        $('#curr_pass,#new_pass,#conf_pass').val('');
        $('#changePass').fadeOut('fast','swing');
        $("#curr_pass,#new_pass,#conf_pass").css('background-color','#ffffff');
    });
    
    $('#edit_prof').click(function(){
        if($('#edt_buttons').css('display')=='none')
        {
            $('#edt_buttons').fadeIn('fast','swing');
            $('#edt_buttons').css('display','block');
            prof_editable();
        }
    });
    
    $('#edit_prof_info').click(function(){
	if($('#prof_lname').val() && $('#prof_fname').val() && $('#prof_mname').val())
	{
	    editUserProfile();
	    $('#edt_buttons').fadeOut('fast','swing');
	}
    });
    
    $('#cancel_prof_info').click(function(){
        $('#edt_buttons').fadeOut('fast','swing');
        getUserProfile(1,username);
        prof_readOnly();
    });
    
    $('#prof_container').hover(
        function(){$('#edit_prof').css('visibility','visible');},
        function(){$('#edit_prof').css('visibility','hidden');}
    );
    
    $('#acct_container').hover(
        function(){$('#manage_acct').css('visibility','visible');},
        function(){$('#manage_acct').css('visibility','hidden'); }
    );
    
    $("#curr_pass").focus(function(){
        $("#curr_pass").css('background-color','#ffffff');
    });
    
    $('#new_pass,#conf_pass').focus(function(){
        $('#new_pass').animate({backgroundColor:'#ffffff'});
        $('#conf_pass').animate({backgroundColor:'#ffffff'});  
    });
    
    //------------------account management-------------------------------------
    
    $('#search_account').submit(function(e){
        e.preventDefault();
        if($('#search_acct').val()!='') searchAccount($('#search_acct').val());
    });
    
    $('#adm_edit_prof').click(function(){
        adm_editable();
        $('#acct_prof_cont').css('background-color','#fbfbfb');
        $('#adm_prof_buttons').css('visibility','visible');
    });
    
    $('#adm_edt_prof').click(function(){
	if($('#acct_lname').val() && $('#acct_fname').val() && $('#acct_mname').val())
	{
	    adm_editProfile(srch_uname);
	    $('#adm_prof_buttons').css('visibility','hidden');
	}
    });
    
    $('#adm_cancel_prof').click(function(){
        adm_readOnly();
        $('#adm_prof_buttons').css('visibility','hidden');
    });
    
    $('#adm_prof').hover(
        function(){$('#adm_edit_prof').css('visibility','visible');},
        function(){$('#adm_edit_prof').css('visibility','hidden');}
    );
    
    $('#adm_acct').hover(
        function(){$('#adm_manage_acct').css('visibility','visible');},
        function(){$('#adm_manage_acct').css('visibility','hidden');}
    );
    
    $('#adm_manage_acct').click(function(){
        $('#adm_changePass').css('display','block');
    });
    
    
    $('#adm_change_pass').click(function(){
        changePass(1,srch_uname);
        $('#adm_changePass').css('display','none');
    });
    
    $('#adm_cancel_pass').click(function(){
        $('#acct_newpass,#acct_confpass').val('');
        $('#adm_changePass').css('display','none');
    });
    
    $('#acct_search').click(function(){
        $('#acct_search_cont').slideToggle();
        if( document.getElementById('acct_search').innerHTML=='-')
            document.getElementById('acct_search').innerHTML='+';
        else
            document.getElementById('acct_search').innerHTML='-';
    });
    
    $('#toggle_prof').click(function(){
        $('#acct_prof_cont').slideToggle();
        if( document.getElementById('toggle_prof').innerHTML=='-')
            document.getElementById('toggle_prof').innerHTML='+';
        else
            document.getElementById('toggle_prof').innerHTML='-';
    });
    
    $('#toggle_acct').click(function(){
        $('#adm_acct_cont').slideToggle();
         if( document.getElementById('toggle_acct').innerHTML=='-')
            document.getElementById('toggle_acct').innerHTML='+';
        else
            document.getElementById('toggle_acct').innerHTML='-';
    });
    
    $('#acct_mgt').hover(
        function(){$('#adm_add_acct').css('visibility','visible');},
        function(){$('#adm_add_acct').css('visibility','hidden');}
    );
    
    $('#adm_add_acct').click(function(){
        $('#acct_search_cont').slideToggle();
        $('#adm_prof,#adm_acct').fadeOut('fast','swing');
        $('#adm_new_acct').fadeIn('fast','swing');
    });
    
    $('#acct_nusername').focusout(function(){
       checkUsername($(this).val()); 
    });
    
    $('#adm_new_acctsave').click(function(){
        if(!$('#acct_nusername').hasClass('error') && $('#acct_nusername').val()!="" && $('#acct_nlname').val()!="" && $('#acct_nfname').val()!="" && $('#acct_nmname').val()!="")
        {
            newAccount();
            $('#acct_nusername,#acct_nlname,#acct_nfname,#acct_nmname,#acct_naddress,#acct_ncontactno,#acct_ncompany').val('');
        }
    });
    
    $('#adm_new_acctcancel').click(function(){
        $('#acct_search_cont').slideToggle();
        $('#adm_new_acct').fadeOut('fast','swing');
    });
});

//----------------------------------------------------hazard map functions---------------------------------------------------------------------------

function getHazInfoResult(count,chk)
{
    $.ajax({
           type:"GET",
           url:base_url+"index.php/adm_controller/get_haz_info",
           cache:false,
           success:function(result)
           {
            haz_info_res=[];
            haz_info_res=JSON.parse(result);
            haz_readOnly(0);
            if(haz_edit_click==0){loadHazData(haz_count);}
            if(chk==1)
            {
                get_haz_lvl_info(haz_info_res[haz_count]['haz_id']);
                get_haz_lvl(2,haz_info_res[haz_count]['haz_id']);
            }
            },
           complete:function(){},
           error:function(){alert('gethazinforesulterror');}
    });
}

function haz_save_info()
{
    if(haz_edit_click==1)
    {
        $.ajax({
            type:'POST',
            url:base_url+'index.php/adm_controller/new_haz_info',
            data:{haz_name:$('#haz_name').val(),haz_desc:$('#haz_desc').val(),l_editor:username},
            cache:false,
            beforeSend:function(){ $('#haz_info_loading_bar').fadeIn('fast','swing');},
            success:function(result)
            {
                haz_count=haz_info_res.length;
                var l_id=JSON.parse(result);
                save_img(1,l_id,0,0,1,'f_edit_haz_img1','f_edit_haz_img2','f_edit_haz_img3');
                get_haz_lvl_info(l_id);
            },
            complete:function(){
                $('#haz_info_loading_bar').fadeOut('fast','swing');
                $('#haz_info_left,#haz_info_right').slideToggle('slow');
            },
            error:function(xhr,status,errorThrown){alert(xhr.responseText);}
        });
    }
    else if(haz_edit_click==2)
    {
        $.ajax({
            type:'POST',
            url:base_url+'index.php/adm_controller/edit_haz_info',
            data:{haz_id:haz_info_res[haz_count]['haz_id'],haz_name:$('#haz_name').val(),haz_desc:$('#haz_desc').val(),l_editor:username,haz_image_stat:haz_img_stat},
            cache:false,
            beforeSend:function(){$('#haz_info_loading_bar').fadeIn('fast','swing');},
            success:function()
            {
                getHazInfoResult(haz_count,0);
            },
            complete:function(){
                haz_img_stat[0]['haz_image1_stat']='0';
                haz_img_stat[0]['haz_image2_stat']='0';
                haz_img_stat[0]['haz_image3_stat']='0';
                $('#haz_info_loading_bar').fadeOut('fast','swing');
                $('#haz_info_left,#haz_info_right').slideToggle('slow');
            },
            error:function(jqXHR,status,errorThrown){alert('hazsaveinfoerror');}
        });
    }
}

function hazlgnd_save_info()
{
    if(haz_edit_click==4)
    {
        $.ajax({
            type:'POST',
            url:base_url+'index.php/adm_controller/new_hazlgnd',
            data:{haz_id:$('#haz_drpwdwn').val(),hazlgnd_name:$('#hazlgnd_name').val(),hazlgnd_lvl:$('#hazlgnd_lvl').val(),hazlgnd_clr:'#'+$('#hazlgnd_clr').val(),hazlgnd_desc:$('#hazlgnd_desc').val(),l_editor:username},
            cache:false,
            beforeSend:function(){$('#haz_lgnd_loading_bar').fadeIn('fast','swing');},
            success:function(result)
            {
                var l_id=JSON.parse(result);
                save_img(6,0,l_id,0,2,'f_edit_hazlgnd_img1','f_edit_hazlgnd_img2','f_edit_hazlgnd_img3');
                
            },
            complete:function()
            {
                $('#haz_lgnd_loading_bar').fadeOut('fast','swing');
                $('#haz_lgnd_left,#haz_lgnd_right').slideToggle('slow');
            },
            error:function(){alert('newlgnderror');}
        });
    }
    else if(haz_edit_click==5)
    {
        $.ajax({
            type:'POST',
            url:base_url+'index.php/adm_controller/edit_haz_lgnd',
            data:{haz_id:$('#haz_drpwdwn').val(),hazlgnd_id:haz_lvl[haz_lvl_count]['hazlgnd_id'],hazlgnd_name:$('#hazlgnd_name').val(),hazlgnd_lvl:$('#hazlgnd_lvl').val(),hazlgnd_clr:'#'+$('#hazlgnd_clr').val(),hazlgnd_desc:$('#hazlgnd_desc').val(),l_editor:username,hazlgnd_image_stat:haz_img_stat},
            cache:false,
            beforeSend:function(){$('#haz_lgnd_loading_bar').fadeIn('fast','swing');},
            success:function()
            {
                haz_img_stat[1]['hazlgnd_image1_stat']=0;
                haz_img_stat[1]['hazlgnd_image2_stat']=0;
                haz_img_stat[1]['hazlgnd_image3_stat']=0;
                save_img(2,$('#haz_drpwdwn').val(),haz_lvl[haz_lvl_count]['hazlgnd_id'],0,2,'f_edit_hazlgnd_img1','f_edit_hazlgnd_img2','f_edit_hazlgnd_img3');
            },
            complete:function(){
                $('#haz_lgnd_loading_bar').fadeOut('fast','swing');
                $('#haz_lgnd_left,#haz_lgnd_right').slideToggle('slow');
            },
            error:function(jqXHR,status,errorThrown){alert('hazlgndsaveerror');}
        });
    }
}

function haz_change_stat(haz_stat)
{
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/haz_change_state/'+haz_info_res[haz_count]['haz_id']+'/'+haz_stat,
        cache:false,
        success:function(result){
        var res=JSON.parse(result);
        if(res[0]['haz_stat']==1)
        {
            haz_info_res[haz_count]['haz_stat']=1;
            $('#haz_stat').text('Active');
        }
        else
        {
            haz_info_res[haz_count]['haz_stat']=0;
            $('#haz_stat').text('Inactive');
        }
        },
        error:function(){alert('changeshazstaterror');}
    });
}

function hazLgnd_change_stat(hazlgnd_stat)
{
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/hazLgnd_change_state/'+haz_lvl[haz_lvl_count]['hazlgnd_id']+'/'+hazlgnd_stat,
        cache:false,
        success:function(result){
        var res=JSON.parse(result);
        if(res[0]['hazlgnd_state']==1)
        {
            haz_lvl[haz_lvl_count]['hazlgnd_stat']=1;
            $('#hazlgnd_stat').text('Active');
        }
        else
        {
            haz_lvl[haz_lvl_count]['hazlgnd_stat']=0;
            $('#hazlgnd_stat').text('Inactive');
        }
        },
        error:function(){alert('hazlgndchangestaterror');}
    });
}

function get_haz_lvl_info(haz_id)
{
    var haz_lvl_names=new Array();
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/get_haz_lvl/'+haz_id,
        cache:false,
        success:function(result){
            haz_lvl_names=JSON.parse(result);
            $('#haz_lvl').empty();
                var checkEmpty=$.isEmptyObject(haz_lvl_names);
                if(checkEmpty==true)
                {
                    var row='<tr><td style="border:solid 1px #c1c1c1; background-color:#ffffff">No Legend Found</td>';
                    $('#haz_lvl').append(row);
                }
                if(haz_lvl_names.length!=0 && checkEmpty==false)
                {
                    for(var x=0;x<haz_lvl_names.length;x++)
                    {
                        var row='<tr style="height:30px;"><td style="border:solid 1px; max-width:45px; border-color:'+haz_lvl_names[x]['hazlgnd_clr']+'; background-color:'+haz_lvl_names[x]['hazlgnd_clr']+'; color:#f0f0f0">'+haz_lvl_names[x]['hazlgnd_clr']+'</td><td style="background-color:#ffffff">'+haz_lvl_names[x]['hazlgnd_name']+'</td>';
                        $('#haz_lvl').append(row);
                    }
                    $('#a_haz').animate({marginTop:'+=10px'},'fast');
                }
        },
        complete:function(){
        },
        error:function(){alert('gethazlevelerror');}
    });
}

function get_haz_lvl(frm,haz_id)
{
    var haz_lvl_names=new Array();
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/get_haz_lvl/'+haz_id,
        cache:false,
        success:function(result){
            haz_lvl=[];
            haz_lvl=JSON.parse(result);
            haz_lvl_names=JSON.parse(result);
        },
        complete:function(){
            if(frm==1)
            {
                $('#haz_lvl').empty();
                var checkEmpty=$.isEmptyObject(haz_lvl_names);
                if(checkEmpty==true)
                {
                    var row='<tr><td style="border:solid 1px #c1c1c1; background-color:#ffffff">No Legend Found</td>';
                    $('#haz_lvl').append(row);
                }
                if(haz_lvl_names.length!=0 && checkEmpty==false)
                {
                    for(var x=0;x<haz_lvl_names.length;x++)
                    {
                        var row='<tr style="height:30px;"><td style="border:solid 1px; max-width:45px; border-color:'+haz_lvl_names[x]['hazlgnd_clr']+'; background-color:'+haz_lvl_names[x]['hazlgnd_clr']+'; color:#f0f0f0">'+haz_lvl_names[x]['hazlgnd_clr']+'</td><td style="background-color:#ffffff">'+haz_lvl_names[x]['hazlgnd_name']+'</td>';
                        $('#haz_lvl').append(row);
                    }
                    $('#a_haz').animate({marginTop:'+=10px'},'fast');
                }
            }
            if(frm==2)loadHazLvl(haz_lvl_count);
            if(frm==3)
            {
                haz_lvl_count=haz_lvl.length-1;
                haz_lvl[haz_lvl_count]['hazlgnd_id']=haz_lvl[haz_lvl.length-1]['hazlgnd_id'];
                loadHazLvl(haz_lvl.length-1);
                $('#haz_drpwdwn').val(haz_lvl[haz_lvl.length-1]['haz_id']);
            }
        },
        error:function(){alert('gethazlevelerror');}
    });
}

function loadHazData(count)
{
    haz_readOnly(0);
    $('#haz_name').val('');
    $('#haz_desc').val('');
        
    removeImg('haz_info_img1');
    removeImg('haz_info_img2');
    removeImg('haz_info_img3');
    reset_form($('#f_edit_haz_img1'));
    reset_form($('#f_edit_haz_img2'));
    reset_form($('#f_edit_haz_img3'));
        
    $('#haz_name').val(haz_info_res[count]['haz_name']);
    $('#haz_desc').val(haz_info_res[count]['haz_desc']);
        
    if(haz_info_res[count]['haz_stat']==1)
        $('#haz_stat').text('Active');
    else
        $('#haz_stat').text('Inactive');
            
    $('#haz_info_img1').attr('src',base_url+'../uploads/geohazard/'+haz_info_res[count]['haz_image1']);
    $('#haz_info_img1').attr('alt',haz_info_res[count]['haz_image1']);
    $('#haz_info_img1').attr('title',haz_info_res[count]['haz_image1']);
            
    $('#haz_info_img2').attr('src',base_url+'../uploads/geohazard/'+haz_info_res[count]['haz_image2']);
    $('#haz_info_img2').attr('alt',haz_info_res[count]['haz_image2']);
    $('#haz_info_img2').attr('title',haz_info_res[count]['haz_image2']);
           
    $('#haz_info_img3').attr('src',base_url+'../uploads/geohazard/'+haz_info_res[count]['haz_image3']);
    $('#haz_info_img3').attr('alt',haz_info_res[count]['haz_image3']);
    $('#haz_info_img3').attr('title',haz_info_res[count]['haz_image3']);

    get_haz_drp_names();
}

function loadHazLvl(count)
{
    $('#hazlgnd_name').val('');
    $('#hazlgnd_lvl').val('');
    $('#hazlgnd_desc').val('');
    $('#hazlgnd_clr').val('');
    
    removeImg('haz_lgnd_img1');
    removeImg('haz_lgnd_img2');
    removeImg('haz_lgnd_img3');
    
    reset_form($('#f_edit_hazlgnd_img1'));
    reset_form($('#f_edit_hazlgnd_img2'));
    reset_form($('#f_edit_hazlgnd_img3'));
    
    if(haz_edit_click!=4)
    {
    if(haz_lvl[count]['hazlgnd_stat']==1)
        $('#hazlgnd_stat').text('Active');
    else
        $('#hazlgnd_stat').text('Inactive');
    
    $('#hazlgnd_name').val(haz_lvl[count]['hazlgnd_name']);
    $('#hazlgnd_lvl').val(haz_lvl[count]['hazlgnd_lvl']);
    $('#hazlgnd_desc').val(haz_lvl[count]['hazlgnd_desc']);
    $('#hazlgnd_clr').val(haz_lvl[count]['hazlgnd_clr'].replace('#',''));
    $('#hazlgnd_clr_right').css('background-color',haz_lvl[count]['hazlgnd_clr']);

    $('#haz_lgnd_img1').attr('src',base_url+'../uploads/geohazard/'+haz_lvl[count]['hazlgnd_image1']);
    $('#haz_lgnd_img1').attr('alt',haz_lvl[count]['hazlgnd_image1']);
    $('#haz_lgnd_img1').attr('title',haz_lvl[count]['hazlgnd_image1']);
          
    $('#haz_lgnd_img2').attr('src',base_url+'../uploads/geohazard/'+haz_lvl[count]['hazlgnd_image2']);
    $('#haz_lgnd_img2').attr('alt',haz_lvl[count]['hazlgnd_image2']);
    $('#haz_lgnd_img2').attr('title',haz_lvl[count]['hazlgnd_image2']);
           
    $('#haz_lgnd_img3').attr('src',base_url+'../uploads/geohazard/'+haz_lvl[count]['hazlgnd_image3']);
    $('#haz_lgnd_img3').attr('alt',haz_lvl[count]['hazlgnd_image3']);
    $('#haz_lgnd_img3').attr('title',haz_lvl[count]['hazlgnd_image3']);
    }
}

function get_haz_drp_names()
{
    var haz_names=new Array();
    var chk=0;
    if(haz_edit_click==0)chk=2;
    else if(haz_edit_click==4)chk=1;
    else if(haz_edit_click==5)chk=2;
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/get_haz_drp_list/'+chk,
        cache:false,
        success:function(result)
        {
          haz_names=[];
          haz_names=JSON.parse(result);
          $('.haz_drp_names').remove();
          for(var x=0;x<haz_names.length;x++)
          {
            $('#haz_drpwdwn').append('<option class="haz_drp_names" value="'+haz_names[x]['haz_id']+'">'+haz_names[x]['haz_name']+'</option>');
          }
          
        },
        error:function(){alert('gethazdropnameserror');}
    });
}

function haz_readOnly(chk)
{
    $('#haz_tbl').css('display','block');
    $('#a_haz').css('display','block');
    $('.haztbl').css('display','block');
    
    if(chk==1 || chk==0)
    {
        $('#haz_name,#haz_desc').attr('readonly','readonly');
        $('#haz_name,#haz_desc').attr('disabled','true');
        $('#haz_name,#haz_desc').attr('class','txt_styles_1');
        $('#haz_lvl').fadeIn('fast','swing');
        $('#lbl_lvl').fadeIn('fast','swing');
        $('#save_haz').css('visibility','hidden');
        $('#cancel_haz').css('visibility','hidden');
        haz_edit_click=0;
    }
    if(chk==2 || chk==0)
    {
        $('#hazlgnd_name,#hazlgnd_lvl,#hazlgnd_desc').attr('readonly','readonly');
        $('#hazlgnd_name,#hazlgnd_lvl,#hazlgnd_desc').attr('disabled','true');
        $('#hazlgnd_name,#hazlgnd_lvl,#hazlgnd_desc').attr('class','txt_styles_1_2');
        $('#hazlgnd_clr').css('cursor','default');
        $('#save_haz_lgnd').css('visibility','hidden');
        $('#cancel_haz_lgnd').css('visibility','hidden');
        haz_edit_click=0;
    }
}

function haz_editable(stat)
{
    $('#haz_tbl').css('display','none');
    $('#a_haz').css('display','none');
    $('.haztbl').css('display','none');
    
    if(stat==1)
    {
        $('#haz_info_base').css('background-color','#fbfbfb');
        $('#haz_name,#haz_desc').attr('class','txt_styles_2');
        $('#haz_info_cont').css('margin-left','8%');
        $('#haz_lvl').fadeOut('fast','swing');
        $('#lbl_lvl').fadeOut('fast','swing');
        $('#haz_name').val('');
        $('#haz_desc').val('');
        $('#haz_name,#haz_desc').removeAttr('readonly');
        $('#haz_name,#haz_desc').removeAttr('disabled');
        removeImg('haz_info_img1');
        removeImg('haz_info_img2');
        removeImg('haz_info_img3');
        
        change_img_btn(1,'edit_haz_img1');
        change_img_btn(1,'edit_haz_img2');
        change_img_btn(1,'edit_haz_img3');
        
        $('#save_haz').val('Save');
        $('#save_haz').css('visibility','visible');
        $('#cancel_haz').css('visibility','visible');
    }
    else if(stat==2)
    {
        $('#haz_name,#haz_desc').removeAttr('readonly');
        $('#haz_name,#haz_desc').removeAttr('disabled');
        
        change_img_btn(2,'edit_haz_img1');
        change_img_btn(2,'edit_haz_img2');
        change_img_btn(2,'edit_haz_img3');
        
        $('#haz_name,#haz_desc').attr('class','txt_styles_2');
        $('#haz_lvl').fadeOut('fast','swing');
        $('#lbl_lvl').fadeOut('fast','swing');
        
        $('#save_haz').val('Save Changes');
        $('#save_haz').css('visibility','visible');
        $('#cancel_haz').css('visibility','visible');
        
    }
    else if(stat==4)
    {
        haz_edit_click=4;
        get_haz_drp_names();
        
        $('#hazlgnd_name,#hazlgnd_lvl,#hazlgnd_desc').removeAttr('readonly');
        $('#hazlgnd_name,#hazlgnd_lvl,#hazlgnd_desc').removeAttr('disabled');
        
        $('#hazlgnd_name,#hazlgnd_lvl').attr('class','txt_styles_2_1');
        $('#hazlgnd_desc').attr('class','txt_styles_2');
        $('#haz_legnd_cont').css('margin-left','8%');
        $('#hazlgnd_name,#hazlgnd_lvl,#hazlgnd_desc,#hazlgnd_clr').val('');
        $('#hazlgnd_clr').css('cursor','text');
        $('#hazlgnd_clr_right').css('background-color','#ffffff');
        
        removeImg('haz_lgnd_img1');
        removeImg('haz_lgnd_img2');
        removeImg('haz_lgnd_img3');
        
        change_img_btn(1,'edit_hazlgnd_img1');
        change_img_btn(1,'edit_hazlgnd_img2');
        change_img_btn(1,'edit_hazlgnd_img3');
        
        $('#save_haz_lgnd').val('Save');
        $('#save_haz_lgnd').css('visibility','visible');
        $('#cancel_haz_lgnd').css('visibility','visible');
    }
    else if(stat==5)
    {
        $('#hazlgnd_name,#hazlgnd_lvl,#hazlgnd_desc').removeAttr('readonly');
        $('#hazlgnd_name,#hazlgnd_lvl,#hazlgnd_desc').removeAttr('disabled');
        
        change_img_btn(2,'edit_hazlgnd_img1');
        change_img_btn(2,'edit_hazlgnd_img2');
        change_img_btn(2,'edit_hazlgnd_img3');
        
        $('#hazlgnd_name,#hazlgnd_lvl,#hazlgnd_desc').attr('class','txt_styles_2_1');
        $('#hazlgnd_clr').css('cursor','text');
        
        $('#save_haz_lgnd').val('Save Changes');
        $('#save_haz_lgnd').css('visibility','visible');
        $('#cancel_haz_lgnd').css('visibility','visible');
    }
}

function haz_drp_hover(id){ $('#'+id).css('background-color','#b7d7e8'); }

function haz_drp_leave(id){ $('#'+id).css('background-color',''); }

//----------------------------------------------------rock map functions------------------------------------

function getRockInfoResult(count,chk)
{
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/get_rock_info',
        cache:false,
        success:function(result){
            rmap=[];
            rmap=JSON.parse(result);
        },
        complete:function(){ loadRmapData(count); },
        error:function(){ alert('rockmapinfoerror');}
    });
}

function rockSaveInfo(chk)
{
    if(chk==1)
    {
        $.ajax({
            type:'POST',
            url:base_url+'index.php/adm_controller/new_rock_info',
            data:{rockname:$('#rock_legnd').val(),rockdesc:$('#rock_name').val(),rockdesc2:$('#rock_desc').val(),rockclr:'#'+$('#rock_clr').val(),state:'1',ageid:$('#rock_age_drpdwn').val(),groupid:$('#rock_group_drpdwn').val(),l_editor:username},
            cache:false,
            beforeSend:function(){$('#rock_loading_bar').fadeIn('fast','swing');},
            success:function(result){
                rmap_count=rmap.length;
                var l_id=JSON.parse(result);
                save_img(3,0,0,l_id,2,'f_edit_rock_img1','f_edit_rock_img2','f_edit_rock_img3');
            },
            complete:function(){ $('#rock_loading_bar').fadeOut('fast','swing');},
            error:function(){alert('newrockinfoerror');}
        });
    }
    if(chk==2)
    {
        $.ajax({
            type:'POST',
            url:base_url+'index.php/adm_controller/edit_rock_info',
            data:{rockid:rmap[rmap_count]['maplgnd_id'],rockname:$('#rock_legnd').val(),rockdesc:$('#rock_name').val(),rockdesc2:$('#rock_desc').val(),rockclr:'#'+$('#rock_clr').val(),state:'1',ageid:$('#rock_age_drpdwn').val(),groupid:$('#rock_group_drpdwn').val(),l_editor:username,haz_image_stat:haz_img_stat},
            beforeSend:function(){$('#rock_loading_bar').fadeIn('fast','swing');},
            success:function(result){
                getRockInfoResult(rmap_count,0);
                haz_img_stat[2]['rock_img1_stat']=0;
                haz_img_stat[2]['rock_img2_stat']=0;
                haz_img_stat[2]['rock_img3_stat']=0;
            },
            complete:function(){ $('#rock_loading_bar').fadeOut('fast','swing'); }
        });
    }
}

function rock_change_stat(lgnd_type,lgnd_id,rock_stat)
{
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/rock_change_state/'+lgnd_id+'/'+rock_stat,
        cache:false,
        success:function(result){
        var res=JSON.parse(result);
        if(lgnd_type==1)
        {
            if(res[0]['rock_stat']==1)
            {
                rmap[rmap_count]['mlstate']=1;
                $('#rock_stat').text('Active');
            }
            else if(res[0]['rock_stat']==0 && lgnd_type==1)
            {
                rmap[rmap_count]['mlstate']=0;
                $('#rock_stat').text('Inactive');
            }
        }
        else if(lgnd_type==2)
        {
            if(res[0]['rock_stat']==1)
            {
                rstruct[rstruct_count]['mlstate']=1;
                $('#struct_stat').text('Active'); 
            }
            else if(res[0]['rock_stat']==0)
            {
                rstruct[rstruct_count]['mlstate']=0;
                $('#struct_stat').text('Inactive'); 
            }
        }
        else if(lgnd_type==3)
        {
            if(res[0]['rock_stat']==1)
            {
                m_soil[msoil_count]['mlstate']=1;
                $('#soillayer_stat').text('Active'); 
            }
            else if(res[0]['rock_stat']==0)
            {
                m_soil[msoil_count]['mlstate']=0;
                $('#soillayer_stat').text('Inactive'); 
            }
        }
        },
        error:function(){alert('changesrockstaterror');}
    });
}


function get_rock_age(chk)
{
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/get_rock_age',
        cache:false,
        success:function(result)
        {
            rockage_res=JSON.parse(result);
            if(chk==1)
            {
                $('.rockage').remove();
                $('#rock_age_drpdwn').append('<option value="0" class="rockage">No Age</option>');
                for(var x=0;x<rockage_res.length;x++)
                {
                    $('#rock_age_drpdwn').append('<option value="'+rockage_res[x]['rage_id']+'" class="rockage">'+rockage_res[x]['rage_name']+'</option>');
                }
                if(rmap[rmap_count]['mlgnd_ageid']!=null && haz_edit_click!=7)
                $('#rock_age_drpdwn').val(rmap[rmap_count]['mlgnd_ageid']);
                else $('#rock_age_drpdwn').val(0);
            }
            else if(chk==2)
            {
                $('.rage_list').remove();
                for(var x=0,z=1;x<rockage_res.length;x++,z++)
                {
                    $('#rock_ageList').append('<tr id="'+rockage_res[x]['rage_id']+'" class="rage_list"><td style="border:solid 1px #9b9b9b">'+z+'</td>'+'<td style="text-align:left;border:solid 1px #9b9b9b">'+rockage_res[x]['rage_name']+'</td></tr>');
                }
            }
        }
    });
}

function get_rock_group(chk)
{
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/get_rock_group',
        cache:false,
        success:function(result)
        {
            rockgroup_res=JSON.parse(result);
            if(chk==1)
            {
                $('.rockgroup').remove();
                $('#rock_group_drpdwn').append('<option value="0" class="rockgroup">No group</option>');
                for(var x=0;x<rockgroup_res.length;x++)
                {
                    $('#rock_group_drpdwn').append('<option value="'+rockgroup_res[x]['rgroup_id']+'" class="rockgroup">'+rockgroup_res[x]['rgroup_name']+'</option>');
                }
                if(rmap[rmap_count]['mlgnd_groupid']!=null && haz_edit_click!=7)
                $('#rock_group_drpdwn').val(rmap[rmap_count]['mlgnd_groupid']);
                else $('#rock_group_drpdwn').val(0);
            }
            else if(chk==2)
            {
                $('.rgroup_list').remove();
                for(var x=0,z=1;x<rockgroup_res.length;x++,z++)
                {
                    $('#rock_groupList').append('<tr class="rgroup_list"><td style="border:solid 1px #9b9b9b">'+z+'</td>'+'<td style="text-align:left;border:solid 1px #9b9b9b">'+rockgroup_res[x]['rgroup_name']+'</td></tr>');
                }
            }
        }
    });
}

function new_rock_age()
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/new_rock_age',
        data:{rage:$('#rock_age').val()},
        cache:false,
        success:function(){},
        complete:function(){get_rock_age(2);$('#rock_age').val('');},
        error:function(){alert("newrockageerror");}
    });
}

function new_rock_group()
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/new_rock_group',
        data:{rgroup:$('#rock_group').val()},
        cache:false,
        success:function(){},
        complete:function(){get_rock_group(2);$('#rock_group').val('');},
        error:function(){alert('newrockgrouperror');}
    });
}

function loadRmapData(count)
{
    $('#rock_legnd').val('');
    $('#rock_name').val('');
    $('#rock_desc').val('');
    $('#rock_clr').val('');
    
    removeImg('rock_img1');
    removeImg('rock_img2');
    removeImg('rock_img3');
    reset_form($('#f_edit_rock_img1'));
    reset_form($('#f_edit_rock_img2'));
    reset_form($('#f_edit_rock_img3'));
    
    if(rmap[count]['mlgnd_desc2']==null)
    {
        $('#rock_desc').animate({'height':'14px'},'fast');
        $('#rock_desc').animate({'minHeight':'14px'},'fast');
        $('#rock_desc').animate({'maxHeight':'14px'},'fast');
        $('#rock_desc').val('');
    }
    else
    {
        $('#rock_desc').animate({'height':'80px'},'fast');
        $('#rock_desc').animate({'minHeight':'80px'},'fast');
        $('#rock_desc').animate({'maxHeight':'80px'},'fast');
        $('#rock_desc').val(rmap[count]['mlgnd_desc2']);
    }
    
    if(rmap[count]['mlgnd_group']==null)
        $('#rock_groupv').val('');
    else
        $('#rock_groupv').val(rmap[count]['mlgnd_group']);
    
    if(rmap[count]['mlstate']==1) $('#rock_stat').text('Active');
    else if(rmap[count]['mlstate']==0) $('#rock_stat').text('Inactive');
        
    $('#rock_legnd').val(rmap[count]['mlgnd_name']);
    $('#rock_name').val(rmap[count]['mlgnd_desc']);
    $('#rock_clr').val(rmap[count]['mlgnd_clr'].replace('#',''));
    $('#rock_agev').val(rmap[count]['mlgnd_age']);
    
    //dropdown
    if(rmap[count]['mlgnd_groupid']!=null)
    $('#rock_group_drpdwn').val(rmap[count]['mlgnd_groupid']);
    else
    $('#rock_group_drpdwn').val('');
    
    if(rmap[count]['mlgnd_ageid']!=null)
    $('#rock_age_drpdwn').val(rmap[count]['mlgnd_ageid']);
    else
    $('#rock_age_drpdwn').val('');
    
    
    $('#rock_clr_right').css('background-color',rmap[count]['mlgnd_clr']);
    
    $('#rock_img1').attr('src',base_url+'../uploads/rockmap/'+rmap[count]['mlgnd_image1']);
    $('#rock_img1').attr('alt',rmap[count]['mlgnd_image1']);
    $('#rock_img1').attr('title',rmap[count]['mlgnd_image1']);
       
    $('#rock_img2').attr('src',base_url+'../uploads/rockmap/'+rmap[count]['mlgnd_image2']);
    $('#rock_img2').attr('alt',rmap[count]['mlgnd_image2']);
    $('#rock_img2').attr('title',rmap[count]['mlgnd_image2']);
        
    $('#rock_img3').attr('src',base_url+'../uploads/rockmap/'+rmap[count]['mlgnd_image3']);
    $('#rock_img3').attr('alt',rmap[count]['mlgnd_image3']);
    $('#rock_img3').attr('title',rmap[count]['mlgnd_image3']);
    
    
}

function r_readOnly(chk)
{
    if(chk==1 || chk==0)
    {
        $('#rock_legnd,#rock_name,#rock_desc,#rock_agev,#rock_groupv,#rock_clr').attr('readonly','readonly');
        $('#rock_legnd,#rock_name,#rock_desc,#rock_agev,#rock_groupv,#rock_clr').attr('disabled','true');
        $('#rock_legnd,#rock_name,#rock_desc,#rock_agev,#rock_groupv').attr('class','txt_styles_1');
        $('#rock_desc').attr('placeholder','No Description');
        $('#rock_groupv').attr('placeholder','No Group');
        $('#rock_clr').css('cursor','default');
        
        $('rockage_1,rockgroup_1').fadeIn('fast','swing');
        $('rockage_2,rockgroup_2').fadeOut('fast','swing');
        $('rockage_2,rockgroup_2').css('visibility','hidden');
        $('rockage_2,rockgroup_2').css('display','none');
        
        $('#save_rock_info').css('visibility','hidden');
        $('#cancel_rock_info').css('visibility','hidden');
    }
}

function r_editable(stat)
{
    if(stat==1)
    {
        get_rock_age(1);
        get_rock_group(1);
        $('#rock_legnd,#rock_name,#rock_desc').removeAttr('readonly');
        $('#rock_legnd,#rock_name,#rock_desc,#rock_clr').removeAttr('disabled');
        $('#rock_legnd,#rock_name,#rock_desc').attr('class','txt_styles_2');
        
        $('#rock_clr').css('cursor','text');
        $('#rock_desc').animate({'height':'80px'},'fast');
        $('#rock_desc').animate({'minHeight':'80px'},'fast');
        $('#rock_desc').animate({'maxHeight':'80px'},'fast');
        
        $('rockage_1,rockgroup_1').fadeOut('fast','swing');
        $('rockage_2,rockgroup_2').fadeIn('fast','swing');
        $('rockage_2,rockgroup_2').css('visibility','visible');
        $('rockage_2,rockgroup_2').css('display','block');
        
        $('#save_rock_info').css('visibility','visible');
        $('#cancel_rock_info').css('visibility','visible');
        $('#rock_info_left,#rock_info_right').slideToggle('slow');
       
    }
    else if(stat==2)
    {   
        $('#rock_legnd,#rock_name,#rock_desc,#rock_clr').val('');
        $('#rock_desc,#rock_groupv').attr('placeholder','');
        $('#rock_legnd,#rock_name,#rock_desc').removeAttr('readonly');
        $('#rock_legnd,#rock_name,#rock_desc,#rock_clr').removeAttr('disabled');
        $('#rock_legnd,#rock_name,#rock_desc').attr('class','txt_styles_2');
        
        $('#rock_clr').css('cursor','text');
        $('#rock_clr_right').css('background-color','#ffffff');
        
        get_rock_group(1);
        get_rock_age(1);
        
        $('rockage_1,rockgroup_1').fadeOut('fast','swing');
        $('rockage_2,rockgroup_2').fadeIn('fast','swing');
        $('rockage_2,rockgroup_2').css('visibility','visible');
        $('rockage_2,rockgroup_2').css('display','block');
        
        removeImg('rock_img1');
        removeImg('rock_img2');
        removeImg('rock_img3');
        change_img_btn(1,'edit_rock_img1');
        change_img_btn(1,'edit_rock_img2');
        change_img_btn(1,'edit_rock_img3');
        
        $('#save_rock_info').css('visibility','visible');
        $('#cancel_rock_info').css('visibility','visible');
        
        haz_edit_click=7;
    }
}
//----------------------------------------------------rock structure---------------------------------------------------

function getRockStruct(count)
{
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/get_rock_struct',
        cache:false,
        success:function(result){
            rstruct=[];
            rstruct=JSON.parse(result);
        },
        complete:function(){loadRmapStructData(rstruct_count);},
        error:function(){alert('getrockstructerror');}
    });
}

function new_rock_struct()
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/new_rock_struct',
        data:{structname:$('#rock_struct_name').val(),structdesc:$('#rock_struct_desc').val(),structclr:'#'+$('#rock_struct_clr').val()},
        cache:false,
        success:function(result){
            var l_id=JSON.parse(result);
            rstruct_count=rstruct.length;
            save_img(4,0,0,l_id,2,'f_edit_rock_struct_img1','f_edit_rock_struct_img2','f_edit_rock_struct_img3');
        },
        complete:function(){},
        error:function(xhr,status,errorThrown){alert(errorThrown);}
    });
}

function edit_rock_struct()
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/edit_rock_struct',
        data:{structid:rstruct[rstruct_count]['maplgnd_id'],structname:$('#rock_struct_name').val(),structdesc:$('#rock_struct_desc').val(),structclr:'#'+$('#rock_struct_clr').val(),haz_img_stat:haz_img_stat},
        cache:false,
        success:function(result){getRockStruct(rstruct_count);},
        complete:function(){},
        error:function(){alert('editstructerror');}
    });
}

function loadRmapStructData(count)
{
    removeImg('rock_struct_img1');
    removeImg('rock_struct_img2');
    removeImg('rock_struct_img3');
    reset_form($('#f_edit_rock_struct_img1'));
    reset_form($('#f_edit_rock_struct_img2'));
    reset_form($('#f_edit_rock_struct_img3'));
    
    $('#rock_struct_name').val('');
    $('#rock_struct_desc').val('');
    
    if(rstruct[count]['mlgnd_desc']==null)
    {
        $('#rock_struct_desc').animate({'height':'14px'},'fast');
        $('#rock_struct_desc').animate({'minHeight':'14px'},'fast');
        $('#rock_struct_desc').animate({'maxHeight':'14px'},'fast');
        $('#rock_struct_desc').val('');
    }
    else
    {
        $('#rock_struct_desc').animate({'height':'80px'},'fast');
        $('#rock_struct_desc').animate({'minHeight':'80px'},'fast');
        $('#rock_struct_desc').animate({'maxHeight':'80px'},'fast');
        $('#rock_struct_desc').val(rstruct[count]['mlgnd_desc']);
    }
    
    if(rstruct[count]['mlstate']==0)
        $('#struct_stat').text('Inactive');
    else if(rstruct[count]['mlstate']==1)
        $('#struct_stat').text('Active');
    
    $('#rock_struct_name').val(rstruct[count]['mlgnd_name']);
    $('#rock_struct_desc').val(rstruct[count]['mlgnd_desc']);
    $('#rock_struct_clr').val(rstruct[count]['mlgnd_clr'].replace('#',''));
    
    $('#rock_struct_clr_right').css('background-color',rstruct[count]['mlgnd_clr']);
    
    $('#rock_struct_img1').attr('src',base_url+'../uploads/rockmap/'+rstruct[count]['mlgnd_image1']);
    $('#rock_struct_img1').attr('alt',rstruct[count]['mlgnd_image1']);
    $('#rock_struct_img1').attr('title',rstruct[count]['mlgnd_image1']);
       
    $('#rock_struct_img2').attr('src',base_url+'../uploads/rockmap/'+rstruct[count]['mlgnd_image2']);
    $('#rock_struct_img2').attr('alt',rstruct[count]['mlgnd_image2']);
    $('#rock_struct_img2').attr('title',rstruct[count]['mlgnd_image2']);
        
    $('#rock_struct_img3').attr('src',base_url+'../uploads/rockmap/'+rstruct[count]['mlgnd_image3']);
    $('#rock_struct_img3').attr('alt',rstruct[count]['mlgnd_image3']);
    $('#rock_struct_img3').attr('title',rstruct[count]['mlgnd_image3']);
}

function rStruct_readOnly(chk)
{
    if(chk==1 || chk==0)
    {
        $('#rock_struct_name,#rock_struct_desc').attr('readonly','readonly');
        $('#rock_struct_name,#rock_struct_desc').attr('disabled','true');
        $('#rock_struct_name,#rock_struct_desc,rock_struct_clr').attr('class','txt_styles_1');
        $('#rock_struct_desc').attr('placeholder','No Description');
        
        $('#rock_struct_clr').css('cursor','default');
        
        $('#save_rock_struct_info').css('visibility','hidden');
        $('#cancel_rock_struct_info').css('visibility','hidden');

    }
}

function rStruct_editable(stat)
{
    if(stat==1)
    {
        $('#rock_struct_name,#rock_struct_desc').removeAttr('readonly');
        $('#rock_struct_name,#rock_struct_desc,rock_struct_clr').removeAttr('disabled');
        $('#rock_struct_name,#rock_struct_desc').attr('class','txt_styles_2_2');
        
        $('#rock_struct_clr').css('cursor','text');
        
        $('#rock_struct_desc').animate({'height':'80px'},'fast');
        $('#rock_struct_desc').animate({'minHeight':'80px'},'fast');
        $('#rock_struct_desc').animate({'maxHeight':'80px'},'fast');
        
        $('#save_rock_struct_info').css('visibility','visible');
        $('#cancel_rock_struct_info').css('visibility','visible');
        
        $('#rock_struct_left,#rock_struct_right').slideToggle('slow');
    }
    else if(stat==2)
    {
        haz_edit_click=10;
        
        $('#rock_struct_name,#rock_struct_desc,#rock_struct_clr').val('');
        $('#rock_struct_desc').attr('placeholder','');
        $('#rock_struct_name,#rock_struct_desc').removeAttr('readonly');
        $('#rock_struct_name,#rock_struct_desc,#rock_struct_clr').removeAttr('disabled');
        $('#rock_struct_name,#rock_struct_desc').attr('class','txt_styles_2_2');
        
        $('#rock_struct_clr').css('cursor','text');
        $('#rock_struct_clr_right').css('background-color','#ffffff');
        
        removeImg('rock_struct_img1');
        removeImg('rock_struct_img2');
        removeImg('rock_struct_img3');
        change_img_btn(1,'edit_rock_struct_img1');
        change_img_btn(1,'edit_rock_struct_img2');
        change_img_btn(1,'edit_rock_struct_img3');
        
        $('#save_rock_struct_info').css('visibility','visible');
        $('#cancel_rock_struct_info').css('visibility','visible');
        $('#rock_struct_left,#rock_struct_right').slideToggle('slow');
    }
}

//---------------------------------------------------soil functions--------------------------------------------

function getSoilInfo()
{
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/get_soil_info',
        cache:false,
        success:function(result){
            m_soil=[];
            m_soil=JSON.parse(result);
        },
        complete:function(){soilLgnd_loadData(msoil_count);
        if(haz_edit_click==13) getSoilSymbols(1);
        getSoilSymbols(2);
        },
        error:function(){}
    });
}

function getSoilSymbols(chk)
{
    $.ajax({
        type:'GET',
        url:base_url+'index.php/adm_controller/get_soil_symbol',
        cache:false,
        success:function(result){
            var soilSymbols=new Array();
            soilSymbols=JSON.parse(result);
            $('.soilSymbols').remove();
            for(var x=0,z=1;x<soilSymbols.length;x++,z++)
            {
                $('#soilSymbol_drpdwn1').append('<option value="'+soilSymbols[x]['sym_name']+'" class="soilSymbols" id="l1_'+soilSymbols[x]['sym_name']+'">'+soilSymbols[x]['sym_name']+'</option>');
                $('#soilSymbol_drpdwn2').append('<option value="'+soilSymbols[x]['sym_name']+'" class="soilSymbols" id="l2_'+soilSymbols[x]['sym_name']+'">'+soilSymbols[x]['sym_name']+'</option>');
                $('#soilSymbol_drpdwn3').append('<option value="'+soilSymbols[x]['sym_name']+'" class="soilSymbols" id="l3_'+soilSymbols[x]['sym_name']+'">'+soilSymbols[x]['sym_name']+'</option>');
                $('#soilSymbol_drpdwn4').append('<option value="'+soilSymbols[x]['sym_name']+'" class="soilSymbols" id="l4_'+soilSymbols[x]['sym_name']+'">'+soilSymbols[x]['sym_name']+'</option>');
            }
            if(chk==2)
            {
                $('.soilsym_list').remove();
                for(var x=0,z=1;x<soilSymbols.length;x++,z++)
                {
                    $('#soil_sym_list').append('<tr class="soilsym_list"><td style="border:solid 1px #9b9b9b">'+z+'</td>'+'<td style="text-align:left;border:solid 1px #9b9b9b">'+soilSymbols[x]['sym_name']+'</td></tr>');
                }
            }
        },
        complete:function(){
            if(chk==1)
            {
            document.getElementById('soillayer_cont1').innerHTML="";
            document.getElementById('soillayer_cont2').innerHTML="";
            document.getElementById('soillayer_cont3').innerHTML="";
            document.getElementById('soillayer_cont4').innerHTML="";
            if(haz_edit_click==14)
            {
                var layer1=new Array();
                var layer2=new Array();
                var layer3=new Array();
                var layer4=new Array();
                
                if(m_soil[msoil_count]['layer1']!='') layer1=m_soil[msoil_count]['layer1'].split('%');
                if(m_soil[msoil_count]['layer2']!='') layer2=m_soil[msoil_count]['layer2'].split('%');    
                if(m_soil[msoil_count]['layer3']!='') layer3=m_soil[msoil_count]['layer3'].split('%');
                if(m_soil[msoil_count]['layer4']!='') layer4=m_soil[msoil_count]['layer4'].split('%');
                
                for(var x=0; x<layer1.length; x++)
                {
                    $('#soilSymbol_drpdwn1 option[value="'+layer1[x]+'"]').remove();
                    if(layer1[x]!='')
                    document.getElementById('soillayer_cont1').innerHTML+='<span id="l1_'+layer1[x]+'"><label>'+layer1[x]+'</label><button onclick="removeSoilLayer(\'soilSymbol_drpdwn1\', \'l1_'+layer1[x]+'\', \''+layer1[x]+'\')">X</button></span>';
                }
                
                for(var x=0; x<layer2.length; x++)
                {
                    $('#soilSymbol_drpdwn2 option[value="'+layer2[x]+'"]').remove();
                    if(layer2[x]!='')
                    document.getElementById('soillayer_cont2').innerHTML+='<span id="l2_'+layer2[x]+'"><label>'+layer2[x]+'</label><button onclick="removeSoilLayer(\'soilSymbol_drpdwn2\', \'l2_'+layer2[x]+'\', \''+layer2[x]+'\')">X</button></span>';
                }
                
                for(var x=0; x<layer3.length; x++)
                {
                    $('#soilSymbol_drpdwn3 option[value="'+layer3[x]+'"]').remove();
                    if(layer3[x]!='')
                    document.getElementById('soillayer_cont3').innerHTML+='<span id="l3_'+layer3[x]+'"><label>'+layer3[x]+'</label><button onclick="removeSoilLayer(\'soilSymbol_drpdwn3\', \'l3_'+layer3[x]+'\', \''+layer3[x]+'\')">X</button></span>';
                }
                
                for(var x=0; x<layer4.length; x++)
                {
                    $('#soilSymbol_drpdwn4 option[value="'+layer4[x]+'"]').remove();
                    if(layer4[x]!='')
                    document.getElementById('soillayer_cont4').innerHTML+='<span id="l4_'+layer4[x]+'"><label>'+layer4[x]+'</label><button onclick="removeSoilLayer(\'soilSymbol_drpdwn4\', \'l4_'+layer4[x]+'\', \''+layer4[x]+'\')">X</button></span>';
                }
            }
            }
        },
        error:function(){alert('getsoilsymbolerror');}
    });
}

function soilLgnd_edit(soilid,soilname,soildesc,soilclr,layerid,layer1,layer2,layer3,layer4)//$layerid,$soilname,$soildesc,$soilclr,$soilstate,$soillayerid,$haz_image_stat,  layer1, layer2,layer3,layer4
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/soil_lgnd_edit',
        data:{soilid:soilid,soilname:soilname,soildesc:soildesc,soilclr:'#'+soilclr,soilstate:'1',haz_img_stat:haz_img_stat,layerid:layerid,layer1:layer1,layer2:layer2,layer3:layer3,layer4:layer4,l_editor:username},
        cache:false,
        beforeSend:function(){},
        success:function(result){},
        error:function(){alert('soillegendediterror');}
    });
}

function soillgnd_new(layer1,layer2,layer3,layer4)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/new_soil_lgnd',
        data:{soilname:$('#soil_name').val(),soildesc:$('#soil_desc').val(),soilclr:'#'+$('#soil_clr').val(),s_state:'1',layer1:layer1,layer2:layer2,layer3:layer3,layer4:layer4},
        cache:false,
        beforeSend:function(){},
        success:function(result){
           msoil_count=m_soil.length;
           var l_id=JSON.parse(result);
           save_img(5,0,0,l_id,3,'f_edit_soil_img1','f_edit_soil_img2','f_edit_soil_img3');
        },
        complete:function(){},
        error:function(xhr,status,errorThrown){alert(xhr.responseText);}
    });
}

function removeSoilLayer(drpdwn,id,value)
{
    $('#'+id).remove();
    $('#'+drpdwn).append('<option value="'+value+'" id="'+id+'">'+value+'</option>');
}

function soilSymbol_new()
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/new_soil_symbol',
        data:{sym_name:$('#soil_symbol1').val()},
        cache:false,
        success:function(){$('#soil_symbol1').val('');},
        complete:function(){getSoilSymbols(2);},
        error:function(){alert('soilsymbonewe');}
    });
}

function soilLgnd_loadData(ctr)
{
    $('#soil_name,#soil_desc,#soil_clr,#soil_layer1,#soil_layer2,#soil_layer3,#soil_layer4').val('');
    
    if(m_soil[ctr]['mlstate']==0)
        $('#soillayer_stat').text('Inactive');
    else if(m_soil[ctr]['mlstate']==1)
        $('#soillayer_stat').text('Active');
        
    
    $('#soil_name').val(m_soil[ctr]['soil_name']);
    $('#soil_desc').val(m_soil[ctr]['soild_desc']);
    $('#soil_clr').val(m_soil[ctr]['soil_clr'].replace('#',''));
    
    $('#soil_clr_right').css('background-color',m_soil[ctr]['soil_clr'])
    $('#soil_layer1').val(m_soil[ctr]['layer1'].replace(new RegExp('%','g'),' '));
    $('#soil_layer2').val(m_soil[ctr]['layer2'].replace(new RegExp('%','g'),' '));
    $('#soil_layer3').val(m_soil[ctr]['layer3'].replace(new RegExp('%','g'),' '));
    $('#soil_layer4').val(m_soil[ctr]['layer4'].replace(new RegExp('%','g'),' '));
    
    removeImg('soil_img1');
    removeImg('soil_img2');
    removeImg('soil_img3');
    reset_form($('#f_edit_soil_img1'));
    reset_form($('#f_edit_soil_img2'));
    reset_form($('#f_edit_soil_img3'));
    
    
    $('#soil_img1').attr('src',base_url+'../uploads/soilmap/'+m_soil[ctr]['soil_img1']);
    $('#soil_img1').attr('alt',m_soil[ctr]['soil_img1']);
    $('#soil_img1').attr('title',m_soil[ctr]['soil_img1']);
    
    $('#soil_img2').attr('src',base_url+'../uploads/soilmap/'+m_soil[ctr]['soil_img2']);
    $('#soil_img2').attr('alt',m_soil[ctr]['soil_img2']);
    $('#soil_img2').attr('title',m_soil[ctr]['soil_img2']);
    
    $('#soil_img3').attr('src',base_url+'../uploads/soilmap/'+m_soil[ctr]['soil_img3']);
    $('#soil_img3').attr('alt',m_soil[ctr]['soil_img3']);
    $('#soil_img3').attr('title',m_soil[ctr]['soil_img3']);
}

function soilLgnd_readOnly()
{
    $('#soil_name,#soil_desc').attr('readonly','readonly');
    $('#soil_name,#soil_desc,#soil_clr').attr('disabled','true');
    $('#soil_name,#soil_desc').attr('class','txt_styles_1');
    
    $('.first_layer').fadeOut('fast','swing');
    $('.second_layer').fadeOut('fast','swing');
    $('.third_layer').fadeOut('fast','swing');
    $('.fourth_layer').fadeOut('fast','swing');
    
    $('.soil_layer1').fadeIn('fast','swing');
    $('.soil_layer2').fadeIn('fast','swing');
    $('.soil_layer3').fadeIn('fast','swing');
    $('.soil_layer4').fadeIn('fast','swing');
    
    $('#save_soil_lgnd').css('visibility','hidden');
    $('#cancel_soil_lgnd').css('visibility','hidden');
}

function soilLgnd_editable()
{
    $('#soil_name,#soil_desc').removeAttr('readonly');
    $('#soil_name,#soil_desc,#soil_clr').removeAttr('disabled');
    $('#soil_name,#soil_desc').attr('class','txt_styles_2');
        
    $('#soil_clr').css('cursor','text');
    $('.soil_layer1').fadeOut('fast','swing');
    $('.soil_layer2').fadeOut('fast','swing');
    $('.soil_layer3').fadeOut('fast','swing');
    $('.soil_layer4').fadeOut('fast','swing');
    
    $('.first_layer').fadeIn('fast','swing');
    $('.second_layer').fadeIn('fast','swing');
    $('.third_layer').fadeIn('fast','swing');
    $('.fourth_layer').fadeIn('fast','swing');
    
    $('#save_soil_lgnd').css('visibility','visible');
    $('#cancel_soil_lgnd').css('visibility','visible');
    $('#soillgnd_left,#soillgnd_right').slideToggle('slow');
    
    if(haz_edit_click==13)
    {
        getSoilSymbols(1);
        $('#soil_name,#soil_desc,#soil_clr').val('');
        $('#soil_clr_right').css('background-color','#ffffff');
        $('.symbol_cont').innerHTML="";
        
        removeImg('soil_img1');
        removeImg('soil_img2');
        removeImg('soil_img3');
        reset_form($('#f_edit_soil_img1'));
        reset_form($('#f_edit_soil_img2'));
        reset_form($('#f_edit_soil_img3'));
        
        change_img_btn(1,'edit_soil_img1');
        change_img_btn(1,'edit_soil_img2');
        change_img_btn(1,'edit_soil_img3');
    }
    else if(haz_edit_click==14)
    {
        change_img_btn(2,'edit_soil_img1');
        change_img_btn(2,'edit_soil_img2');
        change_img_btn(2,'edit_soil_img3');
    }
}


//-----------------------------profile-----------------------------------------------------

function getUserProfile(chk,uname)
{
    var user_prof=new Array();
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/get_user_prof',
	data:{ username:uname },
        cache:false,
        success:function(result){
            user_prof=JSON.parse(result);
        },
        complete:function(){
            if(chk==1)
            {
                $('#prof_lname').val(user_prof[0]['last_name']);
                $('#prof_fname').val(user_prof[0]['first_name']);
                $('#prof_mname').val(user_prof[0]['middle_name']);
                $('#prof_address').val(user_prof[0]['address']);
                $('#prof_contactno').val(user_prof[0]['contact']);
                $('#prof_company').val(user_prof[0]['company']);
                
                $('#prof_user').val(user_prof[0]['uname']);
                if(user_prof[0]['ulevel']==2)
                $('#prof_level').val('Normal User');
            }
            else if(chk==2)
            {
                $('#acct_lname').val(user_prof[0]['last_name']);
                $('#acct_fname').val(user_prof[0]['first_name']);
                $('#acct_mname').val(user_prof[0]['middle_name']);
                $('#acct_address').val(user_prof[0]['address']);
                $('#acct_contactno').val(user_prof[0]['contact']);
                $('#acct_company').val(user_prof[0]['company']);
                
                $('#acct_username').val(user_prof[0]['uname']);
                if(user_prof[0]['ulevel']==2)
                $('#acct_level').val('Normal User');
                else
                $('#acct_level').val('Superuser');
            }
        },
        error:function(){alert('getuserprofileerror');}
    });
}

function editUserProfile()
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/edit_user_profile',
        data:{username:username,prof_lname:$('#prof_lname').val(),prof_fname:$('#prof_fname').val(),prof_mname:$('#prof_mname').val(),prof_address:$('#prof_address').val(),prof_contactno:$('#prof_contactno').val(),prof_company:$('#prof_company').val()},
        cache:false,
        success:function(){},
        complete:function(){
            getUserProfile(username);
            prof_readOnly();
        },
        error:function(){alert('edituserorofileerror');}
    });
}

function adm_editProfile(u_name)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/edit_user_profile',
        data:{username:u_name,prof_lname:$('#acct_lname').val(),prof_fname:$('#acct_fname').val(),prof_mname:$('#acct_mname').val(),prof_address:$('#acct_address').val(),prof_contactno:$('#acct_contactno').val(),prof_company:$('#acct_company').val()},
        cache:false,
        success:function(){},
        complete:function(){
            getUserProfile(u_name);
            adm_readOnly();
        },
        error:function(){alert('erroradmeditprofile');}
    });
}

function searchAccount(u_name)
{
    var res_actts=new Array();
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/search_account/',
        data:{u_name:u_name},
        cache:false,
        success:function(result){
            res_accts=JSON.parse(result);
        },
        complete:function(){
            $('#tbl_accts').empty();
            var checkEmpty=$.isEmptyObject(res_accts);
            if(checkEmpty==true)
            {
                var row='<tr><td>No Results Found</td>';
                $('#tbl_accts').append(row);
            }
            if(res_accts.length!=0 && checkEmpty==false)
            {
                $('#tbl_accts').append('<th>#</th><th>Name</th><th>Username</th><th>Action</th>');
                for(var x=0,z=1; x<res_accts.length;x++,z++)
                {
                    $('#tbl_accts').append('<tr class="res_acct""><td>'+z+'</td><td>'+res_accts[x]['name']+'</td><td>'+res_accts[x]['uname']+'</td><td><a style="cursor:pointer;" onclick="viewAcct(\''+res_accts[x]['uname']+'\')">View</a></td></tr>');
                }
                var tbl_height=$('#tbl_accts').innerHeight();
                $('#e_acct').animate({marginTop:tbl_height},'fast');
            }
        },
        error:function(xhr,status,errorThrown){alert(xhr.responseText);}
    });
}

function viewAcct(uname)
{
    $('#acct_search').click();
    $('#adm_prof,#adm_acct').fadeIn('slow','swing');
    $('#adm_new_acct').fadeOut('fast','swing');
    getUserProfile(2,uname);
    srch_uname=uname;
}

function changePass(chk,uname)
{
    var res_pass="";
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/edit_password',
        data:{username:uname,curr_pass:$('#curr_pass').val(),new_pass:$('#new_pass').val(),chk:chk},
        cache:false,
        success:function(result){
            res_pass=JSON.parse(result);
        },
        complete:function(){
            if(res_pass=='invalid')
                $("#curr_pass").animate({backgroundColor:'#ff0000'});
            else
                $('#changePass').fadeOut('fast','swing');
        },
        error:function(){alert('changepasserror');}
    });
}

function prof_readOnly()
{
    $('#prof_lname,#prof_fname,#prof_mname,#prof_address,#prof_company,#prof_contactno').attr('readonly','readonly');
    $('#prof_lname,#prof_fname,#prof_mname,#prof_address,#prof_company,#prof_contactno').attr('disabled','true');
    $('#prof_lname,#prof_fname,#prof_mname,#prof_address,#prof_company,#prof_contactno').attr('class','txt_styles_1');
}

function prof_editable()
{
    $('#prof_lname,#prof_fname,#prof_mname,#prof_address,#prof_company,#prof_contactno').removeAttr('readonly');
    $('#prof_lname,#prof_fname,#prof_mname,#prof_address,#prof_company,#prof_contactno').removeAttr('disabled');
    $('#prof_lname,#prof_fname,#prof_mname,#prof_address,#prof_company,#prof_contactno').attr('class','txt_styles_2');
}

function adm_readOnly()
{
    $('#acct_lname,#acct_fname,#acct_mname,#acct_address,#acct_company,#acct_contactno').attr('readonly','readonly');
    $('#acct_lname,#acct_fname,#acct_mname,#acct_address,#acct_company,#acct_contactno').attr('disabled','true');
    $('#acct_lname,#acct_fname,#acct_mname,#acct_address,#acct_company,#acct_contactno').attr('class','txt_styles_1');
}

function adm_editable()
{
    $('#acct_lname,#acct_fname,#acct_mname,#acct_address,#acct_company,#acct_contactno').removeAttr('readonly');
    $('#acct_lname,#acct_fname,#acct_mname,#acct_address,#acct_company,#acct_contactno').removeAttr('disabled');
    $('#acct_lname,#acct_fname,#acct_mname,#acct_address,#acct_company,#acct_contactno').attr('class','txt_styles_2');
}


//----------------------------------------------------others functions--------------------------------------------------

function nav_hide()
{
    //during animation disable scroll
    $('#settings_base_1').css('overflow-y','hidden');//ended here with animation
    
    $('#settings_list_base').hide();
    $('#settings_base_1').animate({left:'0px'},'fast');
    $('#settings_base_1').animate({width:'+=20%'},function(){
	$('#settings_base_1').css('overflow-y','scroll');//after animation enable scroll back
    });
    $('#settings_label').removeAttr('disabled');
}

function change_img_btn(stat,img_id)
{
    if(stat==1)
    {
        $('#'+img_id).attr('title','New Image');
        $('#'+img_id).text('New');
        $('#'+img_id).attr('class','img_add_btn');
    }
    else if(stat==2)
    {
        $('#'+img_id).attr('title','Edit Image');
        $('#'+img_id).text('Edit');
        $('#'+img_id).attr('class','img_edit_btn'); 
    }
}

function previewImg(input_id,img_id)
{
    (input_id.files && input_id.files[0])
    {
        if((input_id.files[0].type.toLowerCase()=='image/jpg'||input_id.files[0].type.toLowerCase()=='image/jpeg'||input_id.files[0].type.toLowerCase()=='image/png') || input_id.files[0].size<1000000)
        {
            var reader = new FileReader();
            reader.onload = function (e)
            {
                $('#'+img_id).attr('src', e.target.result);
                $('#'+img_id).attr('alt', input_id.files[0].name);
                $('#'+img_id).attr('title', input_id.files[0].name);
            }
            reader.readAsDataURL(input_id.files[0]);
        }
        else
        {
            alert('Please check the type and size of the file.');
        }
    }
}

function removeImg(img_id)
{
    $('#'+img_id).attr('alt','');
    $('#'+img_id).removeAttr('title');
    $('#'+img_id).removeAttr('src');
}

function reset_form(e)
{
    e.wrap('<form>').parent('form').trigger('reset');
    e.unwrap();
}

function img_mousehover(chk,edt_btn_id,rem_btn_id) //div id not used
{
    if((chk==1 && haz_edit_click==1)||(chk==1 && haz_edit_click==2))
    {
        $('#'+edt_btn_id).css('display','block');
        $('#'+rem_btn_id).css('display','block');
    }
    if((chk==2 && haz_edit_click==4) || (chk==2 && haz_edit_click==5))
    {
        $('#'+edt_btn_id).css('display','block');
        $('#'+rem_btn_id).css('display','block');
    }
    if((chk==4 && haz_edit_click==7) || (chk==4 && haz_edit_click==8))
    {
        $('#'+edt_btn_id).css('display','block');
        $('#'+rem_btn_id).css('display','block'); 
    }
    if((chk==4 && haz_edit_click==11) || (chk==4 && haz_edit_click==10))
    {
        $('#'+edt_btn_id).css('display','block');
        $('#'+rem_btn_id).css('display','block'); 
    }
    if((chk==5 && haz_edit_click==13) || (chk==5 && haz_edit_click==14))
    {
        $('#'+edt_btn_id).css('display','block');
        $('#'+rem_btn_id).css('display','block'); 
    }
}

function img_mouseleave(edt_btn_id,rem_btn_id)
{
    $('#'+edt_btn_id).css('display','none');
    $('#'+rem_btn_id).css('display','none');
}

function edt_new_icon_mousehover(new_info,edt_info)
{
    $('#'+new_info).css('display','block');
    $('#'+edt_info).css('display','block');
}

function edt_new_icon_mouseleave(new_info,edt_info)
{
    $('#'+new_info).css('display','none');
    $('#'+edt_info).css('display','none');
}

function haz_edt_btn_click(btn_id)
{
    if(btn_id=='edit_haz_info' && haz_edit_click!=1 && haz_edit_click!=2){haz_editable(2); haz_edit_click=2; $('#haz_info_left,#haz_info_right').slideToggle('slow');}
    if(btn_id=='edit_haz_lgnd' && haz_edit_click!=5 && haz_edit_click!=6){haz_editable(5); haz_edit_click=5; $('#haz_lgnd_left,#haz_lgnd_right').slideToggle('slow');}
    if(btn_id=='edit_rock_info' && haz_edit_click!=7 && haz_edit_click!=8){r_editable(1); haz_edit_click=8;}
    if(btn_id=='edit_rock_struct' && haz_edit_click!=10 && haz_edit_click!=11){rStruct_editable(1);haz_edit_click=11;}
    if(btn_id=='edit_soil_lgnd' && haz_edit_click!=13 && haz_edit_click!=14){ getSoilSymbols(1); haz_edit_click=14; soilLgnd_editable();}
}

function haz_cancel_btn_click(chk,btn_id)
{
    if(btn_id=='cancel_haz')
    {
        $('#haz_tbl').css('display','block');
        $('#a_haz').css('display','block');
        $('.haztbl').css('display','block');
        $('.txt_styles_2').removeClass('error');
        loadHazData(haz_count);
        haz_readOnly(chk);
        $('#haz_info_left,#haz_info_right').slideToggle('slow');
    }
    else if(btn_id=='cancel_haz_lgnd')
    {
        haz_edit_click=0;
        loadHazLvl(haz_lvl_count);
        //get_haz_drp_names();
        haz_readOnly(chk);
        $('#hazlgnd_clr').css('border-color','#a2a2a2');
        $('#haz_lgnd_left,#haz_lgnd_right').slideToggle('slow');
    }
    else if(btn_id=='cancel_rock_info')
    {
        getRockInfoResult(rmap_count,0);
        r_readOnly(0);
        $('#rock_clr').css('border-color','#a2a2a2');
        $('#rock_info_left,#rock_info_right').slideToggle('slow');
    }
    else if(btn_id=='cancel_rock_struct_info')
    {
        getRockStruct(rstruct_count);
        rStruct_readOnly(1);
        $('#rock_struct_clr').css('border-color','#a2a2a2');
        $('#rock_struct_left,#rock_struct_right').slideToggle('slow');
    }
    else if(btn_id=='cancel_soil_lgnd')
    {
        soilLgnd_loadData(msoil_count);
        soilLgnd_readOnly();
        $('.txt_styles_2').removeClass('error');
        $('#soil_clr').css('border-color','#a2a2a2');
        $('#soillgnd_left,#soillgnd_right').slideToggle('slow');
    }
    haz_edit_click=0;
}

function hazlgnd_clr(id,right)
{
    if($('#'+id).css('cursor')!='default' || haz_edit_click==5 || haz_edit_click==4){
        $('#'+id).colpick({
            layout:'hex',
            submit:true,
            colorScheme:'light',
            livePreview:true,
            onSubmit:function(hsb,hex,rgb,el) {
                $('#'+right).css('background-color','#'+hex);
                $('#'+id).val(hex);
                $(el).colpickHide();
                
                if(haz_edit_click==4) checkHazLgndColor(2,$('#haz_drpwdwn').val(),$('#'+id).val(),haz_lvl[haz_lvl_count]['hazlgnd_clr']);
                if(haz_edit_click==5) checkHazLgndColor(1,$('#haz_drpwdwn').val(),$('#'+id).val(),haz_lvl[haz_lvl_count]['hazlgnd_clr']);
                if(haz_edit_click==7) checkROckClr(1,rmap[rmap_count]['lgnd_id'],$('#'+id).val(),rmap[rmap_count]['mlgnd_clr'],1);
                if(haz_edit_click==8) checkROckClr(2,rmap[rmap_count]['lgnd_id'],$('#'+id).val(),rmap[rmap_count]['mlgnd_clr'],1);
                if(haz_edit_click==10) checkROckClr(3,rstruct[rstruct_count]['lgnd_id'],$('#'+id).val(),rstruct[rstruct_count]['mlgnd_clr'],2);
                if(haz_edit_click==11) checkROckClr(4,rstruct[rstruct_count]['lgnd_id'],$('#'+id).val(),rstruct[rstruct_count]['mlgnd_clr'],2);
                if(haz_edit_click==13) checkSoilClr(1,m_soil[msoil_count]['mapid'],$('#'+id).val(),m_soil[msoil_count]['soil_clr']);
                if(haz_edit_click==14) checkSoilClr(2,m_soil[msoil_count]['mapid'],$('#'+id).val(),m_soil[msoil_count]['soil_clr']);
            },
            onBeforeShow:function(){
                if($('#'+id).css('cursor')!='default')$('.colpick').css('visibility','visible');
            },
            onHide:function(){ $('.colpick').css('visibility','hidden');}
            });
    }
}

function save_img(frm,haz_id,hazlgnd_id,rockid,chk,f_img1,f_img2,f_img3)
{
    var data;
    if(frm==1)data=new FormData($('#haz_info_form')[0]);
    else if(frm==2 || frm==6)data=new FormData($('#haz_lgnd_form')[0]);
    else if(frm==3)data=new FormData($('#rock_info_form')[0]); 
    else if(frm==4)data=new FormData($('#rock_struct_form')[0]);
    else if(frm==5) data=new FormData($('#soil_form')[0]);
    
        $.ajax({
            type:'POST',
            url:base_url+'index.php/adm_controller/edit_haz_images/'+haz_id+'/'+hazlgnd_id+'/'+rockid+'/'+chk+'/'+f_img1+'/'+f_img2+'/'+f_img3+'/'+frm,
            data:data,
            cache:false,
            contentType:false,
            processData:false,
            beforeSend:function()
            {
                if(chk==1)$('#haz_info_loading_bar').fadeIn('fast','swing').delay(100).fadeOut('fast','swing');
                else if(chk==2)$('#haz_lgnd_loading_bar').fadeIn('fast','swing').delay(100).fadeOut('fast','swing');
            },
            success:function(data){
                if(frm==1)
                {
                    getHazInfoResult(haz_count,0);
                    loadHazData(haz_count);
                }
                else if(frm==2)
                {
                    get_haz_lvl_info(haz_info_res[haz_count]['haz_id']);
                    get_haz_lvl(2,$('#haz_drpwdwn').val());
                    haz_readOnly(2);
                }
                else if(frm==6)
                {
                    get_haz_lvl_info(haz_info_res[haz_count]['haz_id']);
                    get_haz_lvl(3,$('#haz_drpwdwn').val());
                    haz_readOnly(2);
                }
                else if(frm==3)
                {
                    getRockInfoResult(rmap_count,0);
                    haz_edit_click=0;
                }
                else if(frm==4)
                {
                    getRockStruct(rstruct_count);
                    haz_edit_click=0;
                }
                else if(frm==5)
                {
                    soilLgnd_readOnly();
                    getSoilInfo();
                    haz_edit_click=0;
                }
            },
            complete:function(){
            },
            error:function(jqXHR,status,errorThrown)
            {
                alert('submiterror');
            }
        });
}

//checking
function checkHazName(chk,hazname,dbhazname)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_haz_name',
        data:{check:chk,haz_name:hazname,db_hazname:dbhazname},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists') $('#haz_name').attr('class','error');
            else $('#haz_name').attr('class','txt_styles_2');
        },
        error:function(){alert('checkhaznameerror');}
    });
}

function checkLegendName(chk,lgndname,lgndid,dblgndname)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_lgnd_name',
        data:{check:chk,lgnd_name:lgndname,lgnd_id:lgndid,db_lgndname:dblgndname},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists') $('#hazlgnd_name').attr('class','error');
            else $('#hazlgnd_name').attr('class','txt_styles_2_1');
        },
        error:function(){alert('chklgndname');}
    });
}

function checkLgndLvl(chk,hazid,hazlvl,dblvl)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_lgnd_lvl',
        data:{check:chk,haz_id:hazid,haz_level:hazlvl,db_lvl:dblvl},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists') $('#hazlgnd_lvl').attr('class','error');
            else $('#hazlgnd_lvl').attr('class','txt_styles_2_1');
        },
        error:function(){alert('checklgndlvlerror');}
    });
}

function checkHazLgndColor(chk,hazid,lgndclr,dbclr)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_haz_lgnd_clr',
        data:{check:chk,haz_id:hazid,lgnd_clr:'#'+lgndclr,db_clr:dbclr},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists'){$('#hazlgnd_clr').attr('class','error'); $('#hazlgnd_clr').css('border-color','#ff0000');}
            else{ $('#hazlgnd_clr').attr('class','txt_styles_2'); $('#hazlgnd_clr').css('border-color','#a2a2a2');}
        },
        error:function(){alert('checkhazclrerror');}
    });
}

function checkRockLgnd(chk,rocklgnd,dbrocklgnd,type)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_rock_lgnd',
        data:{check:chk,rock_lgnd:rocklgnd,db_rocklgnd:dbrocklgnd,r_type:type},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists')
            {
                if(chk==1 || chk==2) $('#rock_legnd').attr('class','error');
                if(chk==3 || chk==4) $('#rock_struct_name').attr('class','error');
            }
            else
            {
                if(chk==1 || chk==2) $('#rock_legnd').attr('class','txt_styles_2');
                if(chk==3 || chk==4) $('#rock_struct_name').attr('class','txt_styles_2_2');
            }
        },
        error:function(){alert('checkrocklgnderror');}
    });
}

function checkROckClr(chk,mapid,rockclr,dbrockclr,type)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_rock_clr',
        data:{check:chk,map_id:mapid,rock_clr:'#'+rockclr,db_rockclr:dbrockclr,r_type:type},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists')
            {
                if(chk==1 || chk==2){ $('#rock_clr').attr('class','error'); $('#rock_clr').css('border-color','#ff0000');}
                if(chk==3 || chk==4){ $('#rock_struct_clr').attr('class','error'); $('#rock_struct_clr').css('border-color','#ff0000');}
            }
            else
            {
                if(chk==1 || chk==2){ $('#rock_clr').attr('class','txt_styles_2'); $('#rock_clr').css('border-color','#a2a2a2');}
                if(chk==3 || chk==4){ $('#rock_struct_clr').attr('class','txt_styles_2_2'); $('#rock_struct_clr').css('border-color','#a2a2a2');}
            }
        },
        error:function(){alert('error');}
    });
}

function checkRockAge(rockage)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_rock_age',
        data:{rock_age:rockage},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists') $('#rock_age').attr('class','error');
            else $('#rock_age').attr('class','txt_style_3');
        },
        error:function(){alert('checkrockageerror');}
    });
}

function checkRockGroup(rockgroup)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_rock_group',
        data:{rock_group:rockgroup},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists')  $('#rock_group').attr('class','error');
            else $('#rock_group').attr('class','txt_style_3');
        },
        error:function(){alert('checkrockgrouperror');}
    });
}

function checkSoilLgnd(chk,soillgnd,dbsoillgnd)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_soil_lgnd',
        data:{check:chk,soil_lgnd:soillgnd,db_soillgnd:dbsoillgnd},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists')  $('#soil_name').attr('class','error');
            else $('#soil_name').attr('class','txt_styles_2');
        },
        error:function(){alert('checksoillgnderror');}
    });
}

function checkSoilClr(chk,mapid,soilclr,dbsoilclr)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_soil_clr',
        data:{check:chk,map_id:mapid,soil_clr:'#'+soilclr,db_soilclr:dbsoilclr},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists'){ $('#soil_clr').attr('class','error'); $('#soil_clr').css('border-color','#ff0000');}
            else{ $('#soil_clr').attr('class','txt_styles_2'); $('#soil_clr').css('border-color','#a2a2a2');}
        },
        error:function(){alert('checksoilclrerror');}
    });
}

function checkSoilSymbol(soilsym)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_soil_symbol',
        data:{soil_sym:soilsym},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists')  $('#soil_symbol1').attr('class','error');
            else $('#soil_symbol1').attr('class','txt_style_3');
        },
        error:function(){alert('checksoilsymbolerror');}
    });
}

function checkUsername(uname)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/check_uname',
        data:{u_name:uname},
        cache:false,
        success:function(result){
            var chk_res=JSON.parse(result);
            if(chk_res=='exists')  $('#acct_nusername').attr('class','error');
            else $('#acct_nusername').attr('class','txt_styles_2');
        }
    });
}

function newAccount()
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/adm_controller/new_account',
        data:{u_name:$('#acct_nusername').val(),u_lvl:$('#acct_nlvl').val(),l_name:$('#acct_nlname').val(),f_name:$('#acct_nfname').val(),m_name:$('#acct_nmname').val(),address:$('#acct_naddress').val(),contct:$('#acct_ncontactno').val(),compny:$('#acct_ncompany').val()},
        cache:false,
        success:function(){
            alert('Account Registered!');
            $('#adm_new_acct').fadeOut('fast','swing');
            $('#acct_search_cont').slideToggle();
        },
        error:function(){
            alert('newaccounterror');
        }
    });
}

//------------
//var haz_sel=0; //for the selected type of hazard [2]
/*haz_edit_click
1=new haz_info
2=edit_haz_info
3=save new haz info images(update)
4=new haz_lgnd
5=edit_haz_lgnd
6=save new haz lgnd images(update)
7=new rock type
8=edit rock type
9=save rock type images(update)
10-new rock structure
11-edit rock structure
12-res
13-new soil lgnd
14-edit soil lgnd
15-res
*/