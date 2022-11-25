<?php
/*
header('Content-Type: application/json; charset=UTF-8');
header("Connection: Keep-alive");
*/
$SHOW_DEBUG=true;
if($SHOW_DEBUG==true){
    error_reporting(E_ALL);
    ini_set('display_errors','On');
}
$databaseURL=$_SERVER['DOCUMENT_ROOT']."/api_container/config/connection.php";
$libraryURL=$_SERVER['DOCUMENT_ROOT']."/api_container/partLibraries/";
include $databaseURL;
include $libraryURL."time_stamp_module.php";
$userRequestingData="c"; //sender variable container
$contact_to_chat_with="c"; //receiver variable container
$empty="";
$time_stamp_helper=new get_time_stamp_Inchat;
$_POST['userRequestingID']="jane";
$_POST['param1']="l";

if(isset($_POST['userRequestingID']) and isset($_POST['param1'])){
	unset($contact_to_chat_with);
	//$sender=$_POST['sender'];
	//$contact_to_chat_with=$_POST['contact_to_chat_with'];
  $userRequestingData=$_POST['userRequestingID'];
  $contact_to_chat_with="jane";
  //--------user requesting will be used---------
	class message_library{ //------message list structure----------------
    public $db_Connection;
    public $userRequestingID="jane";
    public $timeStampMaster;
    public $resident_class;
    public $result_array=array("username"=>"","sender"=>"","receiver"=>"","message_content"=>"","message_type"=>"","message_date"=>"","message_time"=>"");
    public $allMessageList=array();
    public $userContacts=array();
    public function setResident($param1){
      $this->resident_class=$param1;
    }
    public function setConnection($param1){
      $this->db_Connection=$param1;
    }
    public function load_messages($connection, $userRequestingData,$contact_to_chat_with,$timeStampMaster){
      $messageList=array();
      $messageResult=array("username"=>"","sender"=>"","receiver"=>"","messageContent"=>"","messageType"=>"","messageDate"=>"","messageTime"=>"");
      $query_inst="SELECT * FROM `chat_message_table` WHERE (SENDER ='".$userRequestingData."' OR SENDER='".$contact_to_chat_with."' ) AND (RECEIVER ='".$userRequestingData."' OR RECEIVER='".$contact_to_chat_with."')";
         
      mysqli_set_charset($connection,"utf8");
      $fetchmsg = mysqli_query($connection, $query_inst)or die();
      if($fetchmsg){
        while($row=mysqli_fetch_array($fetchmsg)){
          $messageResult['username']=$contact_to_chat_with;
          $messageResult['sender']=$row['SENDER'];
          $messageResult['receiver']=$row['RECEIVER'];
          //$messageResult['messageContent']=htmlspecialchars($row['MESSAGE']);
          $messageResult['messageContent']=$row['MESSAGE'];
          $messageResult['messageType']=$row['MESSAGE_TYPE'];
          $messageResult['messageDate']=$timeStampMaster->get_output_Time($row['DATE'],$row['TIME']);
          $messageResult['messageTime']=$row['TIME'];
          $messageList[]=$messageResult;
        }
      }
      return $messageList;
    }
    public function loadUserContacts($userRequestingData){
      $contactListResponse=array();
      $connection=$this->db_Connection;
      $selectionTargets="`user`";
      $selectionConditions="user.USERNAME!='j' ";
      $selectionQuery=" SELECT * FROM $selectionTargets ORDER BY id ASC LIMIT 100 ";
      //mysqli_set_charset($connection,"utf8");
      $launch_my_contacts=mysqli_query($connection, $selectionQuery );
      while($row=mysqli_fetch_assoc($launch_my_contacts)){
          $contactImage='';
          /***
            contact type 0 is direct, contact type 1 is group
          ***/
          $contactListResponse[]=array("id"=>$row['ID'], "username"=>$row['USERNAME'] );
      }
      //-----iterate contact list to load contacts
      //----fetching by username right now
      for($list=0; $list<count($contactListResponse); $list++){
        $userRequestingData=$this->userRequestingID;
        $contact_to_chat_with=$contactListResponse[$list]["username"];
        $messageDiscussion=$this->load_messages($connection, $userRequestingData,$contact_to_chat_with,$this->resident_class );
        if(count($messageDiscussion)!=0){
          $this->allMessageList[]=array($contact_to_chat_with=>$this->load_messages($connection, $userRequestingData,$contact_to_chat_with,$this->resident_class ));
        }
      }
      $jsonResult=json_encode($this->allMessageList);
      echo $jsonResult;
    }
	}
	$message_library_builder=new message_library;
  $message_library_builder->setConnection($connect);
  $message_library_builder->setResident($time_stamp_helper);
  $message_library_builder->loadUserContacts($userRequestingData);
}


?>
