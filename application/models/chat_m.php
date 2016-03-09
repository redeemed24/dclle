<?php
class Chat_m extends CI_Model{
    
/*************************************************************ACCOUNT************************************************************************************************/
    //create new conversation
    public function createConvo($userlevel, $username)
    { // create conversation
        $this->db->where('user_lvl !=', $userlevel); // get all users not equal to new user
        $query = $this->db->get('tbl_account');
        
        foreach($query->result() as $row){
            $data_1 = array('peer_1'=> $username, 'peer_2'=>$row->username); // create conversation sender is new user
            $this->db->insert('tbl_conversation', $data_1);
            
            $data_2 = array('peer_1'=> $row->username, 'peer_2'=>$username); // create conversation recipient is new user
            $this->db->insert('tbl_conversation', $data_2);
        }
    }
    
    public function checkAccount($username, $password){ // login
        $this->db->where('username', $username);
        $this->db->where('password', md5($password));
        return $this->db->get('tbl_account')->result();
    }
    
    public function online(){
        $data = array('isonline'=> 1);
        $this->db->where('username', $this->session->userdata('username'));
        $this->db->update('tbl_account', $data);
    }
    
    public function offline(){
        $this->db->query('UPDATE tbl_account SET isonline=0, logout=NOW() WHERE username=?',$this->session->userdata('username'));
    }
 /**********************************************************OTHER USERS***************************************************************************************************/   
    public function getUsernames(){ // get usernames and pending unread messages count
        
        $sql = 'select tbl_conversation.peer_1 as username, tbl_profile.fname, tbl_profile.lname, tbl_account.isonline, tbl_conversation.conv_id,  sum(coalesce(tbl_message.mess_stat,0)) as mess_count from tbl_conversation
                left join tbl_account on tbl_conversation.peer_1 = tbl_account.username
                left join tbl_profile on tbl_conversation.peer_1 = tbl_profile.username
                left join tbl_message using(conv_id)
                where tbl_conversation.peer_2 = ?
                group by conv_id';
                
        return $this->db->query($sql, $this->session->userdata('username'))->result();
    }
        
/************************************************************************CONVERSATION***************************************************************************************/        
    public function checkConvo($chatWith, $username){
        $this->db->where('peer_2', $chatWith);
        $this->db->where('peer_1', $username);
        return $this->db->get('tbl_conversation')->result();
    }
 
    public function getConvoID(){
        $this->db->where('peer_1', $this->session->userdata('username'));
        return $this->db->get('tbl_conversation', 'conv_id')->result();    
    }
    
/*************************************************************************ALERTS IF USER RECEIVED A MESSAGED***********************************************************************************************/    
    
    public function appearMessage(){ // alert if somebody messaged user ONLINE
        $sql = 'select peer_1, fname, lname, isonline from tbl_conversation inner join tbl_profile on tbl_conversation.peer_1 = tbl_profile.username inner join tbl_account on tbl_conversation.peer_1 = tbl_account.username where conv_id in (select distinct conv_id from tbl_message where conv_id in (select conv_id from tbl_conversation where peer_2 = ?) and mess_time > "'.(time()-2).'")'; //temp
        return $this->db->query($sql, $this->session->userdata('username'))->result();
    }
    
    public function getMessages(){ // alert if somebody messaged user OFFLINE
            $sql = 'select peer_1, fname, lname, isonline from tbl_conversation inner join tbl_profile on tbl_conversation.peer_1 = tbl_profile.username inner join tbl_account on tbl_conversation.peer_1 = tbl_account.username where conv_id in (select distinct conv_id from tbl_message where conv_id in (select conv_id from tbl_conversation where peer_2 = ?) and mess_stat = 1)';//mess_date >= "'.$time.'")'; //temp
            return $this->db->query($sql, $this->session->userdata('username'))->result();
    }
     
/**************************************************************MESSAGES THREAD**********************************************************************************************/
    public function setMess($conv_id){
        $data = array ('mess_stat'=> 0);
        $this->db->where('conv_id', $conv_id);
        $this->db->update('tbl_message', $data);
    }
        
    public function saveMess($username, $message, $convo_id, $isfile){ // save messages
        $now = date("Y-m-d H:i:s");
        $data = array('conv_id'=>$convo_id, 'mess_content'=>$message, 'mess_sender'=>$username, 'mess_date'=>$now, 'mess_time'=> time(), 'mess_stat'=>1, 'isfile'=>$isfile);
        $this->db->insert('tbl_message', $data);
    }
    
    public function getMess($time, $id_1, $id_2, $status){ // get messages
        
        $sql = 'select * from tbl_message inner join tbl_profile on tbl_profile.username = tbl_message.mess_sender where tbl_message.mess_time > "'.$time.'" and (tbl_message.conv_id = "'.$id_1.'" or tbl_message.conv_id ="'.$id_2.'") order by tbl_message.mess_time DESC';
       
        $query = $this->db->query($sql);
        $results = array();
    
        foreach ($query->result() as $row){
            if($row->username == $this->session->userdata('username')){
                if($row->isfile == 0){
                    $mess_content = htmlspecialchars($row->mess_content);
                }
                else{
                    $mess_content = '<a href="http://localhost/dclle/uploads/'.$row->mess_content.'" target="_blank">'.$row->mess_content.'</a>';
                }
 
                $results[] = array("<div id = 'mess_content' class = 'me'>".$mess_content."<div id = 'mess_date'>".$row->mess_date."</div></div>",$row->mess_time);    
            }
            
            else{
                
                if($row->isfile == 0){
                    $mess_content = htmlspecialchars($row->mess_content);
                }
                
                else{
                    $mess_content = '<a href="http://localhost/dclle/uploads/'.$row->mess_content.'" target="_blank">'.$row->mess_content.'</a>';
                }
                
                $results[] = array("<div id = 'mess_content' class = 'you'>".$mess_content."<div id = 'mess_date'>".$row->mess_date."</div></div>",$row->mess_time);
            } 
        }
        
        return array_reverse($results);
    }

}

?>