var land_map, land_drawingManager;
var land_count = 0;
var land_polygonInfo = [];
var coorArray = {};
var currentVertex;
var colorSet;
var idSet;
var ischanged = 0;

/*****************************************************COLORS*******************************************************************/
var colorButtons = {};
var colorArray = {};

var land_setColors = function(arr){
    colorArray = arr;
}

var land_setCoor = function(arr){
    coorArray = arr;    
}

function land_initializeColor(){
    var colorPalette = document.getElementById('land_colorWrap');
    var colorUl = document.createElement('ul');
    
    if(colorArray.length > 4){
        colorUl.style.textAlign = 'left';
    }
    
    for(var i=0; i<colorArray.length; i++){
        var currColor = colorArray[i].ml_color;
        var colorButton = land_makeColorButton(currColor, colorArray[i].ml_name, colorArray[i].ml_id);
        colorUl.appendChild(colorButton);
        colorButtons[currColor] = colorButton;
    }
    
    colorPalette.appendChild(colorUl);
    land_selectColor(colorArray[0].ml_color);
    colorSet = colorArray[0].ml_color;
    idSet = colorArray[0].ml_id;
    land_nullColor();
}

function land_makeColorButton(color, colorName, id){
    var button = document.createElement('li');
    button.id = 'color-'+id;
    var buttonLabel = document.createElement('label');
    var buttonButton = document.createElement('button');
    buttonButton.style.backgroundColor = color;
    buttonLabel.innerHTML = colorName;
    buttonButton.title = colorName;
    
    google.maps.event.addDomListener(buttonButton, 'click', function() {
    
        var checkEditable = land_setSelectedColor(color);
        
        /*if(land_drawingManager.getDrawingMode() == null && checkEditable == 0){
            land_clearColor(color);
        }
        else{*/
	if(land_drawingManager.getDrawingMode() != null || checkEditable != 0)
	{
	    if(checkEditable!=0)
		ischanged=1;
	    
	    colorSet = color;
	    idSet = id;
            land_selectColor(color);
        }
        
    });
    
    button.appendChild(buttonLabel);
    button.appendChild(buttonButton);
    return button;
}

function land_nullColor(){
    for(var i = 0; i < colorArray.length; ++i) {
        var currColor = colorArray[i].ml_color;
        colorButtons[currColor].style.outline = '';
    }
}
function land_clearColor(color){
    land_nullColor();
    var polygonOptions = land_drawingManager.get('polygonOptions');
    polygonOptions.fillColor = color;
    land_drawingManager.set('polygonOptions', polygonOptions);    
}

function land_selectColor(color){
    for(var i = 0; i < colorArray.length; ++i) {
        var currColor = colorArray[i].ml_color;
        colorButtons[currColor].style.outline = currColor == color ? '2px solid #1e456b' : '';
    }
    
    var polygonOptions = land_drawingManager.get('polygonOptions');
    polygonOptions.fillColor = color;
    land_drawingManager.set('polygonOptions', polygonOptions);
}

function land_setSelectedColor(color){
    for(var i=0; i<land_polygonInfo.length; i++){
        if(land_polygonInfo[i].mc_stat != 1){
            if(land_polygonInfo[i].mc_polygon.getEditable() == true){
		land_polygonInfo[i].mc_polygon.set('fillColor', color);
		land_polygonInfo[i].mc_color = land_getColorID(color);
                return 1;
            }
        }
    }
    
    return 0;
}

function land_getColorID(color){
    var colorID;
    for(var i=0; i<colorArray.length; i++){
        if(colorArray[i].ml_color==color){
            colorID = colorArray[i].ml_id;
        }
    }
    return colorID;
}

function land_getColorHex(colorID){
    var colorHex;
    for(var i=0; i<colorArray.length; i++){
        if(colorArray[i].ml_id == colorID){
            colorHex = colorArray[i].ml_color;
        }
    }
    return colorHex;
}

/*****************************************************COLORS*******************************************************************/

/******************************************************MAP********************************************************************/
google.maps.visualRefresh = true;

var land_maxBounds = new google.maps.LatLngBounds(new google.maps.LatLng(6.91, 125.25), new google.maps.LatLng(7.62, 125.831));
var land_origBounds = new google.maps.LatLng(7.190708000000000000, 125.455340999999980000);

