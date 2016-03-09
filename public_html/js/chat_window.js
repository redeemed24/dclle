var time = 0;
var minmax;
var convo_id = [];
var div_count = 0;

var chatWith = function(arrayOfConvo){ // if convo_id[2] is 2 (status) thread is in original window, in model.. retrieved messages is not limited to 10
    for(var i=0; i<arrayOfConvo.length; i++){
        convo_id[i] = arrayOfConvo[i];
    }
}

$(document).ready(function(){
    $.ajaxSetup({ cache: false });
    minMax(1);
});

window.onload=function(){
   
    if(convo_id[2]==2){ // if window is not chat
        initializeUsers();
        getMessage();
        
        window.onbeforeunload = function(){
            $.getJSON(base_url+"index.php/chat_c/upOffline"); // set user offline
            alert('Press ok to continue.');
        };
    
        setInterval(function (){
            getUsers(0);
            alertMessage(0);
            $.getJSON(base_url+"index.php/chat_c/upOnline"); // set user online
        },3000);
    }
    
    else{
        initializeSend();
 
        $(window).resize(function() {
            resizeDivSend(); // adjust height on window resize
        });
    }
};

/*********************************************CHAT THREAD***********************************************************************/
function resizeDivSend(){
    document.getElementById('received').style.height=(window.innerHeight*.635)+"px"; // adjust height thread
    document.getElementById('textWrap').style.height=(window.innerHeight*.30)+"px"; // adjust height
    $('#received').scrollTop($('#received')[0].scrollHeight);
}

function initializeSend(){
    /*************************SETTINGS***************************/
            resizeDivSend(); // adjust div size
            
            setTimeout(function(){ // scroll div onload
                $('#received').scrollTop($('#received')[0].scrollHeight);
            }, 3000);
            
             setInterval(function (){
                getChats(0); // getMessages for thread
            },1500);
    
    /*************************CHAT EVENTS**************************/
            $('#send').click(function(evt){ // send button
                evt.preventDefault();
                saveMess();
            });
            
            $(document).keyup(function(e) { // enter key send message
                if (e.keyCode == 13){
                    saveMess();
                }   // esc
            });
             
            var text_focus = 0;
            $('#text').focus(function() { // set messaged seen
                    text_focus = 1;
                    if(text_focus == 1){
                    $.ajax({
                    type: "POST",
                    cache: false,
                    url: base_url+'index.php/chat_c/setMess',
                    data: {conversationID: convo_id[1]}
                    });
                    }
            });
            
            $('#text').blur(function() { // set messaged seen
                text_focus = 0;
            });
            
            /*****************UPLOAD FILES*********************/
     
                $('#submit_file').click(function(){ // add files
                    $('#overlay').show(function(){
                        
                        $(document).keyup(function(e) { // escape button
                            if (e.keyCode == 27){
                                 $('#overlay').hide();
                                  $('#form_upload').trigger("reset");
                            }   // esc
                        });
                       
                        $('#form_upload').on('submit', function(event){ // ajax upload file
                            event.preventDefault();
                            
                            if($('#files_button input').val()!="")
                            {
                                var formData =  new FormData($('#form_upload')[0]);
                                $.ajax({
                                    url: base_url+'index.php/chat_c/upload',
                                    data: formData,
                                    async: false,
                                    contentType: false,
                                    processData: false,
                                    cache: false,
                                    type: 'POST',
                                    beforeSend: function(data){
                                        $('#uploader_file').fadeIn('fast','swing');
                                    },
                                    complete: function(){
                                        $('#uploader_file').fadeOut('fast','swing');
                                    },
                                    error: function(){
                                        $('#uploader_file').fadeOut('fast','swing',function(){
                                             $('#error_file').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
                                        });
                                    },
                                    success: function(data){
                                        $('#overlay').hide();
                                        setTimeout(function(){
                                            $('#received').scrollTop($('#received')[0].scrollHeight);
                                        }, 2000);
                                    }
                                });
                                $('#form_upload').trigger("reset");
                            }    
                            return false;
                        });
                    });
                });  
}
/*********************SAVE MESSAGE************************/
    function saveMess(){ // save message
        var text = document.getElementById('text');
            var data = text.value;
            text.value = '';
           
            if($.trim(data)){
            $.ajax({
                type: "POST",
                url: base_url+'index.php/chat_c/saveMess',
                data:{message: data, convo_id: convo_id[0]}, 
                cache: false,
                complete: function(){
                    text.value = '';//ended here
                }
            });
        }
        
        setTimeout(function(){
            $('#received').scrollTop($('#received')[0].scrollHeight);
        }, 2000);
        
    }

/*********************GET MESSAGE************************/
    var getChats = function(){ // get messages
        $.ajax({
            type: 'POST',
            url: base_url+'index.php/chat_c/getChat',
            dataType: 'json',
            cache: false,
            data: {time: time, conv_1: convo_id[0], conv_2: convo_id[1], conv_3: convo_id[2]},
            success: function(data){
                addDataToReceived(data);
                time = data[data.length-1][1];
            }
        });
    }
    
    var addDataToReceived = function (arrayOfData) {
        for(var i=0; i<arrayOfData.length; i++){
            $("#received").html($("#received").html() + "<br>" + arrayOfData[i][0]);
        }
    }

