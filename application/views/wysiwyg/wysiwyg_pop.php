<?php
$save=array('name'=>'submit','value'=>'Send','id'=>'send_cert');
            
            /***************************************UPLOAD CERT******************************************************************/
                 echo form_open_multipart('wysiwyg_c/upload_cert/'.$request_id.'/0', array('id'=>'upload_cert'));
                   echo '<fieldset>';
                        echo '<legend>Upload Certificate</legend>';
                        echo '<input type="file" name="userfile"/>';
                        echo '<input type="submit" value="Send" />';
                   echo '</fieldset>';
                echo '</form>';
          
            
            /***************************************CREATE CERT******************************************************************/
            echo '<div id ="wysi_div">';
                 echo form_open('wysiwyg_c/add_data/'.$request_id, array('id'=>'wysi_pop'));
                    echo '<fieldset>';
                        echo '<legend>Edit Certificate</legend>';
                        
                        echo 'Client '.form_input(array('style'=>'width:20%','id'=>'wysi_input', 'readonly'=>'yes'), $client_name);
                        echo '<span id="file_title">Title '.form_input(array('style'=>'width:80%','name'=>'wysi_input', 'id'=>'wysi_input')).'</span>';
                        
                        $atts_textarea = array('name'=>'wysi_textarea','id'=>'wysi_textarea');
                        echo form_textarea($atts_textarea);
                        
                        echo '<div id="cert_buttons">';
                          echo form_submit('submit','Save');
                          echo form_submit('submit','Send');
                        echo '</div>';
                     echo '</fieldset>'; 
                 echo form_close();
            echo '</div>';
            
        echo '</body>';
     echo '</html>';
?>