function initialize(){
    
    /********************* MAP *********************/
    var land_mapOptions = {
        backgroundColor:'#ffffff',
        center: land_origBounds,
        zoom:11,
        minZoom: 11,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapMaker: true,
        mapTypeControl: false,
        mapTypeControlOptions:{
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
            mapTypeIds: [google.maps.MapTypeId.TERRAIN, google.maps.MapTypeId.ROADMAP]
        },
        panControl:true,
        scaleControl:true,
        zoomControl: true,
        disableDefaultUI: true,
        disableDoubleClickZoom: true
    };
    
    land_map = new google.maps.Map(document.getElementById("land_mapWrap"), land_mapOptions);
    //var homeControlDiv = document.createElement('div');
    //var homeControl = new HomeControl(homeControlDiv);
    //land_map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
    
     /***************** EVENTS *******************/
         
         google.maps.event.addListener(land_map, 'mousemove', function(event){
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
         
         google.maps.event.addListener(land_map, 'click', function(){
            for(var i=0; i<land_polygonInfo.length; i++){
                land_polygonInfo[i].mc_polygon.setEditable(false);
            }
            
            land_contentStringHTML = '';
            var land_coorWrap = document.getElementById("land_coorWrap");
            land_coorWrap.innerHTML = land_contentStringHTML;
            document.getElementById("land_count").value = '';
            land_nullColor();
        });
          
         /*****************       *******************/
         
    /*********************   *********************/
    
     var polyOptions = {
        strokeOpacity: 0.75,
        strokeWeight: 0.75,
        strokeColor:"#000000",
        fillOpacity: 0.85
    };
    
    land_drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: false,
        drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
                google.maps.drawing.OverlayType.POLYGON
            ]
        },
        polygonOptions: polyOptions
    });   
    
    land_drawingManager.setMap(land_map);
    
    google.maps.event.addListener(land_drawingManager,'drawingmode_changed',function(){
	    for(var i=0; i<land_polygonInfo.length; i++){
		land_polygonInfo[i].mc_polygon.setEditable(false);
	    }
	    
	    land_contentStringHTML = '';
	    var land_coorWrap = document.getElementById("land_coorWrap");
	    land_coorWrap.innerHTML = land_contentStringHTML;
	    document.getElementById('land_count').value = '';
    });
    
    google.maps.event.addListener(land_drawingManager, 'polygoncomplete', function(polygon, event){
        if(polygon.getPath().getLength()>=3)
	{
	    $('#hand-tool').trigger('click');
	    polygon.setEditable(true);
	    land_polygonInfo[land_count] = {mc_polygon: polygon, mc_id: 0, mc_color: land_getColorID(polygon.get('fillColor')), mc_coor: land_coorString(polygon.getPath()), mc_path: polygon.getPath(), mc_stat: 0, mc_index: land_count};
	    land_clearSelection(land_count); //set Editable
	    land_dispCoor(polygon.getPath()); //Display Coordinates
	    land_polyControl(polygon); // Polygon Controls
	    land_count++;
	    ischanged=1;
	}
	else
	{
	    $('#hand-tool').trigger('click');
	    polygon.setMap(null);
	}
    });
    
    $('#land_save').click(function(){ 
        
	var ctr=0;
	for(var x=0;x<land_polygonInfo.length;x++)
	{
	    if(land_polygonInfo[x].mc_id!=0 || land_polygonInfo[x].mc_stat!=1)
		ctr++;
	}
	
	if(land_polygonInfo.length>0 && ctr!=0 && ischanged==1)
	{
	    $.ajax({
		type: "POST",
		url: base_url+'index.php/land_c1/land_saveCoorC',
		data: {polygonInfo: land_copyArray()},
		cache: false,           
		beforeSend: function(){
		    $('#land_loader').fadeIn('fast','swing');
		},
		complete: function(){
		    $('#land_loader').fadeOut('fast','swing');
		},
		success: function(){
		    $('#land_loader').fadeOut('fast','swing',function(){
			$('#land_success').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
		    });
			land_reset();
			ischanged=0;
		},
		error: function(){
		    $('#land_loader').fadeOut('fast','swing',function(){
			$('#land_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
		    });
		}
	    });
	    
	    document.getElementById("land_count").value = '';
	    document.getElementById("land_coorWrap").innerHTML = '';
	    land_nullColor();
	}
    });
    
    $('#land_clear').click(function(){
	var ctr=0;
	for(var x=0;x<land_polygonInfo.length;x++)
	{
	    if(land_polygonInfo[x].mc_stat!=1)
		ctr++;
	}
	
	if(land_polygonInfo.length>0 && ctr!=0)
	{
	    var ans = confirm('Are you sure you want to clear the map?');
	    if(ans==true){
	        /*******************************************************************************/
	        ischanged=1;
		land_clearArr();
	        return;
	    }
	}
    });
    
    land_initializeColor();
    land_setPath();
    land_drawingManagerTools(land_drawingManager);
    land_styleButton(1);
    
}

