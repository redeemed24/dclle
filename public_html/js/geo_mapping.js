var map;
var davao_city = new google.maps.LatLng(7.190708000000000000, 125.455340999999980000);
var geo_coors = new Array();
var geo_coors2=new Array(); //for saving
var geo_check = 0;
var geo_c = 0; //if clear is clicked
var drawingManager = initializeDrawingManager();
google.maps.visualRefresh = true;

function initialize()
{
    var mapOptions=
    {
        center:new google.maps.LatLng(7.190708000000000000, 125.455340999999980000),
        disableDoubleClickZoom:true,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 11,
        minZoom: 11,
        disableDefaultUI: true,
        mapMaker: true,
        mapTypeControl: false,
        mapTypeControlOptions:{
        style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        mapTypeIds: [google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.ROADMAP]},
        panControl:true,
        scaleControl:true,
        zoomControl: true,
        backgroundColor:'#ffffff'
    }
    map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);
    
    //center control
    //var homeControlDiv = document.createElement('div');
    //var homeControl = new HomeControl(homeControlDiv);
    //map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
    
    initializeDrawingManager();
    
    //mousemove
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
    
    google.maps.event.addListener(map,'click',function()
    {
        $("#geo_hand").click();
    });
}

/*****************functions*************************/
function detectBrowser()
{
    //check if mobile
    if($('#geo_inputField_RM').css('position')=='absolute')
    {
        var hedfld = parseFloat($('#header').css('height'))+ parseFloat($('#geo_inputField').css('height'));//header and field height
        document.getElementById('map-canvas').style.height=(window.innerHeight - hedfld - 5)+"px";
        $('#geo_inputField_RM').css('height',window.innerHeight - hedfld - 5);
        $('#geo_inputField_RM_struct').css('height',window.innerHeight - hedfld - 5);
    }
    else//not mobile
    {
        $('#geo_inputField_RM').css({'height':'auto','min-height':'100px'});
        $('#geo_inputField_RM_struct').css({'height':'auto','min-height':'100px'});
        var hedfld = parseFloat($('#header').css('height'))+ parseFloat($('#geo_inputField').css('height'));//header and field height
        document.getElementById('map-canvas').style.height=(window.innerHeight - hedfld - 5)+"px";
    }
    
    document.getElementById('geo_loader').style.height=(window.innerHeight-3)+"px";
    document.getElementById('geo_success').style.height=(window.innerHeight-3)+"px";
    document.getElementById('geo_error').style.height=(window.innerHeight-3)+"px";
}

