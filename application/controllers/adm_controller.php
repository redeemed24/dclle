<?php if(!defined('BASEPATH')) exit('No direct script access allowed');
class Adm_controller extends CI_Controller{
    
    // haz settings
    function get_haz_info()
    {
        $this->load->model('adm_model');
        $haz_info=$this->adm_model->getHazInfo();
        echo json_encode($haz_info);
    }
    
    function get_haz_drp_list($chk)
    {
        $this->load->model('adm_model');
        $haz_info=$this->adm_model->getHazDrpList($chk);
        echo json_encode($haz_info);
    }
    
    function get_haz_lvl($haz_id)
    {
        $this->load->model('adm_model');
        $haz_lvl=$this->adm_model->getHazLvl($haz_id);
        echo json_encode($haz_lvl);
    }
    
    function new_haz_info()
    {
        $this->load->model('adm_model');
        $haz_name=$this->input->post('haz_name');
        $haz_desc=$this->input->post('haz_desc');
        $l_editor=$this->input->post('l_editor');
        $res_id=$this->adm_model->newHazInfo($haz_name,$haz_desc,$l_editor);
        echo json_encode($res_id);
    }
    
    function new_hazlgnd()
    {
        $this->load->model('adm_model');
        $haz_id=$this->input->post('haz_id');
        $hazlgnd_name=$this->input->post('hazlgnd_name');
        $hazlgnd_lvl=$this->input->post('hazlgnd_lvl');
        $hazlgnd_clr=$this->input->post('hazlgnd_clr');
        $hazlgnd_desc=$this->input->post('hazlgnd_desc');
        $l_editor=$this->input->post('l_editor');
        $res_id=$this->adm_model->newHazLgnd($haz_id,$hazlgnd_name,$hazlgnd_lvl,$hazlgnd_clr,$hazlgnd_desc,$l_editor);
        echo json_encode($res_id);
    }
    
    function edit_haz_info()
    {
        $haz_id=$this->input->post('haz_id');
        $haz_name=$this->input->post('haz_name');
        $haz_desc=$this->input->post('haz_desc');
        $l_editor=$this->input->post('l_editor');
        $haz_image_stat=$this->input->post('haz_image_stat');
        $this->load->model('adm_model');
        $this->adm_model->editHazInfo($haz_id,$haz_name,$haz_desc,$l_editor,$haz_image_stat);
    }
    
    function edit_haz_lgnd()
    {
        $haz_id=$this->input->post('haz_id');
        $hazlgnd_id=$this->input->post('hazlgnd_id');
        $hazlgnd_name=$this->input->post('hazlgnd_name');
        $hazlgnd_lvl=$this->input->post('hazlgnd_lvl');
        $hazlgnd_clr=$this->input->post('hazlgnd_clr');
        $hazlgnd_desc=$this->input->post('hazlgnd_desc');
        $l_editor=$this->input->post('l_editor');
        $hazlgnd_img_stat=$this->input->post('hazlgnd_image_stat');
        $this->load->model('adm_model');
        $this->adm_model->editHazLgnd($haz_id,$hazlgnd_id,$hazlgnd_name,$hazlgnd_lvl,$hazlgnd_clr,$hazlgnd_desc,$l_editor,$hazlgnd_img_stat);
    }
    
    //change state
    
    function haz_change_state($haz_id,$stat)
    {
        $this->load->model('adm_model');
        $res_id=$this->adm_model->hazChangeStat($haz_id,$stat);
        echo json_encode($res_id);
    }
    
    function hazLgnd_change_state($hazLgnd_id,$stat)
    {
        $this->load->model('adm_model');
        $res_id=$this->adm_model->hazLgndChangeStat($hazLgnd_id,$stat);
        echo json_encode($res_id);
    }
    
    function rock_change_state($rock_id,$stat)
    {
        $this->load->model('adm_model');
        $res_id=$this->adm_model->rockChangeStat($rock_id,$stat);
        echo json_encode($res_id);
    }
    