/******************************************************MAP********************************************************************/
function land_drawingManagerTools(land_drawingManager){
    $('#hand-tool').click(function(){
        land_drawingManager.setDrawingMode(null);
        for(var i=0; i<land_polygonInfo.length; i++){
            land_polygonInfo[i].mc_polygon.setEditable(false);
        }
        
        land_styleButton(1);  
        land_contentStringHTML = '';
        var land_coorWrap = document.getElementById("land_coorWrap");
        land_coorWrap.innerHTML = land_contentStringHTML;
        document.getElementById('land_count').value = '';
        land_nullColor();  
    });
    
    $('#poly-tool').click(function(){
        land_drawingManager.setDrawingMode('polygon');
        for(var i=0; i<land_polygonInfo.length; i++){
            land_polygonInfo[i].mc_polygon.setEditable(false);
        }
        land_styleButton(2);//ended here
	land_selectColor(colorSet);
	
        var pos = $('#color-'+idSet).position().top+$('#land_colorWrap ul').scrollTop();
	$('#land_colorWrap ul').animate({scrollTop:pos},'fast','swing');
    });
}

function land_copyArray(){
    var polygonDb = [];
    for(var i=0; i<land_polygonInfo.length; i++){
        polygonDb[i] = {mc_coor: land_polygonInfo[i].mc_coor, mc_id: land_polygonInfo[i].mc_id, mc_stat: land_polygonInfo[i].mc_stat, mc_color: land_polygonInfo[i].mc_color};
    }
    
    return polygonDb;
}


function land_checkBounds(land_map){
    if(land_maxBounds.contains(land_map.getCenter())==false){
        land_map.panTo(land_origBounds);
    }
}

/*****************************************************POLYGON*****************************************************************/
function land_setPath(){
    for(var i=0; i<coorArray.length; i++){
        var str = coorArray[i].mc_coordinates;
        var split_str = str.split(')');
        var polygonCoords = [];
        
        for(var x=0; x<split_str.length-1; x++){
            var arr = [];
            arr = split_str[x].slice(1).split(',');
            polygonCoords[x] = new google.maps.LatLng(arr[0], arr[1]); 
        }
      
        var setpolygonCoor = new google.maps.Polygon({
            paths: polygonCoords,
            strokeOpacity: 0.75,
            strokeWeight: 0.75,
            strokeColor:"#000000",
            fillOpacity: 0.85,
            fillColor: land_getColorHex(coorArray[i].ml_id)
        });
        
        land_polygonInfo[land_count] = {mc_polygon: setpolygonCoor, mc_coor: coorArray[i].mc_coordinates, mc_id:coorArray[i].mc_id, mc_path: setpolygonCoor.getPath(), mc_color: coorArray[i].ml_id, mc_stat: 0, mc_index: land_count};
        land_polyControl(setpolygonCoor);
        
        land_count++;
        setpolygonCoor.setMap(land_map);
    }
}

