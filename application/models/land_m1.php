<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Land_m1 extends CI_Model{
    public function land_getInfoM(){
        $this->db->where('m_id', 2);
        $this->db->where('ml_state',1);
        $query = $this->db->get('tbl_maplegend');
        return $query->result();
    }
     
    public function land_saveCoorM($polygonInfo){
        for($i=0; $i<count($polygonInfo); $i++){
            $data = array('mc_coordinates'=>$polygonInfo[$i]['mc_coor'],
                          'ml_id'=>$polygonInfo[$i]['mc_color'], 'm_id'=>2);
            
            if($polygonInfo[$i]['mc_id'] !=0){ //polygon from database
                 $this->db->where('mc_id',$polygonInfo[$i]['mc_id']);
                 $this->db->where('m_id',2);
                 
                if($polygonInfo[$i]['mc_stat'] == 0){ //updated from database
                    $this->db->update('tbl_mapcoordinates', $data);
                }
                else{ // deleted from database
                    $this->db->delete('tbl_mapcoordinates');
                }
            }
            else{
                if($polygonInfo[$i]['mc_stat'] == 0){ //new polygon
                    $this->db->insert('tbl_mapcoordinates', $data);
                }
            }
        }
    }
    
    function updateLandtbl($username)
    {
        $this->db->query('UPDATE tbl_map SET last_editor=?, last_update=NOW() WHERE m_id=2',array($username));
    }
    
    public function land_getCoorM(){
        $query = $this->db->query('SELECT * FROM tbl_mapcoordinates LEFT JOIN tbl_maplegend ON tbl_mapcoordinates.ml_id = tbl_maplegend.ml_id WHERE tbl_mapcoordinates.m_id=2 AND ml_state=1 AND mc_ishistory is null');
        return $query->result();
    }
}
?>