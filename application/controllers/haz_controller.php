<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Haz_controller extends CI_Controller{
    
    function __construct(){
        parent::__construct();
        
        $this->load->model('wysiwyg_m');
        $this->load->model('chat_m');
        define('FPDF_FONTPATH',$this->config->item('fonts_path'));
        $this->load->library('fpdflib');
        $this->load->model('fpdf');
    }
    
    function checkUL()
    {
        if($this->session->userdata('userlevel')!=1 || $this->session->userdata('login')!=1)
            redirect('main_controller');
    }
    
    function index()
    {
        $this->checkUL();//check user
        
        $this->load->model('haz_model');
        $this->load->model('main_model');
        
        //reset hazard in used
        $this->haz_model->resetHazardInUsed($this->session->userdata('username'));
        $this->main_model->resetMapInUsed($this->session->userdata('username'));
        
        $haz_data['hazards'] = $this->haz_model->haz_getHazards();
        $haz_data['haz_data'] = $this->haz_model->haz_getHazardLevels($haz_data['hazards'][0]['h_id']);
        $haz_data['selectedh_id'] = $haz_data['hazards'][0]['h_id'];
        $haz_data['selectedh_name'] = $haz_data['hazards'][0]['h_name'];
        $haz_data['map_type'] = 1;
        
        //other maps
         $haz_data['map'] = $this->main_model->get_Map();
        //end of other maps
        
        //chat
        $this->load->model('chat_m');
        $haz_data['username'] = $this->chat_m->getUsernames(); //get online users
        
        //set hazard in used
        $this->haz_model->setHazardInUsed($this->session->userdata('username'),$haz_data['hazards'][0]['h_id']);
        
        //request
        $haz_data['files'] = $this->wysiwyg_m->getList();
        $haz_data['year'] = $this->wysiwyg_m->getYear();
        
        $this->load->view('templates/header',$haz_data);
        $this->load->view('editor/haz_editor',$haz_data);
        $this->load->view('templates/footer',$haz_data);
    }
    
    function haz_editor($h_id)
    {
        $this->checkUL();//check user
        
        $this->load->model('haz_model');
        $this->load->model('main_model');
        
        //reset hazard in used
        $this->haz_model->resetHazardInUsed($this->session->userdata('username'));
        
        $haz_data['hazards'] = $this->haz_model->haz_getHazards();
        $haz_data['haz_data'] = $this->haz_model->haz_getHazardLevels($h_id);
        $haz_data['selectedh_id'] = $h_id;
        
        $haz_data['selectedh_name']="";
        for($x=0;$x<count($haz_data['hazards']);$x++)
        {
            if($haz_data['hazards'][$x]['h_id']==$h_id)
                $haz_data['selectedh_name'] = $haz_data['hazards'][$x]['h_name'];
        }
            
        $haz_data['map_type'] = 1;
        
        //other maps
         $haz_data['map'] = $this->main_model->get_Map();
        //end of other maps
        
        //chat
        $this->load->model('chat_m');
        $haz_data['username'] = $this->chat_m->getUsernames(); //get online users
        
        //set hazard in used
        $this->haz_model->setHazardInUsed($this->session->userdata('username'),$h_id);
        
        //request
        $haz_data['files'] = $this->wysiwyg_m->getList();
        $haz_data['year'] = $this->wysiwyg_m->getYear();
        
        $this->load->view('templates/header',$haz_data);
        $this->load->view('editor/haz_editor',$haz_data);
        $this->load->view('templates/footer',$haz_data);
    }
    
    function haz_save($h_id)
    {
        $inhc_coordinates = $this->input->post('inhc_coordinates');
        $inhl_id = $this->input->post('inhl_id');
        $inhc_shape = $this->input->post('inhc_shape');
        
        $uphc_coordinates = $this->input->post('uphc_coordinates');
        $uphl_id = $this->input->post('uphl_id');
        $uphc_id = $this->input->post('uphc_id');
        
        $delhc_id = $this->input->post('delhc_id');
        
        $this->load->model('haz_model');
        
        //inserting
       if($inhc_coordinates)
       {
            for($x=0;$x<count($inhc_coordinates);$x++)
            { $this->haz_model->haz_saveToDb($inhc_coordinates[$x], $inhl_id[$x], $h_id, $inhc_shape[$x]); }//coordinates, level, h_id, hc_shape
       }
        
        //updating
        if($uphc_coordinates)
        {
            for($x=0;$x<count($uphc_coordinates);$x++)
            { $this->haz_model->haz_updateDb($uphc_coordinates[$x], $uphl_id[$x], $uphc_id[$x]); }//coordinates, level, hc_id
        }
        
        //deleting
        if($delhc_id)
        {
            for($x=0;$x<count($delhc_id);$x++)
            { $this->haz_model->haz_delete($delhc_id[$x]); }
        }
        
        //last update and editor
        $this->haz_model->updateHazardtbl($this->session->userdata('username'),$h_id);
    }
    
    function haz_getFromDb($h_id)
    {
        $this->load->model('haz_model');
        $haz_data = $this->haz_model->haz_getFromDb($h_id);
        echo json_encode($haz_data);
    }
}
?>