function land_polyControl(polygon){
    google.maps.event.addListener(polygon, 'dblclick', function(event){
        land_deletePolygon(this.getPaths());
	ischanged=1;
    });
    
    google.maps.event.addListener(polygon, 'click', function(event){
        var polygonIndex = land_getPolyIndex(this.getPath());
        land_dispCoor(this.getPath());
        
        if(event.vertex == undefined){
            land_clearSelection(polygonIndex);
            return;
        }
        
        land_deleteVertex(event.latLng, this.getPath());
        land_polygonInfo[polygonIndex].mc_coor = land_coorString(this.getPath());
        land_dispCoor(this.getPath());
    });
    
    google.maps.event.addListener(polygon, 'mouseover', function(event){
        if(event.vertex !=undefined){
            var path = this.getPath();
            for(var i =0; i<path.length; i++){
                if(event.latLng == path.getAt(i)){
                 $("#coor-"+i).css('outline','3px solid #1e456b');
                 currentVertex = i;
                 var pos = $('#coor-'+i).position().top+$('#land_coorWrap').scrollTop();
                 $('#land_coorWrap').animate({scrollTop:pos},'fast','swing');
                 return;
                }
            }
        }
        else{            
            $("#coor-"+currentVertex).css('outline', '');
        }
    });
        
    google.maps.event.addListener(polygon,'mouseout', function(event){    
        if(currentVertex !=null){
             $("#coor-"+currentVertex).css('outline', '');
            currentVertex = null;
        }
    });
    
    google.maps.event.addListener(polygon, 'mouseup', function(event){
        var polygonIndex = land_getPolyIndex(this.getPath());
        google.maps.event.addListener(land_polygonInfo[polygonIndex].mc_path, 'set_at', function(){
            ischanged=1;
	    land_dispCoor(land_polygonInfo[polygonIndex].mc_path);
            land_polygonInfo[polygonIndex].mc_coor = land_coorString(land_polygonInfo[polygonIndex].mc_path);
            return;
        });
        
        google.maps.event.addListener(land_polygonInfo[polygonIndex].mc_path, 'insert_at', function(){
            ischanged=1;
	    land_dispCoor(land_polygonInfo[polygonIndex].mc_path);
            land_polygonInfo[polygonIndex].mc_coor = land_coorString(land_polygonInfo[polygonIndex].mc_path);
            return;
        });
        
        google.maps.event.addListener(land_polygonInfo[polygonIndex].mc_path, 'remove_at', function(){
            ischanged=1;
	    land_dispCoor(land_polygonInfo[polygonIndex].mc_path);
            land_polygonInfo[polygonIndex].mc_coor = land_coorString(land_polygonInfo[polygonIndex].mc_path);
            return;
        });
    });
    
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

function land_coorString(path){
    var contentString = '';
    for(var i=0; i<path.getLength(); i++){
        var xy = path.getAt(i);
        contentString += '(' + xy.lat() + ',' + xy.lng() + ')';
    }
    
    return contentString;
}

function land_deletePolygon(paths){
    //land_map.setOptions({disableDoubleClickZoom: true});
                
    for(var i=0; i<land_polygonInfo.length; i++){
        var land_coordinates = land_polygonInfo[i].mc_polygon.getPaths();
        if(land_coordinates == paths){
                land_polygonInfo[i].mc_polygon.setMap(null);
                land_polygonInfo[i].mc_stat = 1;

                var land_coorWrap = document.getElementById("land_coorWrap");
                land_coorWrap.innerHTML = '';
                land_nullColor();
                
                var countBox = document.getElementById('land_count');
                countBox.value = '';
                return;
        }
    }
}

function land_dispCoor(path){
    var coorPalette = document.getElementById('land_coorWrap');
    coorPalette.innerHTML = '';
    
    var count_path = 0;
    for(var i=0; i<path.getLength(); i++){
	var xy = path.getAt(i);
	var stringCon = xy.lat() + ', ' + xy.lng();
	var coorButton = land_coorDiv(stringCon, i, path);
	coorPalette.appendChild(coorButton);
        count_path++;
    }
    
    var countBox = document.getElementById('land_count');
    countBox.value = count_path;
}

function land_deleteVertex(latLng, path){
    if(path.length >3){
         for(var i =0; i<path.length; i++){
                if(latLng == path.getAt(i)){
                    path.removeAt(i);
                    return;
                }
            }
	ischanged=1;
    }
}

function land_coorDiv(textCoor, pathIndex, path){
    
    var coorButton = document.createElement('span');
    coorButton.title = "Point: "+(pathIndex+1);
    coorButton.id = "coor-"+pathIndex;
    
    var coorLabel = document.createElement('label');
    coorLabel.innerHTML = textCoor;
    
    var CoorImg = document.createElement('button');
    CoorImg.innerHTML = 'X';
    CoorImg.title = 'Remove Point';

    google.maps.event.addDomListener(CoorImg, 'click', function(){
                if(path.getLength()>3)
		{
		    path.removeAt(pathIndex);
		    land_dispCoor(path);
		    land_polygonInfo[land_getPolyIndex(path)].mc_coor = land_coorString(path);
		}
    });
    
    coorButton.appendChild(coorLabel);
    coorButton.appendChild(CoorImg);
    return coorButton;
}

function land_getPolyIndex(path){
    var polygonIndex;
    for(var i=0; i<land_polygonInfo.length; i++){
        var land_coordinates = land_polygonInfo[i].mc_path;
        if(path == land_coordinates){
            polygonIndex = i;
        }
    }

    return polygonIndex;
}

function land_clearSelection(polygonIndex){
    for(var i=0; i<land_polygonInfo.length; i++){
        if(land_polygonInfo[i].mc_index == polygonIndex){
	    var polygonColor = land_polygonInfo[i].mc_polygon.get('fillColor');
            land_polygonInfo[i].mc_polygon.setEditable(true);
            land_selectColor(polygonColor);
            
            var pos = $('#color-'+(land_getColorID(polygonColor))).position().top+$('#land_colorWrap ul').scrollTop();
	    $('#land_colorWrap ul').animate({scrollTop:pos},'fast','swing');
        }
        else{
             land_polygonInfo[i].mc_polygon.setEditable(false);
        }
    }
}

/*****************************************************POLYGON*****************************************************************/
$(document).ready(function(){
    detectBrowser();
    //initialize();

    //hiding
    $('#land_loader').hide();
    $('#land_success').hide();
    $('#land_error').hide();
    
    $(window).resize(function(){
	detectBrowser();
    });
    
     //transfer
    $('#nav_rightPane a, #map_options a').click(function(event){//evaluator link click
        if($(this).attr('href'))
        {
            event.preventDefault();
	    
	    var chkit=0;
	    for(var x=0;x<land_polygonInfo.length;x++)
	    {
		if(land_polygonInfo[x].mc_id!=0 || land_polygonInfo[x].mc_stat!=1)
		    chkit=1;
	    }
	    
            if(ischanged==1 && chkit==1)
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

function land_clearArr(){
    for(var i=0; i<land_polygonInfo.length; i++){
        land_polygonInfo[i].mc_polygon.setMap(null);
        land_polygonInfo[i].mc_stat = 1;
    }
             
    document.getElementById("land_coorWrap").innerHTML = '';
    document.getElementById('land_count').value = '';
}

function land_reset(){
    for(var i=0; i<land_polygonInfo.length; i++){
        land_polygonInfo[i].mc_polygon.setMap(null);
    }
    land_polygonInfo = [];
    land_count = 0;
    land_getDb();
}

function land_getDb(){
    $.ajax({
        type: "GET",
        url: base_url+'index.php/land_c1/land_fromDb',
        dataType: "json",
        cache:false,
        success: function(result){
            coorArray = result;
            land_setPath();
        },
        error: function(){
            $('#land_error').fadeIn('fast','swing').delay(600).fadeOut('fast','swing');
        }
    });

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
                    
                    google.maps.event.addDomListener(controlUI, 'click', function(event){
                       land_map.panTo(land_origBounds),
                       land_map.setZoom(11)
                    });
}
                
/*****************************************************BUTTONS******************************************************************/
function detectBrowser()
{ 
    //check if mobile
    if($('#land_colorWrap').css('position')=='absolute')
    {
	var hedfld = parseFloat($('#header').css('height'))+ parseFloat($('#land_inputField').css('height'));//header and field height
        document.getElementById('land_mapWrap').style.height=(window.innerHeight - hedfld - 5)+"px";
	$('#land_colorWrap').css('height',window.innerHeight - hedfld - 5);
    }
    else//not mobile
    {
	$('#land_colorWrap').css({'height':'auto','min-height':'100px'});
	var hedfld = parseFloat($('#header').css('height'))+ parseFloat($('#land_inputField').css('height'));//header and field height
	document.getElementById('land_mapWrap').style.height=(window.innerHeight - hedfld - 5)+"px";
    }
    
    document.getElementById('land_loader').style.height=(window.innerHeight-3)+"px";
    document.getElementById('land_success').style.height=(window.innerHeight-3)+"px";
    document.getElementById('land_error').style.height=(window.innerHeight-3)+"px";
}

function land_styleButton(land_button)
{
   if(land_button==1)//stop
   {
     $('#hand-tool').removeClass();
     $('#poly-tool').removeClass();
 
     $('#hand-tool').addClass('land_stopClicked');
     $('#poly-tool').addClass('land_polygonNotClicked');
   }
   
   if(land_button==2)//polygon
   {
     $('#hand-tool').removeClass();
     $('#poly-tool').removeClass();
 
     $('#hand-tool').addClass('land_stopNotClicked');
     $('#poly-tool').addClass('land_polygonClicked');
   }
}
/*****************************************************BUTTONS*******************************************************************/