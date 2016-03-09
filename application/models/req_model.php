<?php if(!defined('BASEPATH')) exit('No direct script access allowed');

class Req_model extends CI_Model
{
    function saveRequest($client_id,$lat,$lng,$area,$req_stat)
    {
        $coor=$lat."%".$lng;
        $now = date("Y-m-d");
        $this->db->query("INSERT INTO tbl_requests(client_id,loc_coor,area,date_requested,req_stat,s_stat) VALUE(?,?,?,?,?,4)",array($client_id,$coor,$area,$now,$req_stat));
        return $this->db->insert_id();
    }
    
    function changeReqStat($req_id)
    {
        $this->db->query("UPDATE tbl_requests SET s_stat=2 WHERE req_id=?",array($req_id));
    }
    
    function delReq($req_id)
    {
        $this->db->query("DELETE FROM tbl_requests WHERE req_id=?",array($req_id));
        $this->db->query("DELETE FROM tbl_reqfiles WHERE req_id=?",array($req_id));    
    }
    
    function saveRequestFiles($req_id,$u_id,$file,$file_stat)//file_stat: 0-from client, 1=from admin(certificate)
    {
        $this->db->query("INSERT INTO tbl_reqfiles(req_id,u_id,file,file_stat) VALUES(?,?,?,?)",array($req_id,$u_id,$file,$file_stat));
        return $this->db->insert_id();
    }
    
    function updateCoor($req_id,$lat,$lng,$area)
    {
        $coor=$lat."%".$lng;
        $this->db->query("UPDATE tbl_requests SET loc_coor=?,area=? WHERE req_id=?",array($coor,$area,$req_id));
    }
    
    function cancelRequest($req_id)
    {
        $this->db->query("UPDATE tbl_requests SET req_stat=3,s_stat=3 WHERE req_id=?",array($req_id));
    }
    
    function removeFile($file_id)
    {
        $this->db->query("DELETE FROM tbl_reqfiles WHERE reqfile_id=?",array($file_id));
    }
    
    function changeRemFileStat($fileid)
    {
        $this->db->query("UPDATE tbl_reqfiles SET file_stat=1 WHERE reqfile_id=?",array($fileid));
    }

    function denRequest($reqid)
    {
        $now = date("Y-m-d");
        $this->db->query("UPDATE tbl_requests SET req_stat=2, s_stat=1, den_date=? WHERE req_id=?",array($now,$reqid));
    }
    
    function getRequests($user,$ulvl)
    {
        if($ulvl==1)
        {
        $query=$this->db->query("SELECT tbl_requests.req_id,client_id,loc_coor,area,date_requested,den_date,req_stat,e_stat,s_stat,cert_id,cert_filename,cert_by,cert_stat,cert_issend,date(cert_date) as cert_date,
                                concat(lname,', ',fname,' ',mname) as c_name
                                FROM tbl_requests LEFT JOIN tbl_certificates on tbl_requests.req_id=tbl_certificates.req_id
                                LEFT JOIN tbl_profile on tbl_requests.client_id=tbl_profile.username
                                WHERE s_stat<>4 ORDER BY req_id ASC",array($user));
        }
        else if($ulvl==2)
        {
        $query=$this->db->query("SELECT tbl_requests.req_id,client_id,loc_coor,area,date_requested,den_date,req_stat,e_stat,s_stat,cert_id,cert_filename,cert_by,cert_stat,cert_issend,date(cert_date) as cert_date,
                                concat(lname,', ',fname,' ',mname) as c_name
                                FROM tbl_requests LEFT JOIN tbl_certificates on tbl_requests.req_id=tbl_certificates.req_id
                                LEFT JOIN tbl_profile on tbl_requests.client_id=tbl_profile.username
                                WHERE client_id=? AND s_stat<>4 ORDER BY req_id ASC",array($user));
        }
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('reqid'=>$row['req_id'],'coor'=>$row['loc_coor'],'area'=>$row['area'],'d_req'=>$row['date_requested'],'dendate'=>$row['den_date'],'reqstat'=>$row['req_stat'],'sstat'=>$row['s_stat'],'estat'=>$row['e_stat'],
                            'certid'=>$row['cert_id'],'certfilename'=>$row['cert_filename'],'certby'=>$row['cert_by'],
                            'certstat'=>$row['cert_stat'],'certdate'=>$row['cert_date'],'c_name'=>$row['c_name']);
            }
            return $data;
        }
        else{return null;}
    }
    
    function getFiles($r_id)
    {
        $query=$this->db->query("SELECT reqfile_id,file,file_stat FROM tbl_reqfiles WHERE req_id=?",array($r_id));
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('fileid'=>$row['reqfile_id'],'filename'=>$row['file'],'filestat'=>$row['file_stat']);
            }
            return $data;
        }
        else {return null;}
    }
    
    function checkRequests($lvl,$username)
    {
        if($lvl==1)//geo
        {
            $query=$this->db->query("SELECT count(*) as count from tbl_requests where s_stat=2");
            if($query->num_rows()>0)
            {
                foreach($query->result_array() as $row)
                {
                    $data=$row['count'];
                }
                return $data;
            }
            else{return null;}
        }
        else if($lvl==2)//client
        {
            $query=$this->db->query("SELECT count(*) as count from tbl_requests where s_stat=1 AND client_id=?",array($username));
            if($query->num_rows()>0)
            {
                foreach($query->result_array() as $row)
                {
                    $data=$row['count'];
                }
                return $data;
            }
            else{return null;}
        }
    }
    
    function viewRequests($lvl,$username)
    {
        if($lvl==1)
            $this->db->query("UPDATE tbl_requests SET s_stat=0 WHERE s_stat<>4");
        else if($lvl==2)
            $this->db->query("UPDATE tbl_requests SET s_stat=0 WHERE client_id=? AND s_stat=1 AND s_stat<>4",array($username));
    }
    
    function reqApprove($r_id)
    {
        $now = date("Y-m-d");
        $this->db->query("UPDATE tbl_requests SET s_stat=1,req_stat=1,den_date=? WHERE req_id=?",array($now,$r_id));
    }
}

?>