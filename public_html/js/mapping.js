google.maps.visualRefresh = true;

//global variables
var davao_city = new google.maps.LatLng(7.190708000000000000, 125.455340999999980000);//default center
var map;
var haz_drawingManager;
var haz_polygonArray = new Array();
var haz_ischange = 0;

$(document).ready(function(){
   // initialize();
    detectBrowser();
    
    //hiding
    $('#haz_loader').hide();
    $('#haz_success').hide();
    $('#haz_error').hide();
    
    $(window).resize(function(){
        detectBrowser();
    });
    
    //save
    $('#haz_save').click(function(){
        if(haz_ischange==1)
        {
            haz_save(haz_selectedh_id);//dummy
        }
    });
    
    //clear
    $('#haz_clear').click(function(){
        
        var chk_it=0;
        for(var x=0;x<haz_polygonArray.length;x++)
        {
            if(haz_polygonArray[x]['shape'].getMap()!=null)
            {
                chk_it=1;
            }
        }
        
        if(haz_polygonArray.length>0 && chk_it!=0)
        {
            var ans = confirm('Are you sure you want to clear the map?');      
            if(ans==true)
            {
                haz_ischange=1;
                haz_unsetEditablePolygon();
                for(var x=0;x<haz_polygonArray.length;x++)
                    haz_polygonArray[x]['shape'].setMap(null);
            }
        }
        
    });
    
    //transfer
    $('#nav_rightPane a, #map_options a').click(function(event){//evaluator link click
        if($(this).attr('href'))
        {
            event.preventDefault();
            
            var chk_it=0;
            for(var x=0;x<haz_polygonArray.length;x++)
            {
                if(haz_polygonArray[x]['shape'].getMap()!=null || haz_polygonArray[x]['hc_id'])
                {
                    chk_it=1;
                }
            }
            
            if(haz_ischange==1 && chk_it==1)
            {
                var con_mes = confirm("Are you sure you don't want to save changes?");
                if(con_mes == true)
                {   window.location = $(this).attr('href'); }
            }
            else
            {
                window.location = $(this).attr('href');
            }
        }
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
    
    //center control
    //var homeControlDiv = document.createElement('div');
    //var homeControl = new HomeControl(homeControlDiv);
    //map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
    
    haz_getFromDb(haz_selectedh_id);
    haz_styleButton(1);
    haz_draw();
    
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
}

//detect browser
function detectBrowser()
{   
    //check if mobile
    if($('#haz_inputField_RM').css('position')=='absolute')
    {
        var hedfld = parseFloat($('#header').css('height'))+ parseFloat($('#haz_inputField').css('height'));//header and field height
        document.getElementById('map-canvas').style.height=(window.innerHeight - hedfld - 5)+"px";
        $('#haz_inputField_RM').css('height',window.innerHeight - hedfld - 5);
    }
    else//if not mobile
    {
        $('#haz_inputField_RM').css({'height':'auto','min-height':window.innerHeight - hedfld - 5});
        var hedfld = parseFloat($('#header').css('height'))+ parseFloat($('#haz_inputField').css('height'));//header and field height
        document.getElementById('map-canvas').style.height=(window.innerHeight - hedfld - 5)+"px";
    }
    
    document.getElementById('haz_loader').style.height=(window.innerHeight-3)+"px";
    document.getElementById('haz_success').style.height=(window.innerHeight-3)+"px";
    document.getElementById('haz_error').style.height=(window.innerHeight-3)+"px";
}

//style buttons
function haz_styleButton(haz_button)
{
   if(haz_button==1)//stop
   {
     $('#haz_stop').removeClass();
     $('#haz_polygon').removeClass();
     $('#haz_polyline').removeClass();
     
     $('#haz_stop').addClass('haz_stopClicked');
     $('#haz_polygon').addClass('haz_polygonNotClicked');
     $('#haz_polyline').addClass('haz_polylineNotClicked');
   }
   
   if(haz_button==2)//polygon
   {
     $('#haz_stop').removeClass();
     $('#haz_polygon').removeClass();
     $('#haz_polyline').removeClass();
     
     $('#haz_stop').addClass('haz_stopNotClicked');
     $('#haz_polygon').addClass('haz_polygonClicked');
     $('#haz_polyline').addClass('haz_polylineNotClicked');
   }
   
   if(haz_button==3)//polyline
   {
     $('#haz_stop').removeClass();
     $('#haz_polygon').removeClass();
     $('#haz_polyline').removeClass();
     
     $('#haz_stop').addClass('haz_stopNotClicked');
     $('#haz_polygon').addClass('haz_polygonNotClicked');
     $('#haz_polyline').addClass('haz_polylineClicked');
   }
}

//drawing
function haz_draw()
{
    var haz_drawingManagerOptions = {map:map,
                                    drawingControl: false,
                                    polygonOptions:{
                                        strokeOpacity: 0.75,
                                        strokeWeight: 0.75,
                                        strokeColor:"#000000",
                                        fillOpacity: 0.85
                                        },
                                    polylineOptions:{
                                        strokeOpacity: 0.75,
                                        strokeWeight: 2,
                                        strokeColor: "#000000"
                                        }
                                    };
    
    haz_drawingManager = new google.maps.drawing.DrawingManager(haz_drawingManagerOptions);
    
    //clicked
    $('#haz_stop').click(function(){
        haz_styleButton(1);
        haz_drawingManager.setDrawingMode(null);
    });
    
    $('#haz_polygon').click(function(){
        haz_styleButton(2);
        haz_drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
    });
    
    $('#haz_polyline').click(function(){
        haz_styleButton(3);
        haz_drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
    });
    
    //polygons
    google.maps.event.addListener(haz_drawingManager,'polygoncomplete',function(polygon){
         haz_styleButton(1);
         haz_drawingManager.setDrawingMode(null);
         if(polygon.getPath().getLength()>=3)
         {
            haz_ischange=1;
            polygon.setEditable(true);
            polygon.setOptions({fillColor:haz_default_hl_color});
            haz_polygonArray.push({'shape':polygon,'hl_id':haz_default_hl_id,'hc_shape':1});
            $("#color-"+haz_default_hl_id).css("outline","2px solid #1e465b");
            haz_passToField(haz_polygonArray[haz_polygonArray.length-1]['shape']);
            haz_edit(haz_polygonArray[haz_polygonArray.length-1]['shape'], haz_polygonArray.length-1, haz_polygonArray[haz_polygonArray.length-1]['hc_shape']);
         
         }
         else
         { polygon.setMap(null); }
    });
    
    //polyline earthquake
    google.maps.event.addListener(haz_drawingManager,'polylinecomplete',function(polyline){
         haz_styleButton(1);
         haz_drawingManager.setDrawingMode(null);
         if(polyline.getPath().getLength()>=2)
         {
            haz_ischange=1;
            polyline.setEditable(true);
            polyline.setOptions({strokeColor:haz_default_hl_color});
            haz_polygonArray.push({'shape':polyline,'hl_id':haz_default_hl_id,'hc_shape':2});
            $("#color-"+haz_default_hl_id).css("outline","2px solid #1e465b");
            haz_passToField(haz_polygonArray[haz_polygonArray.length-1]['shape']);
            haz_edit(haz_polygonArray[haz_polygonArray.length-1]['shape'], haz_polygonArray.length-1, haz_polygonArray[haz_polygonArray.length-1]['hc_shape']);
            
         }
         else
         { polyline.setMap(null); }
    });

    google.maps.event.addListener(haz_drawingManager,'drawingmode_changed',function(){
        haz_unsetEditablePolygon();
        if(haz_drawingManager.getDrawingMode()!=null)
        {
            //force scroll
            var pos = $("#color-"+haz_default_hl_id).position().top+$('#haz_inputField_RM ul').scrollTop();
            $('#haz_inputField_RM ul').animate({scrollTop:pos},'fast','swing');
            
            $('#color-'+haz_default_hl_id).css('outline','2px solid #1e465b');
        }
    });
    
    google.maps.event.addListener(map,'click',haz_unsetEditablePolygon);
}

//edit
function haz_edit(polygon,shape_no, hc_shape)
{
    //mousemove vertex
    google.maps.event.addListener(polygon,'mousemove',function(event){
           var lat = document.getElementById('lat');
           var lng = document.getElementById('lng');
           var coor = event.latLng.toString();
           coor = coor.replace('(','');
           coor = coor.replace(')','');
           coor = coor.replace(' ','');
           var coor_split = coor.split(',');
                
           lat.value = coor_split[0];
           lng.value = coor_split[1];
           
           
           if(event.vertex!=undefined)
           {
              $('#haz_shapeList').stop();
              $('#haz_shapeList span').css('outline','none');

              //force scroll
              var pos = ($('#SHspan_'+event.vertex).position().top + ($('#haz_shapeList').scrollTop()-10)) - $('#haz_shapeList').position().top;
              $('#SHspan_'+event.vertex).css('outline','3px solid #1e456b');
              $('#haz_shapeList').animate({scrollTop:pos},'fast','swing');
           }
           if(event.vertex==undefined)
           {
              $('#haz_shapeList').stop();
              $('#haz_shapeList span').css('outline','none');
           }
    });
    
    //mouseout from polygon
    google.maps.event.addListener(polygon,'mouseout',function(){
            $('#haz_shapeList').stop();
            $('#haz_shapeList span').css('outline','none');
    });
    
    //click
    google.maps.event.addListener(polygon,'click',function(event){
          haz_unsetEditablePolygon();
          polygon.setEditable(true);
          $("#color-"+haz_polygonArray[shape_no]['hl_id']).css("outline","2px solid #1e465b");
          
          //force scroll
            var pos = $("#color-"+haz_polygonArray[shape_no]['hl_id']).position().top+$('#haz_inputField_RM ul').scrollTop();
            $('#haz_inputField_RM ul').animate({scrollTop:pos},'fast','swing');
          
          //deleting polygon points
          if(hc_shape==1)
          {
            if(event.vertex!=undefined && polygon.getPath().getLength()>3)
            {
                polygon.getPath().removeAt(event.vertex);
                event.vertex=undefined;
            }
            else
            { haz_passToField(polygon); }
          }
          
          //deleting polyline points
          if(hc_shape==2)
          {
            if(event.vertex!=undefined && polygon.getPath().getLength()>2)
            {
                polygon.getPath().removeAt(event.vertex);
                event.vertex=undefined;
            }
            else
            { haz_passToField(polygon); }
          }
    });
    
    //drag1
    google.maps.event.addListener(polygon.getPath(),'set_at',function(){
        haz_passToField(polygon);
        haz_ischange=1;
    });
    
    //drag2
    google.maps.event.addListener(polygon.getPath(),'insert_at',function(){
        haz_passToField(polygon);
        haz_ischange=1;
    });
    
    //drag3
    google.maps.event.addListener(polygon.getPath(),'remove_at',function(){
        haz_passToField(polygon);
        haz_ischange=1;
    });
    
    //dbclick
    google.maps.event.addListener(polygon,'dblclick',function(){
        polygon.setMap(null);
        haz_unsetEditablePolygon();
        haz_ischange=1;
    });
}

//unset editable
function haz_unsetEditablePolygon()
{
    for(var x=0;x<haz_polygonArray.length;x++)
    {
        if(haz_polygonArray[x]['shape'].getEditable()==true)
            haz_polygonArray[x]['shape'].setEditable(false);
    }
    document.getElementById('haz_count').value="";
    $('#haz_shapeList').empty(); //document.getElementById('haz_shapeList').innerHTML=null;
    $('#haz_inputField_RM ul li').css('outline','none');
}

//pass to field
function haz_passToField(haz_poly)
{
    var haz_count = document.getElementById('haz_count');
    var haz_shapeList = document.getElementById('haz_shapeList');
    var haz_path = haz_poly.getPath();
    
    $('#haz_shapeList').empty(); //haz_shapeList.innerHTML=null;//reset
    haz_count.value = haz_path.getLength();//count or total
    for(var x=0;x<haz_path.getLength();x++)//coordinates list
    {
        var a = haz_path.getAt(x).toString().replace('(','');
        var b = a.replace(')','');
        haz_shapeList.innerHTML+='<span title="Point: '+(x+1)+'" id="SHspan_'+x+'"><label>'+b+'</label><button title="Remove Point" onclick="haz_deleteFromField(\''+x+'\');">X</button></span>';
    }
}

//delete from field
function haz_deleteFromField(haz_vertex)
{
    for(var x=0;x<haz_polygonArray.length;x++)
    {
        if(haz_polygonArray[x]['shape'].getEditable()==true && haz_polygonArray[x]['shape'].getMap()!=null)
        {
            var pth = haz_polygonArray[x]['shape'].getPath();
            
            if(haz_polygonArray[x]['hc_shape']==1) //polygon
            {
                if(pth.getLength()>3)
                {
                    pth.removeAt(haz_vertex);
                    haz_passToField(haz_polygonArray[x]['shape']);
                }
            }
            
            if(haz_polygonArray[x]['hc_shape']==2) //polyline
            {
                if(pth.getLength()>2)
                {
                    pth.removeAt(haz_vertex);
                    haz_passToField(haz_polygonArray[x]['shape']);
                }
            }
        }
    }
}

//color polygon
function haz_colorPoly(hl_id,hl_color)
{
    var ctr = 0;
    
    //if there's one editable
    for(var x=0;x<haz_polygonArray.length;x++)
    {
        if(haz_polygonArray[x]['shape'].getEditable()==true && haz_polygonArray[x]['shape'].getMap()!=null)
        {
           ctr++;
           haz_ischange=1;
           
           //set default color and id
           haz_default_hl_color = hl_color;
           haz_default_hl_id = hl_id;
           
           if(haz_polygonArray[x]['hc_shape']==2)//earthquake
           { haz_polygonArray[x]['shape'].setOptions({strokeColor:hl_color}); }
           else//other hazards
           { haz_polygonArray[x]['shape'].setOptions({fillColor:hl_color}); }
            
            haz_polygonArray[x]['hl_id'] = hl_id;
            
            $('#haz_inputField_RM ul li').css('outline','none');
            $('#color-'+hl_id).css('outline','2px solid #1e465b');
        }
    }
    
    //no editable
    if(ctr==0 && haz_drawingManager.getDrawingMode()!=null)
    {
        //set default color and id
        haz_default_hl_color = hl_color;
        haz_default_hl_id = hl_id;
        
        $('#haz_inputField_RM ul li').css('outline','none');
        $('#color-'+haz_default_hl_id).css('outline','2px solid #1e465b');
    }
}

//save polygons
function haz_save(h_id)
{
    if(haz_polygonArray.length>0)//mother if count
    {
        var inhc_coordinates= new Array();
        var inhl_id = new Array();
        var inhc_shape = new Array();
        
        var uphc_coordinates = new Array();
        var uphl_id = new Array();
        var uphc_id = new Array();
        
        var delhc_id = new Array();
        
        //process loop
        for(var x=0;x<haz_polygonArray.length;x++)
        {
            //inserting
            if(haz_polygonArray[x]['shape'].getMap()!=null && !haz_polygonArray[x]['hc_id'])
            {
                var coorBinder="";
                for(var y=0;y<haz_polygonArray[x]['shape'].getPath().getLength();y++)
                {
                    coorBinder+=haz_polygonArray[x]['shape'].getPath().getAt(y).toString();
                }
                inhc_coordinates.push(coorBinder);
                inhl_id.push(haz_polygonArray[x]['hl_id']);
                inhc_shape.push(haz_polygonArray[x]['hc_shape']);
            }
            
            //updating
            if(haz_polygonArray[x]['shape'].getMap()!=null && haz_polygonArray[x]['hc_id'])
            {
                var coorBinder="";
                for(var y=0;y<haz_polygonArray[x]['shape'].getPath().getLength();y++)
                {
                    coorBinder+=haz_polygonArray[x]['shape'].getPath().getAt(y).toString();
                }
                uphc_coordinates.push(coorBinder);
                uphl_id.push(haz_polygonArray[x]['hl_id']);
                uphc_id.push(haz_polygonArray[x]['hc_id']);
            }
            
            //deleting
            if(haz_polygonArray[x]['shape'].getMap()==null && haz_polygonArray[x]['hc_id'])
            {
                delhc_id.push(haz_polygonArray[x]['hc_id']);
            }
        }//end of process loop
        
        //passing
        if(inhc_coordinates.length>0 || uphc_coordinates.length>0 || delhc_id.length>0)//count
        {   
            $.ajax({
                type: "POST",
                url: base_url+"index.php/haz_controller/haz_save/"+h_id,
                cache:false,
                data:{
                    inhc_coordinates: inhc_coordinates,
                    inhl_id: inhl_id,
                    inhc_shape: inhc_shape,
                    
                    uphc_coordinates: uphc_coordinates,
                    uphl_id: uphl_id,
                    uphc_id: uphc_id,
                    
                    delhc_id:delhc_id
                },
                beforeSend: function(){
                    $('#haz_loader').fadeIn('fast','swing');
                },
                complete: function(){
                    $('#haz_loader').fadeOut('fast','swing');
                },
                success: function(){
                    $('#haz_loader').fadeOut('fast','swing',function(){
                        $('#haz_success').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
                    });
                    
                    haz_reset();
                    haz_getFromDb(h_id);
                    haz_ischange=0;
                },
                error: function(){
                    $('#haz_loader').fadeOut('fast','swing',function(){
                        $('#haz_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
                    });
                }
            });
        }
    }//end if mother if
}

//retrieve polygons
function haz_getFromDb(h_id)
{
    $.ajax({
        type: "GET",
        url: base_url+"index.php/haz_controller/haz_getFromDb/"+h_id,
        dataType: "json",
        cache:false,
        success: function(result){
            for(var x=0;x<result.length;x++)
            {
                var haz_poly = haz_processCoor(result[x]['hc_coordinates'], result[x]['hl_color'], result[x]['hc_shape']);
                haz_polygonArray.push({'shape':haz_poly, 'hl_id':result[x]['hl_id'], 'hc_id':result[x]['hc_id'], 'hc_shape':result[x]['hc_shape']});
                haz_edit(haz_polygonArray[x]['shape'],x,haz_polygonArray[x]['hc_shape']);//under observation
            }
        },
        error: function(){
            $('#haz_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
        }
    });
}

//process
function haz_processCoor(hc_coordinates,hl_color, hc_shape)
{
    if(hc_shape==2)//earthquake
    {
        var haz_poly = new google.maps.Polyline({map:map,
                                                strokeOpacity: 0.75,
                                                strokeWeight: 2,
                                                strokeColor:hl_color});
    }
    else//other hazards
    {
        var haz_poly = new google.maps.Polygon({map:map,
                                                strokeOpacity: 0.75,
                                                strokeWeight: 0.75,
                                                strokeColor:"#000000",
                                                fillOpacity: 0.85,
                                                fillColor: hl_color});
    }
    
    var a =  hc_coordinates.replace(/\(/g,"");  
    var b = a.split(')');
    
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

//reset
function haz_reset()
{
    haz_unsetEditablePolygon();
    for(var x=0;x<haz_polygonArray.length;x++)
    { haz_polygonArray[x]['shape'].setMap(null); }
    haz_polygonArray=[];
}

function HomeControl(controlDiv){
                    controlDiv.style.padding = '5px';
                    controlDiv.setAttribute('id','m_center');
                    
                    var controlUI = document.createElement('div');
		    controlUI.style.marginTop = 0;
		    controlUI.style.padding = '1.5px';
		    controlUI.style.border = '1px solid rgba(0, 0, 0, 0.33392)';
		    controlUI.style.borderRadius = '2px';
		    controlUI.style.backgroundColor = '#ffffff';
		    controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
                    controlUI.style.cursor = 'pointer';
                    controlUI.style.textAlign = 'center';
                    controlUI.title = 'Set map to center';
                    
                    controlDiv.appendChild(controlUI);
                    
                    var controlText = document.createElement('div');
		    controlText.style.color = '#272727';
		    controlText.style.fontWeight = 'bold';
                    controlText.style.fontFamily = 'calibri';
                    controlText.style.fontSize = '12px';
                    controlText.style.paddingLeft = '4px';
                    controlText.style.paddingRight = '5px';
                    controlText.innerHTML = 'Center';
                    controlUI.appendChild(controlText);
                    
                    google.maps.event.addDomListener(controlUI, 'click', function(){
                       map.panTo(davao_city);
                       map.setZoom(11);
                    });
}