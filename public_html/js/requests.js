var chk=0;
var isClicked=0;
var req_d=0;
var res_id=0;
var req_d2=0;
//var req_d3=0; //for now
var isSubmitted=0;
var geocoder_r;

$(document).ready(function(){
    $('#req_container').css('display','none');
    $('#req_base').css('display','none');
    $('#prt_2').css('display','none');
    $('.req_left_cont').css('display','none');
    geocoder_r = new google.maps.Geocoder();
    setInterval(function(){check_r();get_r();},3000);
    
    $('.nav_a3').click(function(e){
        if(!mp_type)
        {
            e.preventDefault();
            view_r();
            /*if(u_lvl==1)
            {
                $('#new_req').remove();
                $('#button_add_files').remove();
            }*/
            $('.req_left_cont').slideToggle('fast','swing');
        }
    });
    
    $('.req_left_cont').hover(
        function(){$('.new_req').show();},
        function(){$('.new_req').hide();}
    );
    
    $('#new_req').click(function(){
        $('#req_lat,#req_lng,#req_area').val('');
        $('#prt_2').css('display','none');
        $('#prt_2').hide();
        $('#req_container').fadeIn('fast','swing');
        $('#req_base').fadeIn('fast','swing');
    });
    
    $('#file_mgt').click(function(){
        $('#note_span').css('visibility','visible');
	    $('#cert_files').fadeIn('fast','swing',function(){
		$(document).keyup(function(e) { // escape button
		    if (e.keyCode == 27){
			$('#cert_files').fadeOut('fast','swing');
			$('#cert_wrap').fadeOut('fast','swing');
		    }   // esc
		});
	    });
	    
	    $('#cert_wrap').fadeIn('fast','swing');
	    
	    $('#close_files').click(function(){
		$('#cert_files').fadeOut('fast','swing');
		$('#cert_wrap').fadeOut('fast','swing');
	    });
	    
	    $('#search_files').click(function(){
		
		var month = $('[name="file_month"] option:selected').val();
		var year = $('[name="file_year"] option:selected').text();
		$.ajax({
		    type: 'POST',
		    url: base_url + 'index.php/wysiwyg_c/getSearch',
		    dataType: 'json',
		    cache: false,
		    data: {month: month, year: year},
		    success: function(data){
			$('#cert_list').empty();
			$('#note_span').css('visibility','hidden');
			if(data=='empty')
			{
			    $('#cert_list').append('<div id="div_empty">No results found</div>');
			}
			else
			{
			    $('#div_empty').remove();
			    $('#cert_list').append(data);
			}
		    },
		    error:function(xhr,status,errorThrown){alert(status);}
		});
	    });
	    
	    $('#print_reports').click(function(){
		var month_ = $('[name="file_month"] option:selected').val();
		var year_ = $('[name="file_year"] option:selected').text();
		
		 window.open( base_url + 'index.php/wysiwyg_c/printReports/' + month_ + '/' + year_, '_blank');
	    });
    });
    
    $('#send_request').click(function(){
        var filenames = $.map($(".file_name"), function(n, i){return n.id;});
        if(filenames.length>0)
        {
            update_r(req_d);
            change_req_stat(req_d);
            isSubmitted=1;
        }
        else alert("Please submit the files needed before submitting the request.");
    });
    
    $('req_closeButton').click(function(){
        if(isSubmitted==0) del_r(req_d);
        $('#req_container').fadeOut('fast','swing');
        $('#req_base').fadeOut('fast','swing');
        $('#prt_2').hide();
        $('.req_files_cont').empty();
        
        $('#req_files').attr('disabled','disabled');
        var height=$('#prt_2').innerHeight();
        $('#req_base').animate({height:'-='+height});
        $('#prt_2').css('display','none');
        isClicked=0;
    });
    
    $('#cancel_request').click(function(){
        del_r(req_d);
        $('#req_container').fadeOut('fast','swing');
        $('#req_base').fadeOut('fast','swing');
        $('#prt_2').hide();
        $('.req_files_cont').empty();
        
        $('#req_files').attr('disabled','disabled');
        var height=$('#prt_2').innerHeight();
        $('#req_base').animate({height:'-='+height});
        $('#prt_2').css('display','none');
        isClicked=0;
    });
    
    $('#req_lat,#req_lng').focusout(function(){
        var place_coor = new google.maps.LatLng(parseFloat($('#req_lat').val()),parseFloat($('#req_lng').val()));
        reverseGeoCode_s(place_coor);
    });
    
    $('#req_lat,#req_lng').keyup(function(){
        var place_coor = new google.maps.LatLng(parseFloat($('#req_lat').val()),parseFloat($('#req_lng').val()));
        reverseGeoCode_s(place_coor);
    });
    
    $('#req_files_btn').click(function(){$('#req_files').click();});
    
    $('#req_app').click(function(){
        var req_id;
        if(isClicked==0)
        {
            if($('#req_lat,#req_lng').val()!='')
            {
                req_id=save_request(username,$('#req_lat').val(),$('#req_lng').val(),$('#req_area').val(),0);
                $('#req_files').attr('disabled','false');
            }
            isClicked=1;
            $('#req_files').removeAttr('disabled');
            var height=$('#prt_2').innerHeight();
            $('#req_base').animate({height:'+='+height});
            $('#prt_2').css('display','block');
        }
    });
    
    $('#frm_req_files').submit(function(e){
        e.preventDefault();
    });
    
    $('#req_lat,#req_lng').keypress(function(e){
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
    
    $('#req_lat,#req_lng').focusout(function(){
        var val=parseFloat($(this).val());
        if(isNaN(val)==true)
            $(this).val('0');
        else
            $(this).val(val);
    });
    
    $('#req_files').change(function(){
        var filename=this.files[0].name;
        var validExt=['jpg','jpeg','png','doc','docx','pdf'];
        var fileNameExt = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
        if(jQuery.inArray(fileNameExt,validExt)==-1){alert("File type not allowed");reset_form($('#req_files'));}
        else if((((this.files[0].size/1024)*100)/100)>204800){alert("File size exceeds the maximum allowed size");reset_form($('#req_files'));}
        else save_req_files(req_d,username,0,filename,1);
    });
    
    $(document).on('submit', '#add_files', function(e){
        e.preventDefault();
        $('#m_files').click();
    });
    
    $(document).on('change','#m_files',function(){
        var filename=this.files[0].name;
        var validExt=['jpg','jpeg','png','doc','docx','pdf'];
        var fileNameExt = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
        if(jQuery.inArray(fileNameExt,validExt)==-1){alert("File type not allowed"); reset_form('#m_files');}
        else if((((this.files[0].size/1024)*100)/100)>204800){alert("File size exceeds the maximum allowed size");reset_form($('#m_files'));}
        else save_req_files(req_d2,username,0,filename,2);
    });
    
    $('app_closeButton').click(function(){
        $('#req_container').fadeOut('fast','swing');
        $('#appBase').fadeOut('fast','swing');
    });
    
    $('#close_left_cont').click(function(){
        $('.req_left_cont').fadeOut('fast','swing',function(){$(this).slideUp();});
    });
    
    $('#send_cert').click(function(){
        alert('sa');
    });
    
    /*$('#app_send').click(function(){
        req_app(req_d3);
    });*/
});

//functions
function save_request(clientid,lat,lng,area,reqstat)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/save_request',
        data:{client_id:clientid,c_lat:lat,c_lng:lng,area:area,req_stat:reqstat,f_file:'req_files'},
        cache:false,
        success:function(data){
           var req_id=JSON.parse(data);
           req_d=req_id;
           if(req_id!=0)chk=1;
        },
        error:function(xhr,status,errorThrown){//alert('error');
        }
    });
}

