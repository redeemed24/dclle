<?php
    //echo "<div id='container'>";
    //echo "<div id='container-map'>";
    echo "<div id='map-canvas'></div>";
    //echo "</div>";
    echo '<div id="geo_inputField">';
    
        echo '<div id="geo_inputField_L">';
        echo '<button title="Stop" id="geo_hand"></button>';
        echo '<button title="Draw Polygon" id="geo_polygon"></button>';
        echo '<button title="Draw Polyline" id="geo_polyline"></button>';
        echo '</div>';
        
        echo '<div id="geo_inputField_LM">';
        echo '<div id="geo_block"><div id="geo_input_field_polygons"></div></div>';
        echo '<div id="geo_block"><input type="text" id="geo_coor_count" readonly=""/><label style="float:right; margin-top:5px; margin-right:1%;">Total: </label></div>';
        echo '</div>';
        
        //normal legend
        echo "<div id='geo_inputField_RM'>";
            if(count($geo_legends)<=4) echo '<ul>';
            elseif(count($geo_legends)>4) echo '<ul style="text-align:left !important;">';
            
            if(count($geo_legends)>0)
            {
                foreach($geo_legends as $row)
                {
                    echo '<li title="'.$row->ml_name.' : '.$row->ml_desc.'"   id="ml_'.$row->ml_id.'">';
                    echo '<label>'.$row->ml_name.'</label>';
                    echo  '<button onclick="geo_getLegendId(\''.'ml_'.$row->ml_id.'\', \''.$row->ml_color.'\')" style="background-color:'.$row->ml_color.'"></button>
                          </li>';
                }
            }
            echo '</ul>';
        echo "</div>";
        
        //geological structures 
        echo "<div id='geo_inputField_RM_struct'>";
            if(count($geo_struct)<=4) echo '<ul>';
            elseif(count($geo_struct)>4) echo '<ul style="text-align:left !important;">';
            
            if(count($geo_struct)>0)
            {
                foreach($geo_struct as $row)
                {
                    echo '<li title="'.$row->ml_name.'" id="struct_'.$row->ml_id.'">';
                    echo '<label>'.$row->ml_name.'</label>'; 
                    echo '<button onclick="geo_getStructId(\''.'struct_'.$row->ml_id.'\', \''.$row->ml_color.'\')" style="background-color:'.$row->ml_color.'"></button>
                          </li>';
                }
            }
            echo '</ul>';
        echo "</div>";
        
        echo "<div id='geo_inputField_R'>";
        echo "<geo_submit><button id='geo_save'>Save</button></geo_submit>";
        echo "<clear_all><button id='geo_clear'>Clear</button></geo_submit>";
        echo "</div>";
    
    echo '</div>';
    
    echo '<div id="geo_loader"></div>';//loader
    echo '<div id="geo_success"></div>';//success
    echo '<div id="geo_error"></div>';//error
    
   //echo "<button id='test'>CLICK ME</button>"; 
?>
