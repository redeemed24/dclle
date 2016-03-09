<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Land_c1 extends CI_Controller{
    
    public function __construct(){
        parent::__construct();
        $this->load->model('land_m1');
        
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
    
    public function index(){
        
        //auto check
        $this->checkUL();
        
        $this->load->model('haz_model');
        $this->load->model('main_model');
        
        //reset land, rock and hazard in used
        $this->haz_model->resetHazardInUsed($this->session->userdata('username'));
        $this->main_model->resetMapInUsed($this->session->userdata('username'));
        
        $data['land_color']=$this->land_m1->land_getInfoM();
        $data['land_coor']=$this->land_m1->land_getCoorM();
        
        //hazard and maps
        $data['hazards'] = $this->haz_model->haz_getHazards();
        $data['map'] = $this->main_model->get_Map();
        $data['selectedm_name'] = $data['map'][1]['m_name'];
        $data['map_type'] = 3;
        //end of hazard and maps
        
        //chat
        $this->load->model('chat_m');
        $data['username'] = $this->chat_m->getUsernames(); //get online users
        
        //set land in used
        $this->main_model->setLandInUsed($this->session->userdata('username'));
        
        //request
        $data['files'] = $this->wysiwyg_m->getList();
        $data['year'] = $this->wysiwyg_m->getYear();
        
        $this->load->view('templates/header', $data);
        $this->load->view('editor/land_addType');
        $this->load->view('templates/footer',$data);
    }
    
    public function land_saveCoorC(){
        $polygonInfo = $this->input->post('polygonInfo');
        echo json_encode($polygonInfo);
        $this->land_m1->land_saveCoorM($polygonInfo);
        
        //last editor and update
        $this->land_m1->updateLandtbl($this->session->userdata('username'));
    }
    
    public function land_fromDb(){
        $land_coor = $this->land_m1->land_getCoorM();
        $land_count =0;
        $land_coorInfo = array();
        foreach($land_coor as $land_coordata){
            $land_coorInfo[$land_count] = array('mc_id'=>$land_coordata->mc_id,
                'mc_coordinates'=>$land_coordata->mc_coordinates,
                'ml_id'=>$land_coordata->ml_id);
            $land_count++;
        }
        
        echo json_encode($land_coorInfo);
    }
}

?>