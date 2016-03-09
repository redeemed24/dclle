<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
$count=0;
class Geo_model extends CI_Model
{
    
    function geo_getLengends()
    {
        $query=$this->db->query("SELECT * FROM tbl_maplegend WHERE ml_state=1 AND ml_type=1 AND m_id=1");
        if($query->num_rows()>=0)
        return $query->result();
    }
    
    function geo_getStructLegends()
    {
        $query=$this->db->query("SELECT * FROM tbl_maplegend WHERE ml_state=1 AND ml_type=2 AND m_id=1");
        if($query->num_rows()>=0)
        return $query->result();
    }
    
    function geo_getLegendsFColor()
    {
        $query=$this->db->query("SELECT ml_id,ml_color FROM tbl_maplegend WHERE ml_id=(SELECT min(ml_id) FROM tbl_maplegend WHERE ml_type=1) AND m_id=1");
        if($query->num_rows()>=0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('ml_id'=>$row['ml_id'],'ml_color'=>$row['ml_color']);
            }
            return $data;
        }
        else return null;
    }
    
    function geo_getStructFColor()
    {
        $query=$this->db->query("SELECT ml_id, ml_color FROM tbl_maplegend WHERE ml_id=(SELECT min(ml_id) FROM tbl_maplegend WHERE ml_type=2) AND m_id=1");
        if($query->num_rows()>=0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                $data[$ctr++]=array('ml_id'=>$row['ml_id'],'ml_color'=>$row['ml_color']);
            }
            return $data;
        }
        else return null;
    }
    
    function geo_getPolygons()
    {
        $query=$this->db->query("SELECT * FROM tbl_mapcoordinates 
                                 LEFT JOIN tbl_maplegend on tbl_mapcoordinates.ml_id=tbl_maplegend.ml_id
                                 WHERE tbl_mapcoordinates.m_id=1 AND ml_state=1 AND mc_ishistory is null");
        if($query->num_rows()>=0)
        {
            $ctr=0;
            foreach($query->result_array() as $row)
            {
                if($row["ml_type"]==1)
                {
                    $data[$ctr++]=array("mc_id"=>$row["mc_id"],
                                        "mc_coordinates"=>$row["mc_coordinates"],
                                        "ml_id"=>"ml_".$row["ml_id"],
                                        "ml_color"=>$row["ml_color"],
                                        "mc_type"=>$row["ml_type"]);
                }
                else if($row["ml_type"]==2)
                {
                    $data[$ctr++]=array("mc_id"=>$row["mc_id"],
                                        "mc_coordinates"=>$row["mc_coordinates"],
                                        "ml_id"=>"struct_".$row["ml_id"],
                                        "ml_color"=>$row["ml_color"],
                                        "mc_type"=>$row["ml_type"]);
                }
            }
            return $data;
        }
        else
            return null;
    }
    
    function geo_saveCoor($geo_data,$geo_c)
    { 
        for($x=0;$x<count($geo_data);$x++)
        {
            if($geo_data[$x]["stat"]==2)
            {
                if($geo_data[$x]["overlaytype"]=="polygon")
                {
                    $legend=str_replace("ml_","",$geo_data[$x]["legend"]);
                    $this->db->query("INSERT INTO tbl_mapcoordinates(mc_coordinates,m_id,ml_id) VALUES(?,?,?)",array($geo_data[$x]["polygon"],1,$legend));
                }
                else if($geo_data[$x]["overlaytype"]=="polyline")
                {
                    $legend=str_replace("struct_","",$geo_data[$x]["legend"]);
                    $this->db->query("INSERT INTO tbl_mapcoordinates(mc_coordinates,m_id,ml_id) VALUES(?,?,?)",array($geo_data[$x]["polygon"],1,$legend));
                }
            }
            else if($geo_data[$x]["stat"]==1)
            {
                if($geo_data[$x]["overlaytype"]=="polygon")
                {
                    $legend=str_replace("ml_","",$geo_data[$x]["legend"]);
                    $this->db->query("UPDATE tbl_mapcoordinates SET mc_coordinates=?, ml_id=? WHERE mc_id=?",array($geo_data[$x]["polygon"],$legend,$geo_data[$x]["mc"]));
                }
                else if($geo_data[$x]["overlaytype"]=="polyline")
                {
                    $legend=str_replace("struct_","",$geo_data[$x]["legend"]);
                    $this->db->query("UPDATE tbl_mapcoordinates SET mc_coordinates=?, ml_id=? WHERE mc_id=?",array($geo_data[$x]["polygon"],$legend,$geo_data[$x]["mc"]));
                }
            }
            else if($geo_data[$x]["stat"]==3)
            {
                $this->db->query("DELETE FROM tbl_mapcoordinates WHERE mc_id=?",array($geo_data[$x]["mc"]));
            }
        }
    }
    
    function updateRocktbl($username)
    {
        $this->db->query('UPDATE tbl_map SET last_editor=?, last_update=NOW() WHERE m_id=1',array($username));
    }
}
?>