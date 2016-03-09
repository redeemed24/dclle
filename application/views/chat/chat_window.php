<?php
    /***************************CONVERSATION INFO********************************/
    
    $convo_id = array();
    foreach($convo_info_1 as $row){
        $data = array('username_chat'=>$row->peer_2, 'convo_id'=> $row->conv_id);
        $convo_id[0] = $row->conv_id;
        $this->session->set_userdata($data);
    }
    
    foreach($convo_info_2 as $row){
        $convo_id[1] = $row->conv_id;    
    }
    
    /************************WINDOW TITLE***********************************/
    $title;
    $fname; $lname; $status;
    
    foreach($chat_info as $row){
        $fname = str_replace("%20", " ",$row['fname']);
        $lname = str_replace("%20", " ",$row['lname']);
        
        $status = $row['status'];
        $convo_id[2]=$status;
        $title = $fname.' '.$lname;
    }
    
     /************************ANCHOR ATTRIBUTES***********************************/
     
    $id = 0; // anchor id (for javascript)
    
?>
    <div id = "overlay">
    <?php
        $attributes = array('id' => 'form_upload');
        echo form_open_multipart('chat_c/upload', $attributes);
    ?>
        <div id = "files_button">
            <input type="file" id = "file_0"  multiple name="userfile[]" size="20"/>
        </div>
        <input type="submit" value="upload" />
        </form>
    </div>
    
    <?php
            echo doctype();
            echo '<head>';
            echo '<title>'.$title.'</title>';
            
            echo link_tag(base_url().'css/chat_w.css');
            echo '<script src="'.base_url().'js/jquery-1.10.2.js"></script>';
            echo '<script src="'.base_url().'js/chat_window.js"></script>';
            echo '<script>
                    var base_url = "'.base_url().'";
                    chatWith('.json_encode($convo_id).');
                  </script>';
            
            echo '</head>';
            echo '<div id = "received" class = "received_pop"></div>';
            echo    '<div id = "textWrap" class = "text_pop">
                        <textarea id = "text" placeholder= "Type to compose."></textarea>
                        <input type = "submit" id = "send" value = "" title="send"/>
                        <button id = "submit_file" title = "submit file"></button>
                    </div>';
?>

<div id = "uploader_file"></div>
<div id = "error_file"></div>