function initializeDrawingManager()
{
    var drawingManagerOptions = new google.maps.drawing.DrawingManager(
    {
        drawingMode:null,
        drawingControl:false,
        drawingControlOptions:
        {
            position:google.maps.ControlPosition.TOP_CENTER,
            drawingModes:[
                google.maps.drawing.OverlayType.POLYGON
            ]
        },
        polygonOptions:
        {
            strokeOpacity:0.75,
            strokeWeight:0.75,
            strokeColor:"#000000",
            fillOpacity:0.75
        },
        polylineOptions:
        {
            strokeOpacity:0.75,
            strokeWeight:3,
            strokeColor: "#000000"
        }
    });
    
    drawingManager=new google.maps.drawing.DrawingManager(drawingManagerOptions);
    
    google.maps.event.addListener(drawingManager,'drawingmode_changed',function()
    {
        //removeSelected();
        if(drawingManager.getDrawingMode()=="polygon"){ $("#"+geo_legend_id).css('outline','2px solid #1e465b'); }
        else if(drawingManager.getDrawingMode()=="polyline"){$("#"+geo_struct_id).css('outline','2px solid #1e465b');}
    });
    
    google.maps.event.addListener(drawingManager,'polygoncomplete',function(polygon)
    {
        geo_styleButton(1);
        drawingManager.setDrawingMode(null);
        if(polygon.getPath().getLength()>=3)
        {
            geo_check=1;
            getGeoCoordinates(polygon,"polygon");
            polygon.setEditable(true);
            polygon.setOptions({fillColor:geo_leg_color});
            geo_coors.push({"mc":"0","polygon":polygon,"legend":geo_legend_id, "stat":"2","overlaytype":"polygon"});
            geo_coors2.push({"mc":"0","polygon":polygon.getPath().getArray().toString(),"legend":geo_legend_id, "stat":"2","overlaytype":"polygon"});
            geoPolygonClick(polygon,geo_legend_id,"polygon");
            
            //mousemove
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
            });
        }
        else
        {
            polygon.setMap(null);
            $("#geo_hand").click();
        }
        geo_vertexHover(polygon);
    });
    
    google.maps.event.addListener(drawingManager,'polylinecomplete',function(polygon)
    {
        geo_styleButton(1);
        drawingManager.setDrawingMode(null);
        if(polygon.getPath().getLength()>=2)
        {
            geo_check=1;
            getGeoCoordinates(polygon,"polygon");
            polygon.setEditable(true);
            polygon.setOptions({strokeColor:geo_struct_color});
            geo_coors.push({"mc":"0","polygon":polygon,"legend":geo_struct_id, "stat":"2","overlaytype":"polyline"});
            geo_coors2.push({"mc":"0","polygon":polygon.getPath().getArray().toString(),"legend":geo_struct_id, "stat":"2","overlaytype":"polyline"});
            geoPolygonClick(polygon,geo_struct_id,"polyline");
            
            //mousemove
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
            });
        }
        else
        {
            polygon.setMap(null);
            $("#geo_hand").click();
        }
        geo_vertexHover(polygon);
    });
    
    $("#geo_hand").click(function()
    {
        geo_styleButton(1);
        drawingManager.setDrawingMode(null);
        removeSelected();
    });
    
    $("#geo_polygon").click(function()
    {
        geo_styleButton(2);
        removeSelected();
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
        drawingManager.setMap(map);
        geo_moveScrollBar("polygon",geo_legend_id);
    });
    
    $("#geo_polyline").click(function()
    {
        geo_styleButton(3);
        removeSelected();
        drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYLINE);
        drawingManager.setMap(map);
        geo_moveScrollBar("polyline",geo_struct_id);
    });
}

