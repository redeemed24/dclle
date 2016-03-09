<?php
echo doctype('html5');
echo '<html>';
echo '<head>';
echo '<title>DCLLE</title>';
echo '<meta name="viewport" content="width=device-width, initial-scale=1.0">';
echo link_tag(base_url().'css/style.css');//css

echo '<script src="'.base_url().'js/jquery-1.10.2.js"></script>';//jquery
echo '<script src="'.base_url().'js/api_handler.js"></script>';//error handler

echo '<script src="https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyDtW8eex8CCAUvrAoU8fP6ZkG2pRdcjFtE&sensor=true&region=PH&libraries=geometry,drawing,places"></script>';//google api
echo '<script src="'.base_url().'js/nav.js"></script>';//navigation

//declarations---------------------------------------------------------------
if($this->session->userdata('login')==1)
{
    //chat-----------------------------------------------------------------------
    echo link_tag(base_url().'css/chat.css');
    echo link_tag(base_url().'css/chat_w.css');
    echo '<script src="'.base_url().'js/chat_window.js"></script>';
    
    $convo_id = array(); // used in javascript
    $convo_id[0]=0; //conversation id
    $convo_id[1]=0; //same sa above
    $convo_id[2]=2; //status is 2
 
    echo '<script>chatWith('.json_encode($convo_id).')</script>';
    
    //settings--------------------------------------------------------------------
    echo link_tag(base_url().'css/colpick.css');//css//colorpicker css
    echo link_tag(base_url().'css/settings.css');//css//colorpicker css
    
    $username=$this->session->userdata('username'); //this should be a session
    $u_lvl=$this->session->userdata('userlevel');
        
    echo '<script> var base_url = "'.base_url().'"; var username="'.$username.'"; var u_lvl="'.$u_lvl.'" </script>';
    echo '<script src="//code.jquery.com/ui/1.10.4/jquery-ui.js"></script>';
    echo '<script src="'.base_url().'js/colpick.js"></script>';
    echo '<script src="'.base_url().'js/settings.js"></script>';
    
        //request
        echo link_tag(base_url().'css/request.css');//request
        echo '<script> var mp_type="'.$map_type.'"; </script>';
        echo '<script src="'.base_url().'js/requests.js"></script>';//request
        
        //file mgt and reports
        echo link_tag(base_url().'css/wysiwyg.css');
        echo link_tag(base_url().'css/wysiwyg_print.css');
        echo '<script src="'.base_url().'js/tinymce/tinymce.min.js"></script>';
        //echo '<script src="'.base_url().'js/file_mgt.js"></script>';
}
//end of chat and settings

//evaluator js
if($map_type==null)
{
    echo '<script>
            var base_url = "'.base_url().'";
            var e_type = "'.$e_type.'";
            var s_id = "'.$s_id.'";
         </script>';
    
    echo '<script src="'.base_url().'js/evaluator.js"></script>';//evaluator
}

//hazards js
if($map_type==1)
{
    echo '<script>
         var haz_default_hl_color="'.$haz_data[0]['hl_color'].'";
         var haz_default_hl_id="'.$haz_data[0]['hl_id'].'";
         var haz_selectedh_id='.$selectedh_id.';
         var base_url ="'.base_url().'";
         </script>';
    
    echo '<script src="'.base_url().'js/mapping.js"></script>';//hazard mapping
}

//geo js
if($map_type==2)
{
    echo '<script>
        var geo_leg_color="'.$geo_f_color[0]['ml_color'].'";
        var geo_legend_id="ml_'.$geo_f_color[0]['ml_id'].'";
        var geo_struct_color="'.$struct_f_color[0]['ml_color'].'";
        var geo_struct_id="struct_'.$struct_f_color[0]['ml_id'].'";
        var base_url ="'.base_url().'";
        </script>';
    
    echo '<script src="'.base_url().'js/geo_mapping.js"></script>';//geo mapping
}

//land js
if($map_type==3)
{
    $land_count = 0;
    $land_colorInfo = array();
    foreach($land_color as $land_colordata){
        $land_colorInfo[$land_count] = array('ml_id'=>$land_colordata->ml_id,
                                             'ml_color'=>$land_colordata->ml_color,
                                             'ml_name'=>$land_colordata->ml_name);
        $land_count++;
    }
    
    $land_count =0;
    $land_coorInfo = array();
    foreach($land_coor as $land_coordata){
        $land_coorInfo[$land_count] = array('mc_id'=>$land_coordata->mc_id,
                                            'mc_coordinates'=>$land_coordata->mc_coordinates,
                                            'ml_id'=>$land_coordata->ml_id);
        $land_count++;
    }
    
    echo '<script> var base_url = "'.base_url().'" </script>';
    echo '<script src="'.base_url().'js/land_js.js"></script>';//land mapping
    
    echo '<script>land_setCoor('.json_encode($land_coorInfo).')</script>';
    echo '<script>land_setColors('.json_encode($land_colorInfo).')</script>';
}

//end of declarations--------------------------------------------------------------

echo '</head>';
echo '<body>';
echo '<div id="main">';
echo '<div id="container">';

