<?php

if($this->session->userdata('login')==1)
{
?>

    <button id = "onlineGeo"></button>
    <div id = "onlineMax">
        <button id = "headerMax">
            <?php    
                if($this->session->userdata('userlevel')==1){
                    echo 'Chat Client';
                }
            
                else{
                    echo 'Chat Geologist';
                }
            ?>
        </button>
    
    <ul>
        <?php
            $id = 0; // anchor id used for javascript
            foreach ($username as $row){
                echo '<li>';
                echo '<div id = "anchor_'.$id.'">';
                    echo '<div id = "name" class = "anchor" title = "'.$row->fname." ".$row->lname.'">';
                    echo '<div id = "countMess_'.$id.'" class = "countMess"></div>';
                    echo $row->fname." ".$row->lname;
                    echo '</div>';
                echo '</div>';
                echo '</li>';
                
                $id++;
            }
        ?>
        </ul>
    </div>

<?php
}

if($this->session->userdata('login')==1)
{
    //request
    $req_lat=array('name'=>'req_lat','id'=>'req_lat','class'=>'req_inputField_styles');
    $req_lng=array('name'=>'req_lng','id'=>'req_lng','class'=>'req_inputField_styles');
    $req_area=array('name'=>'req_area','id'=>'req_area','class'=>'req_area','readonly'=>'readonly');
    
    echo '<div id="req_container"></div>';
    echo '<div id="req_base">';
         echo '<div id="req_header">';
            echo '<label>New Request Form</label>';
            echo '<req_closeButton title="Close">X</req_closeButton>';
            echo '<span>';
                echo '<div class="req_inputFields_cont"/>';
                echo '<label id="lbl_lat">Lat</label>'.form_input($req_lat);
                echo '<label id="lbl_lng">Lng</label>'.form_input($req_lng);
                echo '</div>';
                echo '<div class="req_inputFields_cont"/>';
                echo '<label id="lbl_area">Area</label>'.form_input($req_area);
                echo '<button class="req_btn3" id="req_app">Add Files</button>';
                echo '</div>';
                echo '<div id="prt_2" style="display:none">';
                echo '<div class="req_files_header">Files Uploaded</div>';
                echo '<form id="frm_req_files" method="post" action="">';
                echo '<input type="file" name="userfile" id="req_files" style="display:none">';
                echo '<button id="req_files_btn">Choose and Upload File</button>';
                echo '<div id="" class="req_files_cont">';
                echo '</div>';
                echo '</form>';
                echo '<button class="req_btn3" id="cancel_request">Cancel Request</button>';
                echo '<button class="req_btn3" id="send_request">Submit Request</button>';
            echo '</span>';
            echo '</div>';
            echo '</div>';
    echo '</div>';//end req_base
    
    echo '<div id="appBase">';
        echo '<div id="app_header"><app_closeButton title="Close">X</app_closeButton></div>';
        echo '<div id="editor"></div>';//editor here
        echo '<div id="app_btn_span"><button class="app_button" id="app_send">Approve and Send</button><button class="app_button" id="app_den">Save as Draft</button></div>';
    echo '</div>';
    
   /* echo '<div id="denBase"><header onclick="hideDenMsg()" title="Close">X</header>';
        echo '<span id="den_msg"></span>';
    echo '</div>';*/
    
    echo '<div class="req_left_cont">';
     if($this->session->userdata('userlevel')==1)
        echo '<header><div class="new_req" id="file_mgt" title="View All Certificates">View All Certificates</div><div id="close_left_cont" title="Close">X</div></header>';
    else
        echo '<header><div class="new_req" id="new_req" title="New Request">New Request</div><div id="close_left_cont" title="Close">X</div></header>';
    echo '<div class="req_left_cont_base"></div>';
    echo '</div>';
    //end request

    //file mgt
    echo '<div id="cert_files" style="visibility:none"></div>';
            echo '<div id="cert_wrap">';
            echo '<div id="cert_header"><label>List of Certificates</label><div id="close_files">X</div></div>';
                $options_month = array('Month','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
                $count_year = 1;
                $options_year[0] = 'Year';
                foreach($year as $row){
                    $options_year[$count_year++] = $row->cert_year;
                }
                
                $files_drpdwn='id="file_drpdwn"';
                
                echo '<div id="note_span">*click search button to refresh table</div><span>'.form_dropdown('file_month', $options_month);
                echo form_dropdown('file_year', $options_year);
                echo '<button id= "search_files">Search</button><button id = "print_reports" title="Print"></button></span>';
                
                //echo '<div id="certwrap_table" class="cert_table"></div>';
                echo '<div id = "cert_list">';
                    echo '<div class="cert_table">';
                        echo '<table><tr><th>Title</th><th>Client</th><th>Geologist</th><th>Date</th></tr>';
                            foreach($files as $row){
                                if($row->cert_issend==1){
                                    echo '<tr>';
                                }
                                
                                else{
                                    echo '<tr class="files_draft">';
                                }
                                
                                        $atts = array('width'=>'500', 'height'=>'400', 'scrollbars'=>'yes', 'titlebar'=>'no','resizable'=>'no', 'class'=>'file_link');
                                        echo '<td>'.anchor_popup('wysiwyg_c/load_pop/'.$row->req_id,$row->cert_filename,$atts).'</td>';
                                        echo '<td>'.$row->client_fname.' '.$row->client_lname.'</td>';
                                        echo '<td>'.$row->geo_fname.' '.$row->geo_lname.'</td>';
                                        echo '<td>'.$row->cert_date.'</td>'; 
                                    echo '</tr>';  
                            }
                        echo '</table>';
                    echo '</div>';
                echo '</div>';
                
            echo '</div>';
   // echo '</div>';
}


echo '</div>';//container
echo '</div>';//main

echo '</body>';
echo '</html>';
?>