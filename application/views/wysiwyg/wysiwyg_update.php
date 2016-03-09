<?php
            foreach($info as $row){
            /***************************************UPLOAD CERT******************************************************************/
                echo form_open_multipart('wysiwyg_c/upload_cert/'.$row->req_id.'/1', array('id'=>'upload_cert'));
                    echo '<fieldset>';
                        echo '<legend>Upload Certificate</legend>';
                        echo '<input type="file" name="userfile"/>';
                        echo '<input type="submit" value="Send" />';
                   echo '</fieldset>';
                echo '</form>';
            /***************************************CREATE CERT******************************************************************/
                echo '<div id ="wysi_div">';
                  echo form_open('wysiwyg_c/update_data/'.$row->req_id, array('id'=>'wysi_pop'));
                    echo '<fieldset>';
                       echo '<legend>Edit Certificate</legend>';
                       echo 'Client '.form_input(array('style'=>'width:20%','id'=>'wysi_input', 'readonly'=>'yes'),$row->client_fname.' '.$row->client_lname);
                       echo '<span id="file_title">Title '.form_input(array('style'=>'width:80%','name'=>'wysi_input', 'id'=>'wysi_input'), $row->cert_filename).'</span>';
                       
                       $atts_textarea = array('name'=>'wysi_textarea','id'=>'wysi_textarea');
                       echo form_textarea($atts_textarea, $row->cert_content);
                       
                       echo '<div id="cert_buttons">';
                            echo form_submit('submit','Save');
                            echo form_submit('submit','Send');
                        echo '</div>';
                    echo '</fieldset>'; 
                  echo form_close();
                echo '</div>';   
            }
        
        echo '</body>';
    echo '</html>';
?>