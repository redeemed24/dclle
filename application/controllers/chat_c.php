<?php
class Chat_c extends CI_Controller{
     
    public function __construct(){
        parent::__construct();
        $this->load->model('chat_m');
    }
        
    public function openWin($fname, $lname, $username, $status){ // read thread (either in new window or not)
        $data['chat_info'][] = array("fname"=>$fname, "lname"=>$lname, "username"=>$username, "status"=>$status);
                
        $data['convo_info_1'] = $this->chat_m->checkConvo($username, $this->session->userdata('username')); //fetch conversation info 
        $data['convo_info_2'] = $this->chat_m->checkConvo($this->session->userdata('username'), $username); // fetch conversation
        
        $this->load->view('chat/chat_window', $data); // window for thread   
    }
    
    /********************************************* INVOKED THROUGH JAVASCRIPT ***********************************************************/
    
    public function upOnline(){ //set status online
        echo json_encode($this->chat_m->online());
    }
    
    public function upOffline(){ //set status offline
         echo json_encode($this->chat_m->offline());
    }
    
    public function getUsers(){ // get all users
        echo json_encode($this->chat_m->getUsernames());
    }
    
    public function saveMess(){ // save message
        $message = $this->input->post('message');
        $convo_id = $this->input->post('convo_id');
        echo json_encode($message);
        echo json_encode($convo_id);
        
        $this->chat_m->saveMess($this->session->userdata('username'), $message, $convo_id , 0);
        //$this->chat_m->saveMess($this->session->userdata('username'), $message, $this->session->userdata('convo_id'), 0);
    }
            
    public function setMess(){ // set message seen
        $conv_id = $this->input->post('conversationID');
        echo json_encode($conv_id);
        $this->chat_m->setMess($conv_id);
    }
        
    public function getChat(){
        $time = $this->input->post('time');
        $conv_1 = $this->input->post('conv_1');
        $conv_2 = $this->input->post('conv_2');
        $conv_3 = $this->input->post('conv_3');
        
        echo json_encode($this->chat_m->getMess($time, $conv_1, $conv_2, $conv_3));
    }
     
    public function getMessages_old(){ // messages offline
        echo json_encode($this->chat_m->getMessages());
    }
    
    public function getMessages_new(){ //messages online
        echo json_encode($this->chat_m->appearMessage());
    }
    
    /********************************************* UPLOAD FILES ***********************************************************/
    public function upload(){
        $this->load->library('upload');

        $files = $_FILES;
        $cpt = count($_FILES['userfile']['name']);
        
        for($i=0; $i<$cpt; $i++){

            $_FILES['userfile']['name']= $files['userfile']['name'][$i];
            $_FILES['userfile']['type']= $files['userfile']['type'][$i];
            $_FILES['userfile']['tmp_name']= $files['userfile']['tmp_name'][$i];
            $_FILES['userfile']['error']= $files['userfile']['error'][$i];
            $_FILES['userfile']['size']= $files['userfile']['size'][$i];    

        $this->upload->initialize($this->set_upload_options());
        $this->upload->do_upload();
        
        $upload_data = $this->upload->data();
        
        if($upload_data['file_name']!= null){
            $link = $upload_data['file_name'];
            $this->chat_m->saveMess($this->session->userdata('username'), $link, $this->session->userdata('convo_id'), 1); // save path to db
        }
        }
    }
    
    private function set_upload_options(){   
        
        $config = array();
        $config['upload_path'] = '../uploads/';
        $config['allowed_types'] = 'jpg|png|pdf|doc|docx|txt';
        $config['max_size']      = '0';
        $config['overwrite']     = FALSE;


        return $config;
    }
    
}
?>