function save_req_files(req_id,user_id,file_stat,filename,chk)
{
    var data;
    if(chk==1)data=new FormData($('#frm_req_files')[0]);
    if(chk==2)data=new FormData($('#add_files')[0]);
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/save_reqFiles/'+req_id+'/'+user_id+'/'+file_stat,
        data:data,
        cache:false,
        contentType:false,
        processData:false,
        beforeSend:function(){},
        success:function(data){
            res_id=JSON.parse(data);
            if(chk==1)
            {
                $('.req_files_cont').prepend('<div id="'+res_id['fileid']+'" class="uploaded_file_cont"><button id="'+res_id['fileid']+'" class="file_name_x" onclick="changeRemFileStat(\''+req_id+'\', \''+res_id['fileid']+'\')"></button><div id="" class="file_name">'+filename+'</div></div>');
                $('#'+res_id['fileid']).slideToggle();
                reset_form($('#req_files'));
            }
            else if(chk==2)
            {
                get_f(req_id);
                reset_form($('#m_files'));
            }
        },
        error:function(xhr,status,errorThrown){//alert('error');
        },
        complete:function(){}
    });
}

function change_req_stat(req_id)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/change_req_stat',
        data:{reqid:req_id},
        cache:false,
        success:function(){
            isSubmitted=0;
            $('#req_container').fadeOut('fast','swing');
            $('#req_base').fadeOut('fast','swing');
            $('#prt_2').hide();
            $('.req_files_cont').empty();
            
            $('#req_files').attr('disabled','disabled');
            var height=$('#prt_2').innerHeight();
            $('#req_base').animate({height:'-='+height});
            $('#prt_2').css('display','none');
            isClicked=0;
        },
        error:function(){//alert('error');
        }
    });
}