echo '<div id="header">';
    
    echo '<div id="nav_leftPane">';//left pane
    
        //***********************************************
        echo '<div id="map_selector">';//button
            
            if($map_type==null)//evaluator
            {
                if($selected)
                    echo $selected;
                else
                    echo 'Select a Map';
            }
            
            elseif($map_type==1)//hazards
            {
                if($selectedh_name)
                    echo $selectedh_name;
                else
                    echo 'Select a Map';
            }
            
            elseif($map_type==2 || $map_type==3)//geo or land
            {
                if($selectedm_name)
                    echo $selectedm_name;
                else
                    echo 'Select a Map';
            }
            
        echo '</div>';//end of button********************
        
        //******************************************************
        echo '<ul id="map_options">';//map list
            echo '<li style="font-style:italic; color:#acacac;">Select a Map</li>';
            
            //Evaluator
            if($map_type==null)
            {
                echo '<li style="font-weight:bold; color:#454545;">Hazard Maps</li>';
                
                for($x=0;$x<count($hazards);$x++)
                {
                        echo '<a href="'.base_url().'index.php/main_controller/select_map/x/'.$hazards[$x]['h_id'].'">'
                             .$hazards[$x]['h_name'].'</a>';
                }
                
                echo '<li style="font-weight:bold; color:#454545;">Geologic Maps</li>';
                echo '<a href="'.base_url().'index.php/main_controller/select_map/'.$map[0]['m_id'].'/x">'
                     .$map[0]['m_name'].'</a>';
                echo '<a href="'.base_url().'index.php/main_controller/select_map/'.$map[1]['m_id'].'/x">'
                     .$map[1]['m_name'].'</a>';
            }
            //editor
            else
            {
                echo '<li style="font-weight:bold; color:#454545;">Hazard Maps</li>';
                
                for($x=0;$x<count($hazards);$x++)
                {
                    echo '<a href="'.base_url().'index.php/haz_controller/haz_editor/'.$hazards[$x]['h_id'].'">'
                       .$hazards[$x]['h_name'].'</a>';
                }
                
                echo '<li style="font-weight:bold; color:#454545;">Geologic Maps</li>';
                
                echo '<a href="'.base_url().'index.php/geo_controller">'
                     .$map[0]['m_name'].'</a>';
                echo '<a href="'.base_url().'index.php/land_c1">'
                     .$map[1]['m_name'].'</a>';
            }
        echo '</ul>';//end of map list**************************
        
        //latitude and longitude
        echo '<label id="lbl">Lat</label><input type="text" id="lat" readonly=""/>';
        echo '<label id="lbl1">Lng</label><input type="text" id="lng" readonly=""/>';
        
    echo '</div>';//end of left pane

    echo '<div id="nav_rightPane">';
        if($this->session->userdata('login')==1 && $this->session->userdata('userlevel')==1)//if login geologist
        {
            echo '<a title="Evaluator" style="margin-left:8% !important;" href="'.base_url().'index.php/main_controller" class="nav_a1"></a>';
            echo '<a title="Map Editor" href="'.base_url().'index.php/haz_controller" class="nav_a2"></a>';
            echo '<a id="request_b" title="List of Request" class="nav_a3"></a>';
            echo '<a id="about_b" title="Hazard Information" class="nav_a7"></a>';
            echo '<a title="Settings" class="nav_a4"></a>';
            echo '<a title="Logout" href="'.base_url().'/index.php/login/logout" class="nav_a6"></a>';
        }
        elseif($this->session->userdata('login')==1 && $this->session->userdata('userlevel')==2)//if login client
        {
            echo '<a title="Evaluator" style="margin-left:8% !important;" href="'.base_url().'index.php/main_controller" class="nav_a1"></a>';
            echo '<a id="request_b" title="List of Request" class="nav_a3"></a>';
            echo '<a id="about_b" title="Hazard Information" class="nav_a7"></a>';
            echo '<a title="Settings" class="nav_a4"></a>';
            echo '<a title="Logout" href="'.base_url().'/index.php/login/logout" class="nav_a6"></a>';
        }
        else//logout
        {
            echo '<a title="Evaluator" style="margin-left:8% !important;" href="'.base_url().'index.php/main_controller" class="nav_a1"></a>';
            echo '<a id="about_b" title="Hazard Information" class="nav_a7"></a>';
            echo '<a id="login_b" title="Login" class="nav_a5"></a>';
            echo '<a id="sign_b" title="Sign Up" class="nav_a8"></a>';
        }
    echo '</div>';
    
echo '</div>';//end of header

if(!$this->session->userdata('login'))//if logout
{
    //login box
    echo '<div id="login_container"></div>';
    echo '<div id="login_box">';
        echo '<div id="login_box_header">User Credentials</div>';
        echo '<input id="login_box_input1" type="text" placeholder="Username" />';
        echo '<input id="login_box_input2" type="password" placeholder="Password" />';
        echo '<button id="login_box_submit">Submit</button>';
        echo '<button id="login_box_close">Cancel</button>';
    echo '</div>';
}

//about box
echo '<div id="about_container"></div>';
echo '<div id="about_box">';
    echo '<div id="about_box_header">Hazard Information <button id="about_close">X</button></div>';
    echo '<div id="about_box_content">';
    echo '</div>';
echo '</div>';

if(!$this->session->userdata('login'))//if logout
{
    //sign up
    echo '<div id="sign_upcontainer"></div>';
    echo '<div id="sign_up_box">';
        echo '<div id="sign_up_box_header">Registration Form</div>';
        echo '<div id="sign_up_box_content">';
            
            echo '<div id="sign_up_box_block">
                  <input type="text" id="u_name" placeholder="Enter username here"/>
                  </div>';
            echo '<div id="sign_up_box_block">
                  <input type="password" id="u_pass" placeholder="Enter password here"/>
                  </div>';
            echo '<div id="sign_up_box_block">
                  <input type="password" id="conf_pass1" placeholder="Confirm password here"/>
                  </div>';
            echo '<div id="sign_up_box_block">
                  <input type="text" id="l_name" placeholder="Enter last name here"/>
                  </div>';
            echo '<div id="sign_up_box_block">
                  <input type="text" id="f_name" placeholder="Enter first name here"/>
                  </div>';
            echo '<div id="sign_up_box_block">
                  <input type="text" id="m_name" placeholder="Enter middle name here"/>
                  </div>';
            //button      
            echo '<div id="sign_up_box_block">
                  <button id="reg_submit" style="background-color:#8da005">Register</button>
                  <button id="reg_cancel" style="background-color:#fd4009">Cancel</button>
                  </div>';
        echo '</div>';
    echo '</div>';
}

