<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Main_controller extends CI_Controller{
    
    function __construct(){
        parent::__construct();
        
        $this->load->model('wysiwyg_m');
        $this->load->model('chat_m');
        define('FPDF_FONTPATH',$this->config->item('fonts_path'));
        $this->load->library('fpdflib');
        $this->load->model('fpdf');
        
    }
    
    function index()
    {
        $this->load->model('main_model');
        
        $data['map_type'] = null;
        $data['selected'] = "Select a Map";
        $data['hazards'] = $this->main_model->get_Hazards();
        $data['map'] = $this->main_model->get_Map();
        $data['e_type'] = null;
        $data['s_id'] = 0;
        
        if($this->session->userdata('login')==1)//logged in so load chat
        {
            $this->load->model('chat_m');
            $data['username'] = $this->chat_m->getUsernames(); //get online users
          
            //request  
            $data['files'] = $this->wysiwyg_m->getList();
            $data['year'] = $this->wysiwyg_m->getYear();
            
            $this->load->view('templates/header',$data);
            $this->load->view('evaluator/evaluator');
            $this->load->view('templates/footer',$data);
        }
        else//not logged in so do not load chat
        {
            $this->load->view('templates/header',$data);
            $this->load->view('evaluator/evaluator');
            $this->load->view('templates/footer');
        }
    }
    
    function select_map($map_id,$haz_id)
    {
        $this->load->model('main_model');
        
        $data['map_type'] = null;
        $data['hazards'] = $this->main_model->get_Hazards();
        $data['map'] = $this->main_model->get_Map();
        
        if(is_numeric($map_id) && !is_numeric($haz_id))//map
        {
            $data['selected']="";
            for($x=0;$x<count($data['map']);$x++)
            {
                if($data['map'][$x]['m_id'] == $map_id)
                {
                    $data['selected'] = $data['map'][$x]['m_name'];
                }
            }
                
            $data['mlegend'] = $this->main_model->getMapLegends($map_id);
            $data['e_type'] = 2;
            $data['s_id'] = $map_id;
        }
        elseif(is_numeric($haz_id) && !is_numeric($map_id))//hazard
        {
            $data['selected']="";
            for($x=0;$x<count($data['hazards']);$x++)
            {
                if($data['hazards'][$x]['h_id'] == $haz_id)
                {
                    $data['selected'] = $data['hazards'][$x]['h_name'];
                }
            }
            
            $data['hlvl'] = $this->main_model->getHazardLevels($haz_id);
            $data['e_type'] = 1;
            $data['s_id'] = $haz_id;
        }
        else
        {
            $data['selected'] = 'Select a Map';
            $data['e_type'] = null;
            $data['s_id'] = 0;
        }
        
        if($this->session->userdata('login')==1)//logged in so load chat
        {
            $this->load->model('chat_m');
            $data['username'] = $this->chat_m->getUsernames(); //get online users
            
            //request
            $data['files'] = $this->wysiwyg_m->getList();
            $data['year'] = $this->wysiwyg_m->getYear();
            
            $this->load->view('templates/header',$data);
            $this->load->view('evaluator/evaluator');
            $this->load->view('templates/footer',$data);
        }
        else//not logged in so do not load chat
        {
            $this->load->view('templates/header',$data);
            $this->load->view('evaluator/evaluator');
            $this->load->view('templates/footer');
        }
    }
    
    //AJAX
    function getRocks()
    {
        $this->load->model('main_model');
        $data = $this->main_model->getRocks();
        echo json_encode($data);
    }
    
    function getLand()
    {
        $this->load->model('main_model');
        $data = $this->main_model->getLand();
        echo json_encode($data);
    }
    
    function getHazardCoors()
    {
        $this->load->model('main_model');
        $data = $this->main_model->getHazardCoors();
        echo json_encode($data);
    }
    
    function getHazLvlSum()
    {
        $this->load->model('main_model');
        $data = $this->main_model->getHazLvlSum();
        echo json_encode($data);
    }
    
    function dispHazardCoors($haz_id)
    {
        $this->load->model('main_model');
        $data = $this->main_model->dispHazardCoors($haz_id);
        echo json_encode($data);
    }
    
    function dispMapCoors($map_id)
    {
        $this->load->model('main_model');
        $data = $this->main_model->dispMapCoors($map_id);
        echo json_encode($data);
    }
    
    function getInfoHazard()
    {
        $this->load->model('main_model');
        $data  =$this->main_model->get_Hazards();
        echo json_encode($data);
    }
}
?>