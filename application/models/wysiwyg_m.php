<?php

class Wysiwyg_m extends CI_Model{
    
    /************************************************WYSIWYG*********************************************************************************/
        public function getClientName($req_id){ // get client_name
            $sql = 'select fname, lname from tbl_requests inner join tbl_profile on client_id = username where req_id="'.$req_id.'"';
            foreach($this->db->query($sql)->result() as $row){
                return $row->fname.' '.$row->lname;
            }
        }
        
        public function getClientID($req_id){ // get client id
            $sql = 'select client_id from tbl_requests where req_id="'.$req_id.'"';
            foreach($this->db->query($sql)->result() as $row){
                return $row->client_id;
            }
        }
        
        public function getReqStat($req_id){ // get cert stat if current editable or not
            $sql = 'select e_stat, req_stat from tbl_requests where req_id="'.$req_id.'"';
            return $this->db->query($sql)->result();
        }
        
        public function setReqStat($req_id, $stat){ // set request stat to 1 or 0
            $data = array('e_stat'=>$stat);
            
            $this->db->where('req_id', $req_id);
            $this->db->update('tbl_requests', $data);
        }
        
        public function updateReq($req_id){   // update to tbl request approved
            $data = array('den_date'=>date("Y-m-d H:i:s"), 'req_stat'=>1, 's_stat'=>1);
            $this->db->where('req_id', $req_id);
            $this->db->update('tbl_requests', $data);
        }
        
        public function insertContent($req_id){ // insert to db
            $client_id = $this->getClientID($req_id);
            
            $data = array('cert_content'=>$this->input->post('wysi_textarea'), 'cert_filename'=>$this->input->post('wysi_input'),
                          'cert_date'=>date("Y-m-d H:i:s"),'cert_by'=>$this->session->userdata('username'),'req_id'=>$req_id, 'cert_to'=>$client_id);
            
            if($this->input->post('submit')=='Send'){ // send and save
                    $data['cert_issend']=1;
                    
                    $this->updateReq($req_id); // update db requests
            }
           
            $this->db->insert('tbl_certificates', $data);
            $this->setReqStat($req_id, 0); // set cert to view
        }
            
        public function updateContent($req_id){ // update certificate
            $data=array('cert_filename'=>$this->input->post('wysi_input'), 'cert_content'=>$this->input->post('wysi_textarea'), 'cert_date'=>date("Y-m-d H:i:s"), 'cert_by'=>$this->session->userdata('username'));
                
                if($this->input->post('submit')=='Send'){ // send and save
                    $data['cert_issend']=1;
                    
                    $this->updateReq($req_id); // update db requests
                }
                
            $this->db->where('req_id', $req_id);
            $this->db->update('tbl_certificates', $data);
            $this->setReqStat($req_id, 0); // set cert to view
        }
        
    /*****************************************************************UPLOAD_CERT*************************************************************************************/
        public function cr_cert($req_id, $filename){ //save certificate pdf created
            $client_id = $this->getClientID($req_id);
            
            $data = array('cert_filename'=> $filename, 'cert_content'=>$filename, 'req_id'=> $req_id, 'cert_to'=>$client_id, 'cert_by'=>$this->session->userdata('username'), 'is_file'=>1, 'cert_issend'=>1, 'cert_date'=>date("Y-m-d H:i:s"));
            $this->updateReq($req_id);
            $this->db->insert('tbl_certificates', $data);
        }
        
        public function up_cert($req_id, $filename){ //save certificate pdf updated 
            $data = array('cert_filename'=> $filename, 'cert_content'=>$filename, 'cert_by'=>$this->session->userdata('username'), 'is_file'=>1, 'cert_issend'=>1, 'cert_date'=>date("Y-m-d H:i:s"));
            $this->updateReq($req_id);
            $this->db->where('req_id', $req_id);
            $this->db->update('tbl_certificates', $data);
        }
        
    /*****************************************************************FILE_MGT*************************************************************************************/
        public function getYear(){
            $sql='select distinct YEAR(cert_date) as cert_year from tbl_certificates order by YEAR(cert_date) DESC';
            return $this->db->query($sql)->result();
        }
        