    //rock map
    function get_rock_info()
    {
        $this->load->model('adm_model');
        $rock_info=$this->adm_model->getRockInfo();
        echo json_encode($rock_info);
    }
    
    function get_rock_struct()
    {
        $this->load->model('adm_model');
        $rock_struct=$this->adm_model->getRockStruct();
        echo json_encode($rock_struct);
    }
    
    function new_rock_info()
    {
        $rockname=$this->input->post('rockname');
        $rockdesc=$this->input->post('rockdesc');
        $rockdesc2=$this->input->post('rockdesc2');
        $rockclr=$this->input->post('rockclr');
        $ageid=$this->input->post('ageid');
        $groupid=$this->input->post('groupid');
        
        $this->load->model('adm_model');
        $res_id=$this->adm_model->newRockInfo($rockname,$rockdesc,$rockdesc2,$rockclr,$ageid,$groupid);
        echo json_encode($res_id);
    }
    
    function edit_rock_info()
    {
        $rockid=$this->input->post('rockid');
        $rockname=$this->input->post('rockname');
        $rockdesc=$this->input->post('rockdesc');
        $rockdesc2=$this->input->post('rockdesc2');
        $rockclr=$this->input->post('rockclr');
        $state=$this->input->post('state');
        $ageid=$this->input->post('ageid');
        $groupid=$this->input->post('groupid');
        $l_editor=$this->input->post('l_editor');
        $haz_image_stat=$this->input->post('haz_image_stat');
        
        $this->load->model('adm_model');
        $this->adm_model->editRockInfo($rockid,$rockname,$rockdesc,$rockdesc2,$rockclr,$state,$ageid,$groupid,$l_editor,$haz_image_stat); //$rockid,$rockname,$rockdesc,$rockdesc2,$rockclr,$state,$ageid,$groupid,$l_editor,$haz_image_stat
        echo 'success';
    }
    
    function edit_rock_struct()
    {
        $structid=$this->input->post('structid');
        $structname=$this->input->post('structname');
        $structdesc=$this->input->post('structdesc');
        $structclr=$this->input->post('structclr');
        $state=$this->input->post('state');
        $haz_img_stat=$this->input->post('haz_img_stat');
        
        $this->load->model('adm_model');
        $this->adm_model->editRockStruct($structid,$structname,$structdesc,$structclr,$state,$haz_img_stat);
        echo 'success';
    }
    
    function new_rock_struct()
    {
        $structname=$this->input->post('structname');
        $structdesc=$this->input->post('structdesc');
        $structclr=$this->input->post('structclr');
        
        $this->load->model('adm_model');
        $res_id=$this->adm_model->newRockStruct($structname,$structdesc,$structclr);
        echo json_encode($res_id);
    }
    
    function get_rock_age()
    {
        $this->load->model('adm_model');
        $rock_age=$this->adm_model->getRockAge();
        echo json_encode($rock_age);
    }
    
    function get_rock_group()
    {
        $this->load->model('adm_model');
        $rock_group=$this->adm_model->getRockGroup();
        echo json_encode($rock_group);
    }
    
    function new_rock_age()
    {
        $age=$this->input->post('rage');
        $this->load->model('adm_model');
        $this->adm_model->newRockAge($age);
    }
    
    function new_rock_group()
    {
        $group=$this->input->post('rgroup');
        $this->load->model('adm_model');
        $this->adm_model->newRockGroup($group);
    }
    
    function get_soil_info()
    {
        $this->load->model('adm_model');
        $soil_info=$this->adm_model->getSoilMapLegend();
        echo json_encode($soil_info);
    }
    
    function get_soil_symbol()
    {
        $this->load->model('adm_model');
        $soil_symbol=$this->adm_model->getSoilSymbols();
        echo json_encode($soil_symbol);
    }
    
