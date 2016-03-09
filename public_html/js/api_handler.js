$(document).ready(function(){
    $.ajaxSetup({ cache:false });
    var t_imer = setInterval(function(){
        if(typeof google === 'object' || typeof google.maps === 'object' || window.google.maps === 'object')
        {
            clearInterval(t_imer);
            $('#container').fadeIn('fast',initialize);
            detectBrowser();
        }
        //put loader here
    },100);
});