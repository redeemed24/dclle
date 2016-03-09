google.maps.visualRefresh = true;

//global variables
var davao_city = new google.maps.LatLng(7.190708000000000000, 125.455340999999980000);//default center
var map;
var geocoder;
var place_marker;

//back bone for evaluating
var hazards = new Array();
var rocks = new Array();
var land = new Array();

//displays
var dispHazards = new Array();//display hazards
var dispRocks = new Array();//display rocks
var dispLand = new Array();//display land

var lvl_sum = 0;

$(document).ready(function(){
   // initialize();
    detectBrowser();
    
    //hiding
    $('#ev_error').hide();
    $('#pop-upLegend').hide();
    $('#searchBox').hide();
    
    //close legend
    $('#pop-upLegend_header button').click(function(){
        $('#pop-upLegend').hide();
    });
    
    $(window).resize(function(){
        detectBrowser();
    });
});

function initialize()
{
    var mapOptions = {backgroundColor:'#ffffff',
                      center: davao_city,
                      mapTypeId: google.maps.MapTypeId.ROADMAP,
                      zoom: 11,
                      minZoom: 11,
                      disableDefaultUI: true,
                      mapMaker: true,
                      mapTypeControl: false,
                      mapTypeControlOptions:{
                        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
                        mapTypeIds: [google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.ROADMAP]
                        },
                      panControl:true,
                      scaleControl:true,
                      zoomControl: true,
                      disableDoubleClickZoom: true
                      };
                      
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    geocoder = new google.maps.Geocoder();
    
    getRocks();//get rock coordinates
    getLand();//get land coordinates
    getHazardCoors();//get hazard coordinates
    getHazLvlSum();//get lvl sum
    
    //retrieve shapes from db
    if(e_type==1)//hazard
    {
        dispHazardCoors(s_id);   
    }
    else if(e_type==2)//map rock or land
    {
        dispMapCoors(s_id);
    }
    
    //mouse move and display coordinates
    google.maps.event.addListener(map,'mousemove',function(event){
        var lat = document.getElementById('lat');
        var lng = document.getElementById('lng');
        var coor = event.latLng.toString();
        coor = coor.replace('(','');
        coor = coor.replace(')','');
        coor = coor.replace(' ','');
        var coor_split = coor.split(',');
        
        lat.value = coor_split[0];
        lng.value = coor_split[1];
    });
    
    //Marker--------------------------------------------------------------------------
    var markerOption = {map:map, position:davao_city, draggable:true, title:"Drag Me!"};
    place_marker = new google.maps.Marker(markerOption);
    
    //marker click
    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(place_marker,'click',function(){
                infowindow.setContent('<div style="font-family:calibri; font-size:13px;"><b>Lat: </b>'+place_marker.getPosition().lat()+'<br><b>Lng: </b>'+place_marker.getPosition().lng()+'</div>');
                infowindow.open(map,place_marker);
    });
    
    //map click
    google.maps.event.addListener(map,'click',function(event){
        infowindow.close();
        $('#searchBox').val("");//reset search box
        
        place_marker.setMap(null);
        place_marker.setAnimation(google.maps.Animation.DROP);
        place_marker.setPosition(event.latLng); 
        place_marker.setMap(map);
        
        //reset legend outline
        $('#evaluator_field_R ul li').css('outline','none');
        
        //evaluate
        reverseGeoCode(event.latLng);
        checkIfInsideRock(event.latLng);//rock
        checkIfInsideLand(event.latLng);//land
        checkIfInsideHazard(event.latLng);//hazard
    });
    
    //marker drag
    google.maps.event.addListener(place_marker,'drag',function(event){
        infowindow.close();
        var lat = document.getElementById('lat');
        var lng = document.getElementById('lng');
        var coor = event.latLng.toString();
        coor = coor.replace('(','');
        coor = coor.replace(')','');
        coor = coor.replace(' ','');
        var coor_split = coor.split(',');
        
        lat.value = coor_split[0];
        lng.value = coor_split[1];
    });
    
    //marker drag end
    google.maps.event.addListener(place_marker,'dragend',function(event){
        $('#searchBox').val("");//reset search box
        
        place_marker.setAnimation(google.maps.Animation.BOUNCE);
        
        window.setTimeout(function(){
            place_marker.setAnimation(null);
        }, 500);
        
        //reset legend outline
        $('#evaluator_field_R ul li').css('outline','none');
        
        //evaluate
        reverseGeoCode(event.latLng);
        checkIfInsideRock(event.latLng);//rock
        checkIfInsideLand(event.latLng);//land
        checkIfInsideHazard(event.latLng);//hazard
    });
    
    /*SEARCH*/
    // Search Box initialization
    var davaoBounds = new google.maps.LatLngBounds(
                                                    new google.maps.LatLng(6.92, 125.22),
                                                    new google.maps.LatLng(7.57, 125.68)
                                                    );
    
    var input = /** @type {HTMLInputElement} */(document.getElementById('searchBox'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);      
    var searchBox = new google.maps.places.SearchBox(/** @type {HTMLInputElement} */(input),{ bounds:davaoBounds });
    
    //after tiles loaded
    google.maps.event.addListener(map,'tilesloaded',function(){
          $('#searchBox').fadeIn('fast','swing');
    });
    
    //after searching = get result
    google.maps.event.addListener(searchBox,'places_changed',function(){    
            infowindow.close();
            
            //retrieve input value and process it
            var crs = input.value;
            crs = crs.replace('(','');
            crs = crs.replace(')','');
            var crs_split = crs.split(',');
            
            if(crs_split.length==2 && isNaN(crs_split[0])==false && isNaN(crs_split[1])==false)//if not an address
            {
                    var place_coor = new google.maps.LatLng(parseFloat(crs_split[0]),parseFloat(crs_split[1]));
                    
                    //reset legend outline
                    $('#evaluator_field_R ul li').css('outline','none');
                    
                    map.panTo(place_coor);
                    place_marker.setMap(null);
                    place_marker.setAnimation(google.maps.Animation.DROP);
                    place_marker.setPosition(place_coor); 
                    place_marker.setMap(map);
            
                    //evaluate   
                    reverseGeoCode(place_coor);//geo code             
                    checkIfInsideRock(place_coor);//rock
                    checkIfInsideLand(place_coor);//land
                    checkIfInsideHazard(place_coor);//hazard
            }
            else//if real address
            {
                var places = searchBox.getPlaces();
                for (var x = 0, place; place = places[x],x<1;x++)//restrict to first result only
                {
                    //reset legend outline
                    $('#evaluator_field_R ul li').css('outline','none');
                    
                    map.panTo(place.geometry.location);
                    place_marker.setMap(null);
                    place_marker.setAnimation(google.maps.Animation.DROP);
                    place_marker.setPosition(place.geometry.location); 
                    place_marker.setMap(map);
            
                    //evaluate   
                    reverseGeoCode(place.geometry.location);//geo code             
                    checkIfInsideRock(place.geometry.location);//rock
                    checkIfInsideLand(place.geometry.location);//land
                    checkIfInsideHazard(place.geometry.location);//hazard
                }
            }
    });
    /*END OF SEARCH*/
    
}/*end of initialize*/

function detectBrowser()
{   
    //legend list height if mobile
    if($('#evaluator_field_R').css('position') == 'absolute')
    {
        var hedfld = parseFloat($('#header').css('height'))+ parseFloat($('#evaluator_field').css('height'));//header and field height
        $('#map-canvas').css('height',window.innerHeight - hedfld - 5);
        $('#evaluator_field_R').css('height',window.innerHeight - hedfld - 5);
    }
    else
    {
        $('#evaluator_field_R').css({'height':'auto','min-height':'100px'});
        var hedfld = parseFloat($('#header').css('height'))+ parseFloat($('#evaluator_field').css('height'));//header and field height
        $('#map-canvas').css('height',window.innerHeight - hedfld - 5);
    }
    $('#ev_error').css('height', window.innerHeight);
}

function reverseGeoCode(latLng)
{
    geocoder.geocode({'latLng':latLng},function(results,status){
        if (status == google.maps.GeocoderStatus.OK)
        {
            if(results[0].formatted_address)
            {   
                $('#location').val(results[0].formatted_address.toString());    
                $('#location').attr('title',results[0].formatted_address.toString());
            }
            else
            {
                $('#location').val('No data found');
                $('#location').attr('title',"No data found");
            }
        }
        else
        {
            $('#location').val(latLng.toString());
            $('#location').attr('title',latLng.toString());
        }
    });
}

/*Back Bone------------------------------------------*/
/*---------------------------------------------------*/
/*rocks evaluation*/
function getRocks()//[1]
{
    $.ajax({
        type: "GET",
        url: base_url+"index.php/main_controller/getRocks",
        dataType: "json",
        cache:false,
        success: function(result){
            for(var x=0;x<result.length;x++)
            {
                var rock_poly = rock_processCoor(result[x]['mc_coordinates'], result[x]['ml_type']);
                rocks.push({'mc_id':result[x]['mc_id'],
                            'rock_poly':rock_poly,
                            'ml_id':result[x]['ml_id'],
                            'ml_name':result[x]['ml_name'],
                            'ml_desc':result[x]['ml_desc'],
                            'ml_type':result[x]['ml_type']});
            }
        },
        error: function(){
                $('#ev_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
                //alert('1');
        }
    });
}

function rock_processCoor(mc_coordinates,ml_type)//[2]
{
    if(ml_type==2)//polyline
    { var rock_poly = new google.maps.Polyline(); }
    else//polygon
    { var rock_poly = new google.maps.Polygon(); }
    
    
    var a =  mc_coordinates.replace(/\,\(/g,"");//remove ,(
        a =  a.replace(/\(/g,"");//remove (
    var b = a.split(')');//remove )
    
    for(var x=0;x<b.length;x++)
    {
        if(b[x].replace(/^\s+|\s+$/g,'')!="")
        {
            var c = b[x].split(',');
            rock_poly.getPath().push(new google.maps.LatLng( parseFloat(c[0]),parseFloat(c[1]) ) );
        }
    }
    
    return rock_poly;
}

function checkIfInsideRock(latLng)//[3]
{
    var isOne = 0;
    var ctr=0;
    var ctr2=0;
    for(var x=0;x<rocks.length;x++)
    {
            if(rocks[x]['ml_type']==1)//rock type
            {
                if((google.maps.geometry.poly.containsLocation(latLng,rocks[x]['rock_poly'])==true || google.maps.geometry.poly.isLocationOnEdge(latLng,rocks[x]['rock_poly'],0.0001)==true) && isOne==0)
                {
                    var disp = rocks[x]['ml_name']+": "+rocks[x]['ml_desc']; 
                    $('#rock_type').val(disp);    
                    $('#rock_type').attr('title',disp);
                    ctr++;
                    
                    if(s_id==1 && e_type==2)
                    {
                        $('#map-'+rocks[x]['ml_id']).css('outline','2px solid #1e465b');
                         
                        //force scroll
                        var pos = $("#map-"+rocks[x]['ml_id']).position().top+$('#evaluator_field_R ul').scrollTop();
                        $('#evaluator_field_R ul').animate({scrollTop:pos},'fast','swing');
                    }
                    isOne++;
                }
            }
            else//rock structure
            {
                if(google.maps.geometry.poly.isLocationOnEdge(latLng,rocks[x]['rock_poly'],0.0001)==true)
                {
                    var disp = rocks[x]['ml_name']; 
                    $('#rock_struct').val(disp);
                    $('#rock_struct').attr('title',disp);
                    ctr2++;
                    
                    if(s_id==1 && e_type==2)
                    {
                        $('#map-'+rocks[x]['ml_id']).css('outline','2px solid #1e465b');
                         
                        //force scroll
                        var pos = $("#map-"+rocks[x]['ml_id']).position().top+$('#evaluator_field_R ul').scrollTop();
                        $('#evaluator_field_R ul').animate({scrollTop:pos},'fast','swing');
                    }
                }
            }
    }//end of loop
    
    if(ctr==0)
    {
        $('#rock_type').val("No data found");
        $('#rock_type').attr('title',"No data found");
    }
    if(ctr2==0)
    {
        $('#rock_struct').val("No data found");
        $('#rock_struct').attr('title',"No data found");
    }
}

/*end of rock*/

/*land evaluation*/
function getLand()//[1]
{
    $.ajax({
        type: "GET",
        url: base_url+"index.php/main_controller/getLand",
        dataType: "json",
        cache:false,
        success: function(result){
            for(var x=0;x<result.length;x++)
            {
                var land_poly = land_processCoor(result[x]['mc_coordinates']);
                land.push({'mc_id':result[x]['mc_id'],
                            'land_poly':land_poly,
                            'ml_id':result[x]['ml_id'],
                            'ml_name':result[x]['ml_name'],
                            'ml_desc':result[x]['ml_desc']});
            }
        },
        error: function(){
                $('#ev_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
                //alert('2');
        }
    });
}

function land_processCoor(mc_coordinates)//[2]
{
    var land_poly = new google.maps.Polygon();
    
    var a =  mc_coordinates.replace(/\(/g,"");//remove (
    var b = a.split(')');//remove )
    
    for(var x=0;x<b.length;x++)
    {
        if(b[x].replace(/^\s+|\s+$/g,'')!="")
        {
            var c = b[x].split(',');
            land_poly.getPath().push(new google.maps.LatLng( parseFloat(c[0]),parseFloat(c[1]) ) );
        }
    }
    
    return land_poly;
}

function checkIfInsideLand(latLng)//[3]
{
    var isOne = 0;//restricts only one type of soil result per location
    var ctr=0;
    for(var x=0;x<land.length;x++)
    {
        if((google.maps.geometry.poly.containsLocation(latLng,land[x]['land_poly'])==true || google.maps.geometry.poly.isLocationOnEdge(latLng,land[x]['land_poly'],0.0001)==true) && isOne==0)
        {
            $('#land_type').val(land[x]['ml_name']);
            $('#land_type').attr('title',land[x]['ml_name']);
            ctr++;
            
            if(s_id==2 && e_type==2)
            {
                $('#map-'+land[x]['ml_id']).css('outline','2px solid #1e465b');
                 
                //force scroll
                var pos = $("#map-"+land[x]['ml_id']).position().top+$('#evaluator_field_R ul').scrollTop();
                $('#evaluator_field_R ul').animate({scrollTop:pos},'fast','swing');
            }
            isOne++;
        }
    }
    
    if(ctr==0)
    {
        $('#land_type').val("No data found");
        $('#land_type').attr('title',"No data found");
    }
}
/*end of land*/

/*hazard evaluation*/
function getHazardCoors()//[1]
{
    $.ajax({
        type: "GET",
        url: base_url+"index.php/main_controller/getHazardCoors",
        dataType: "json",
        cache:false,
        success: function(result){
            for(var x=0;x<result.length;x++)
            {
                var haz_poly = haz_processCoor(result[x]['hc_coordinates'],result[x]['hc_shape']);
                hazards.push({'hc_id':result[x]['hc_id'],
                              'haz_poly':haz_poly,
                              'hc_shape':result[x]['hc_shape'],
                              'hl_id':result[x]['hl_id'],
                              'hl_lvl':result[x]['hl_lvl'],
                              'hl_name':result[x]['hl_name'],
                              'h_id':result[x]['h_id'],
                              'h_name':result[x]['h_name']});
            }
        },
        error: function(){
                $('#ev_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
                //alert('3');
        }
    });
}

function haz_processCoor(hc_coordinates, hc_shape)//[2]
{
    if(hc_shape==2)//polyline
        var haz_poly = new google.maps.Polyline();
    else//polygon
        var haz_poly = new google.maps.Polygon();
    
    var a =  hc_coordinates.replace(/\(/g,"");//remove (
    var b = a.split(')');//remove )
    
    for(var x=0;x<b.length;x++)
    {
        if(b[x].replace(/^\s+|\s+$/g,'')!="")
        {
            var c = b[x].split(',');
            haz_poly.getPath().push(new google.maps.LatLng( parseFloat(c[0]),parseFloat(c[1]) ) );
        }
    }
    
    return haz_poly;
}

function checkIfInsideHazard(latLng)//[3]
{
    var ctr = 0;
    var ctr_hid = new Array();
    var rate = 0;
    
    //reset haz_list
    var haz_list = document.getElementById('haz_list');
    haz_list.innerHTML="";
       
    for(var x=0;x<hazards.length;x++)
    {
        if(hazards[x]['hc_shape']==1)//polygon
        {
            if(google.maps.geometry.poly.containsLocation(latLng,hazards[x]['haz_poly'])==true || google.maps.geometry.poly.isLocationOnEdge(latLng,hazards[x]['haz_poly'],0.0001)==true)
            {
                var checker = 0;
                for(var z=0;z<ctr_hid.length;z++)
                {
                    if(ctr_hid[z]==hazards[x]['h_id'])
                        checker=1;
                }
                
                if(checker==0)
                {
                    if(hazards[x]['hl_lvl']!=0)
                    {
                        //put hazard name to list
                        haz_list.innerHTML+="<span title='"+hazards[x]['h_name']+" : "+hazards[x]['hl_name']+"'>"+hazards[x]['h_name']+" : <i>"+hazards[x]['hl_name']+"</i></span>";
                        
                        ctr_hid.push(hazards[x]['h_id']);
                        rate+=parseFloat(hazards[x]['hl_lvl']);
                        ctr++;
                        
                        if(hazards[x]['h_id']==s_id && e_type==1)
                        {
                            $('#haz-'+hazards[x]['hl_id']).css('outline','2px solid #1e465b');
                            
                            //force scroll
                            var pos = $("#haz-"+hazards[x]['hl_id']).position().top+$('#evaluator_field_R ul').scrollTop();
                            $('#evaluator_field_R ul').animate({scrollTop:pos},'fast','swing');
                        }
                    }
                }
            }
        }
        else//polyline
        {
            if(google.maps.geometry.poly.isLocationOnEdge(latLng,hazards[x]['haz_poly'],0.0001)==true)
            {
                var checker = 0;
                for(var z=0;z<ctr_hid.length;z++)
                {
                    if(ctr_hid[z]==hazards[x]['h_id'])
                        checker=1;
                }
                
                if(checker==0)
                {
                    if(hazards[x]['hl_lvl']!=0)
                    {
                        //put hazard name to list
                        haz_list.innerHTML+="<span title='"+hazards[x]['h_name']+" : "+hazards[x]['hl_name']+"'>"+hazards[x]['h_name']+" : <i>"+hazards[x]['hl_name']+"</i></span>";
                        
                        ctr_hid.push(hazards[x]['h_id']);
                        rate+=parseFloat(hazards[x]['hl_lvl']);
                        ctr++;
                        
                        if(hazards[x]['h_id']==s_id && e_type==1)
                        {
                            $('#haz-'+hazards[x]['hl_id']).css('outline','2px solid #1e465b');
                            
                            //force scroll
                            var pos = $("#haz-"+hazards[x]['hl_id']).position().top+$('#evaluator_field_R ul').scrollTop();
                            $('#evaluator_field_R ul').animate({scrollTop:pos},'fast','swing');
                        }
                    }
                }
            }            
        }
    }//end of loop
    
    var safety_rate = (100-((rate/lvl_sum)*100)).toFixed(2);
   
    if(ctr<=1)
    {
        if(ctr==0)//if empty
        { haz_list.innerHTML+="<span></span><span></span>"; }
            
        $('#no_haz').html(ctr+" Geologic hazard found in this area");
    }
    else
    {  $('#no_haz').html(ctr+" Geologic hazards found in this area");   }
        
    $('#safety_rate').val(safety_rate+"% less chance of hazard");
    $('#safety_rate').attr('title',safety_rate+"% less chance of hazard");
}

function getHazLvlSum()//[4]
{
    $.ajax({
        type: "GET",
        url: base_url+"index.php/main_controller/getHazLvlSum",
        dataType: "json",
        cache:false,
        success: function(result){
            for(var x=0;x<result.length;x++)
            {
                lvl_sum = result[x]['sum'];
            }
        },
        error: function(){
                $('#ev_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
                //alert('4');
        }
    });
}
/*end of hazards*/


/*display on map--------------------------------------------------*/
/*----------------------------------------------------------------*/
//disphazard ajax
function dispHazardCoors(haz_id)
{
    $.ajax({
        type: "GET",
        url: base_url+"index.php/main_controller/dispHazardCoors/"+haz_id,
        dataType: "json",
        cache:false,
        success: function(result){
            for(var x=0;x<result.length;x++)
            {
                var haz_poly = dispHaz_processCoor(result[x]['hc_coordinates'], result[x]['hc_shape'], result[x]['hl_color']);
                dispHazards.push({'hc_id':result[x]['hc_id'],
                                  'haz_poly':haz_poly,
                                  'hl_id':result[x]['hl_id']});
            }
        },
        error: function(){
                $('#ev_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
                //alert('5');
        }
    });
}

//hazard process
function dispHaz_processCoor(hc_coordinates, hc_shape, hl_color)
{
    if(hc_shape==2)//polyline
        var haz_poly = new google.maps.Polyline({strokeColor:hl_color,
                                                 strokeWeight:0.85,
                                                 strokeOpacity:1,
                                                 map:map,
                                                 clickable:false});
    else//polygon
        var haz_poly = new google.maps.Polygon({strokeWeight:0,
                                                fillColor:hl_color,
                                                fillOpacity:0.85,
                                                map:map,
                                                clickable:false});
    
    var a =  hc_coordinates.replace(/\(/g,"");//remove (
    var b = a.split(')');//remove )
    
    for(var x=0;x<b.length;x++)
    {
        if(b[x].replace(/^\s+|\s+$/g,'')!="")
        {
            var c = b[x].split(',');
            haz_poly.getPath().push(new google.maps.LatLng( parseFloat(c[0]),parseFloat(c[1]) ) );
        }
    }
    
    return haz_poly;
}

//dispRock and dispLand ajax
function dispMapCoors(map_id)
{
    $.ajax({
        type: "GET",
        url: base_url+"index.php/main_controller/dispMapCoors/"+map_id,
        dataType: "json",
        cache:false,
        success: function(result){
            for(var x=0;x<result.length;x++)
            {
                if(map_id==1)//rock
                {
                    var rock_poly = dispRock_processCoor(result[x]['mc_coordinates'], result[x]['ml_type'], result[x]['ml_color']);
                    dispRocks.push({'mc_id':result[x]['mc_id'],
                                    'rock_poly':rock_poly,
                                    'ml_id':result[x]['ml_id']});
                }
                else if(map_id==2)//land
                {
                    var land_poly = dispLand_processCoor(result[x]['mc_coordinates'], result[x]['ml_color']);
                    dispLand.push({'mc_id':result[x]['mc_id'],
                                   'land_poly':land_poly,
                                   'ml_id':result[x]['ml_id']});
                }
            }
        },
        error: function(){
            $('#ev_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
            //alert('6');
        }
    });
}

//rock process
function dispRock_processCoor(mc_coordinates, ml_type, ml_color)
{
    if(ml_type==2)//polyline
        var rock_poly = new google.maps.Polyline({strokeColor:ml_color,
                                                 strokeWeight:0.85,
                                                 strokeOpacity:1,
                                                 map:map,
                                                 clickable:false});
    else//polygon
        var rock_poly = new google.maps.Polygon({strokeWeight:0,
                                                fillColor:ml_color,
                                                fillOpacity:0.85,
                                                map:map,
                                                clickable:false});
    
    var a =  mc_coordinates.replace(/\,\(/g,"");//remove ,(
        a =  a.replace(/\(/g,"");//remove (
    var b = a.split(')');//remove )
    
    for(var x=0;x<b.length;x++)
    {
        if(b[x].replace(/^\s+|\s+$/g,'')!="")
        {
            var c = b[x].split(',');
            rock_poly.getPath().push(new google.maps.LatLng( parseFloat(c[0]),parseFloat(c[1]) ) );
        }
    }
    
    return rock_poly;
}

//land process
function dispLand_processCoor(mc_coordinates, ml_color)
{
    //polygon
    var land_poly = new google.maps.Polygon({strokeWeight:0,
                                             fillColor:ml_color,
                                             fillOpacity:0.85,
                                             map:map,
                                             clickable:false});
    
    var a =  mc_coordinates.replace(/\(/g,"");//remove (
    var b = a.split(')');//remove )
    
    for(var x=0;x<b.length;x++)
    {
        if(b[x].replace(/^\s+|\s+$/g,'')!="")
        {
            var c = b[x].split(',');
            land_poly.getPath().push(new google.maps.LatLng( parseFloat(c[0]),parseFloat(c[1]) ) );
        }
    }
    
    return land_poly;
}

//php.js
function nl2br (str, is_xhtml) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Philip Peterson
  // +   improved by: Onno Marsman
  // +   improved by: Atli Þór
  // +   bugfixed by: Onno Marsman
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   improved by: Maximusya
  // *     example 1: nl2br('Kevin\nvan\nZonneveld');
  // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
  // *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
  // *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
  // *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
  // *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
  var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br ' + '/>' : '<br>'; // Adjust comment to avoid issue on phpjs.org display

  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

/*click maplegend*/

//land and rock
function mapLegendClick(sel_id, ml_name, ml_desc, ra_name, rg_name, layer1, layer2, layer3, layer4, img1, img2, img3)
{
    //layer processing
    var lyr1 = "";
    var lyr2 = "";
    var lyr3 = "";
    var lyr4 = "<a style='margin-bottom:10px; border:none; background-color:none;'></a>";
    
    if(layer1!="None")
    {
        lyr1+='<a>';
        var a = layer1.toString().split('%');
        for(var x=0;x<a.length;x++)
        {
            if(a[x].replace(/^\s+|\s+$/g,'')!="")
            {
                lyr1+=a[x]+" ";
            }
        }
        lyr1+='</a>';
    }
    if(layer2!="None")
    {
        lyr2+='<a>';
        var a = layer2.toString().split('%');
        for(var x=0;x<a.length;x++)
        {
            if(a[x].replace(/^\s+|\s+$/g,'')!="")
            {
                lyr2+=a[x]+" ";
            }
        }
        lyr2+='</a>';
    }
    if(layer3!="None")
    {
        lyr3+='<a>';
        var a = layer3.toString().split('%');
        for(var x=0;x<a.length;x++)
        {
            if(a[x].replace(/^\s+|\s+$/g,'')!="")
            {
                lyr3+=a[x]+" ";
            }
        }
        lyr3+='</a>';
    }
    if(layer4!="None")
    {
        lyr4='<a style="margin-bottom:10px;">';
        var a = layer4.toString().split('%');
        for(var x=0;x<a.length;x++)
        {
            if(a[x].replace(/^\s+|\s+$/g,'')!="")
            {
                lyr4+=a[x]+" ";
            }
        }
        lyr4+='</a>';
    }
    //end of layer processing
    
    //Header section
    $('#pop-upLegend_header label').html(ml_name+" Information");//header label
    
    var d_loc="";//folder for image
    
    //Description section
    if(sel_id==1)//rock type
    {                                  //Age                    //Group                            //desc
        $('#pop-upLegend_desc').html('<b>Age:</b> '+ra_name+'<br><b>Group:</b> '+rg_name+'<br><br><b>Description:</b><br>'+nl2br(ml_desc));
        d_loc = "rockmap";
    }
    else//land type
    {
        $('#pop-upLegend_desc').html('<b>Sub-layers:</b>'+lyr1+lyr2+lyr3+lyr4+'<br><b>Description:</b> <br>'+nl2br(ml_desc));
        d_loc = "soilmap";
    }

    
    //images [1]
    //first load
    slide(img1,d_loc);
    $('#pop-upLegend_img1').attr('title','Click Me!');
    
    //during clicks
    var ctr = 1;
    $('#pop-upLegend_img1').click(function(){
        ctr++;
        if(ctr==1)//image1
        {
            slide(img1,d_loc);
            $(this).attr('title','image:'+ctr);
        }
        if(ctr==2)//image2
        {
            slide(img2,d_loc);
            $(this).attr('title','image:'+ctr);
        }
        if(ctr==3)//image3
        {
            slide(img3,d_loc);
            $(this).attr('title','image:'+ctr);
            ctr=0;
        }
    });
        
    //show pop up legend
    $('#pop-upLegend').show();
}

//hazard
function hazLegendClick(hl_name, hl_desc, img1, img2, img3)
{
    //Header section
    $('#pop-upLegend_header label').html(hl_name+" Information");//header label
    
    //images [2]
    //first load
    slide(img1,"geohazard");
    $('#pop-upLegend_img1').attr('title','Click Me!');
    
    //during clicks
    var ctr = 1;
    $('#pop-upLegend_img1').click(function(){
        ctr++;
        if(ctr==1)//image1
        {
            slide(img1,"geohazard");
            $(this).attr('title','image:'+ctr);
        }
        if(ctr==2)//image2
        {
            slide(img2,"geohazard");
            $(this).attr('title','image:'+ctr);
        }
        if(ctr==3)//image3
        {
            slide(img3,"geohazard");
            $(this).attr('title','image:'+ctr);
            ctr=0;
        }
    });
    
    //description section
    $('#pop-upLegend_desc').html('<b>Description:</b><br>'+nl2br(hl_desc));
    
     //show pop up legend
    $('#pop-upLegend').show();
}

function slide(disp_image,disp_loc)
{
    //reset bg-image to none
    $('#pop-upLegend_img1').css('background-image','none');
    
    //base url
    var srvr = 'http://'+window.location.hostname+'/dclle';
    
    if(disp_image!='None')//if image exists
    {
      $('#pop-upLegend_img1').fadeOut('fast','swing',function(){
            $(this).css({'background-image':'url("'+srvr+'/uploads/'+disp_loc+'/'+disp_image+'")','border':'1px solid #ffffff'});
            $(this).fadeIn('fast','swing');
      });
    }
    else if(disp_image=='None')//does not exist
    {
      $('#pop-upLegend_img1').fadeOut('fast','swing',function(){
            $(this).css({'background-image':'url("'+srvr+'/uploads/default_ev.jpg")','border':'1px solid #c0c0c0'});
            $(this).fadeIn('fast','swing');
      });
    }
}