<?php
echo '<div id="map-canvas"></div>';//map

echo '<div id="evaluator_field">';//eval field
    
    //left
    echo '<div id="evaluator_field_L">';
        
        //left table
        echo '<div id="table_details">';
            
            echo '<div id="ev_block">';
                echo '<div class="td_label">Location</div>';
                    echo '<div class="td_input1"><input type="text" id="location" readonly=""
                            style="width:99% !important; padding-left:0.5% !important; padding-right:0.5% !important;" /></div>';
            echo '</div>';
            
            echo '<div id="ev_block">';
                echo '<div class="td_label">Rock Type</div>';
                    echo '<div class="td_input"><input type="text" id="rock_type" readonly=""/></div>';
                echo '<div class="td_label">Soil Type</div>';
                    echo '<div class="td_input"><input type="text" id="land_type" readonly=""/></div>';        
            echo '</div>';
            
            echo '<div id="ev_block">';
                echo '<div class="td_label">Rock Structure</div>';
                    echo '<div class="td_input"><input type="text" id="rock_struct" readonly=""/></div>';
                echo '<div class="td_label">Safety Rate</div>';
                    echo '<div class="td_input"><input type="text" id="safety_rate" readonly="" /></div>';
            echo '</div>';
        
        echo '</div>';//end of left table
        
    echo '</div>';//end of left
    
    //Middle
    echo '<div id="evaluator_field_M">';
        echo '<div id="no_haz" class="haz_list_header">Geologic Hazards</div>';
        echo '<div id="haz_list"><span></span><span></span></div>';
    echo '</div>';
    
    //Right
    echo '<div id="evaluator_field_R">';
    
        //###############################################
        if($e_type==1)//hazard
        {
            if(count($hlvl)<4)//ul
            {   echo '<ul style="text-align:center;">'; }
            else
            {   echo '<ul style="text-align:left;">';   }
                
                for($x=0;$x<count($hlvl);$x++)//loop
                {
                    $hl_name="";
                    $hl_desc="None";
                    $hl_img1="None";
                    $hl_img2="None";
                    $hl_img3="None";
                    
                    $hl_name = $hlvl[$x]['hl_name'];//header ###
                    //description
                    if($hlvl[$x]['hl_desc'])
                        $hl_desc = $hlvl[$x]['hl_desc'];
                    
                    //images
                    if($hlvl[$x]['hl_img1'])
                        $hl_img1 = $hlvl[$x]['hl_img1'];
                    if($hlvl[$x]['hl_img2'])
                        $hl_img2 = $hlvl[$x]['hl_img2'];
                    if($hlvl[$x]['hl_img3'])
                        $hl_img3 = $hlvl[$x]['hl_img3'];
                    
                    //hazards initializing li 
                    echo '<li id="haz-'.$hlvl[$x]['hl_id'].'" title="'.$hlvl[$x]['hl_name'].'">';
                    
                    //label inside li
                    echo '<label>'.$hlvl[$x]['hl_name'].'</label>';
                    
                    //button inside li
                    echo '<button onclick="hazLegendClick(\''.addslashes($hl_name).'\',
                                                          \''.addslashes($hl_desc).'\',
                                                          \''.addslashes($hl_img1).'\',
                                                          \''.addslashes($hl_img2).'\',
                                                          \''.addslashes($hl_img3).'\')" style="background-color:'.$hlvl[$x]['hl_color'].'"></button>
                          </li>';
                          
                }//end of loop
                
            echo '</ul>';//end of ul
        }
        //################################################
        elseif($e_type==2)//map
        {
            if(count($mlegend)<4)//ul
            {   echo '<ul style="text-align:center;">'; }
            else
            {   echo '<ul style="text-align:left;">';   }
                
                for($x=0;$x<count($mlegend);$x++)//loop
                {
                    $ml_name = "";
                    $ml_desc = "None";
                    $ra_name = "None";
                    $rg_name = "None";
                    $sl_firstlayer = "None";
                    $sl_secondlayer = "None";
                    $sl_thirdlayer = "None";
                    $sl_fourthlayer = "None";
                    $ml_img1 = "None";
                    $ml_img2 = "None";
                    $ml_img3 = "None";
                    
                    //images
                    if($mlegend[$x]['ml_img1'])
                        $ml_img1 = $mlegend[$x]['ml_img1'];
                    if($mlegend[$x]['ml_img2'])
                        $ml_img2 = $mlegend[$x]['ml_img2'];
                    if($mlegend[$x]['ml_img3'])
                        $ml_img3 = $mlegend[$x]['ml_img3'];
                    
                    if($s_id==1)//rock initializing li
                    {
                        if($mlegend[$x]['ml_type']==1)//rock type
                        {
                            echo '<li id="map-'.$mlegend[$x]['ml_id'].'" title="'.$mlegend[$x]['ml_name']." : ".$mlegend[$x]['ml_desc'].'">';
                            
                            $ml_name = $mlegend[$x]['ml_name']." : ".$mlegend[$x]['ml_desc'];//header ###
                            
                            if($mlegend[$x]['ml_desc2'])
                                $ml_desc = $mlegend[$x]['ml_desc2'];//description
                            if($mlegend[$x]['ra_name'])
                                $ra_name = $mlegend[$x]['ra_name'];//rock age
                            if($mlegend[$x]['rg_name'])
                                $rg_name = $mlegend[$x]['rg_name'];//rock group
                        }
                        else//structure
                        {
                            echo '<li id="map-'.$mlegend[$x]['ml_id'].'" title="'.$mlegend[$x]['ml_name'].'">';
                            
                            $ml_name = $mlegend[$x]['ml_name'];//header ###
                            
                            if($mlegend[$x]['ml_desc'])
                                $ml_desc = $mlegend[$x]['ml_desc'];//description
                        }
                    }
                    elseif($s_id==2)//land initializing li
                    {
                        echo '<li id="map-'.$mlegend[$x]['ml_id'].'" title="'.$mlegend[$x]['ml_name'].'">';
                        
                        $ml_name = $mlegend[$x]['ml_name'];//header ###
                        
                        if($mlegend[$x]['ml_desc'])
                            $ml_desc = $mlegend[$x]['ml_desc'];//description
                        
                        //Soil sub-layers
                        if($mlegend[$x]['sl_firstlayer'])
                            $sl_firstlayer = $mlegend[$x]['sl_firstlayer'];//first
                        if($mlegend[$x]['sl_secondlayer'])
                            $sl_secondlayer = $mlegend[$x]['sl_secondlayer'];//second
                        if($mlegend[$x]['sl_thirdlayer'])
                            $sl_thirdlayer = $mlegend[$x]['sl_thirdlayer'];//third
                        if($mlegend[$x]['sl_fourthlayer'])
                            $sl_fourthlayer = $mlegend[$x]['sl_fourthlayer'];//fourth
                    }
                    
                    
                    //label inside li
                    echo '<label>'.$mlegend[$x]['ml_name'].'</label>';
                          
                    //button inside li
                    echo '<button onclick=" mapLegendClick(\''.addslashes($s_id).'\',
                                                           \''.addslashes($ml_name).'\',
                                                           \''.addslashes($ml_desc).'\',
                                                           \''.addslashes($ra_name).'\',
                                                           \''.addslashes($rg_name).'\',
                                                           \''.addslashes($sl_firstlayer).'\',
                                                           \''.addslashes($sl_secondlayer).'\',
                                                           \''.addslashes($sl_thirdlayer).'\',
                                                           \''.addslashes($sl_fourthlayer).'\',
                                                           \''.addslashes($ml_img1).'\',
                                                           \''.addslashes($ml_img2).'\',
                                                           \''.addslashes($ml_img3).'\') "   style="background-color:'.$mlegend[$x]['ml_color'].'"></button>
                          </li>';
                          
                }//end of loop
                
            echo '</ul>';//end of ul
        }
        else//null
        {
            echo '<ul>';
                echo '<div class="no_map" style="float:left; width:100%; margin-top:8px;">Please select a map to display legend</div>';
                echo '<li class="no_map" style="width:10%; height:25px; border:3px solid #f4fafd; border-top-right-radius:10px;"></li>';
                echo '<li class="no_map" style="width:10%; height:25px; border:3px solid #f4fafd; border-top-right-radius:10px;"></li>';
                echo '<li class="no_map" style="width:10%; height:25px; border:3px solid #f4fafd; border-top-right-radius:10px;"></li>';
            echo '</ul>';
        }
    echo '</div>';
    
    
echo '</div>';//end of eval field



//outside eval field#####################################################################
//error
echo '<div id="ev_error"></div>';

//legend to pop
echo '<div id="pop-upLegend">';
    //container
    echo '<div id="pop-upLegend_container">';
            echo '<div id="pop-upLegend_header"> <label></label> <button title="Close">X</button> </div>';//header
            echo '<div id="pop-upLegend_img1Container">';
                echo '<div id="pop-upLegend_img1"></div>'; //big image
            echo '</div>';
            echo '<div id="pop-upLegend_desc"></div>'; //desc
    echo '</div>';
echo '</div>';

//evaluation header
//echo '<div id="ev_pop">';
//    echo '<div id="ev_pop_header">Land Information</div>';
//echo '</div>';

//search box
echo '<input type="text" id="searchBox" placeholder="Search Place"/>';
?>