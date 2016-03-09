<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Main_model extends CI_Model{
    
    //hazards
    function get_Hazards()
    {
        $query = $this->db->query("SELECT * FROM tbl_hazards WHERE h_state=1");
        
        if($query->num_rows()>0)
        {
            $ctr=0;
            
            foreach($query->result_array() AS $rows)
            {
                $data[$ctr++] = array('h_id'=>$rows['h_id'],
                                      'h_name'=>$rows['h_name'],
                                      'h_desc'=>$rows['h_desc'],
                                      'h_img1'=>$rows['h_img1'],
                                      'h_img2'=>$rows['h_img2'],
                                      'h_img3'=>$rows['h_img3']);
            }
            
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    //rock type and land type
    function get_Map()
    {
        $query = $this->db->query("SELECT * FROM tbl_map");
        
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() AS $rows)
            {
                $data[$ctr++] = array('m_id'=>$rows['m_id'],
                                      'm_name'=>$rows['m_name']); 
            }
            
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    //LEGENDS
    function getHazardLevels($h_id)
    {
        $query = $this->db->query('SELECT * FROM tbl_hazardlevel WHERE h_id=? AND hl_state=1
                                  ORDER BY hl_id ASC',array($h_id));
        
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() AS $row)
            {
                $data[$ctr++]= array('hl_id'=>$row['hl_id'],
                                     'hl_name'=>$row['hl_name'],
                                     'hl_color'=>$row['hl_color'],
                                     'hl_desc'=>$row['hl_desc'],
                                     'hl_img1'=>$row['hl_img1'],
                                     'hl_img2'=>$row['hl_img2'],
                                     'hl_img3'=>$row['hl_img3']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function getMapLegends($m_id)//rock and land legend
    {
        $query = $this->db->query('SELECT * FROM tbl_maplegend
                                  LEFT JOIN tbl_rockage ON tbl_maplegend.ra_id = tbl_rockage.ra_id
                                  LEFT JOIN tbl_rockgroup ON tbl_maplegend.rg_id = tbl_rockgroup.rg_id
                                  LEFT JOIN tbl_soillayer ON tbl_maplegend.sl_id = tbl_soillayer.sl_id
                                  WHERE m_id=? AND ml_state=1 ORDER BY ml_id ASC',array($m_id));
        
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() AS $row)
            {
                $data[$ctr++]= array('ml_id'=>$row['ml_id'],
                                     'ml_name'=>$row['ml_name'],
                                     'ml_color'=>$row['ml_color'],
                                     'ml_desc'=>$row['ml_desc'],
                                     'ml_desc2'=>$row['ml_desc2'],
                                     'ml_type'=>$row['ml_type'],
                                     'ra_name'=>$row['ra_name'],
                                     'rg_name'=>$row['rg_name'],
                                     'sl_firstlayer'=>$row['sl_firstlayer'],
                                     'sl_secondlayer'=>$row['sl_secondlayer'],
                                     'sl_thirdlayer'=>$row['sl_thirdlayer'],
                                     'sl_fourthlayer'=>$row['sl_fourthlayer'],
                                     'ml_img1'=>$row['ml_img1'],
                                     'ml_img2'=>$row['ml_img2'],
                                     'ml_img3'=>$row['ml_img3']);
            }
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    
    //AJAX
    function getRocks()
    {
        $query = $this->db->query("SELECT * FROM tbl_mapcoordinates LEFT JOIN tbl_maplegend ON tbl_mapcoordinates.ml_id = tbl_maplegend.ml_id WHERE ml_state=1 AND tbl_mapcoordinates.m_id=1 AND mc_ishistory is null");
        
        if($query->num_rows()>0)
        {
            $ctr = 0;
            foreach($query->result_array() AS $rows)
            {
                $data[$ctr++] = array('mc_id'=>$rows['mc_id'],
                                      'mc_coordinates'=>$rows['mc_coordinates'],
                                      'ml_id'=>$rows['ml_id'],
                                      'ml_name'=>$rows['ml_name'],
                                      'ml_desc'=>$rows['ml_desc'],
                                      'ml_color'=>$rows['ml_color'],
                                      'ml_type'=>$rows['ml_type']);
            }
            
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function getLand()
    {        
        $query = $this->db->query("SELECT * FROM tbl_mapcoordinates LEFT JOIN tbl_maplegend ON tbl_mapcoordinates.ml_id = tbl_maplegend.ml_id WHERE ml_state=1 AND tbl_mapcoordinates.m_id=2 AND mc_ishistory is null");
        
        if($query->num_rows()>0)
        {
            $ctr = 0;
            foreach($query->result_array() AS $rows)
            {
                $data[$ctr++] = array('mc_id'=>$rows['mc_id'],
                                      'mc_coordinates'=>$rows['mc_coordinates'],
                                      'ml_id'=>$rows['ml_id'],
                                      'ml_name'=>$rows['ml_name'],
                                      'ml_desc'=>$rows['ml_desc'],
                                      'ml_color'=>$rows['ml_color']);
            }
            
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function getHazardCoors()
    {
        $query = $this->db->query('SELECT * FROM tbl_hazardcoordinates
                                  LEFT JOIN tbl_hazardlevel ON tbl_hazardcoordinates.hl_id = tbl_hazardlevel.hl_id                                  
                                  LEFT JOIN tbl_hazards ON tbl_hazardcoordinates.h_id = tbl_hazards.h_id
                                  WHERE hl_state=1 AND hc_ishistory is null');
        
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() AS $rows)
            {
                $data[$ctr++] = array('hc_id'=>$rows['hc_id'],
                                      'hc_coordinates'=>$rows['hc_coordinates'],
                                      'hc_shape'=>$rows['hc_shape'],//1polygon //2polyline
                                      'hl_id'=>$rows['hl_id'],
                                      'hl_lvl'=>$rows['hl_lvl'],
                                      'hl_name'=>$rows['hl_name'],
                                      'h_id'=>$rows['h_id'],
                                      'h_name'=>$rows['h_name']);
            }
            
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function getHazLvlSum()
    {
        $query = $this->db->query('SELECT sum(hl_lvl) AS sum FROM tbl_hazardlevel WHERE hl_state=1');
        
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() AS $rows)
            {
                $data[$ctr++] = array('sum'=>$rows['sum']);
            }
            
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    //AJAX DISPLAY ON THE MAP
    function dispHazardCoors($haz_id)
    {
        $query = $this->db->query('SELECT * FROM tbl_hazardcoordinates
                                  LEFT JOIN tbl_hazardlevel ON tbl_hazardcoordinates.hl_id = tbl_hazardlevel.hl_id
                                  WHERE hl_state=1 AND tbl_hazardcoordinates.h_id=? AND hc_ishistory is null',array($haz_id));
        
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() AS $rows)
            {
                $data[$ctr++] = array('hc_id'=>$rows['hc_id'],
                                      'hc_coordinates'=>$rows['hc_coordinates'],
                                      'hc_shape'=>$rows['hc_shape'],//1polygon //2polyline
                                      'hl_id'=>$rows['hl_id'],
                                      'hl_color'=>$rows['hl_color']);
            }
            
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function dispMapCoors($map_id)
    {
        $query = $this->db->query('SELECT * FROM tbl_mapcoordinates
                                   LEFT JOIN tbl_maplegend ON tbl_mapcoordinates.ml_id = tbl_maplegend.ml_id
                                   WHERE ml_state=1 AND tbl_mapcoordinates.m_id=? AND mc_ishistory is null',array($map_id));
        
        if($query->num_rows()>0)
        {
            $ctr=0;
            foreach($query->result_array() AS $rows)
            {
                $data[$ctr++] = array('mc_id'=>$rows['mc_id'],
                                      'mc_coordinates'=>$rows['mc_coordinates'],
                                      'ml_type'=>$rows['ml_type'],//1polygon //2polyline
                                      'ml_id'=>$rows['ml_id'],
                                      'ml_color'=>$rows['ml_color']);
            }
            
            return $data;
        }
        else
        {
            return null;
        }
    }
    
    function setRockInUsed($username)
    {
        $query = $this->db->query('SELECT current_u FROM tbl_map WHERE m_id=1');
        
        if($query->row()->current_u && $query->row()->current_u!=$username)//somebody else is using
        {
            redirect('haz_controller');
        }
        else
        {
            //set new
            $this->db->query('UPDATE tbl_map SET current_u=? WHERE m_id=1',array($username));
        }
    }
    
    function setLandInUsed($username)
    {
        $query = $this->db->query('SELECT current_u FROM tbl_map WHERE m_id=2');
        
        if($query->row()->current_u && $query->row()->current_u!=$username)//somebody else is using
        {
            redirect('haz_controller');
        }
        else
        {
            //set new
            $this->db->query('UPDATE tbl_map SET current_u=? WHERE m_id=2',array($username));
        }
    }
    
    function resetMapInUsed($username)
    {
        $this->db->query('UPDATE tbl_map SET current_u=NULL WHERE current_u=?',array($username));
    }
    
}
?>