function removeFile(fileid)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/remove_file',
        data:{file_id:fileid},
        cache:false,
        success:function(){
            $('#'+fileid).fadeOut('fast','swing',function(){$(this).remove();});
        },
        error:function(){//alert('errorinremovingthefile');
        }
    });
}

function del_r(req_id)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/del_r',
        data:{reqid:req_id},
        cache:false,
        success:function(){},
        error:function(){//alert('errordeleting');
        }
    });
}

function update_r(reqid)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/update_r',
        data:{r_id:reqid,lat:$('#req_lat').val(),lng:$('#req_lng').val(),area:$('#req_area').val()},
        cache:false,
        success:function(){},
        error:function(){//alert('errorhere');
        }
    });
}

function changeRemFileStat(reqid,reqfileid)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/change_rem_file_stat/'+reqfileid,
        cache:false,
        success:function(){get_f(reqid);}
    });
}

function show_app_div(reqid)
{
    /*$('#req_container').fadeIn('fast','swing');
    $('#appBase').slideDown('slow','swing',function(){$(this).css('display','block');});*/
   // req_d3=reqid;
    var win = window.open(base_url + 'index.php/wysiwyg_c/load_pop/'+reqid,'', 'width=600px,height='+window.innerHeight+'px'+',resizable=no,titlebar=no,scrollbars=yes');
}

function den_alert(reqid,c_name,d_req,lat,lng,area)
{
   // $('#den_msg').empty();
    if($('#den_'+reqid).hasClass('btn_disabled'))
    {
      /*  $('#denBase').css('min-height','110px');
        $('#den_msg').append('Unable to deny request. Somebody is editing the request\'s Geologic Assessment Certificate.<br/><br/>Please try again later.');
        $('#req_container').fadeIn('fast','swing');
        $('#denBase').slideDown('fast','swing',function(){$(this).css('display','block');});*/
      alert('Unable to deny request. Somebody is editing the request\'s Geologic Assessment Certificate.Please try again later.');
    }
    else
    {
        /*$('#denBase').css('min-height','170px');
        $('#den_msg').append('Are you sure you want to deny the request made by '+c_name+' on '+d_req+'?<br/><br/>Lat: '+lat+'<br/>Lng: '+lng+'</br>Area:'+area+'');
        $('#den_msg').append('<span><button class="den_btn" onclick="den_r(\''+reqid+'\')">YES</button><button class="den_btn" onclick="hideDenMsg()">Cancel</button></span>');
        $('#req_container').fadeIn('fast','swing');
        $('#denBase').slideDown('fast','swing',function(){$(this).css('display','block');});*/
        var ans = confirm('Are you sure you want to deny the request made by '+c_name+' on '+d_req+'?\n  Lat: '+lat+'\n  Lng: '+lng+'\n  Area:'+area+'');
	if(ans==true){
	    den_r(reqid);
	    return;
	}
    }
}

function den_r(r_id)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/den_r/',
        data:{reqid:r_id},
        cache:false,
        success:function(){
            $('#btn_cont_'+r_id).fadeOut('fast','swing',function(){$(this).remove();});
            hideDenMsg();
        },
        error:function(){//alert('denreqerror');
        }
    });
}

function hideDenMsg()
{
    $('#req_container').fadeOut('fast','swing');
    $('#denBase').fadeOut('slow','swing',function(){$(this).css('display','none');});
}

