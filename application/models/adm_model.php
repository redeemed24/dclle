<?php if(!defined('BASEPATH'))exit('No direct script access allowed');
class Adm_model extends CI_Model{
    
    function getHazInfo()
    {
        //hazards
        $query=$this->db->query("SELECT * FROM tbl_hazards");
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('haz_id'=>$row['h_id'],'haz_name'=>$row['h_name'],'haz_desc'=>$row['h_desc'],
                                    'haz_image1'=>$row['h_img1'],'haz_image2'=>$row['h_img2'],'haz_image3'=>$row['h_img3'],
                                    'haz_stat'=>$row['h_state']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function getHazDrpList($chk)
    {
        if($chk==1)$query=$this->db->query("SELECT  distinct tbl_hazards.h_id,h_name FROM tbl_hazards");
        else if($chk==2)$query=$this->db->query("SELECT  distinct tbl_hazards.h_id,h_name FROM tbl_hazards LEFT JOIN tbl_hazardlevel on tbl_hazards.h_id=tbl_hazardlevel.h_id WHERE tbl_hazardlevel.hl_name<>''");
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('haz_id'=>$row['h_id'],'haz_name'=>$row['h_name']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function newHazInfo($haz_name,$haz_desc,$l_editor)
    {
        $this->db->query("INSERT INTO tbl_hazards(h_name,h_desc,h_state,last_update,last_editor) VALUES(?,?,1,NOW(),?)",array($haz_name,$haz_desc,$l_editor));
        return $this->db->insert_id();
    }
    
    function editHazInfo($haz_id,$haz_name,$haz_desc,$l_editor,$haz_image_stat)
    {
        $this->db->query("UPDATE tbl_hazards SET h_name=?,h_desc=?,last_update=NOW(),last_editor=? WHERE h_id=?",array($haz_name,$haz_desc,$l_editor,$haz_id));
        if($haz_image_stat[0]['haz_image1_stat']==2) $this->db->query("UPDATE tbl_hazards SET h_img1=? WHERE h_id=?",array('',$haz_image_stat[0]['haz_id']));
        if($haz_image_stat[0]['haz_image2_stat']==2) $this->db->query("UPDATE tbl_hazards SET h_img2=? WHERE h_id=?",array('',$haz_image_stat[0]['haz_id']));
        if($haz_image_stat[0]['haz_image3_stat']==2) $this->db->query("UPDATE tbl_hazards SET h_img3=? WHERE h_id=?",array('',$haz_image_stat[0]['haz_id']));
    }
    
    function editHazImages($haz_id,$hazlgnd_id,$img1,$img2,$img3,$frm)
    {
        if($frm==1)
        {
            if($img1!="") $this->db->query("UPDATE tbl_hazards SET h_img1=? WHERE h_id=?",array($img1,$haz_id));
            if($img2!="") $this->db->query("UPDATE tbl_hazards SET h_img2=? WHERE h_id=?",array($img2,$haz_id));
            if($img3!="") $this->db->query("UPDATE tbl_hazards SET h_img3=? WHERE h_id=?",array($img3,$haz_id));
        }
        else if($frm==2 || $frm==6)
        {
            if($img1!="") $this->db->query("UPDATE tbl_hazardlevel SET hl_img1=? WHERE hl_id=?",array($img1,$hazlgnd_id));
            if($img2!="") $this->db->query("UPDATE tbl_hazardlevel SET hl_img2=? WHERE hl_id=?",array($img2,$hazlgnd_id));
            if($img3!="") $this->db->query("UPDATE tbl_hazardlevel SET hl_img3=? WHERE hl_id=?",array($img3,$hazlgnd_id));
        }
        return $this->db->affected_rows();
    }
    
    function getHazLvl($haz_id)
    {
        $query=$this->db->query("SELECT * FROM tbl_hazardlevel WHERE h_id=?",array($haz_id));
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('haz_id'=>$row['h_id'],'hazlgnd_id'=>$row['hl_id'],'hazlgnd_name'=>$row['hl_name'],'hazlgnd_lvl'=>$row['hl_lvl'],'hazlgnd_desc'=>$row['hl_desc'],'hazlgnd_clr'=>$row['hl_color'],
                                    'hazlgnd_image1'=>$row['hl_img1'],'hazlgnd_image2'=>$row['hl_img2'],'hazlgnd_image3'=>$row['hl_img3'],
                                    'hazlgnd_stat'=>$row['hl_state']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function newHazLgnd($haz_id,$hazlgnd_name,$hazlgnd_lvl,$hazlgnd_clr,$hazlgnd_desc,$l_editor)
    {
        $this->db->query("UPDATE tbl_hazards SET last_update=NOW(),last_editor=? WHERE h_id=?",array($l_editor,$haz_id));
        $this->db->query("INSERT INTO tbl_hazardlevel(h_id,hl_name,hl_lvl,hl_desc,hl_color,hl_state) values(?,?,?,?,?,1)",array($haz_id,$hazlgnd_name,$hazlgnd_lvl,$hazlgnd_desc,$hazlgnd_clr));
        return $this->db->insert_id();
    }
    
    function editHazLgnd($haz_id,$hazlgnd_id,$hazlgnd_name,$hazlgnd_lvl,$hazlgnd_clr,$hazlgnd_desc,$l_editor,$hazlgnd_img_stat)
    {
        $this->db->query("UPDATE tbl_hazardlevel SET hl_name=?,hl_lvl=?,hl_desc=?,hl_color=? WHERE h_id=? AND hl_id=?",array($hazlgnd_name,$hazlgnd_lvl,$hazlgnd_desc,$hazlgnd_clr,$haz_id,$hazlgnd_id));
        $this->db->query("UPDATE tbl_hazards SET last_update=NOW(),last_editor=? WHERE h_id=?",array($l_editor,$haz_id));
        if($hazlgnd_img_stat[1]['hazlgnd_image1_stat']==2) $this->db->query("UPDATE tbl_hazardlevel SET hl_img1=? WHERE h_id=?",array('',$hazlgnd_img_stat[1]['haz_id']));
        if($hazlgnd_img_stat[1]['hazlgnd_image2_stat']==2) $this->db->query("UPDATE tbl_hazardlevel SET hl_img2=? WHERE h_id=?",array('',$hazlgnd_img_stat[1]['haz_id']));
        if($hazlgnd_img_stat[1]['hazlgnd_image3_stat']==2) $this->db->query("UPDATE tbl_hazardlevel SET hl_img3=? WHERE h_id=?",array('',$hazlgnd_img_stat[1]['haz_id']));
    }
    
    
    //rock map
    function getRockInfo()
    {
        $query=$this->db->query("SELECT * FROM dclle.tbl_maplegend
                                LEFT JOIN tbl_rockage on tbl_maplegend.ra_id=tbl_rockage.ra_id
                                LEFT JOIN tbl_rockgroup on tbl_maplegend.rg_id=tbl_rockgroup.rg_id WHERE ml_type=1 ORDER by ml_id");
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('maplgnd_id'=>$row['ml_id'],'lgnd_id'=>$row['m_id'],'mlgnd_name'=>$row['ml_name'],'mlgnd_desc'=>$row['ml_desc'],
                                    'mlgnd_desc2'=>$row['ml_desc2'],'mlgnd_clr'=>$row['ml_color'],'mlgnd_image1'=>$row['ml_img1'],'mlgnd_image2'=>$row['ml_img2'],
                                    'mlgnd_image3'=>$row['ml_img3'],'mlgnd_ageid'=>$row['ra_id'],'mlgnd_age'=>$row['ra_name'],
                                    'mlgnd_groupid'=>$row['rg_id'],'mlgnd_group'=>$row['rg_name'],'mlstate'=>$row['ml_state']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function newRockInfo($rockname,$rockdesc,$rockdesc2,$rockclr,$ageid,$groupid)
    {
        $this->db->query("INSERT INTO tbl_maplegend(m_id,ml_name,ml_desc,ml_desc2,ml_color,ml_type,ml_state,ra_id,rg_id) VALUES(1,?,?,?,?,1,1,?,?)",array($rockname,$rockdesc,$rockdesc2,$rockclr,$ageid,$groupid));
        return $this->db->insert_id();
    }
    
    function editRockInfo($rockid,$rockname,$rockdesc,$rockdesc2,$rockclr,$state,$ageid,$groupid,$l_editor,$haz_image_stat)
    {
        $this->db->query("UPDATE tbl_maplegend SET ml_name=?,ml_desc=?,ml_desc2=?,ml_color=?,ml_state=?,ra_id=?,rg_id=? WHERE ml_id=?",array($rockname,$rockdesc,$rockdesc2,$rockclr,$state,$ageid,$groupid,$rockid));
        $this->db->query("UPDATE tbl_map SET last_update=NOW(),last_editor=? WHERE m_id=1",array($l_editor));
        if($haz_image_stat[2]['rock_img1_stat']==2) $this->db->query("UPDATE tbl_maplegend SET ml_img1=? WHERE ml_id=?",array('',$haz_image_stat[2]['rockid']));
        if($haz_image_stat[2]['rock_img2_stat']==2) $this->db->query("UPDATE tbl_maplegend SET ml_img2=? WHERE ml_id=?",array('',$haz_image_stat[2]['rockid']));
        if($haz_image_stat[2]['rock_img3_stat']==2) $this->db->query("UPDATE tbl_maplegend SET ml_img3=? WHERE ml_id=?",array('',$haz_image_stat[2]['rockid']));
    }
    
    function editRockImages($rockid,$img1,$img2,$img3,$frm)
    {
        if($img1!="") $this->db->query("UPDATE tbl_maplegend SET ml_img1=? WHERE ml_id=?",array($img1,$rockid));
        if($img2!="") $this->db->query("UPDATE tbl_maplegend SET ml_img2=? WHERE ml_id=?",array($img2,$rockid));
        if($img3!="") $this->db->query("UPDATE tbl_maplegend SET ml_img3=? WHERE ml_id=?",array($img3,$rockid));
        
        return $this->db->affected_rows();
    }
    
    
    //rock structure
    function getRockStruct()
    {
        $query=$this->db->query("SELECT ml_id,m_id,ml_name,ml_desc,ml_color,ml_img1,ml_img2,ml_img3,ml_state FROM dclle.tbl_maplegend
                                LEFT JOIN tbl_rockage on tbl_maplegend.ra_id=tbl_rockage.ra_id
                                LEFT JOIN tbl_rockgroup on tbl_maplegend.rg_id=tbl_rockgroup.rg_id WHERE ml_type=2 ORDER by ml_id");
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('maplgnd_id'=>$row['ml_id'],'lgnd_id'=>$row['m_id'],'mlgnd_name'=>$row['ml_name'],'mlgnd_desc'=>$row['ml_desc'],
                                    'mlgnd_clr'=>$row['ml_color'],'mlgnd_image1'=>$row['ml_img1'],'mlgnd_image2'=>$row['ml_img2'],
                                    'mlgnd_image3'=>$row['ml_img3'],'mlstate'=>$row['ml_state']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function newRockStruct($structname,$structdesc,$structclr)
    {
        $this->db->query("INSERT INTO tbl_maplegend(m_id,ml_name,ml_desc,ml_color,ml_type,ml_state) VALUES(1,?,?,?,2,1)",array($structname,$structdesc,$structclr));
        return $this->db->insert_id();
    }
    
    function editRockStruct($structid,$structname,$structdesc,$structclr,$state,$haz_image_stat)
    {
        $this->db->query("UPDATE tbl_maplegend SET ml_name=?,ml_desc=?,ml_color=?,ml_state=1 WHERE ml_id=?",array($structname,$structdesc,$structclr,$structid));
        if($haz_image_stat[3]['struct_img1_stat']==2) $this->db->query("UPDATE tbl_maplegend SET ml_img1=? WHERE ml_id=?",array('',$haz_image_stat[3]['structid']));
        if($haz_image_stat[3]['struct_img2_stat']==2) $this->db->query("UPDATE tbl_maplegend SET ml_img2=? WHERE ml_id=?",array('',$haz_image_stat[3]['structid']));
        if($haz_image_stat[3]['struct_img3_stat']==2) $this->db->query("UPDATE tbl_maplegend SET ml_img3=? WHERE ml_id=?",array('',$haz_image_stat[3]['structid']));
    }
    
    //rock age
    function getRockAge()
    {
        $query=$this->db->query('SELECT * FROM tbl_rockage');
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('rage_id'=>$row['ra_id'],'rage_name'=>htmlspecialchars($row['ra_name']));
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function newRockAge($age)
    {
        $this->db->query("INSERT INTO tbl_rockage(ra_name) VALUES(?)",array($age));
    }
    
    //rock group
    function getRockGroup()
    {
        $query=$this->db->query('SELECT * FROM tbl_rockgroup');
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('rgroup_id'=>$row['rg_id'],'rgroup_name'=>htmlspecialchars($row['rg_name']));
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function newRockGroup($group)
    {
        $this->db->query("INSERT INTO tbl_rockgroup(rg_name) VALUES(?)",array($group));
    }
    
    
    //soil map
    function getSoilMapLegend()
    {
        $query=$this->db->query("SELECT * FROM tbl_maplegend LEFT JOIN tbl_soillayer on tbl_maplegend.sl_id = tbl_soillayer.sl_id WHERE m_id=2 ORDER BY ml_id");
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('soil_id'=>$row['ml_id'],'mapid'=>$row['m_id'],'soil_name'=>$row['ml_name'],'soild_desc'=>$row['ml_desc'],
                                    'soil_clr'=>$row['ml_color'],'soil_img1'=>$row['ml_img1'],'soil_img2'=>$row['ml_img2'],
                                    'soil_img3'=>$row['ml_img3'],'layer_id'=>$row['sl_id'],'layer1'=>$row['sl_firstlayer'],'layer2'=>$row['sl_secondlayer'],
                                    'layer3'=>$row['sl_thirdlayer'],'layer4'=>$row['sl_fourthlayer'],'mlstate'=>$row['ml_state']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function soilLgndEdit($soilid,$soilname,$soildesc,$soilclr,$soilstate,$haz_image_stat,$layerid,$layer1,$layer2,$layer3,$layer4,$l_editor)
    {
        $this->db->query('UPDATE tbl_soillayer SET sl_firstlayer=?,sl_secondlayer=?,sl_thirdlayer=?,sl_fourthlayer=? WHERE sl_id=?',array($layer1,$layer2,$layer3,$layer4,$layerid));
        $this->db->query('UPDATE tbl_map SET last_update=NOW(), last_editor=? WHERE m_id=2',array($l_editor));
        $this->db->query("UPDATE tbl_maplegend SET ml_name=?,ml_desc=?,ml_color=?,ml_state=? WHERE ml_id=?",array($soilname,$soildesc,$soilclr,$soilstate,$soilid));
        if($haz_image_stat[4]['soil_img1_stat']==2) $this->db->query("UPDATE tbl_maplegend SET ml_img1=? WHERE ml_id=?",array('',$haz_image_stat[4]['soilid']));
        if($haz_image_stat[4]['soil_img2_stat']==2) $this->db->query("UPDATE tbl_maplegend SET ml_img2=? WHERE ml_id=?",array('',$haz_image_stat[4]['soilid']));
        if($haz_image_stat[4]['soil_img3_stat']==2) $this->db->query("UPDATE tbl_maplegend SET ml_img3=? WHERE ml_id=?",array('',$haz_image_stat[4]['soilid']));
        echo 'here '.$haz_image_stat[4]['soil_img1_stat'];
    }
    
    function getSoilSymbols()
    {
        $query=$this->db->query("SELECT * FROM tbl_soilsymbol");
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('sym_id'=>$row['ss_id'],
                                    'sym_name'=>htmlspecialchars($row['ss_name'])
                                    );
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function newSoilLgnd($soilname,$soildesc,$soilclr,$soilstate,$layerid)
    {
        $this->db->query("INSERT INTO tbl_maplegend(m_id,ml_name,ml_desc,ml_color,ml_state,sl_id) VALUES(2,?,?,?,?,?)",array($soilname,$soildesc,$soilclr,$soilstate,$layerid));
        return $this->db->insert_id();
    }

    function newSoilLayer($layer1,$layer2,$layer3,$layer4)
    {
        $this->db->query("INSERT INTO tbl_soillayer(sl_firstlayer,sl_secondlayer,sl_thirdlayer,sl_fourthlayer) VALUES(?,?,?,?)",array($layer1,$layer2,$layer3,$layer4));
        return $this->db->insert_id();
    }
    
    function newSoilSymbol($sym_name)
    {
        $this->db->query("INSERT INTO tbl_soilsymbol(ss_name) VALUES(?)",array($sym_name));
    }
    
    
    //profile
    function getUserProf($username)
    {
        $query=$this->db->query("SELECT * FROM tbl_account LEFT JOIN tbl_profile on tbl_account.username = tbl_profile.username WHERE tbl_account.username=?",array($username));
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('uname'=>$row['username'],'upass'=>$row['password'],'ulevel'=>$row['user_lvl'],
                                    'last_name'=>$row['lname'],'first_name'=>$row['fname'],'middle_name'=>$row['mname'],
                                    'address'=>$row['address'],'contact'=>$row['contact'],'company'=>$row['company']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function editUserProfile($username,$prof_lname,$prof_fname,$prof_mname,$prof_address,$prof_contactno,$prof_company)
    {
        $this->db->query("UPDATE tbl_profile SET lname=?,fname=?,mname=?,address=?,contact=?,company=? WHERE username=?",array($prof_lname,$prof_fname,$prof_mname,$prof_address,$prof_contactno,$prof_company,$username));
    }
    
    function changePass($username,$old_pass,$new_pass,$chk)
    {
        if($chk==1)
            $this->db->query("UPDATE tbl_account SET password=md5(?) WHERE username=?",array('tempoPass',$username));
        else if($chk==2)
            $this->db->query("UPDATE tbl_account SET password=md5(?) WHERE username=? AND password=md5(?)",array($new_pass,$username,$old_pass));
        
        if($this->db->affected_rows()!=null)
            return 'updated';
        else
            return 'invalid';
    }
    
    function searchAccount($value)
    {
        $query=$this->db->query("SELECT username,concat(fname,' ',mname,' ',lname) as name FROM tbl_profile WHERE username!=? AND (fname like ?
                                OR mname like ? OR lname like ? OR concat(fname,' ',lname) like ? OR concat(fname,' ',mname) like ?
                                OR concat(lname,' ',mname) like ? OR concat(lname,' ',fname) like ? OR concat(lname,', ',fname) like ?
                                OR concat(mname,' ',fname) like ? OR concat(mname,' ',lname) like ? OR concat(fname,' ',lname,' ',mname) like ?
                                OR concat(lname,' ',fname,' ',mname) like ? OR concat(lname,', ',fname,' ',mname) like ?
                                OR concat(mname,' ',lname,' ',fname) like ? OR concat(mname,' ',fname,' ',lname) like ?)",
                                array($this->session->userdata('username'),'%'.$value.'%','%'.$value.'%','%'.$value.'%','%'.$value.'%','%'.$value.'%','%'.$value.'%','%'.$value.'%','%'.$value.'%',
                                '%'.$value.'%','%'.$value.'%','%'.$value.'%','%'.$value.'%','%'.$value.'%','%'.$value.'%','%'.$value.'%'));
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('uname'=>$row['username'],'name'=>$row['name']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function newAccount($u_name,$u_lvl,$l_name,$f_name,$m_name,$address,$contct,$compny)
    {
        $this->db->query("INSERT INTO tbl_account(username,password,user_lvl) VALUES(?,md5('tempoPass'),?)",array($u_name,$u_lvl));
        $this->db->query("INSERT INTO tbl_profile(username,lname,fname,mname,address,contact,company) VALUES(?,?,?,?,?,?,?)",array($u_name,$l_name,$f_name,$m_name,$address,$contct,$compny));
    }
    
    function newAccount2($u_name,$u_lvl,$l_name,$f_name,$m_name,$address,$contct,$compny,$pass)
    {
        $this->db->query("INSERT INTO tbl_account(username,password,user_lvl) VALUES(?,md5(?),?)",array($u_name,$pass,$u_lvl));
        $this->db->query("INSERT INTO tbl_profile(username,lname,fname,mname,address,contact,company) VALUES(?,?,?,?,?,?,?)",array($u_name,$l_name,$f_name,$m_name,$address,$contct,$compny));
    }
    
    //check
    function checkHazName($haz_name,$dbhazname,$chk)
    {
        if($chk==1)$query=$this->db->query("SELECT h_name FROM tbl_hazards WHERE h_name=? AND h_name<>?",array($haz_name,$dbhazname));//edit
        if($chk==2)$query=$this->db->query("SELECT h_name FROM tbl_hazards WHERE h_name=?",array($haz_name));//new
        if($query->num_rows()>0) return 'exists';
        else return 'ok';
    }
    
    function checkHazLgndName($hazlgnd_name,$hazlgnd_id,$dbhazlgnd_name,$chk)
    {
        if($chk==1)$query=$this->db->query("SELECT hl_name FROM tbl_hazardlevel WHERE hl_name=? AND h_id=? AND hl_name<>?",array($hazlgnd_name,$hazlgnd_id,$dbhazlgnd_name));
        else if($chk==2)$query=$this->db->query("SELECT hl_name FROM tbl_hazardlevel WHERE hl_name=? AND h_id=?",array($hazlgnd_name,$hazlgnd_id));
        if($query->num_rows()>0) return 'exists';
        else return 'ok';
    }
    
    function checkHazLgndLvl($hazlgnd_id,$hazlgnd_lvl,$dblvl,$chk)
    {
        if($chk==1)$query=$this->db->query("SELECT hl_name FROM tbl_hazardlevel WHERE h_id=? AND hl_lvl=? AND hl_lvl<>0 AND hl_lvl<>?",array($hazlgnd_id,$hazlgnd_lvl,$dblvl));
        else if($chk==2)$query=$this->db->query("SELECT hl_name FROM tbl_hazardlevel WHERE h_id=? AND hl_lvl=? AND hl_lvl<>0",array($hazlgnd_id,$hazlgnd_lvl));
        if($query->num_rows()>0) return 'exists';
        else return 'ok';
    }
    
    function checkHazLgndClr($hazlgnd_id,$hazlgnd_clr,$dbhazclr,$chk)
    {
        if($chk==1)$query=$this->db->query("SELECT hl_name FROM tbl_hazardlevel WHERE h_id=? AND hl_color=? AND hl_color<>?",array($hazlgnd_id,$hazlgnd_clr,$dbhazclr));
        else if($chk==2)$query=$this->db->query("SELECT hl_name FROM tbl_hazardlevel WHERE h_id=? AND hl_color=?",array($hazlgnd_id,$hazlgnd_clr));
        if($query->num_rows()>0) return 'exists';
        else return 'ok';
    }
    
    function checkRockTypeLgnd($chk,$rock_lgnd,$dbrockname,$r_type)
    {
        if($chk==1  || $chk==3)$query=$this->db->query("SELECT ml_name FROM tbl_maplegend WHERE ml_name=? AND ml_type=?",array($rock_lgnd,$r_type));
        else if($chk==2  || $chk==4)$query=$this->db->query("SELECT ml_name FROM tbl_maplegend WHERE ml_name=? AND ml_name<>? AND ml_type=?",array($rock_lgnd,$dbrockname,$r_type));
        if($query->num_rows()>0) return 'exists';
        else return 'ok';
    }
    
    
    function checkRockTypeColor($chk,$haz_id,$rock_clr,$dbrockcolor,$r_type)
    {
        if($chk==1 || $chk==3)$query=$this->db->query("SELECT ml_name FROM tbl_maplegend WHERE ml_color=? AND m_id=? AND ml_type=?",array($rock_clr,$haz_id,$r_type));
        else if($chk==2 || $chk==4) $query=$this->db->query("SELECT ml_name FROM tbl_maplegend WHERE ml_color=? AND ml_color<>? AND m_id=? AND ml_type=?",array($rock_clr,$dbrockcolor,$haz_id,$r_type));
        if($query->num_rows()>0) return 'exists';
        else return 'ok';
    }
    
    function checkRockAge($rage_name)
    {
        $query=$this->db->query("SELECT ra_name FROM tbl_rockage WHERE ra_name=?",array($rage_name));
        if($query->num_rows()>0)return 'exists';
        else return 'ok';
    }
    
    function checkRockGroup($rgoup_name)
    {
        $query=$this->db->query("SELECT rg_name FROM tbl_rockgroup WHERE rg_name=?",array($rgoup_name));
        if($query->num_rows()>0)return 'exists';
        else return 'ok';
    }
    
    function checkSoilLgnd($chk,$soil_lgnd,$dbsoilname)
    {
        if($chk==1)$query=$this->db->query("SELECT ml_name FROM tbl_maplegend WHERE ml_name=?",array($soil_lgnd));
        else if($chk==2)$query=$this->db->query("SELECT ml_name FROM tbl_maplegend WHERE ml_name=? AND ml_name<>?",array($soil_lgnd,$dbsoilname));
        if($query->num_rows()>0) return 'exists';
        else return 'ok';
    }
    
    function checkSoilColor($chk,$map_id,$soil_clr,$dbsoilcolor)
    {
        if($chk==1)$query=$this->db->query("SELECT ml_name FROM tbl_maplegend WHERE ml_color=? AND m_id=?",array($soil_clr,$map_id));
        else if($chk==2) $query=$this->db->query("SELECT ml_name FROM tbl_maplegend WHERE ml_color=? AND ml_color<>? AND m_id=?",array($soil_clr,$dbsoilcolor,$map_id));
        if($query->num_rows()>0) return 'exists';
        else return 'ok';
    }
    
    function checkSoilSymbol($s_sym)
    {
        $query=$this->db->query("SELECT ss_name FROM tbl_soilsymbol WHERE ss_name=?",array($s_sym));
        if($query->num_rows()>0)return 'exists';
        else return 'ok';
    }
    
    function checkUname($u_name)
    {
        $query=$this->db->query("SELECT username FROM tbl_account WHERE username=?",array($u_name));
        if($query->num_rows()>0)return 'exists';
        else return 'ok';
    }
    
    //change stat
    function hazChangeStat($haz_id,$stat)
    {
        $this->db->query("UPDATE tbl_hazards SET h_state=? WHERE h_id=?",array($stat,$haz_id));
        $query=$this->db->query("SELECT h_state as haz_stat FROM tbl_hazards WHERE h_id=?",array($haz_id));
        if($query->num_rows()>0)
        {
            return $query->result();
        }
        else
            return null;
    }
    
    function hazLgndChangeStat($hazlgnd_id,$stat)
    {
        $this->db->query("UPDATE tbl_hazardlevel SET hl_state=? WHERE hl_id=?",array($stat,$hazlgnd_id));
        $query=$this->db->query("SELECT hl_state as hazlgnd_state FROM tbl_hazardlevel WHERE hl_id=?",array($hazlgnd_id));
        if($query->num_rows()>0)
        {
            return $query->result();
        }
        else
            return null;
    }
    
    function rockChangeStat($rock_id,$stat)
    {
        $this->db->query("UPDATE tbl_maplegend SET ml_state=? WHERE ml_id=?",array($stat,$rock_id));
        $query=$this->db->query("SELECT ml_state as rock_stat FROM tbl_maplegend WHERE ml_id=?",array($rock_id));
        if($query->num_rows()>0)
        {
            return $query->result();
        }
        else
            return null;
    }
}
?>