<?php
        echo '<div id="cert_files">';
            echo '<div id="cert_wrap">';
            echo '<button id = "close_files" title="esc"></button>';
                
                $options_month = array('Month','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
                
                $count_year = 1;
                $options_year[0] = 'Year';
                foreach($year as $row){
                    $options_year[$count_year++] = $row->cert_year;
                }
                
                
                echo form_dropdown('file_month', $options_month);
                echo form_dropdown('file_year', $options_year);
                echo '<button id= "search_files">Search</button>';
                echo '<button id = "print_reports" title="print"></button>';
                
                echo '<div id="certwrap_table" class="cert_table"><table><tr><td>Title</td><td>Client</td><td>Geologist</td><td>Date</td></tr></table></div>';
                echo '<div id = "cert_list">';
                    echo '<div class="cert_table">';
                        echo '<table>';
                        echo '<tr></tr>';
                            foreach($files as $row){
                                if($row->cert_issend==1){
                                    echo '<tr>';
                                }
                                
                                else{
                                    echo '<tr class="files_draft">';
                                }
                                
                                        $atts = array('width'=>'500', 'height'=>'400', 'scrollbars'=>'yes', 'titlebar'=>'no','resizable'=>'no', 'class'=>'file_link');
                                        echo '<td>'.anchor_popup('wysiwyg_c/load_update/'.$row->cert_id,$row->cert_filename,$atts).'</td>';
                                        echo '<td>'.$row->client_fname.' '.$row->client_lname.'</td>';
                                        echo '<td>'.$row->geo_fname.' '.$row->geo_lname.'</td>';
                                        echo '<td>'.$row->cert_date.'</td>'; 
                                    echo '</tr>';  
                            }
                        echo '</table>';
                    echo '</div>';
                echo '</div>';
                
            echo '</div>';
        echo '</div>';
        
    echo '</body>';

echo '</html>';
?>