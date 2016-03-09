<?php if(!defined('BASEPATH')) exit('No direct access allowed');

class Req_controller extends CI_Controller
{
    function save_request()
    {
        $client_id=$this->input->post('client_id');
        $c_lat=$this->input->post('c_lat');
        $c_lng=$this->input->post('c_lng');
        $area=$this->input->post('area');
        $req_stat=$this->input->post('req_stat');
        $f_file=$this->input->post('f_file');
        
        $this->load->model('req_model');
        $req_id=$this->req_model->saveRequest($client_id,$c_lat,$c_lng,$area,$req_stat);
        echo json_encode($req_id);
    }
    
    function change_req_stat()
    {
        $req_id=$this->input->post('reqid');
        $this->load->model('req_model');
        $this->req_model->changeReqStat($req_id);
    }
    
    function del_r()
    {
        $req_id=$this->input->post('reqid');
        $this->load->model('req_model');
        $this->req_model->delReq($req_id);
    }
    
    function cancel_r()
    {
        $req_id=$this->input->post('req_id');
        $this->load->model('req_model');
        $this->req_model->cancelRequest($req_id);
    }
    
    function save_reqFiles($req_id,$u_id,$file_stat)
    {
        $status="";
        $msg="";
        
        if($status!='error')
        {
            $config['upload_path'] = '../uploads/request_files/';
            $config['allowed_types'] = 'jpg|jpeg|png||doc||docx||pdf';
            $config['max_size'] = 204800;
            
            $this->load->library('upload',$config);
            
            if(!empty($_FILES['userfile']['name']))
            {
                if(!$this->upload->do_upload('userfile'))
                {
                    $status='error';
                    $msg=$this->upload->display_errors('','');
                }
                else
                {
                    $data=$this->upload->data('userfile');
                    $this->load->model('req_model');
                    $file_id=$this->req_model->saveRequestFiles($req_id,$u_id,$data['file_name'],$file_stat);
                    
                    if($file_id)
                    {
                        $status="success";
                        $msg="File successfully uploaded";
                    }
                    else
                    {
                        unlink($data['full_path']);
                        $status='error';
                        $msg='Something went wrong when saving the file, please try again.';
                    }
                }
            }
        }
        echo json_encode(array('status'=>$status,'msg'=>$msg,'fileid'=>$file_id,'filename'=>$data['file_name']));
    }
    
    function update_r()
    {
        $req_id=$this->input->post('r_id');
        $lat=$this->input->post('lat');
        $lng=$this->input->post('lng');
        $area=$this->input->post('area');
        $this->load->model('req_model');
        $this->req_model->updateCoor($req_id,$lat,$lng,$area);
    }
    
    function remove_file()
    {
        $file_id=$this->input->post('file_id');
        $this->load->model('req_model');
        $this->req_model->removeFile($file_id);
    }
    
    function change_rem_file_stat($fileid)
    {
        $this->load->model("req_model");
        $this->req_model->changeRemFileStat($fileid);
    }
    
    function den_r()
    {
        $reqid=$this->input->post('reqid');
        $this->load->model('req_model');
        $this->req_model->denRequest($reqid);
    }
    
    function get_r()
    {
        $user=$this->input->post('user');
        $ulvl=$this->input->post('ulvl');
        $this->load->model('req_model');
        $res=$this->req_model->getRequests($user,$ulvl);
        echo json_encode($res);
    }
    
    function get_f()
    {
        $r_id=$this->input->post('r_id');
        $this->load->model('req_model');
        $res=$this->req_model->getFiles($r_id);
        echo json_encode($res);
    }
    
    function check_r()
    {
        $user=$this->input->post('user');
        $ulvl=$this->input->post('ulvl');
        $this->load->model('req_model');
        $res=$this->req_model->checkRequests($ulvl,$user);
        echo json_encode($res);
    }
    
    function view_r()
    {
        $user=$this->input->post('user');
        $ulvl=$this->input->post('ulvl');
        $this->load->model('req_model');
        $this->req_model->viewRequests($ulvl,$user);
    }
    
    function req_app()
    {
        $r_id=$this->input->post('r_id');
        $this->load->model('req_model');
        $this->req_model->reqApprove($r_id);
    }
}
?>