    function soil_lgnd_edit()
    {
        $soilid=$this->input->post('soilid');
        $soilname=$this->input->post('soilname');
        $soildesc=$this->input->post('soildesc');
        $soilclr=$this->input->post('soilclr');
        $soilstate=$this->input->post('soilstate');
        $haz_image_stat=$this->input->post('haz_img_stat');
        $layerid=$this->input->post('layerid');
        $layer1=$this->input->post('layer1');
        $layer2=$this->input->post('layer2');
        $layer3=$this->input->post('layer3');
        $layer4=$this->input->post('layer4');
        $l_editor=$this->input->post('l_editor');
        
        $this->load->model('adm_model');
        $this->adm_model->soilLgndEdit($soilid,$soilname,$soildesc,$soilclr,$soilstate,$haz_image_stat,$layerid,$layer1,$layer2,$layer3,$layer4,$l_editor);
    }
    
    function new_soil_lgnd()
    {
        $soilname=$this->input->post('soilname');
        $soildesc=$this->input->post('soildesc');
        $soilclr=$this->input->post('soilclr');
        $soilstate=$this->input->post('s_state');
        $layer1=$this->input->post('layer1');
        $layer2=$this->input->post('layer2');
        $layer3=$this->input->post('layer3');
        $layer4=$this->input->post('layer4');
        
        $this->load->model('adm_model');
        $res_id=$this->adm_model->newSoilLayer($layer1,$layer2,$layer3,$layer4);
        $this->adm_model->newSoilLgnd($soilname,$soildesc,$soilclr,$soilstate,$res_id);
        echo json_encode($res_id);
    }
    
    function new_soil_symbol()
    {
        $sym_name=$this->input->post('sym_name');
        $this->load->model('adm_model');
        $this->adm_model->newSoilSymbol($sym_name);
    }
    
    //profile
    function get_user_prof()
    {
        $username = $this->input->post('username');
        $this->load->model('adm_model');
        $res=$this->adm_model->getUserProf($username);
        echo json_encode($res);
    }
    
    function edit_user_profile()
    {
        $username=$this->input->post('username');
        $prof_lname=$this->input->post('prof_lname');
        $prof_fname=$this->input->post('prof_fname');
        $prof_mname=$this->input->post('prof_mname');
        $prof_address=$this->input->post('prof_address');
        $prof_contactno=$this->input->post('prof_contactno');
        $prof_company=$this->input->post('prof_company');
        
        $this->load->model('adm_model');
        $this->adm_model->editUserProfile($username,$prof_lname,$prof_fname,$prof_mname,$prof_address,$prof_contactno,$prof_company);
    }
    
    function edit_password()
    {
        $username=$this->input->post('username');
        $curr_pass=$this->input->post('curr_pass');
        $new_pass=$this->input->post('new_pass');
        $chk=$this->input->post('chk');
        
        $this->load->model('adm_model');
        $res=$this->adm_model->changePass($username,$curr_pass,$new_pass,$chk);
        echo json_encode($res);
    }
    
    function search_account()
    {
        $u_name=$this->input->post('u_name');
        $this->load->model('adm_model');
        $res=$this->adm_model->searchAccount($u_name);
        echo json_encode($res);
    }
    
    function new_account()
    {
        $u_name=$this->input->post('u_name');
        $u_lvl=$this->input->post('u_lvl');
        $l_name=$this->input->post('l_name');
        $f_name=$this->input->post('f_name');
        $m_name=$this->input->post('m_name');
        $address=$this->input->post('address');
        $contct=$this->input->post('contct');
        $compny=$this->input->post('compny');
        
        $this->load->model('adm_model');
        $this->adm_model->newAccount($u_name,$u_lvl,$l_name,$f_name,$m_name,$address,$contct,$compny);
        
        //create conversation
        $this->load->model('chat_m');
        $this->chat_m->createConvo($u_lvl, $u_name);
    }
    
