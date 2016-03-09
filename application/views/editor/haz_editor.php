<?php
echo '<div id="map-canvas"></div>';
echo '<div id="haz_inputField">';
    
    //left
    echo '<div id="haz_inputField_L">';
        echo '<button title="Stop" id="haz_stop"></button>';//stop button
        
        //if($selectedh_id==1)//polygon button = other hazards
            echo '<button title="Draw Polygon" id="haz_polygon"></button>';
        //elseif($selectedh_id==2)//polyline button = earthquake
            echo '<button title="Draw Polyline" id="haz_polyline"></button>';
            
    echo '</div>';
    
    //left mid
    echo '<div id="haz_inputField_LM">';
        echo '<div id="haz_block"><div id="haz_shapeList"></div></div>';
        echo '<div id="haz_block"><input type="text" id="haz_count" readonly=""/><label style="float:right; margin-top:5px; margin-right:1%;">Total: </label></div>';
    echo '</div>';
    
    //right mid
    echo '<div id="haz_inputField_RM">';
        if(count($haz_data)<=4)
            echo '<ul>';
        elseif(count($haz_data)>4)
            echo '<ul style="text-align:left !important;">';
            
            for($x=0;$x<count($haz_data);$x++)
            {
                echo '<li title="'.$haz_data[$x]['hl_name'].'" id="color-'.$haz_data[$x]['hl_id'].'">';
                echo '<label>'.$haz_data[$x]['hl_name'].'</label>';
                echo '<button onclick="haz_colorPoly(\''.$haz_data[$x]['hl_id'].'\', \''.$haz_data[$x]['hl_color'].'\')" style="background-color:'.$haz_data[$x]['hl_color'].'"></button>
                      </li>';
            }
        echo '</ul>';
    echo '</div>';
    
    //right
    echo '<div id="haz_inputField_R">';
        echo '<button id="haz_save">Save</button>';
        echo '<button id="haz_clear">Clear</button>';
    echo '</div>';

echo '</div>';

//prompts
echo '<div id="haz_loader"></div>';//loader
echo '<div id="haz_success"></div>';//success
echo '<div id="haz_error"></div>';//error
?>