function getReqid(reqid){req_d2=reqid;}

function cancel_r(reqid)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/cancel_r',
        data:{req_id:reqid},
        cache:false,
        success:function(){},
        error:function(){//alert('cancelrequesterror');
        }
    });
}

function reset_form(e)
{
    e.wrap('<form>').parent('form').trigger('reset');
    e.unwrap();
}

function reverseGeoCode_s(latLng)
{
    geocoder_r.geocode({'latLng':latLng},function(results,status){
        if (status == google.maps.GeocoderStatus.OK)
        {
            if(results[0].formatted_address)
            {   
                $('#req_area').val(results[0].formatted_address.toString());    
                $('#req_area').attr('title',results[0].formatted_address.toString());
            }
            else
            {
                $('#req_area').val('No data found');
                $('#req_area').attr('title',"No data found");
            }
        }
        else
        {
            $('#req_area').val('No data found');
            $('#req_area').attr('title',"No data found"); 
        }
    });
}

function get_r()
{
    var c_req=[];
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/get_r',
        data:{user:username,ulvl:u_lvl},
        cache:false,
        success:function(result){
            c_req=JSON.parse(result);
            var checkEmpty=$.isEmptyObject(c_req);
            
            if(checkEmpty==false)
            {
                var req_stat,color,title;
                var arr_id = $.map($(".a_files_status"), function(n, i){
                return n.id.replace('stat_','');
                });
               
                var btn_cont_ids = $.map($(".a_files_btn_cont"), function(n, i){
                return n.id.replace('btn_cont_','');
                });
                
                var cert_ids = $.map($(".certificates"), function(n, i){
                return n.id.replace('cert_','');
                });
                
                for(var x=0;x<c_req.length;x++)
                {
                    if(c_req[x]['sstat']==2 && $('.req_left_cont').css('display')=='block' && u_lvl==1)
                    view_r();
                    
                    if(c_req[x]['sstat']==1 && $('.req_left_cont').css('display')=='block' && u_lvl==2)
                    view_r();
                    
                    var coor=c_req[x]['coor'].split('%');
                    
                    if(c_req[x]['reqstat']==1)//background-color green:approved red:denied gray:pending
                    {
                        req_stat='Approved';
                        color='#5bb700';
                        title='Date Approved';
                    }
                    else if(c_req[x]['reqstat']==0)
                    {
                        req_stat='Pending';
                        color='#747474';
                        title='Date Requested';
                    }
                    else if(c_req[x]['reqstat']==2)
                    {
                        req_stat='Denied';
                        color='#dd0000';
                        title='Date Denied';
                    }
                    
                    if(jQuery.inArray(c_req[x]['reqid'],arr_id)==-1 && c_req[x]['reqstat']!=3)
                    {
                        if(u_lvl==1 && req_stat=='Pending')
                        $('.req_left_cont_base').prepend('<div class="a_files_status" style="background-color:'+color+'" id="stat_'+c_req[x]['reqid']+'">'+req_stat+'</div><div class="req_left_cont_span" id="cont_'+c_req[x]['reqid']+'"><div class="app_date" title="Date Requested" id="title_'+c_req[x]['reqid']+'">'+c_req[x]['d_req']+'</div><span><label>Client</label><input type="text" class="a_input_field c_name" value="'+c_req[x]['c_name']+'" readonly/></span><span><label>Lat</label><input type="text" id="lat_'+c_req[x]['reqid']+'" class="a_input_field" value="'+coor[0]+'" readonly/></span><span><label>Lng</label><input type="text" id="lng_'+c_req[x]['reqid']+'" class="a_input_field" value="'+coor[1]+'" readonly/></span><span><label>Location</label><input type="text" class="a_input_field" value="'+c_req[x]['area']+'" readonly/></span><span class="certspan"  id="certspan_'+c_req[x]['reqid']+'"></span><span id="span_'+c_req[x]['reqid']+'">'); 
                        else if(u_lvl==1  && req_stat=='Approved')
                        $('.req_left_cont_base').prepend('<div class="a_files_status" style="background-color:'+color+'" id="stat_'+c_req[x]['reqid']+'">'+req_stat+'</div><div class="req_left_cont_span" id="cont_'+c_req[x]['reqid']+'"><div class="app_date" title="Date Approved" id="title_'+c_req[x]['reqid']+'">'+c_req[x]['dendate']+'</div><span><label>Client</label><input type="text" class="a_input_field c_name" value="'+c_req[x]['c_name']+'" readonly/></span><span><label>Lat</label><input type="text" id="lat_'+c_req[x]['reqid']+'" class="a_input_field" value="'+coor[0]+'" readonly/></span><span><label>Lng</label><input type="text" id="lng_'+c_req[x]['reqid']+'" class="a_input_field" value="'+coor[1]+'" readonly/></span><span><label>Location</label><input type="text" class="a_input_field certificates" value="'+c_req[x]['area']+'" readonly style="cursor:pointer" title="'+c_req[x]['certfilename']+'" id="cert_'+c_req[x]['reqid']+'"/></span><span><label>Cert.</label><input type="text" class="a_input_field certificates" value="'+c_req[x]['certfilename']+'" readonly style="cursor:pointer" title="'+c_req[x]['certfilename']+'" onclick="show_app_div('+c_req[x]['reqid']+')"/></span><span id="span_'+c_req[x]['reqid']+'">'); 
                        else if(u_lvl==2  && req_stat=='Approved')
                        $('.req_left_cont_base').prepend('<div class="a_files_status" style="background-color:'+color+'" id="stat_'+c_req[x]['reqid']+'">'+req_stat+'</div><div class="req_left_cont_span" id="cont_'+c_req[x]['reqid']+'"><div class="app_date" title="Date Approved" id="title_'+c_req[x]['reqid']+'">'+c_req[x]['dendate']+'</div><span><label>Lat</label><input type="text" id="lat_'+c_req[x]['reqid']+'" class="a_input_field c_name" value="'+coor[0]+'" readonly/></span><span><label>Lng</label><input type="text" id="lng_'+c_req[x]['reqid']+'" class="a_input_field" value="'+coor[1]+'" readonly/></span><span><label>Location</label><input type="text" class="a_input_field" value="'+c_req[x]['area']+'" readonly/></span><span><label>Cert.</label><input type="text" class="a_input_field certificates" value="'+c_req[x]['certfilename']+'" readonly style="cursor:pointer" title="'+c_req[x]['certfilename']+'" id="cert_'+c_req[x]['reqid']+'" onclick="show_app_div('+c_req[x]['reqid']+')"/></span><span id="span_'+c_req[x]['reqid']+'">'); 
                        else if(u_lvl==2 && req_stat=='Pending')
                        $('.req_left_cont_base').prepend('<div class="a_files_status" style="background-color:'+color+'" id="stat_'+c_req[x]['reqid']+'">'+req_stat+'</div><div class="req_left_cont_span" id="cont_'+c_req[x]['reqid']+'"><div class="app_date" title="'+title+'" id="title_'+c_req[x]['reqid']+'">'+c_req[x]['d_req']+'</div><span><label>Lat</label><input type="text" id="lat_'+c_req[x]['reqid']+'" class="a_input_field c_name" value="'+coor[0]+'" readonly/></span><span><label>Lng</label><input type="text" id="lng_'+c_req[x]['reqid']+'" class="a_input_field" value="'+coor[1]+'" readonly/></span><span><label>Location</label><input type="text" class="a_input_field" value="'+c_req[x]['area']+'" readonly/></span><span class="certspan" id="certspan_'+c_req[x]['reqid']+'"></span><span id="span_'+c_req[x]['reqid']+'">'); 
                        else if(u_lvl==2 && req_stat=='Denied')
                        $('.req_left_cont_base').prepend('<div class="a_files_status" style="background-color:'+color+'" id="stat_'+c_req[x]['reqid']+'">'+req_stat+'</div><div class="req_left_cont_span" id="cont_'+c_req[x]['reqid']+'"><div class="app_date" title="Date Denied" id="title_'+c_req[x]['reqid']+'">'+c_req[x]['dendate']+'</div><span><label>Client</label><input type="text" class="a_input_field c_name" value="'+c_req[x]['c_name']+'" readonly/></span><span><label>Lat</label><input type="text" id="lat_'+c_req[x]['reqid']+'" class="a_input_field" value="'+coor[0]+'" readonly/></span><span><label>Lng</label><input type="text" id="lng_'+c_req[x]['reqid']+'" class="a_input_field" value="'+coor[1]+'" readonly/></span><span><label>Location</label><input type="text" class="a_input_field" value="'+c_req[x]['area']+'" readonly/></span><span id="span_'+c_req[x]['reqid']+'">'); 
                        
                        
                        if(c_req[x]['reqstat']==0 && u_lvl==2)
                        {
                            $('#cont_'+c_req[x]['reqid']).append('<span><div class="div_l"><div class="file_l">Files</div></div><div class="div_r"><form id="add_files"><input type="file" name="userfile" id="m_files" style="display:none"><button id="button_add_files" class="btn_add_f'+c_req[x]['reqid']+'" onclick="getReqid(\''+c_req[x]['reqid']+'\')">Add Files</button></div></form><div class="a_files" id="file_'+c_req[x]['reqid']+'">');
                            $('#span_'+c_req[x]['reqid']).prepend('<button id="can_'+c_req[x]['reqid']+'" onclick="cancel_r(\''+c_req[x]['reqid']+'\')" style="margin-bottom:10px">Cancel Request</button><button id="locate" onclick="locate_c(\''+coor[0]+'\', \''+coor[1]+'\')" style="margin-bottom:10px">Locate</button></span>');
                        }
                        else
                        {
                            $('#cont_'+c_req[x]['reqid']).append('<span><div class="file_l">Files</div><div class="a_files" id="file_'+c_req[x]['reqid']+'">');
                            $('#span_'+c_req[x]['reqid']).prepend('<button id="locate" onclick="locate_c(\''+coor[0]+'\', \''+coor[1]+'\')">Locate</button></span>');
                        }
                    }
                   
                    if(jQuery.inArray(c_req[x]['reqid'],btn_cont_ids)==-1)
                    {  
                       if(u_lvl==1 && c_req[x]['reqstat']==0)
                       $('#cont_'+c_req[x]['reqid']).after('<div class="a_files_btn_cont" id="btn_cont_'+c_req[x]['reqid']+'"><button onclick="show_app_div(\''+c_req[x]['reqid']+'\')">Send a Certificate</button><button onclick="den_alert(\''+c_req[x]['reqid']+'\', \''+c_req[x]['c_name']+'\', \''+c_req[x]['d_req']+'\', \''+coor[0]+'\', \''+coor[1]+'\', \''+c_req[x]['area']+'\')" id="den_'+c_req[x]['reqid']+'">Deny</button></div>');
                        
                    }
                    
                    if(c_req[x]['estat']==1)$('#den_'+c_req[x]['reqid']).addClass('btn_disabled');
                    if(c_req[x]['estat']==0 && $('#den_'+c_req[x]['reqid']).addClass('btn_disabled').length!=0)$('#den_'+c_req[x]['reqid']).removeClass('btn_disabled');
                    
                    
                    //cancel request
                    if(c_req[x]['reqstat']==3)
                    {
                        $('#stat_'+c_req[x]['reqid']).fadeOut('fast','swing',function(){$(this).remove();});
                        $('#cont_'+c_req[x]['reqid']).fadeOut('fast','swing',function(){$(this).remove();});
                        $('#btn_cont_'+c_req[x]['reqid']).fadeOut('fast','swing',function(){$(this).remove();});
                    }
                    
                    if(c_req[x]['reqstat']==2 || c_req[x]['reqstat']==1 && u_lvl==2)
                    {
                        $('.btn_add_f'+c_req[x]['reqid']).fadeOut('fast','swing',function(){$(this).remove();});
                        $('#can_'+c_req[x]['reqid']).fadeOut('fast','swing',function(){$(this).remove();});
                    }
                    
                    if(c_req[x]['reqstat']==2 && u_lvl==1)
                    {
                        $('#span_'+c_req[x]['reqid']).fadeOut('fast','swing',function(){$(this).remove();});
                        $('#cont_'+c_req[x]['reqid']).fadeOut('fast','swing',function(){$(this).remove();});
                        $('#stat_'+c_req[x]['reqid']).fadeOut('fast','swing',function(){$(this).remove();});
                        $('#btn_cont_'+c_req[x]['reqid']).fadeOut('fast','swing',function(){$(this).remove();});
                    }
                    
                    if(jQuery.inArray(c_req[x]['reqid'],cert_ids)==-1 && c_req[x]['reqstat']==1)
                    {
                        $('#certspan_'+c_req[x]['reqid']).append('<label>Cert.</label><input type="text" class="a_input_field certificates" value="'+c_req[x]['certfilename']+'" readonly style="cursor:pointer" title="'+c_req[x]['certfilename']+'" id="cert_'+c_req[x]['reqid']+'" onclick="show_app_div('+c_req[x]['reqid']+')"/>');
                    }
                    
                    if(c_req[x]['reqstat']==1)
                    {
                        $('#btn_cont_'+c_req[x]['reqid']).fadeOut('fast','swing',function(){$(this).remove();});
                       // $('#req_container').fadeOut('fast','swing');
                        //$('#appBase').fadeOut('fast','swing');
                    }
                    
                    $('#stat_'+c_req[x]['reqid']).text(req_stat);
                    $('#title_'+c_req[x]['reqid']).attr('title',title);
                    $('#stat_'+c_req[x]['reqid']).css('background-color',color);
                    get_f(c_req[x]['reqid']);
                }
            }
            
            if($('.a_files_status').length==0){
                $('.req_left_cont_base').empty();
                $('.req_left_cont_base').prepend('<div class="req_left_cont_empty" id="nor_req">No request found</div>');
            }
            else  $('#nor_req').fadeOut('fast','swing',function(){$(this).remove();});
        },
        error:function(){//alert('error');
        }
    });
}