/*********************************************ONLINE USERS***********************************************************************/
function initializeUsers(){  
    $('#onlineGeo').click(function(){
        minMax(minmax);
    });
    
    $('#onlineMax').click(function(){
        minMax(minmax);
    });
    
    clickUsers(); //click users
}

function setUsers(i, fname, lname, username, isonline){
    var winPop = false;
    $("#anchor_"+i).click(function(){
        if(winPop && !winPop.closed){
            winPop.focus();
        }
        else{
            var win = window.open(base_url+'index.php/chat_c/openWin/'+ fname+ '/' + lname + '/' + username + '/' + isonline, 'winPop_'+i, 'width=350px,height=400px,resizable=no,titlebar=no,scrollbars=yes');
        }
    });
}

function clickUsers(){
    $.getJSON(base_url+"index.php/chat_c/getUsers", function (data){
        for(var i=0; i<data.length; i++){
            setUsers(i, data[i]['fname'], data[i]['lname'], data[i]['username'], data[i]['isonline']);
        }
    });
}

function minMax(min_max){
    if($('#onlineGeo').length!=0)
    {
        document.getElementById('onlineGeo').innerHTML = '';
        
        if(min_max==1){
           $('#onlineGeo').removeClass();
           $('#onlineGeo').addClass('onlineMin');
           
           document.getElementById('onlineGeo').innerHTML = $('#headerMax').text(); //'CHAT GEOLOGISTS';
           var link = document.getElementById('onlineMax');
           link.style.display = 'none';
           minmax = 2;
        }
        
        else if(min_max==2){
            $('#onlineGeo').removeClass();
            $('#onlineGeo').addClass('onlineMax');
            
            var link = document.getElementById('onlineMax');
            link.style.display = 'block';
            minmax = 1;
        }
    }
}

var getUsers = function(){
     $.getJSON(base_url+"index.php/chat_c/getUsers", function (data){
            updateOnline(data);
     });
};

var updateOnline = function (arrayOfData) {
    for(var i=0; i<arrayOfData.length; i++){
        $('#anchor_'+i).removeClass();
        $('#countMess_'+i).text('');
        
        if(arrayOfData[i]['isonline']==1){
            $('#anchor_'+i).addClass('nameOn');
        }
        
        else{
            $('#anchor_'+i).addClass('nameOff');
        }
        
            if(arrayOfData[i]['mess_count']!=0){
                $('#countMess_'+i).text(arrayOfData[i]['mess_count']);
            }
    }
}

/******************************************ALERT IF SOMEBODY MESSAGED*********************************************************/

var alertMessage = function(){ // alert if somebody messaged ONLINE
     $.getJSON(base_url+"index.php/chat_c/getMessages_old", function (data){
        if(data.length != 0){ // pending messages
            document.getElementById('onlineGeo').style.backgroundColor = '#ff0000';
        }
        else{
            document.getElementById('onlineGeo').style.backgroundColor = '#225068';
        }
     });
     
     $.getJSON(base_url+"index.php/chat_c/getMessages_new", function (data){
        popMessage(data);
     });
};
 
var getMessage = function(){ // alert if somebody messaged OFFLINE
     $.getJSON(base_url+"index.php/chat_c/getMessages_old", function (data){
        popMessage(data);
     });
};

function createDiv(i, message, height, fname, lname, isonline){
    var div_ = document.createElement("div");
    div_.id = "div_"+i;
    div_.style.height = ((i+height)) + 'px';
    div_.style.display = 'none';
    div_.style.color = '#F0F0F0';
    div_.style.textAlign = "left";
    div_.className = "popMessage";
    div_.innerHTML = fname + " messaged you! ";
    
    div_.onclick = function(){
        var xhr = base_url+'index.php/chat_c/openWin/'+ fname + '/' + lname + '/' + message + '/' + isonline; /***controller url****/
        var open = window.open(xhr, 'winPop_'+i, 'height=400,width=350,scrollbars=yes');
        if (window.focus){
            open.focus();
        }       
    };
    
    return div_;
}

var popMessage = function (arrayOfData) {
    var height = (30*arrayOfData.length);
    for(var i=0; i<arrayOfData.length; i++){
        var div_ = createDiv(i, arrayOfData[i]['peer_1'], height, arrayOfData[i]['fname'], arrayOfData[i]['lname'], arrayOfData[i]['isonline']);
        height = height - 30;
        document.body.appendChild(div_);
    }
    
        for(var i=0; i<arrayOfData.length; i++){
            $("#div_"+i).slideDown("slow");
            $("#div_"+i).delay(2000);
            $("#div_"+i).slideUp("slow", function(){
                $(this).remove();
            });
        }
}
 