        public function getList(){ // get list of files
            $sql = ('select req_id, tm.cert_id, tm.cert_filename, t1.fname as client_fname, t1.lname as client_lname, t2.fname as geo_fname, t2.lname as geo_lname, tm.cert_issend, tm.cert_date from tbl_certificates as tm
                    inner join tbl_profile as t1 on tm.cert_to = t1.username
                    inner join tbl_profile as t2 on tm.cert_by = t2.username
                    order by cert_date desc');
            return $this->db->query($sql)->result();
        }
        
        public function getInfo($req_id){ // get info
            $sql = ('select tm.cert_id, tm.req_id, tm.cert_filename, tm.cert_content, t1.fname as client_fname, t1.lname as client_lname, t2.fname as geo_fname, t2.lname as geo_lname, tm.cert_issend, tm.cert_date, tm.is_file from tbl_certificates as tm
                    inner join tbl_profile as t1 on tm.cert_to = t1.username
                    inner join tbl_profile as t2 on tm.cert_by = t2.username
                    where tm.req_id = "'.$req_id.'"');
            return $this->db->query($sql)->result();
        }
            
         public function getFiles($month, $year){
            $sql = 'select req_id, tm.cert_id, tm.cert_filename, tm.cert_content, t1.fname as client_fname, t1.lname as client_lname, t2.fname as geo_fname, t2.lname as geo_lname, tm.cert_issend, tm.cert_date from tbl_certificates as tm
                    inner join tbl_profile as t1 on tm.cert_to = t1.username
                    inner join tbl_profile as t2 on tm.cert_by = t2.username where';
                   
            if($month == 0 && $year != 'Year'){ // by year
                $sql = $sql.' year(tm.cert_date) ="'.$year.'"';
                $sql .= ' order by cert_date desc';
                $query = $this->db->query($sql)->result();
            }
            
            else if($month != 0 && $year== 'Year'){ // by month
                $sql = $sql.' month(tm.cert_date)="'.$month.'"';
                $sql .= ' order by cert_date desc';
                $query = $this->db->query($sql)->result();
            }
            
            else if($month !=0 && $year!='Year'){ // both
                $sql = $sql.' month(tm.cert_date)="'.$month.'" and year(tm.cert_date)="'.$year.'"';
                $sql .= ' order by cert_date desc';
                $query = $this->db->query($sql)->result();
            }
             
            else if($month == 0 && $year == 'Year'){ // no input
                $query = $this->getList();
            }
            
            if(count($query)==0)
            return 'empty';
            else
            {
             $content = '<div class="cert_table">
                    <table>
                        <tr><th>Title</th><th>Client</th><th>Geologist</th><th>Date</th></tr>';
                        
            foreach($query as $row){
               
                if($row->cert_issend==1){
                    $content .= '<tr>';
                }
                                    
                else{
                    $content .= '<tr class="files_draft">';
                }
                
                $link = base_url().'index.php/wysiwyg_c/load_pop/'.$row->req_id;
                
                $content.= '<td><a href="'.$link.'" class="file_link" onclick="window.open(this.href,'."' "."'".', '."'".'width=500px,height=400px,resizable=no,titlebar=no,scrollbars=yes'."'".'); return false">'.$row->cert_filename.'</a></td>';
                $content.= '<td>'.$row->client_fname.' '.$row->client_lname.'</td>';
                $content.= '<td>'.$row->geo_fname.' '.$row->geo_lname.'</td>';
                $content.= '<td>'.$row->cert_date.'</td>'; 
                    
                    $content.= '</tr>';  
                                
                           
            }
            
                    $content .= '</table>';
            
            $content .= '</div>';
            return $content;
            }
    }
    
    public function printReports($month, $year){
        $sql='select c.fname as client_fname, c.lname as client_lname, tr.loc_coor, tr.area, date(tr.den_date) as send_date, g.fname as geo_fname, g.lname as geo_lname
                from tbl_certificates as tc
                inner join tbl_profile as c on tc.cert_to = c.username
                inner join tbl_profile as g on tc.cert_by = g.username
                inner join tbl_requests as tr on tc.req_id = tr.req_id
                where tc.cert_issend = 1';
        
        if($month == 0 && $year != 'Year'){ // by year
            $sql .= ' and year(tr.den_date) ="'.$year.'"';
        }
       
        else if($month != 0 && $year== 'Year'){ // by month
            $sql .= ' and month(tr.den_date)="'.$month.'"';
        }
        
        else if($month !=0 && $year!='Year'){ // both
            $sql .= ' and month(tr.den_date)="'.$month.'" and year(tr.den_date)="'.$year.'"';
        }
        
        $sql .= ' order by tr.den_date desc';
        return $this->db->query($sql)->result();
    }
}

?>