function locate_c(lat,lng)
{
    var place_coor = new google.maps.LatLng(parseFloat(lat),parseFloat(lng));
    map.panTo(place_coor);
    place_marker.setMap(null);
    place_marker.setAnimation(google.maps.Animation.DROP);
    place_marker.setPosition(place_coor); 
    place_marker.setMap(map);
    
    reverseGeoCode(place_coor);
    checkIfInsideRock(place_coor);//rock
    checkIfInsideLand(place_coor);//land
    checkIfInsideHazard(place_coor);//hazard
}

function get_f(reqid)
{
    var file_id = $.map($(".files"), function(n, i){return n.id.replace('f_','');});
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/get_f',
        data:{r_id:reqid},
        success:function(result){
            var files=new Array();
            files=JSON.parse(result);
            
            var checkEmpty=$.isEmptyObject(files);
            if(checkEmpty==false)
            {
                for(var x=0;x<files.length;x++)
                {
                    if(jQuery.inArray(files[x]['fileid'],file_id)==-1)
                    {
                        $('#file_'+reqid).append('<div class="files_span" id="fspan_'+files[x]['fileid']+'"><a class="files" id="f_'+files[x]['fileid']+'" href="'+base_url+'../uploads/request_files/'+files[x]['filename']+'" target="_blank" title="'+files[x]['filename']+'">'+files[x]['filename']+'</a></div></div>');
                    }
                    if(files[x]['filestat']==1)
                    {
                        $('#f_'+files[x]['fileid']).fadeOut('fast','swing',function(){$(this).remove();});
                        $('#fspan_'+files[x]['fileid']).fadeOut('fast','swing',function(){$(this).remove();});
                        removeFile(files[x]['fileid']);
                    }
                }
            }
        },
        error:function(){//alert('error');
        }
    });
}

function check_r()
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/check_r',
        data:{user:username,ulvl:u_lvl},
        cache:false,
        success:function(data){
            var check=JSON.parse(data);
            if(check!=0 && $('.req_left_cont').css('display')=='none')
                $('.nav_a3').addClass('new_request');
            else
                $('.nav_a3').removeClass('new_request');
        },
        error:function(){//alert('checkrequestserror');
        }
    });
}

function view_r() //view the requests
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/view_r',
        data:{user:username,ulvl:u_lvl},
        cache:false,
        success:function(){},
        error:function(){//alert('viewrequestserror');
        }
    });
}

/*function req_app(reqid)
{
    $.ajax({
        type:'POST',
        url:base_url+'index.php/req_controller/req_app',
        data:{r_id:reqid},
        cache:false,
        success:function(){
            $('#btn_cont_'+reqid).fadeOut('fast','swing',function(){$(this).remove();});
            $('#req_container').fadeOut('fast','swing');
            $('#appBase').fadeOut('fast','swing');
            
        },
        error:function(){alert('approveerror');
        }
    });
}*/
