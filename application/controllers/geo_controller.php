<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Geo_controller extends CI_Controller{
    
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
    
    public function index() //change to getGeoCoordiantes
    {
        //auto check
        $this->checkUL();
        
        $this->load->model('haz_model');
        $this->load->model('main_model');
        $this->load->model('geo_model');
        
        //reset rock,soil,hazard in used
        $this->haz_model->resetHazardInUsed($this->session->userdata('username'));
        $this->main_model->resetMapInUsed($this->session->userdata('username'));
        
        $tmp1=$this->geo_model->geo_getLengends();
        $tmp2=$this->geo_model->geo_getStructLegends();
        
        $data=array('geo_legends'=>$this->geo_model->geo_getLengends(),
                    'geo_struct'=>$this->geo_model->geo_getStructLegends(),
                    'geo_f_color'=>$this->geo_model->geo_getLegendsFColor(),
                    'struct_f_color'=>$this->geo_model->geo_getStructFColor(),
                    'map_type'=>2);
        
        //hazard and maps
        $data['hazards'] = $this->haz_model->haz_getHazards();
        $data['map'] = $this->main_model->get_Map();
        $data['selectedm_name'] = $data['map'][0]['m_name'];
        //end of hazard and maps
        
        //chat
        $this->load->model('chat_m');
        $data['username'] = $this->chat_m->getUsernames(); //get online users
        
        //set rock in used
        $this->main_model->setRockInUsed($this->session->userdata('username'));
        
        //request
        $data['files'] = $this->wysiwyg_m->getList();
        $data['year'] = $this->wysiwyg_m->getYear();
        
        $this->load->view('templates/header',$data);
        $this->load->view('editor/geo_editor',$data);
        $this->load->view('templates/footer',$data);
    }
    
    function geo_saveCoor()
    {
        $this->load->model('geo_model');
        $geo_data=$this->input->post('geo_data');
        $geo_c=$this->input->post('geo_c');
        echo json_encode($geo_data);
        $this->geo_model->geo_saveCoor($geo_data,$geo_c);
        
        //last editor and update
        $this->geo_model->updateRocktbl($this->session->userdata('username'));
    }
    
    function geo_getPolygons()
    {
        $this->load->model('geo_model');
        $geo_data=$this->geo_model->geo_getPolygons();
        echo json_encode($geo_data);
    }
    
    function geo_getStructLegends()
    {
        $this->load->model('geo_model');
        $geo_structLegends=$this->geo_model->geo_getStructLegends();
        echo json_encode($geo_structLegends);
    }
    
    function check()
    {
        $tmp=$this->input->post('geo_data');
        echo json_encode($tmp);
    }
    
    function geo_getFirstGeoColor()
    {
        $this->load->model('geo_model');
        $data=array('geo_legendFColor'=>$this->geo_model->geo_getLegendsFColor(),
                    'geo_structFColor'=>$this->geo_model->geo_getStructFColor());
        echo json_encode($data);
    }
}

?>