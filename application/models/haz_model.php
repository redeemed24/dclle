<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Haz_model extends CI_Model{
    
    function haz_getHazards()
    {
        $query = $this->db->query('SELECT * FROM tbl_hazards WHERE h_state=1 AND current_u is null');
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() AS $row)
            {
                $data[$ctr++] = array('h_id'=>$row['h_id'],
                                      'h_name'=>$row['h_name']);
            }
            return $data;
        }
        else
        {
            redirect('main_controller');
        }
    }
    
    function haz_getHazardLevels($h_id)
    {
        $query = $this->db->query('SELECT * FROM tbl_hazardlevel WHERE h_id=? AND hl_state=1',array($h_id));
        
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() AS $row)
            {
                $data[$ctr++]= array('hl_id'=>$row['hl_id'],
                                     'hl_name'=>$row['hl_name'],
                                     'hl_color'=>$row['hl_color']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function haz_getFromDb($h_id)
    {
        $query = $this->db->query('SELECT * FROM tbl_hazardcoordinates LEFT JOIN 
                                   tbl_hazardlevel ON tbl_hazardcoordinates.hl_id = tbl_hazardlevel.hl_id 
                                   WHERE tbl_hazardcoordinates.h_id=? AND hl_state=1 AND hc_ishistory is null',array($h_id));
        
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() AS $row)
            {
                $data[$ctr++]= array('hc_id'=>$row['hc_id'],
                                     'hc_coordinates'=>$row['hc_coordinates'],
                                     'hl_id'=>$row['hl_id'],
                                     'hl_color'=>$row['hl_color'],
                                     'hc_shape'=>$row['hc_shape']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function haz_saveToDb($hc_coordinates, $hl_id, $h_id, $hc_shape)
    {
        $this->db->query('INSERT INTO tbl_hazardcoordinates(hc_coordinates, h_id, hl_id, hc_shape)
                         VALUES(?,?,?,?)', array($hc_coordinates,$h_id,$hl_id,$hc_shape));
    }
    
    function haz_updateDb($hc_coordinates, $hl_id, $hc_id)
    {
        $this->db->query('UPDATE tbl_hazardcoordinates
                          SET hc_coordinates=?, hl_id=? WHERE hc_id=?', array($hc_coordinates, $hl_id, $hc_id));
    }
    
    function haz_delete($hc_id)
    {
        $this->db->query('DELETE FROM tbl_hazardcoordinates WHERE hc_id=?',array($hc_id));
    }
    
    function updateHazardtbl($username, $h_id)
    {
        $this->db->query('UPDATE tbl_hazards SET last_editor=?, last_update=NOW() WHERE h_id=?', array($username,$h_id));
    }
    
    function setHazardInUsed($username,$h_id)
    {
        //check first
        $query = $this->db->query('SELECT current_u FROM tbl_hazards WHERE h_id=?',array($h_id));
        
        if($query->row()->current_u && $query->row()->current_u!=$username)//if someone is still using it
        {
            redirect('haz_controller');
        }
        else
        {
            //set new
            $this->db->query('UPDATE tbl_hazards SET current_u=? WHERE h_id=?',array($username,$h_id));
        }
    }
    
    function resetHazardInUsed($username)
    {
        //reset
        $this->db->query('UPDATE tbl_hazards SET current_u=NULL WHERE current_u=?',array($username));   
    }
}
?>