    function new_account2()
    {
        $u_name=$this->input->post('u_name');
        $u_lvl=$this->input->post('u_lvl');
        $l_name=$this->input->post('l_name');
        $f_name=$this->input->post('f_name');
        $m_name=$this->input->post('m_name');
        $address=$this->input->post('address');
        $contct=$this->input->post('contct');
        $compny=$this->input->post('compny');
        $pass = $this->input->post('pass');
        
        $this->load->model('adm_model');
        $this->adm_model->newAccount2($u_name,$u_lvl,$l_name,$f_name,$m_name,$address,$contct,$compny,$pass);
        
        //create conversation
        $this->load->model('chat_m');
        $this->chat_m->createConvo($u_lvl, $u_name);
    }
    
    
    //checking
    function check_haz_name()
    {
        $check=$this->input->post('check');
        $haz_name=$this->input->post('haz_name');
        $db_hazname=$this->input->post('db_hazname');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkHazName($haz_name,$db_hazname,$check);
        echo json_encode($result);
    }
    
    function check_lgnd_name()
    {
        $check=$this->input->post('check');
        $lgnd_name=$this->input->post('lgnd_name');
        $lgnd_id=$this->input->post('lgnd_id');
        $db_lgndname=$this->input->post('db_lgndname');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkHazLgndName($lgnd_name,$lgnd_id,$db_lgndname,$check);
        echo json_encode($result);
    }
    
    function check_lgnd_lvl()
    {
        $check=$this->input->post('check');
        $haz_id=$this->input->post('haz_id');
        $haz_level=$this->input->post('haz_level');
        $db_lvl=$this->input->post('db_lvl');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkHazLgndLvl($haz_id,$haz_level,$db_lvl,$check);
        echo json_encode($result);
    }
    
    function check_haz_lgnd_clr()
    {
        $check=$this->input->post('check');
        $haz_id=$this->input->post('haz_id');
        $lgnd_clr=$this->input->post('lgnd_clr');
        $db_clr=$this->input->post('db_clr');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkHazLgndClr($haz_id,$lgnd_clr,$db_clr,$check);
        echo json_encode($result);
    }
    
    function check_rock_lgnd()
    {
        $check=$this->input->post('check');
        $rock_lgnd=$this->input->post('rock_lgnd');
        $db_rocklgnd=$this->input->post('db_rocklgnd');
        $r_type=$this->input->post('r_type');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkRockTypeLgnd($check,$rock_lgnd,$db_rocklgnd,$r_type);
        echo json_encode($result);
    }
    
    function check_rock_clr()
    {
        $check=$this->input->post('check');
        $map_id=$this->input->post('map_id');
        $rock_clr=$this->input->post('rock_clr');
        $db_rockclr=$this->input->post('db_rockclr');
        $r_type=$this->input->post('r_type');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkRockTypeColor($check,$map_id,$rock_clr,$db_rockclr,$r_type);
        echo json_encode($result);
    }
    
    function check_rock_age()
    {
        $rock_age=$this->input->post('rock_age');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkRockAge($rock_age);
        echo json_encode($result);
    }
    
    function check_rock_group()
    {
        $rock_group=$this->input->post('rock_group');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkRockGroup($rock_group);
        echo json_encode($result);
    }
    
    function check_soil_lgnd()
    {
        $check=$this->input->post('check');
        $soil_lgnd=$this->input->post('soil_lgnd');
        $db_soillgnd=$this->input->post('db_soillgnd');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkSoilLgnd($check,$soil_lgnd,$db_soillgnd);
        echo json_encode($result);
    }
    
    function check_soil_clr()
    {
        $check=$this->input->post('check');
        $map_id=$this->input->post('map_id');
        $soil_clr=$this->input->post('soil_clr');
        $db_soilclr=$this->input->post('db_soilclr');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkSoilColor($check,$map_id,$soil_clr,$db_soilclr);
        echo json_encode($result);
    }

    function check_soil_symbol()
    {
        $soil_sym=$this->input->post('soil_sym');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkSoilSymbol($soil_sym);
        echo json_encode($result);
    }
    
    function check_uname()
    {
        $u_name=$this->input->post('u_name');
        
        $this->load->model('adm_model');
        $result=$this->adm_model->checkUname($u_name);
        echo json_encode($result); 
    }
    
