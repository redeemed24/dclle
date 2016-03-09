<?php
class Login extends CI_Controller{
    
    public function __construct(){
        parent::__construct();
        $this->load->model('chat_m');
    }
    
    public function checkAccount(){
       
        $data['account'] = $this->chat_m->checkAccount($this->input->post('username'), $this->input->post('password'));
       
        if($data['account']!=null)
        {             
            foreach($data['account'] as $row){
               $user_info = array('username'=>$row->username,
                                  'userlevel'=>$row->user_lvl,
                                  'login'=>1);
            }
            
            $this->session->set_userdata($user_info); // set session
            
            $data['username'] = $this->chat_m->getUsernames($this->session->userdata('userlevel')); //send userlevel if geologist or client
            echo 'true';
        }
        else
        {
            echo 'false';
        }
    }
    
    public function logout(){
        if($this->session->userdata('userlevel')==1)//if geologist
        {
            $this->load->model('haz_model');
            $this->load->model('main_model');
            $this->haz_model->resetHazardInUsed($this->session->userdata('username'));
            $this->main_model->resetMapInUsed($this->session->userdata('username'));
        }
        
        $this->chat_m->offline(); //set isonline to 0
        $this->session->sess_destroy();
        redirect('main_controller');
    }
}
?>