//settings
//-----------------------------------------------------settings-------------------------------------------------------------------------------------------------
if($this->session->userdata('login')==1)
{
     echo '<div id="settings_container"></div>';
    
    echo '<div id="settings_base">';
        echo '<div id="settings_header">';
            echo '<closeButton>X</closeButton>';
            echo '<button id="settings_label">Settings</button>';
            echo '<button id="profile_label">My Profile</button>';
        echo '</div>';
        echo '<div id="settings_list_base">';
            echo '<a id="profile">Profile</a>';
            echo '<a id="acct_mgt_button">Account Management</a>';
            echo '<a id="haz_mgt_button">Hazard Map Settings</a>';
            echo '<a id="rock_mgt_button">Rock Map Settings</a>';
            echo '<a id="soil_mgt_button">Soil Map Settings</a>';
        echo '</div>';
        
        echo '<div id="settings_base_1">';
        
           //----------------------------------------profile-----------------------------------------------------
           $prof_lname=array('name'=>'prof_lname','id'=>'prof_lname','class'=>'txt_styles_1');
           $prof_fname=array('name'=>'prof_fname','id'=>'prof_fname','class'=>'txt_styles_1');
           $prof_mname=array('name'=>'prof_mname','id'=>'prof_mname','class'=>'txt_styles_1');
           $prof_address=array('name'=>'prof_address','id'=>'prof_address','class'=>'txt_styles_1','style'=>'height:100px; max-height:100px');
           $prof_company=array('name'=>'prof_company','id'=>'prof_company','class'=>'txt_styles_1');
           $prof_contactno=array('name'=>'prof_contactno','id'=>'prof_contactno','class'=>'txt_styles_1');
           $prof_user=array('name'=>'prof_user','id'=>'prof_user','class'=>'txt_styles_1', 'readonly'=>'');
           $prof_level=array('name'=>'prof_level','id'=>'prof_level','class'=>'txt_styles_1','readonly'=>'readonly');
           $curr_pass=array('name'=>'curr_pass','id'=>'curr_pass','class'=>'txt_styles_2');
           $new_pass=array('name'=>'new_pass','id'=>'new_pass','class'=>'txt_styles_2');
           $conf_pass=array('name'=>'conf_pass','id'=>'conf_pass','class'=>'txt_styles_2');
           
            echo '<div class="prof_base" id="prof_container">';
                echo '<header>Basic Information';
                echo '<button class="prof_edt" id="edit_prof">Edit Profile</button>';
                echo '</header>';
                echo '<div id="pbasic_info_cont">';
                    echo '<span>';
                        echo '<a id="base_style"><left>Last Name:</left><right>'.form_input($prof_lname,'').'</right></a>';
                        echo '<a id="base_style"><left>First Name:</left><right>'.form_input($prof_fname,'').'</right></a>';
                        echo '<a id="base_style"><left>Middle Name:</left><right>'.form_input($prof_mname,'').'</right></a>';
                        echo '<a id="base_style"><left>Address:</left><right>'.form_textarea($prof_address,'').'</right></a>';
                        echo '<a id="base_style"><left>Contact Number:</left><right>'.form_input($prof_contactno,'').'</right></a>';
                        echo '<a id="base_style"><left>Company:</left><right>'.form_input($prof_company).'</right></a>';
                       
                        echo '<span id="edt_buttons" style="display:none">';
                        echo '<button class="btn_edtsave" id="edit_prof_info">Save Changes</button>';
                        echo '<button class="btn_edtsave" id="cancel_prof_info">Cancel</button>';
                        echo '</span>';
                    
                    echo '</span>';
                echo '</div>';
            echo '</div>';
                
            echo '<div class="prof_base" id="acct_container">';
                echo '<header>Account Information';
                echo '<button class="prof_edt" id="manage_acct">Manage</button>';
                echo '</header>';
                echo '<div class="pbasic_info_cont" id="pacct_cont">';
                    echo '<span>';
                        echo '<a id="base_style"><left>Username:</left><right>'.form_input($prof_user,'').'</right></a>';
                        //echo '<a id="base_style"><left>User Level:</left><right>'.form_input($prof_level,'').'</right></a>';
                    echo '</span>';
                    
                    echo '<span id="changePass" style="display:none;">';
                        echo '<a id="base_style"><left>Old Password:</left><right>'.form_password($curr_pass,'').'</right></a>';
                        echo '<a id="base_style"><left>New Password:</left><right>'.form_password($new_pass,'').'</right></a>';
                        echo '<a id="base_style"><left>Confirm Password:</left><right>'.form_password($conf_pass,'').'</right></a>';
                        echo '<button class="btn_edtsave" id="change_pass">Save Password</button>';
                        echo '<button class="btn_edtsave" id="cancel_pass">Cancel</button>';
                    echo '</span>';
                        
                    
                echo '</div>';  
            echo '</div>';
           
           
            //----------------------------------------account mgt-----------------------------------------------------
            $acct_lname=array('name'=>'acct_lname','id'=>'acct_lname','class'=>'txt_styles_1');
            $acct_fname=array('name'=>'acct_fname','id'=>'acct_fname','class'=>'txt_styles_1');
            $acct_mname=array('name'=>'acct_mname','id'=>'acct_mname','class'=>'txt_styles_1');
            $acct_address=array('name'=>'acct_address','id'=>'acct_address','class'=>'txt_styles_1','style'=>'height:100px; max-height:100px');
            $acct_contactno=array('name'=>'acct_contactno','id'=>'acct_contactno','class'=>'txt_styles_1');
            $acct_company=array('name'=>'acct_company','id'=>'acct_company','class'=>'txt_styles_1');
            $acct_username=array('name'=>'acct_username','id'=>'acct_username','class'=>'txt_styles_1','readonly'=>'readonly');
            $acct_level=array('name'=>'acct_level','id'=>'acct_level','class'=>'txt_styles_1','readonly'=>'readonly');
            $search_acct=array('name'=>'search_acct','id'=>'search_acct','class'=>'txt_style_3','placeholder'=>'Search Account');
            
            echo '<div class="prof_base" id="acct_mgt">';
                    echo '<header>Account Management';
                    echo '<button_1 class="prof_edt" id="adm_add_acct">New Account</button_1>';
                    echo'</header>';
                    echo '<div class="acct_act_info">';
                        echo '<header style="background-color:#9EA7AD; border-radius:0px; color:#ffffff;">Search Accounts<toggle_min id="acct_search">-</toggle_min></header>';
                        echo '<div id="acct_search_cont">';
                            echo '<form id="search_account" method="post" action="">';
                            echo '<search>';
                                echo '<search_box>'.form_input($search_acct);
                                echo '<input type="submit" id="search_btn_acct" class="btn_edtsave" value="Search"/>';
                            echo '</search_box></search>';
                            echo '</form>';
                            echo '<table id="tbl_accts"></table>';
                        echo '</div>';
                    echo '</div>';
                
                echo '<div class="acct_act_info" id="adm_prof">';
                    echo '<header style="background-color:#9EA7AD">Basic Information<toggle_min id="toggle_prof">-</toggle_min>';
                    echo '<button_1 class="prof_edt" id="adm_edit_prof">Edit Profile</button_1>';
                    echo '</header>';
                    echo '<span id="acct_prof_cont">';
                        echo '<a id="base_style"><left>Last Name:</left><right>'.form_input($acct_lname,'').'</right></a>';
                        echo '<a id="base_style"><left>First Name:</left><right>'.form_input($acct_fname,'').'</right></a>';
                        echo '<a id="base_style"><left>Middle Name:</left><right>'.form_input($acct_mname,'').'</right></a>';
                        echo '<a id="base_style"><left>Address:</left><right>'.form_textarea($acct_address,'').'</right></a>';
                        echo '<a id="base_style"><left>Contact Number:</left><right>'.form_input($acct_contactno,'').'</right></a>';
                        echo '<a id="base_style"><left>Company:</left><right>'.form_input($acct_company,'').'</right></a>';
                        
                        echo '<span id="adm_prof_buttons" style="visibility:hidden">';
                        echo '<button class="btn_edtsave" id="adm_edt_prof">Save Changes</button>';
                        echo '<button class="btn_edtsave" id="adm_cancel_prof">Cancel</button>';
                        echo '</span>';
                        
                    echo '</span>';
               echo '</div>';
               
                echo '<div class="acct_act_info" id="adm_acct">';
                    echo '<header style="background-color:#9EA7AD">Account Information<toggle_min id="toggle_acct">-</toggle_min>';
                    echo '<button_1 class="prof_edt" id="adm_manage_acct">Manage</button_1>';
                    echo '</header>';
                    echo '<span id="adm_acct_cont">';
                        echo '<a id="base_style"><left>Username:</left><right>'.form_input($acct_username,'').'</right></a>';
                        echo '<a id="base_style"><left>User level:</left><right>'.form_input($acct_level,'').'</right></a>';
                        
                        echo '<span id="adm_changePass" style="display:none;">';
                            echo '<button class="btn_edtsave" id="adm_change_pass">Reset Password</button>';
                            echo '<button class="btn_edtsave" id="adm_cancel_pass">Cancel</button>';
                        echo '</span>';
                    echo '</span>';
               echo '</div>';
               
               
               //new account
            $acct_nlname=array('name'=>'acct_nlname','id'=>'acct_nlname','class'=>'txt_styles_2');
            $acct_nfname=array('name'=>'acct_nfname','id'=>'acct_nfname','class'=>'txt_styles_2');
            $acct_nmname=array('name'=>'acct_nmname','id'=>'acct_nmname','class'=>'txt_styles_2');
            $acct_naddress=array('name'=>'acct_naddress','id'=>'acct_naddress','class'=>'txt_styles_2','style'=>'height:100px; max-height:100px');
            $acct_ncontactno=array('name'=>'acct_ncontactno','id'=>'acct_ncontactno','class'=>'txt_styles_2');
            $acct_ncompany=array('name'=>'acct_ncompany','id'=>'acct_ncompany','class'=>'txt_styles_2');
            $acct_nusername=array('name'=>'acct_nusername','id'=>'acct_nusername','class'=>'txt_styles_2');
            $acct_nlevels=array('1'=>'Admin','2'=>'Normal User');
            $lvl_js="id='acct_nlvl'";
            
            echo '<div class="acct_act_info" id="adm_new_acct">';
                    echo '<header style="background-color:#9EA7AD">Basic and Account Information';
                    echo '<button_1 class="prof_edt" id="adm_edit_prof">Edit Profile</button_1>';
                    echo '</header>';
                    echo '<span id="acct_prof_cont">';
                        echo '<a id="base_style"><left>Username:</left><right>'.form_input($acct_nusername,'').'</right></a>';
                        echo '<a id="base_style"><left>User level:</left><right>'.form_dropdown('acct_nlvl',$acct_nlevels,'1',$lvl_js).'</right></a>';
                        
                        echo '<a id="base_style"><left>Last Name:</left><right>'.form_input($acct_nlname,'').'</right></a>';
                        echo '<a id="base_style"><left>First Name:</left><right>'.form_input($acct_nfname,'').'</right></a>';
                        echo '<a id="base_style"><left>Middle Name:</left><right>'.form_input($acct_nmname,'').'</right></a>';
                        echo '<a id="base_style"><left>Address:</left><right>'.form_textarea($acct_naddress,'').'</right></a>';
                        echo '<a id="base_style"><left>Contact Number:</left><right>'.form_input($acct_ncontactno,'').'</right></a>';
                        echo '<a id="base_style"><left>Company:</left><right>'.form_input($acct_ncompany,'').'</right></a>';
                    echo '</span>';
                    
                    echo '<span id="adm_newacct_buttons">';
                        echo '<button class="btn_edtsave" id="adm_new_acctsave">Register</button>';
                        echo '<button class="btn_edtsave" id="adm_new_acctcancel">Cancel</button>';
                    echo '</span>';
                        
               echo '</div>';
               
               
            echo '</div>';
            //----------------------------------------hazard mgt-----------------------------------------------------
            $haz_name=array('name'=>'haz_name','id'=>'haz_name','class'=>'txt_styles_1');
            $haz_desc=array('name'=>'haz_desc','id'=>'haz_desc','class'=>'txt_styles_1','style'=>'height:100px; max-height:100px');
            $hazlgnd_drpdwn=array('name'=>'hazlgnd_drpdwn','id'=>'hazlgnd_drpdwn','class'=>'txt_styles_1_2');
            $hazlgnd_name=array('name'=>'hazlgnd_name','id'=>'hazlgnd_name','class'=>'txt_styles_1_2');
            $hazlgnd_lvl=array('name'=>'hazlgnd_lvl','id'=>'hazlgnd_lvl','readonly'=>'readonly','disabled'=>'true','class'=>'txt_styles_1_2');
            $hazlgnd_desc=array('name'=>'hazlgnd_desc','id'=>'hazlgnd_desc','class'=>'txt_styles_1_2','style'=>'height:100px; max-height:100px');
            
            echo '<div class="haz_rock_soil_mgt" id="haz_mgt">';
                echo '<header>Geologic Hazard Map Settings</header>';
                echo '<div class="base haz_rock_soil_info" id="haz_info_base" onmouseover="edt_new_icon_mousehover(\'new_haz_info\', \'edit_haz_info\')" onmouseout="edt_new_icon_mouseleave(\'new_haz_info\', \'edit_haz_info\')">';
                
                echo '<header style="background-color:#f2f2f2; border-radius:0px; color:#888888;" id="geo_haz_info">';
                    echo '<toggle_min id="toggle_haz_info">-</toggle_min>';
                    echo '<stat id="haz_stat" title="Status">Active</stat>'; 
                    echo '<new_btn id="new_haz_info" title="New GeoHazard Information"></new_btn>';
                    echo '<edit_btn id="edit_haz_info" title="Edit GeoHazard Information" onclick="haz_edt_btn_click(\'edit_haz_info\')"></edit_btn>';
                echo 'Geologic Hazard Information</header>';
                
                echo '<left_arr id="haz_info_left"></left_arr>';
                echo '<right_arr id="haz_info_right"></right_arr>';
                
                echo '<span id="haz_info_cont">';
                    echo '<a id="base_style"><left>GeoHazard Name:</left>'.'<right>'.form_input($haz_name,'').'</right></a>';
                    echo '<a id="base_style"><left style="margin-top:5px;">GeoHazard Description:</left>'.'<right id="hazdesc">'.br(1).form_textarea($haz_desc,'').'</right></a>';
                    echo '<a id="base_style" class="haztbl"><left id="lbl_lvl">'.br(1).'GeoHazard Levels:</left><right id="haz_tbl">'.br(1).'<lgnd_base>'.
                         '<table id="haz_lvl" style="border:solid 1px #c1c1c1"></table>'.'</lgnd_base></right></a>';
                    
                    echo '<a style="margin-left:13%; margin-top:0%; margin-bottom:0%" id="a_haz">';
                    echo '<form id="haz_info_form" method="post" action="" enctype="multipart/form-data">';
                        echo '<input type="file" id="f_edit_haz_img1" name="f_edit_haz_img1" style="display:none"/>';
                        echo '<input type="file" id="f_edit_haz_img2" name="f_edit_haz_img2" style="display:none"/>';
                        echo '<input type="file" id="f_edit_haz_img3" name="f_edit_haz_img3" style="display:none"/>';
                       
                        echo '<div class="haz_rock_soil_img" id="edt_h_img1" onmouseover="img_mousehover(\'1\', \'edit_haz_img1\', \'rem_haz_img1\')" onmouseout="img_mouseleave(\'edit_haz_img1\', \'rem_haz_img1\')">'; // 
                         echo '<div class="img_edit_btn" id="edit_haz_img1" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_haz_img1" title="Remove Image">Remove</div>';
                         echo '<img name="haz_info_img1" id="haz_info_img1"></img>';
                        echo '</div>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_h_img2" onmouseover="img_mousehover(\'1\', \'edit_haz_img2\', \'rem_haz_img2\')" onmouseout="img_mouseleave(\'edit_haz_img2\', \'rem_haz_img2\')">'; // 
                         echo '<div class="img_edit_btn" id="edit_haz_img2" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_haz_img2" title="Remove Image">Remove</div>';
                         echo '<img name="haz_info_img2" id="haz_info_img2"></img>';
                        echo '</div>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_h_img3" onmouseover="img_mousehover(\'1\', \'edit_haz_img3\', \'rem_haz_img3\')" onmouseout="img_mouseleave(\'edit_haz_img3\', \'rem_haz_img3\')">'; //
                         echo '<div class="img_edit_btn" id="edit_haz_img3" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_haz_img3" title="Remove Image">Remove</div>';
                         echo '<img name="haz_info_img3" id="haz_info_img3"></img>';
                        echo '</div>';
                      
                        echo '<div class="edit_loading_bar" id="haz_info_loading_bar"></div>';
                        echo '<a class="haz_btn">';
                            echo '<input type="submit" id="save_haz" class="btn_edtsave" value="Save Changes"/>';
                            echo '<button id="cancel_haz" class="btn_edtsave" onclick="haz_cancel_btn_click(\'1\', \'cancel_haz\')">Cancel</button>';
                        echo '</a>';
                    
                    echo '</form>';
                    echo '</a>';
                echo '</span>';
            echo '</div>';
            
            echo '<div class="base haz_rock_soil_info" id="haz_lgnd_base" onmouseover="edt_new_icon_mousehover(\'new_haz_lgnd\', \'edit_haz_lgnd\')" onmouseout="edt_new_icon_mouseleave(\'new_haz_lgnd\', \'edit_haz_lgnd\')">';
            echo '<header style="background-color:#f2f2f2; border-radius:0px; color:#888888;" id="geo_haz_lgnd">';
                     echo '<toggle_min id="toggle_haz_legnd">-</toggle_min>';
                    echo '<stat id="hazlgnd_stat" title="Status">Active</stat>';
                    echo '<new_btn id="new_haz_lgnd" title="New GeoHazard Legend"></new_btn>';
                    echo '<edit_btn id="edit_haz_lgnd" title="Edit GeoHazard Legend" onclick="haz_edt_btn_click(\'edit_haz_lgnd\')"></edit_btn>';
                echo 'Hazard Legend</header>';
                
                echo '<left_arr id="haz_lgnd_left"></left_arr>';
                echo '<right_arr id="haz_lgnd_right"></right_arr>';
                
                echo '<span id="haz_legnd_cont">';
                /*echo '<a id="base_style"><left style="text-align:right;">Select GeoHazard:'.nbs(3).'</left>';
                    
                    echo '<right><button id="haz_name_button"></button>';
                        echo '<ul id="haz_name_selector">';
                            echo '<a style="font-style:italic; color:#acacac;  font-size:12px; font-family:Calibri; margin-top:-2px" id="haz_name_li;">'.'---GeoHazard---'.'</a>';
                        echo '</ul>';
                    echo '</right>';*/
                    echo '<a id="base_style"><left>Select Geohazard</left><right><select id="haz_drpwdwn"></select></right></a>';
                
                    echo '<a id="base_style"><left>Legend Name:</left>'.'<right>'.form_input($hazlgnd_name,'').'</right></a>';
                    echo '<a id="base_style"><left>Legend Level:</left>'.'<right>'.form_input($hazlgnd_lvl,'').'</right></a>';
                    
                     echo '<a id="base_style"><left>Legend Color:</left>'.'<right><input type="text" id="hazlgnd_clr" readonly="readonly" onclick="hazlgnd_clr(\'hazlgnd_clr\',\'hazlgnd_clr_right\')"><div id="hazlgnd_clr_right"></div></input></left></a>';
                    echo '<a id="base_style"><left>Legend Description:</left>'.'<right>'.form_textarea($hazlgnd_desc,'').'</right></a>';
                    echo '<a style="margin-left:12%; margin-top:1%; margin-bottom:3%">';
                    
                    echo '<form id="haz_lgnd_form" method="post" action="" enctype="multipart/form-data">';
                        echo '<input type="file" id="f_edit_hazlgnd_img1" name="f_edit_hazlgnd_img1" style="display:none"/>';
                        echo '<input type="file" id="f_edit_hazlgnd_img2" name="f_edit_hazlgnd_img2" style="display:none"/>';
                        echo '<input type="file" id="f_edit_hazlgnd_img3" name="f_edit_hazlgnd_img3" style="display:none"/>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_hlgnd_img1" onmouseover="img_mousehover(\'2\', \'edit_hazlgnd_img1\', \'rem_hazlgnd_img1\')" onmouseout="img_mouseleave(\'edit_hazlgnd_img1\', \'rem_hazlgnd_img1\')">'; //
                         echo '<div class="img_edit_btn" id="edit_hazlgnd_img1" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_hazlgnd_img1" title="Remove Image">Remove</div>';
                         echo '<img name="haz_lgnd_img1" id="haz_lgnd_img1"></img>';
                        echo '</div>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_hlgnd_img2" onmouseover="img_mousehover(\'2\', \'edit_hazlgnd_img2\', \'rem_hazlgnd_img2\')" onmouseout="img_mouseleave(\'edit_hazlgnd_img2\', \'rem_hazlgnd_img2\')">'; // 
                         echo '<div class="img_edit_btn" id="edit_hazlgnd_img2" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_hazlgnd_img2" title="Remove Image">Remove</div>';
                         echo '<img name="haz_lgnd_img2" id="haz_lgnd_img2"></img>';
                        echo '</div>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_hlgnd_img3" onmouseover="img_mousehover(\'2\', \'edit_hazlgnd_img3\', \'rem_hazlgnd_img3\')" onmouseout="img_mouseleave(\'edit_hazlgnd_img3\', \'rem_hazlgnd_img3\')">';//
                         echo '<div class="img_edit_btn" id="edit_hazlgnd_img3" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_hazlgnd_img3" title="Remove Image">Remove</div>';
                         echo '<img name="haz_lgnd_img3" id="haz_lgnd_img3"></img>';
                        echo '</div>';
                    
                        echo '<div class="edit_loading_bar" id="haz_lgnd_loading_bar"></div>';
                        echo '<a class="haz_btn">';
                        echo '<input type="submit" class="btn_edtsave" id="save_haz_lgnd" value="Save Changes"/>';
                        echo '<button id="cancel_haz_lgnd" class="btn_edtsave" style="margin-left:0.20%" onclick="haz_cancel_btn_click(\'2\', \'cancel_haz_lgnd\')">Cancel</button>';
                        echo '</a>';
                    echo '</form>';
                    echo '</a>';
                echo '</span>';
            echo '</div>';
            echo '</div>';//end haz_mgt
        
            
            //----------------------------------------rock mgt-----------------------------------------------------
            $rock_legnd=array('name'=>'rock_legnd','id'=>'rock_legnd','class'=>'txt_styles_1');//acronym
            $rock_name=array('name'=>'rock_name','id'=>'rock_name','class'=>'txt_styles_1');//meaning
            $rock_desc=array('name'=>'rock_desc','id'=>'rock_desc','class'=>'txt_styles_1','placeholder'=>'No description','style'=>'height:100px; max-height:100px');//desc2
            $rock_agev=array('name'=>'rock_agev','id'=>'rock_agev','class'=>'txt_styles_1');
            $rock_age=array('name'=>'rock_age','id'=>'rock_age','class'=>'txt_style_3');//1_2
            $rock_groupv=array('name'=>'rock_groupv','id'=>'rock_groupv','class'=>'txt_styles_1','placeholder'=>'No group');
            $rock_group=array('name'=>'rock_group','id'=>'rock_group','class'=>'txt_style_3');//1_2
            
            //-----rock type information
            echo '<div class="base haz_rock_soil_mgt" id="rock_mgt">';
                echo '<header>Rock Map Settings</header>';
                
                echo '<div class="base haz_rock_soil_info" id="haz_rock_base" onmouseover="edt_new_icon_mousehover(\'new_rock_info\', \'edit_rock_info\')" onmouseout="edt_new_icon_mouseleave(\'new_rock_info\', \'edit_rock_info\')">';
                    echo '<header style="background-color:#f2f2f2; border-radius:0px; color:#888888" id="rock_info">';
                    echo '<toggle_min id="toggle_rock_info">-</toggle_min>';
                    echo '<stat id="rock_stat" title="Status"></stat>';
                    echo '<new_btn id="new_rock_info" title="New Rock Information"></new_btn>';
                    echo '<edit_btn id="edit_rock_info" title="Edit Rock Type Information" onclick="haz_edt_btn_click(\'edit_rock_info\')"></edit_btn>';
                echo 'Rock Type Information</header>';
                
                echo '<left_arr id="rock_info_left"></left_arr>';
                echo '<right_arr id="rock_info_right"></right_arr>';
                
                echo '<span id="rock_info_cont">';
                    echo '<a id="base_style"><left>Rock Type Legend:</left>'.'<right>'.form_input($rock_legnd,'').'</right></a>';
                    echo '<a id="base_style"><left>Rock Type Name:</left>'.'<right>'.form_input($rock_name,'').'</right></a>';
                    echo '<a id="base_style"><left id="lbl_rdesc">Rock Description:</left>'.'<right id="rdesc">'.form_textarea($rock_desc,'').'</right></a>';
                    echo '<rockage_1 style="visibility:visible; display:block"><a id="base_style"><left>Rock Age:</left>'.'<right>'.form_input($rock_agev,'').'</right></a></rockage_1>';  //for viewing
                    echo '<rockage_2 style="visibility:hidden; display:none"><a id="base_style"><left>Rock Age:</left>'
                    .'<right>'.'<select id="rock_age_drpdwn"></select>'.'</right></a></rockage_2>';
                    echo '<rockgroup_1 style="visibility:visible; display:block"><a id="base_style"><left>Rock Group:</left>'.'<right>'.form_input($rock_groupv,'').'</right></a></rockgroup_1>';  //for viewing
                    echo '<rockgroup_2 style="visibility:hidden; display:none"><a id="base_style"><left>Rock Group:</left>'
                    .'<right>'.'<select id="rock_group_drpdwn"></select>'.'</right></a></rockgroup_2>';
                    echo '<a id="base_style"><left>Legend Color:</left>'.'<right><input type="text" id="rock_clr" readonly="readonly" onclick="hazlgnd_clr(\'rock_clr\', \'rock_clr_right\')"><div id="rock_clr_right"></div></input></left></a>';
                    
                    echo '<a style="margin-left:12%; margin-top:1%; margin-bottom:3%">';
                    echo '<form id="rock_info_form" method="post" action="" enctype="multipart/form-data">';
                        echo '<input type="file" id="f_edit_rock_img1" name="f_edit_rock_img1" style="display:none"/>';
                        echo '<input type="file" id="f_edit_rock_img2" name="f_edit_rock_img2" style="display:none"/>';
                        echo '<input type="file" id="f_edit_rock_img3" name="f_edit_rock_img3" style="display:none"/>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_rock_img1" onmouseover="img_mousehover(\'4\', \'edit_rock_img1\', \'rem_rock_img1\')" onmouseout="img_mouseleave(\'edit_rock_img1\', \'rem_rock_img1\')">'; //
                         echo '<div class="img_edit_btn" id="edit_rock_img1" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_rock_img1" title="Remove Image">Remove</div>';
                         echo '<img name="rock_img1" id="rock_img1"></img>';
                        echo '</div>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_rock_img2" onmouseover="img_mousehover(\'4\', \'edit_rock_img2\', \'rem_rock_img2\')" onmouseout="img_mouseleave(\'edit_rock_img2\', \'rem_rock_img2\')">'; //
                         echo '<div class="img_edit_btn" id="edit_rock_img2" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_rock_img2" title="Remove Image">Remove</div>';
                         echo '<img name="rock_img2" id="rock_img2"></img>';
                        echo '</div>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_rock_img3" onmouseover="img_mousehover(\'4\', \'edit_rock_img3\', \'rem_rock_img3\')" onmouseout="img_mouseleave(\'edit_rock_img3\', \'rem_rock_img3\')">'; //
                         echo '<div class="img_edit_btn" id="edit_rock_img3" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_rock_img3" title="Remove Image">Remove</div>';
                         echo '<img name="rock_img3" id="rock_img3"></img>';
                        echo '</div>';
                        
                        echo '<div class="edit_loading_bar" id="rock_loading_bar"></div>';
                        echo '<a class="haz_btn">';
                        echo '<input type="submit" class="btn_edtsave" id="save_rock_info" value="Save Changes"/>';
                        echo '<button class="btn_edtsave" id="cancel_rock_info" style="margin-left:0.20%" onclick="haz_cancel_btn_click(\'2\', \'cancel_rock_info\')">Cancel</button>';
                        echo '</a>';
                    echo '</form>';
                    echo '</a>';   
                echo '</span>';
            echo '</div>';
            
            //-----rock sructures
            $rock_struct_name=array('name'=>'rock_struct_name','id'=>'rock_struct_name','class'=>'txt_styles_1');
            $rock_struct_desc=array('name'=>'rock_struct_desc','id'=>'rock_struct_desc','class'=>'txt_styles_1','style'=>'height:100px; max-height:100px');
            
            echo '<div class="base haz_rock_soil_info" id="rock_struct_base" onmouseover="edt_new_icon_mousehover(\'new_rock_struct\', \'edit_rock_struct\')" onmouseout="edt_new_icon_mouseleave(\'new_rock_struct\', \'edit_rock_struct\')">';
                echo '<header style="background-color:#f2f2f2; border-radius:0px; color:#888888">';
                    echo '<toggle_min id="toggle_struct_group">-</toggle_min>';
                    echo '<stat id="struct_stat" title="Status"></stat>';
                    echo '<new_btn id="new_rock_struct" title="New Rock Structure Information"></new_btn>';
                    echo '<edit_btn id="edit_rock_struct" title="Edit Rock Structure Type Information" onclick="haz_edt_btn_click(\'edit_rock_struct\')"></edit_btn>';
                echo 'Rock Structures Information</header>';
                    
                echo '<left_arr id="rock_struct_left"></left_arr>';
                echo '<right_arr id="rock_struct_right"></right_arr>';
                
                echo '<span id="rock_struct_cont">';
                    echo '<a id="base_style"><left>Rock Structure:</left>'.'<right>'.form_input($rock_struct_name,'').'</right></a>';
                    echo '<a id="base_style"><left>Description:</left>'.'<right id="rStructDesc">'.form_textarea($rock_struct_desc,'').'</right></a>';
                    echo '<a id="base_style"><left>Rock Structure Color:</left>'.'<right><input type="text" id="rock_struct_clr" readonly="readonly" onclick="hazlgnd_clr(\'rock_struct_clr\', \'rock_struct_clr_right\')"><div id="rock_struct_clr_right"></div></input></left></a>';
                    
                    echo '<a style="margin-left:12%; margin-top:1%; margin-bottom:3%">';
                    echo '<form id="rock_struct_form" method="post" action="" enctype="multipart/form-data">';
                        echo '<input type="file" id="f_edit_rock_struct_img1" name="f_edit_rock_struct_img1" style="display:none"/>';
                        echo '<input type="file" id="f_edit_rock_struct_img2" name="f_edit_rock_struct_img2" style="display:none"/>';
                        echo '<input type="file" id="f_edit_rock_struct_img3" name="f_edit_rock_struct_img3" style="display:none"/>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_rock_struct_img1" onmouseover="img_mousehover(\'4\', \'edit_rock_struct_img1\', \'rem_rock_struct_img1\')" onmouseout="img_mouseleave(\'edit_rock_struct_img1\', \'rem_rock_struct_img1\')">'; //
                         echo '<div class="img_edit_btn" id="edit_rock_struct_img1" name="hello" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_rock_struct_img1" title="Remove Image">Remove</div>';
                         echo '<img name="rock_struct_img1" id="rock_struct_img1"></img>';
                        echo '</div>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_rock_struct_img2" onmouseover="img_mousehover(\'4\', \'edit_rock_struct_img2\', \'rem_rock_struct_img2\')" onmouseout="img_mouseleave(\'edit_rock_struct_img2\', \'rem_rock_struct_img2\')">'; //
                         echo '<div class="img_edit_btn" id="edit_rock_struct_img2" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_rock_struct_img2" title="Remove Image">Remove</div>';
                         echo '<img name="rock_struct_img2" id="rock_struct_img2"></img>';
                        echo '</div>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_rock_struct_img3" onmouseover="img_mousehover(\'4\', \'edit_rock_struct_img3\', \'rem_rock_struct_img3\')" onmouseout="img_mouseleave(\'edit_rock_struct_img3\', \'rem_rock_struct_img3\')">'; //
                         echo '<div class="img_edit_btn" id="edit_rock_struct_img3" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_rock_struct_img3" title="Remove Image">Remove</div>';
                         echo '<img name="rock_struct_img3" id="rock_struct_img3"></img>';
                        echo '</div>';
                    
                        echo '<div class="edit_loading_bar" id="rock_struct_loading_bar"></div>';
                        echo '<a class="haz_btn">';
                            echo '<input type="submit" class="btn_edtsave" id="save_rock_struct_info" value="Save Changes"/>';
                            echo '<button class="btn_edtsave" id="cancel_rock_struct_info" style="margin-left:0.20%" onclick="haz_cancel_btn_click(\'2\', \'cancel_rock_struct_info\')">Cancel</button>';
                        echo '</a>';
                    echo '</form>';
                    echo '</a>';
                echo '</span>';
                //echo '</span>';
            echo '</div>';
            
            //-----rock age
            echo '<div class="base haz_rock_soil_info" id="rock_age_base">';
                echo '<header style="background-color:#f2f2f2; border-radius:0px; color:#888888">';
                    echo '<toggle_min id="toggle_rock_age">-</toggle_min>';
                echo 'Rock Age</header>';
                echo '<span id="rock_age_cont">';
                    echo '<a id="base_style"><left>Rock Age:</left>'.'<right>'.form_input($rock_age,'').'<button class="btn_edtsave" id="save_rock_age" style="width:19%;">Add</button></right></a>';
                    echo '<a id="base_style"><left></left><right><div class="age_group_header">List of Rock Age</div><table class="rock_group_ageList" id="rock_ageList"></table></right></a>';
                  //  echo '<a id="base_style"><div id="e"></div></a>';
                echo '</span>';
            echo '</div>';
    
   
            //-----rock group
            echo '<div class="base haz_rock_soil_info" id="rock_group_base">';
                echo '<header style="background-color:#f2f2f2; border-radius:0px; color:#888888">';
                    echo '<toggle_min id="toggle_rock_group">-</toggle_min>';
                echo 'Rock Groups</header>';
                echo '<span id="rock_group_cont">';
                    echo '<a id="base_style"><left>Rock Group:</left>'.'<right>'.form_input($rock_group,'').'<button class="btn_edtsave" id="save_rockgroup" style="width:19%;">Add</button></right></a>';
                    echo '<a id="base_style"><left></left><right><div class="age_group_header">Rock Groups</div><table class="rock_group_ageList" id="rock_groupList"></table></right></a>';
                  //  echo '<a id="base_style"><div id="f"></div></a>';
                echo '</span>';
            echo '</div>';
    echo '</div>'; //end base_1
        
        //----------------------------------------soil mgt-----------------------------------------------------
        $soil_name=array('id'=>'soil_name','name'=>'soil_name','class'=>'txt_styles_1');
        $soil_desc=array('id'=>'soil_desc','name'=>'soil_desc','class'=>'txt_styles_1','style'=>'height:100px; max-height:100px');
        $soil_layer1=array('id'=>'soil_layer1', 'name'=>'soil_layer1', 'class'=>'txt_styles_1', 'readonly'=>'true', 'placeholder'=>'No layer(s)');
        $soil_layer2=array('id'=>'soil_layer2', 'name'=>'soil_layer2', 'class'=>'txt_styles_1', 'readonly'=>'true', 'placeholder'=>'No layer(s)');
        $soil_layer3=array('id'=>'soil_layer3', 'name'=>'soil_layer3', 'class'=>'txt_styles_1', 'readonly'=>'true', 'placeholder'=>'No layer(s)');
        $soil_layer4=array('id'=>'soil_layer4', 'name'=>'soil_layer4', 'class'=>'txt_styles_1', 'readonly'=>'true', 'placeholder'=>'No layer(s)');
        
        //-----soil legend
        echo '<div class="base haz_rock_soil_mgt" id="soil_mgt">';
            echo '<header>Soil Map Settings</header>';   
            echo '<div class="base haz_rock_soil_info" id="soillgnd_base" onmouseover="edt_new_icon_mousehover(\'new_soil_lgnd\', \'edit_soil_lgnd\')" onmouseout="edt_new_icon_mouseleave(\'new_soil_lgnd\', \'edit_soil_lgnd\')">';
                echo '<header style="background-color:#f2f2f2; border-radius:0px; color:#888888" id="rock_info">';
                    echo '<toggle_min id="toggle_soil_info">-</toggle_min>';
                    echo '<stat id="soillayer_stat" title="Status"></stat>';
                    echo '<new_btn id="new_soil_lgnd" title="New Soil Legend"></new_btn>';
                    echo '<edit_btn id="edit_soil_lgnd" title="Edit Soil Legend" onclick="haz_edt_btn_click(\'edit_soil_lgnd\')"></edit_btn>';
                echo 'Soil Map Legend Information</header>';
                
                echo '<left_arr id="soillgnd_left"></left_arr>';
                echo '<right_arr id="soillgnd_right"></right_arr>';
                
                echo '<span id="soillgnd_cont">';
                    echo '<a id="base_style"><left>Soil Map Legend:</left>'.'<right>'.form_input($soil_name,'').'</right></a>';
                    echo '<a id="base_style"><left id="lbl_rdesc">Soil Description:</left>'.'<right id="rdesc">'.form_textarea($soil_desc,'').'</right></a>';
                    echo '<a id="base_style"><left>Legend Color:</left>'.'<right><input type="text" id="soil_clr" readonly="readonly" onclick="hazlgnd_clr(\'soil_clr\', \'soil_clr_right\')"><div id="soil_clr_right"></div></input></left></a>';
                    echo '<a id="base_style" class="soil_layer1"><left>Layer One</left><right>'.form_input($soil_layer1,'Layer1').'</right></a>';
                    echo '<a id="base_style" class="soil_layer2"><left>Layer Two</left><right>'.form_input($soil_layer2,'Layer2').'</right></a>';
                    echo '<a id="base_style" class="soil_layer3"><left>Layer Three</left><right>'.form_input($soil_layer3,'Layer3').'</right></a>';
                    echo '<a id="base_style" class="soil_layer4"><left>Layer Four</left><right>'.form_input($soil_layer4,'Layer4').'</right></a>';
                    echo '<a id="base_style" class="first_layer" style="display:none"><left>Layer One</left><right><select id="soilSymbol_drpdwn1" class="soil_layer_drpdwn"></select><button class="btn_edtsave" id="addLayer_1" style="width:auto">Add Soil Composition</button></right>';
                    echo '<div id="soillayer_cont1" class="symbol_cont"></div>';
                    echo '<a id="base_style" class="second_layer" style="display:none"><left>Layer Two</left><right><select id="soilSymbol_drpdwn2" class="soil_layer_drpdwn"></select><button class="btn_edtsave" id="addLayer_2" style="width:auto">Add Soil Composition</button></right>';
                    echo '<div id="soillayer_cont2" class="symbol_cont"></div>';
                    echo '<a id="base_style" class="third_layer" style="display:none"><left>Layer Three</left><right><select id="soilSymbol_drpdwn3" class="soil_layer_drpdwn"></select><button class="btn_edtsave" id="addLayer_3" style="width:auto">Add Soil Composition</button></right>';
                    echo '<div id="soillayer_cont3" class="symbol_cont"></div>';
                    echo '<a id="base_style" class="fourth_layer" style="display:none"><left>Layer Four</left><right><select id="soilSymbol_drpdwn4" class="soil_layer_drpdwn"></select><button class="btn_edtsave" id="addLayer_4" style="width:auto">Add Soil Composition</button></right>';
                    echo '<div id="soillayer_cont4" class="symbol_cont"></div>';
                    
                    echo '<a style="margin-left:12%; margin-top:1%; margin-bottom:3%">';
                    echo '<form id="soil_form" method="post" action="" enctype="multipart/form-data">';
                        echo '<input type="file" id="f_edit_soil_img1" name="f_edit_soil_img1" style="display:none"/>';
                        echo '<input type="file" id="f_edit_soil_img2" name="f_edit_soil_img2" style="display:none"/>';
                        echo '<input type="file" id="f_edit_soil_img3" name="f_edit_soil_img3" style="display:none"/>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_soil_img1" onmouseover="img_mousehover(\'5\', \'edit_soil_img1\', \'rem_soil_img1\')" onmouseout="img_mouseleave(\'edit_soil_img1\', \'rem_soil_img1\')">'; //
                         echo '<div class="img_edit_btn" id="edit_soil_img1" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_soil_img1" title="Remove Image">Remove</div>';
                         echo '<img name="soil_img1" id="soil_img1"></img>';
                        echo '</div>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_soil_img2" onmouseover="img_mousehover(\'5\', \'edit_soil_img2\', \'rem_soil_img2\')" onmouseout="img_mouseleave(\'edit_soil_img2\', \'rem_soil_img2\')">'; //
                         echo '<div class="img_edit_btn" id="edit_soil_img2" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_soil_img2" title="Remove Image">Remove</div>';
                         echo '<img name="soil_img2" id="soil_img2"></img>';
                        echo '</div>';
                        
                        echo '<div class="haz_rock_soil_img" id="edt_soil_img3" onmouseover="img_mousehover(\'5\', \'edit_soil_img3\', \'rem_soil_img3\')" onmouseout="img_mouseleave(\'edit_soil_img3\', \'rem_soil_img3\')">'; //
                         echo '<div class="img_edit_btn" id="edit_soil_img3" title="Edit Image">Edit</div>';
                         echo '<div class="img_rem_btn" id="rem_soil_img3" title="Remove Image">Remove</div>';
                         echo '<img name="soil_img3" id="soil_img3"></img>';
                        echo '</div>';
                        
                        echo '<div class="edit_loading_bar" id="rock_loading_bar"></div>';
                        echo '<a class="haz_btn">';
                            echo '<input type="submit" class="btn_edtsave" id="save_soil_lgnd" value="Save Changes"/>';
                            echo '<button class="btn_edtsave" id="cancel_soil_lgnd" style="margin-left:0.20%" onclick="haz_cancel_btn_click(\'2\', \'cancel_soil_lgnd\')">Cancel</button>';
                        echo '</a>';
                    echo '</form>';
                    echo '</a>';
                echo '</span>';
            echo '</div>';
            
            
            //-----soil symbols
            $soil_symbol1=array('name'=>'soil_symbol1','id'=>'soil_symbol1','class'=>'txt_style_3');
            
            echo '<div class="base haz_rock_soil_info" id="soil_symbol_base">';
                echo '<header style="background-color:#f2f2f2; border-radius:0px; color:#888888">';
                    echo '<toggle_min id="toggle_soil_symbol">-</toggle_min>';
                echo 'Soil Compositions</header>';
                
                echo '<span id="soil_symbol_cont">';
                    echo '<a id="base_style"><left>Soil Composition:</left>'.'<right>'.form_input($soil_symbol1,'').'<button class="btn_edtsave" id="save_soilsym" style="width:19%;">Add</button></right></a>';
                    echo '<a id="base_style"><left></left><right><div class="age_group_header">Soil Composition</div><table class="rock_group_ageList" id="soil_sym_list"></table></right></a>';
                   // echo '<a id="base_style"><div id="i"></div></a>';
                echo '</span>';
            echo '</div>';
    echo '</div>';//end base haz rock soil mgt
    echo '</div>';
echo '</div>';
}
?>