    //for uploading images 
     function edit_haz_images($haz_id,$hazlgnd_id,$rockid,$chk,$f_img1,$f_img2,$f_img3,$frm)//edit and upload images,$rockid
    {
        $path="";
        if($frm==1 || $frm==2 || $frm==6)$path='../uploads/geohazard/';
        else if($frm==3 || $frm==4)$path='../uploads/rockmap/';
        else if($frm==5)$path='../uploads/soilmap/';
        
        $status="";
        $msg="";
        //echo 'filename:'.$_FILES[$f_img2]['name'];
        if($status!='error')
        {
            $config['upload_path'] = $path;
            $config['allowed_types'] = 'jpg|jpeg|png';
            $this->load->library('upload',$config);
            
            if(!empty($_FILES[$f_img1]['name']))
            {
                if(!$this->upload->do_upload($f_img1))
                {
                    echo 'error';
                    $status="error";
                    $msg=$this->upload->display_errors('','');
                }
                else
                {
                    $data=$this->upload->data($f_img1);
                    $this->load->model('adm_model');
                    if($frm==1 || $frm==2 || $frm==6)
                    $file_id=$this->adm_model->editHazImages($haz_id,$hazlgnd_id,$data['file_name'],'','',$frm);
                    if($frm==3 || $frm==4 || $frm==5)
                    $file_id=$this->adm_model->editRockImages($rockid,$data['file_name'],'','',$frm);
                    
                    if($file_id)
                    {
                        $status='success';
                        $msg='File successfully uploaded';
                    }
                    else
                    {
                        unlink($data['full_path']);
                        $status='error';
                        $msg='Something went wrong when saving the file, please try again.';
                    }
                }
            }
            
            if(!empty($_FILES[$f_img2]['name']))
            {
                if(!$this->upload->do_upload($f_img2))
                {
                    echo 'error';
                    $status="error";
                    $msg=$this->upload->display_errors('','');
                }
                else
                {
                    $data=$this->upload->data($f_img2);
                    $this->load->model('adm_model');
                    if($frm==1 || $frm==2 || $frm==6)
                    $file_id=$this->adm_model->editHazImages($haz_id,$hazlgnd_id,'',$data['file_name'],'',$frm);
                    if($frm==3 || $frm==4 || $frm==5)
                    $file_id=$this->adm_model->editRockImages($rockid,'',$data['file_name'],'',$frm);
                    if($file_id)
                    {
                        $status='success';
                        $msg='File successfully uploaded';
                    }
                    else
                    {
                        unlink($data['full_path']);
                        $status='error';
                        $msg='Something went wrong when saving the file, please try again.';
                    }
                }
            }
            
            if(!empty($_FILES[$f_img3]['name']))
            {
                if(!$this->upload->do_upload($f_img3))
                {
                    echo 'error';
                    $status="error";
                    $msg=$this->upload->display_errors('','');
                }
                else
                {
                    $data=$this->upload->data($f_img3);
                    $this->load->model('adm_model');
                    if($frm==1 || $frm==2 || $frm==6)
                    $file_id=$this->adm_model->editHazImages($haz_id,$hazlgnd_id,'','',$data['file_name'],$frm);
                    if($frm==3 || $frm==4 || $frm==5)
                    $file_id=$this->adm_model->editRockImages($rockid,'','',$data['file_name'],$frm);
                    if($file_id)
                    {
                        $status='success';
                        $msg='File successfully uploaded';
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
            echo json_encode(array('status'=>$status,'msg'=>$msg));
            if($_FILES[$f_img1]['name']!=null || $_FILES[$f_img2]['name']!=null || $_FILES[$f_img3]['name']!=null)
            {
            $uploaded_imgs=array('img1'=>$_FILES[$f_img1]['name'],
                                 'img2'=>$_FILES[$f_img2]['name'],
                                 'img3'=>$_FILES[$f_img3]['name']);
             echo json_encode($uploaded_imgs);
            }
    }
}
?>