function geoRetrieve()
{
    $.ajax(
    {
        type:"GET",
        url:base_url+"index.php/geo_controller/geo_getPolygons",
        cache:false,
        success:function(result)
        {
            getDbGeoCoor(JSON.parse(result));
        },
        error: function(){
            $('#geo_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
        }
    });
}

function getDbGeoCoor(geo_coors3)//load to map
{
    for(var x=0;x<geo_coors3.length;x++)
    {
        if(geo_coors3[x]["mc_type"]==1)
        {
            var tmp1_coor = geo_coors3[x]["mc_coordinates"].split("),");
            
            var geo_dbPaths = new google.maps.MVCArray();
            for(var y=0;y<tmp1_coor.length;y++)
            {
                var tmp2_coor = tmp1_coor[y].split(",");
                geo_dbPaths.push(new google.maps.LatLng(parseFloat(tmp2_coor[0].replace("(","")),parseFloat(tmp2_coor[1].replace(")",""))));
            }
            var geo_dbMap = new google.maps.Polygon(
            {
                paths:geo_dbPaths,
                strokeColor: "#000000",
                strokeOpacity: 0.75,
                strokeWeight: 0.75,
                fillColor: geo_coors3[x]["ml_color"],
                fillOpacity: 0.85
            });
            geo_coors.push({"mc":geo_coors3[x]["mc_id"],"polygon":geo_dbMap,"legend":geo_coors3[x]["ml_id"],"stat":"0","overlaytype":"polygon"});
            geo_coors2.push({"mc":geo_coors3[x]["mc_id"],"polygon":geo_dbMap.getPath().getArray().toString(),"legend":geo_coors3[x]["ml_id"],"stat":"0","overlaytype":"polygon"});
            geo_dbMap.setMap(map);
            
            //mousemove
            google.maps.event.addListener(geo_dbMap,'mousemove',function(event){
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
            
            geoPolygonClick(geo_dbMap,geo_coors3[x]["ml_id"],"polygon");
        }
        else if(geo_coors3[x]["mc_type"]==2)
        {
            var tmp1_coor = geo_coors3[x]["mc_coordinates"].split("),");
            
            var geo_dbPaths = new google.maps.MVCArray();
            
            for(var y=0;y<tmp1_coor.length;y++)
            {
                var tmp2_coor = tmp1_coor[y].split(",");
                geo_dbPaths.push(new google.maps.LatLng(parseFloat(tmp2_coor[0].replace("(","")),parseFloat(tmp2_coor[1].replace(")",""))));
            }
            
            var geo_dbMap = new google.maps.Polyline(
            {
                path:geo_dbPaths,
                strokeOpacity: 0.75,
                strokeWeight: 3,
                strokeColor:geo_coors3[x]["ml_color"],
                fillOpacity: 0.75
            });
            geo_coors.push({"mc":geo_coors3[x]["mc_id"],"polygon":geo_dbMap,"legend":geo_coors3[x]["ml_id"],"stat":"0","overlaytype":"polyline"});
            geo_coors2.push({"mc":geo_coors3[x]["mc_id"],"polygon":geo_dbMap.getPath().getArray().toString(),"legend":geo_coors3[x]["ml_id"],"stat":"0","overlaytype":"polyline"});
            geo_dbMap.setMap(map);
            
            //mousemove
            google.maps.event.addListener(geo_dbMap,'mousemove',function(event){
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
            
            geoPolygonClick(geo_dbMap,geo_coors3[x]["ml_id"],"polyline");
        }
    }
}

function geo_getLegendId(geo_legend,geo_col)
{
    var chk=0;
    for(var x=0;x<geo_coors.length;x++)
    {
        if(geo_coors[x]['polygon'].getEditable()==true && geo_coors[x]['polygon'].getMap()!=null)
        {
            chk++;
            geo_legend_id=geo_legend;
            geo_leg_color=geo_col;
            if(geo_coors[x]["polygon"].getEditable()==true)
            {
                geo_coors[x]["legend"]=geo_legend_id;
                geo_coors2[x]["legend"]=geo_legend_id;
                if(geo_coors[x]["stat"]=="2")
                {
                    geo_coors[x]["stat"]="2";
                    geo_coors2[x]["stat"]="2";
                }
                else if(geo_coors[x]["stat"]=="0" || geo_coors[x]["stat"]=="1")
                {
                    geo_coors[x]["stat"]="1";
                    geo_coors2[x]["stat"]="1";
                }
                geo_coors[x]["polygon"].setOptions({fillColor:geo_leg_color});
                $('#geo_inputField_RM ul li').css('outline','none');
                $("#"+geo_legend_id).css('outline','2px solid #1e465b');   
                geo_check=1;
                geoPolygonClick(geo_coors[x]["polygon"],geo_legend_id,"polygon");
            }
        }
    }
    if(chk==0 && drawingManager.getDrawingMode()!=null)
    {
        geo_legend_id = geo_legend;
        geo_leg_color=geo_col;
        $('#geo_inputField_RM ul li').css('outline','none');
        $('#'+geo_legend_id).css('outline','2px solid #1e465b');
    }
}

function geo_getStructId(geo_struct,geo_col)
{
    var chk=0; 
    for(var x=0;x<geo_coors.length;x++)
    {
        if(geo_coors[x]['polygon'].getEditable()==true && geo_coors[x]['polygon'].getMap()!=null)
        {
            chk++;
            geo_struct_id=geo_struct;
            geo_struct_color=geo_col;
            if(geo_coors[x]["polygon"].getEditable()==true)
            {
                geo_coors[x]["legend"]=geo_struct_id;
                geo_coors2[x]["legend"]=geo_struct_id;
                if(geo_coors[x]["stat"]=="2")
                {
                    geo_coors[x]["stat"]="2";
                    geo_coors2[x]["stat"]="2";
                }
                else if(geo_coors[x]["stat"]=="0" || geo_coors[x]["stat"]=="1")
                {
                    geo_coors[x]["stat"]="1";
                    geo_coors2[x]["stat"]="1";
                }
                geo_coors[x]["polygon"].setOptions({strokeColor:geo_struct_color});
                $('#geo_inputField_RM_struct ul li').css('outline','none');
                $("#"+geo_struct_id).css('outline','2px solid #1e465b');
                geo_check=1;
                geoPolygonClick(geo_coors[x]["polygon"],geo_struct_id,"polyline");
            }
        }
    }
    
    if(chk==0 && drawingManager.getDrawingMode()!=null)
    {
        geo_struct_id = geo_struct;
        geo_struct_color=geo_col;
        $('#geo_inputField_RM_struct ul li').css('outline','none');
        $('#'+geo_struct_id).css('outline','2px solid #1e465b');
    }
}

function getGeoCoordinates(polygon,p_type)
{
    document.getElementById("geo_input_field_polygons").innerHTML="";
    document.getElementById("geo_coor_count").value=polygon.getPath().length.toString();
    for(var x=0;x<polygon.getPath().getArray().length;x++)
    {
        var geo_1=polygon.getPath().getAt(x);
        var geo_2=(geo_1.toString()).replace("(","");
        var geo_3=geo_2.replace(")","");
        document.getElementById("geo_input_field_polygons").innerHTML+='<span title="Point: '+(x+1)+'" id="span_'+x+'"><label>'+geo_3+'</label><button title="Remove Point" onclick="geoRemoveVertex(\''+x+'\',\''+p_type+'\');">X</button></span>';
    }
}

function geoPolygonClick(polygon,leg_id,p_type)//events:click,insert_at,set_at,remove_at,dbclick
{
    google.maps.event.addListener(polygon,'click',function(event)
    {
        removeSelected();
        if((event.vertex!=null && polygon.getPath().getLength()>2 && p_type=="polyline") || event.vertex!=null && polygon.getPath().getLength()>3 && p_type=="polygon")
        polygon.getPath().removeAt(event.vertex);
     
        for(var x=0;x<geo_coors.length;x++)
        {
            if(geo_coors[x]["polygon"]==polygon)
            {
                polygon.setEditable(true);
                if(geo_coors[x]["overlaytype"]=="polygon")
                {
                    $("#geo_inputField_RM_struct").hide();
                    $("#geo_inputField_RM").show();
                    geo_moveScrollBar("polygon",geo_coors[x]["legend"]);
                    $('#geo_inputField_RM ul li').css('outline','none');
                }
                else if(geo_coors[x]["overlaytype"]=="polyline")
                {
                    $("#geo_inputField_RM_struct").show();
                    $("#geo_inputField_RM").hide();
                    geo_moveScrollBar("polyline",geo_coors[x]["legend"]);
                    $('#geo_inputField_RM_struct ul li').css('outline','none');
                }
                $('#'+geo_coors[x]["legend"]).css('outline','2px solid #1e465b');
            }
        }
        getGeoCoordinates(polygon,p_type);
        geo_vertexHover(polygon);
    });
    
    google.maps.event.addListener(polygon.getPath(),'set_at',function()
    {
        getChanges(polygon,leg_id);
        getGeoCoordinates(polygon,p_type);
    });
    google.maps.event.addListener(polygon.getPath(),'insert_at',function()
    {
        getChanges(polygon,leg_id);
        getGeoCoordinates(polygon,p_type);
    });
    google.maps.event.addListener(polygon.getPath(),'remove_at',function()
    {
        getChanges(polygon,leg_id);
        getGeoCoordinates(polygon,p_type);
    });
    
    google.maps.event.addListener(polygon,'dblclick',function()
    {
        for(var x=0;x<geo_coors.length;x++)
        {
            if(polygon==geo_coors[x]["polygon"])
            {
                polygon.setMap(null);
                geo_coors[x]["stat"]="3";
                geo_coors2[x]["stat"]="3";
                polygon=null;
                geo_check=1;
                $("#geo_hand").click();
            }
        }
    });
}

function geo_vertexHover(polygon)
{
    google.maps.event.addListener(polygon,'mouseover',function(event)
    {
        if(event.vertex!=null)
        {
            $("#span_"+event.vertex).css('outline','3px solid #1e456b');
            geo_moveScrollBar("null","span_"+event.vertex);
        }
    });
    
    google.maps.event.addListener(polygon,'mouseout',function(event)
    {
        $("span").css('outline',"none");
    });
}
function getChanges(polygon,lgnd_id)
{
    for(var x=0;x<geo_coors.length;x++)
    {
        if(geo_coors[x]["polygon"]==polygon && (geo_coors[x]["stat"]==0 || geo_coors[x]["stat"]==1)) //from db
        {
            geo_check=1;
            if(geo_coors[x]["overlaytype"]=="polygon")
            {
                geo_coors[x]={"mc":geo_coors[x]["mc"],"polygon":polygon,"legend":lgnd_id,"stat":"1","overlaytype":"polygon"};
                geo_coors2[x]={"mc":geo_coors[x]["mc"],"polygon":polygon.getPath().getArray().toString(),"legend":lgnd_id,"stat":"1","overlaytype":"polygon"}; 
            }
            else if(geo_coors[x]["overlaytype"]=="polyline")
            {
               geo_coors[x]={"mc":geo_coors[x]["mc"],"polygon":polygon,"legend":lgnd_id,"stat":"1","overlaytype":"polyline"}; 
               geo_coors2[x]={"mc":geo_coors[x]["mc"],"polygon":polygon.getPath().getArray().toString(),"legend":lgnd_id,"stat":"1","overlaytype":"polyline"}; 
            }
        }
        else if(geo_coors[x]["polygon"]==polygon  && geo_coors[x]["stat"]==2)//drawn in the map
        {
            geo_check=1;
            if(geo_coors[x]["overlaytype"]=="polygon")
            {
                geo_coors[x]={"mc":"0","polygon":polygon,"legend":lgnd_id,"stat":"2","overlaytype":"polygon"}; 
                geo_coors2[x]={"mc":"0","polygon":polygon.getPath().getArray().toString(),"legend":lgnd_id,"stat":"2","overlaytype":"polygon"}; 
            }
            else if(geo_coors[x]["overlaytype"]=="polyline")
            {
                geo_coors[x]={"mc":"0","polygon":polygon,"legend":lgnd_id,"stat":"2","overlaytype":"polyline"}; 
                geo_coors2[x]={"mc":"0","polygon":polygon.getPath().getArray().toString(),"legend":lgnd_id,"stat":"2","overlaytype":"polyline"}; 
            }
        }
    }
}

function geoRemoveVertex(vertex,p_type)
{
    for(var x=0;x<geo_coors.length;x++)
    {
        if(geo_coors[x]["polygon"].getEditable()==true && p_type=="polygon" && geo_coors[x]["polygon"].getPath().getLength()>3)
        geo_coors[x]["polygon"].getPath().removeAt(vertex);
        else if(geo_coors[x]["polygon"].getEditable()==true && p_type=="polyline" && geo_coors[x]["polygon"].getPath().getLength()>2)
        geo_coors[x]["polygon"].getPath().removeAt(vertex);
    }
}

function geo_moveScrollBar(p_type,leg_id)
{
    if(p_type=="polygon")
    {
        var pos=$("#"+leg_id).position().top+$('#geo_inputField_RM ul').scrollTop();
        $("#geo_inputField_RM ul").animate({scrollTop:pos},'fast','swing');
    }
    else if(p_type=="polyline")
    {
        var pos=$("#"+leg_id).position().top+$('#geo_inputField_RM_struct ul').scrollTop();
        $("#geo_inputField_RM_struct ul").animate({scrollTop:pos},'fast','swing');
    }
    else
    {
        var pos=($("#"+leg_id).position().top+$("#geo_input_field_polygons").scrollTop()-10)-$("#geo_input_field_polygons").position().top;
        $("#geo_input_field_polygons").animate({scrollTop:pos},'fast','swing');
    }
}


function removeSelected()
{
    document.getElementById("geo_input_field_polygons").innerHTML="";
    document.getElementById("geo_coor_count").value="";
    for(var x=0;x<geo_coors.length;x++)
    {
        if(geo_coors[x]["polygon"].getEditable()==true)geo_coors[x]["polygon"].setEditable(false);
    }
    $('#geo_inputField_RM ul li').css('outline','none');
    $('#geo_inputField_RM_struct ul li').css('outline','none'); 
}

function geo_styleButton(geo_button)
{
   if(geo_button==1)//stop
   {
     $('#geo_hand').removeClass();
     $('#geo_polygon').removeClass();
     $('#geo_polyline').removeClass();
     
     $('#geo_hand').addClass('geo_stopClicked');
     $('#geo_polygon').addClass('geo_polygonNotClicked');
     $('#geo_polyline').addClass('geo_polylineNotClicked');
   }
   
   if(geo_button==2)//polygon
   {
     $("#geo_inputField_RM_struct").hide();
     $("#geo_inputField_RM").show();
     $('#geo_hand').removeClass();
     $('#geo_polygon').removeClass();
     $('#geo_polyline').removeClass();
     
     $('#geo_hand').addClass('geo_stopNotClicked');
     $('#geo_polygon').addClass('geo_polygonClicked');
     $('#geo_polyline').addClass('geo_polylineNotClicked');
   }
   
   if(geo_button==3)//polyline
   {
     $("#geo_inputField_RM_struct").show();
     $("#geo_inputField_RM").hide();
     $('#geo_hand').removeClass();
     $('#geo_polygon').removeClass();
     $('#geo_polyline').removeClass();
     
     $('#geo_hand').addClass('geo_stopNotClicked');
     $('#geo_polygon').addClass('geo_polygonNotClicked');
     $('#geo_polyline').addClass('geo_polylineClicked');
   }
}

function geo_reset()
{
    removeSelected();
    for(var x=0;x<geo_coors.length;x++)
    { geo_coors[x]['polygon'].setMap(null);}
    geo_coors=[];
    geo_coors2=[];
}

//------------------------------------------------------------------------------------------
    $(document).ready(function()
    {
        //initialize();
        
        $("#geo_inputField_RM_struct").hide();
        $("#geo_inputField_RM").show();
        
        detectBrowser(); 
        geoRetrieve();
        geo_styleButton(1);
        
        //hiding
        $('#geo_loader').hide();
        $('#geo_success').hide();
        $('#geo_error').hide();
        
        $(window).resize(function(){
            detectBrowser();
        });
       
        $("#geo_clear").click(function()
        {
            var chk_it=0;
            for(var x=0;x<geo_coors.length;x++)
            {
                if(geo_coors[x]['polygon'].getMap()!=null)
                {
                    chk_it=1;
                }
            }
            
            if(geo_coors.length>0 && chk_it!=0)
            {
                var ans = confirm('Are you sure you want to clear the map?');
                if(ans==true){
                    for(var x=0;x<geo_coors.length;x++)
                    {
                        geo_coors[x]["polygon"].setMap(null);
                        geo_coors[x]["stat"]="3";
                        geo_coors2[x]["stat"]="3";
                        geo_c=1
                        
                        document.getElementById("geo_input_field_polygons").innerHTML="";
                        document.getElementById("geo_coor_count").value="";
                    }
                }
            }
        });
        
        $("#geo_save").click(function()
        {
            
            var chk_it=0;
            for(var x=0;x<geo_coors.length;x++)
            {
                if(geo_coors[x]['polygon'].getMap()!=null || geo_coors[x]['mc']!=0)
                {
                    chk_it=1;
                }
            }
            
            if((geo_check==1 || geo_c==1) && chk_it!=0)
            {
                $.ajax(
                {
                    type:"POST",
                    url:base_url+"index.php/geo_controller/geo_saveCoor",
                    data:{geo_data:geo_coors2,geo_c:geo_c},
                    cache:false,
                    beforeSend:function()
                    {
                        $('#geo_loader').fadeIn('fast','swing');
                    },
                    complete:function()
                    {
                        $('#geo_loader').fadeOut('fast','swing');
                    },
                    success:function(data)
                    {
                        $('#geo_loader').fadeOut('fast','swing',function(){
                        $('#geo_success').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');});
                        geo_reset();
                        geoRetrieve();
                        geo_check=0;
                        geo_c=0;
                    },
                    error:function(error)
                    {
                        $('#geo_loader').fadeOut('fast','swing',function(){
                        $('#geo_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');});
                    }
                });
            }
        });
        
        //transfer
        $('#nav_rightPane a, #map_options a').click(function(event){//evaluator link click
            if($(this).attr('href'))
            {
                event.preventDefault();
                
                var chk_it=0;
                for(var x=0;x<geo_coors.length;x++)
                {
                    if(geo_coors[x]['polygon'].getMap()!=null || geo_coors[x]['mc']!=0)
                    {
                        chk_it=1;
                    }
                }
                
                if((geo_check==1 || geo_c==1) && chk_it==1)
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