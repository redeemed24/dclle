<?php

class Wysiwyg_c extends CI_Controller{
    
    public function __construct(){
        parent::__construct();
        $this->load->model('wysiwyg_m');
        $this->load->model('chat_m');
        define('FPDF_FONTPATH',$this->config->item('fonts_path'));
        $this->load->library('fpdflib');
        $this->load->model('fpdf');
    }
    
    /****************************************************FILE_MGT*******************************************************************************/
        public function getSearch(){ // search by month and year
            $year = $this->input->post('year');
            $month = $this->input->post('month');
            
            echo json_encode($this->wysiwyg_m->getFiles($month, $year));
        }
        
        public function printReports($month, $year){ // print reports pdf
            $data['print'] = $this->wysiwyg_m->printReports($month, $year);
            $this->load->view('print/print_reports', $data);
        }
    
    /*****************************************************WYSIWYG***********************************************************************/
        public function setEditable($req_id){ // set editable to zero
            $this->wysiwyg_m->setReqStat($req_id, 0);
        }
        
        public function load_pop($req_id){
            $cert['info'] = $this->wysiwyg_m->getInfo($req_id); // check if cert has been made
                $is_file = 0;
                $content = "";
                foreach($cert['info'] as $row){ // get is file stat
                    $is_file = $row->is_file;
                    $content = $row->cert_content;
                }
            
            $data['request_id'] = $req_id;
            $data['client_name'] = $this->wysiwyg_m->getClientName($req_id); 
            
            $data['result'] = $this->wysiwyg_m->getReqStat($req_id); // get cert stat
            
            foreach($data['result'] as $row){
                if($row->e_stat ==0 || $row->req_stat == 1){ // if cert is not edited by somebody or cert is ready to print
                    if($is_file == 0){ // if not an uploaded file
                        if($cert['info']==null){ // if not 
                            $this->load->view('wysiwyg/wysiwyg_header', $data);
                            $this->load->view('wysiwyg/wysiwyg_pop', $data);
                        }
                        
                        else{ // if has
                            $this->load_update($req_id);
                        }
                        
                        $this->wysiwyg_m->setReqStat($req_id, 1); // set cert to uneditable
                    }
                    
                    else{
                        echo '<a href="http://localhost/dclle/uploads/cert/'.$content.'">Click to open file.</a>';
                    }
                }
                
                else{
                    echo 'Unable to open this file. Somebody is editing the content. Try to open this later';
                }       
            }
        }
        
        public function load_update($req_id){ // get info for update or client view mode of certificate
            $data['info'] = $this->wysiwyg_m->getInfo($req_id);
            $data['request_id'] = $req_id;
            
            foreach($data['info'] as $row){
                
                if($row->cert_issend==0){ // can be updated
                    $this->load->view('wysiwyg/wysiwyg_header', $data);
                    $this->load->view('wysiwyg/wysiwyg_update', $data);
                }
                
                else{
                    $this->load->view('wysiwyg/print_cert', $data);
                }
            }
        }
        
        public function add_data($req_id){ // insert
            $this->wysiwyg_m->insertContent($req_id); 
            redirect(base_url().'index.php/wysiwyg_c/load_pop/'.$req_id, 'refresh');
        }
        

        public function update_data($cert_id){ // save updated data
            $this->wysiwyg_m->updateContent($cert_id);
            redirect(base_url().'index.php/wysiwyg_c/load_pop/'.$cert_id, 'refresh');
        }
    
    /************************************************************UPLOAD CERT***********************************************************************/
    public function upload_cert($req_id, $update_create){ // upload certificate
        $config['upload_path'] = '../uploads/cert/';
	$config['allowed_types'] = 'pdf';
        $config['overwrite'] = FALSE;
	
        $this->load->library('upload', $config);
        $this->upload->do_upload();
        
        $upload_data = $this->upload->data();
        
        if($update_create==1){ // update
           $this->wysiwyg_m->up_cert($req_id, $upload_data['file_name']);
        }
        
        else{ // create
            $this->wysiwyg_m->cr_cert($req_id, $upload_data['file_name']);
        }
        
        redirect(base_url().'index.php/wysiwyg_c/load_pop/'.$req_id, 'refresh');
    }
}

?>