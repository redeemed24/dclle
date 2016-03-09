<?php    
    echo '<html>';
        echo '<head>';
            echo link_tag(base_url().'css/wysiwyg_print.css');
            echo '<script src="'.base_url().'js/jquery-1.10.2.js"></script>';
        echo '</head>';
        echo '<body onload="window.print()">';
            echo '<table>';
                echo '<thead><tr><th>';
                    echo '<img src="'.base_url().'images/MGB_LOGO.PNG"></div>';
                echo '</th></tr></thead>';
                echo '<tbody><tr><td>';
                    foreach($info as $row){
                        echo '<div id="content_cert" style="height:670px; margin-top:40px;">'.$row->cert_content.'</div>';
                    }
                echo '</td></tr></tbody>';
                echo '<tfoot><tr><td>';
                    echo '<div id="print_footer">MINING SHALL BE PRO-PEOPLE AND PRO-ENVIRONMENT IN SUSTAINING WEALTH CREATION AND IMPROVED QUALITY OF LIFE</div>';
                echo '</td></tr></tfoot>';
            echo '</table>';
        echo '</body>';
    echo '</html>';


?>