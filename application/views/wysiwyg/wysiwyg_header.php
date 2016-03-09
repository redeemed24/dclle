<?php
    echo doctype();    
    echo '<head>';
        echo link_tag(base_url().'css/wysiwyg.css');
        echo link_tag(base_url().'css/wysiwyg_print.css');
        echo '<script src="'.base_url().'js/jquery-1.10.2.js"></script>';
        echo '<script type = "text/javascript" src="'.base_url().'js/tinymce/tinymce.min.js"></script>';
        echo '<script>var base_url="'.base_url().'"; </script>';
        echo '<script type = "text/javascript" src="'.base_url().'js/wysiwyg.js"></script>'; // exclude main header
        echo '<script>SetReqId('.json_encode($request_id).')</script>';
        //echo '<script type = "text/javascript" src="'.base_url().'js/file_mgt.js"></script>'; // add to main header
    echo '</head>';
    echo '<body>';
?>