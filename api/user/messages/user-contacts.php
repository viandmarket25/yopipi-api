
<?php

header('Content-Type: application/json; charset=UTF-8');
header("Connection: Keep-alive");

$SHOW_DEBUG=false;
if($SHOW_DEBUG==true){
    error_reporting(E_ALL);
    ini_set('display_errors', 'On');
}
$databaseURL=$_SERVER['DOCUMENT_ROOT']."/api_container/config/connection.php";
include $databaseURL;
if(!$connect){
    //echo'we are not connected';
}else{
    //echo' connection established ...';
    class contactList{
        private $userID;
        private $limit;
        private $db_Connection;
        private $apiRequestResponse=array();
        private $friendAvatarCDN="https://www.longtact.com/images/";
        private $groupAvatarCDN="https://www.longtact.com/group_images/";
        private $courseAvatarCDN="https://www.longtact.com/course_images/";

        private function getStringWeight($stringValue){
            $totalWeight=0;
            $stringLength=strlen($stringValue);
            for($round=1; $round<=$stringLength; $round++){
                $toConvert=substr($stringValue,$round-1,$round);
                $convertedValue=ord($toConvert );
                $totalWeight+=$convertedValue;
            }
            return $totalWeight;
        }
        public function initializeData($param1,$param2,$param3){
            $this->db_Connection=$param1;
            $this->getContacts();
        }
        public function setDbConnection(){

        }
        public function decodeChar($param1){
            return mb_convert_encoding($param1,'HTML-ENTITIES','utf-8');
        }
        public function getContacts(){
            $apiRequestResponse=array();
            $connection=$this->db_Connection;
            $selectionTargets="`user`";
            $selectionConditions="user.USERNAME!='j' ";
            $selectionQuery=" SELECT * FROM $selectionTargets order by id asc limit 100 ";
            mysqli_set_charset($connection,"utf8");
            $launch_my_contacts=mysqli_query($connection, $selectionQuery );
            while($row=mysqli_fetch_assoc($launch_my_contacts)){
                $contactImage='';
                if($row['PICTURE']!=""){
                  $contactImage=$this->friendAvatarCDN.$row['PICTURE'];
                }
                /***
                  contact type 0 is direct ,contact type 1 is group
                ***/
                $apiRequestResponse[]=array("id"=>$row['ID'],"username"=>$row['USERNAME'],"avatar"=>$contactImage,'',"userID"=>$row['uid'],"contactType"=>0 );
            }
            //---------get group contacts
            $selectionGroupTargets="`courses`";
            $selectionGroupConditions="courses.COURSE_NAME!='j' ";
            $selectionGroupQuery=" SELECT * FROM $selectionGroupTargets order by id asc limit 100 ";
            mysqli_set_charset($connection,"utf8");
            $launch_my_contactsGroup=mysqli_query($connection, $selectionGroupQuery );
            while($row=mysqli_fetch_assoc($launch_my_contactsGroup)){
                $contactImage='';
                if($row['COURSE_ICON']!=""){
                  $contactImage=$this->courseAvatarCDN.$row['COURSE_ICON'];
                }
                /***
                  contact type 0 is direct ,contact type 1 is group
                ***/
                $apiRequestResponse[]=array("id"=>$row['ID'],"username"=>$row['COURSE_NAME'],"avatar"=>$contactImage,'',"userID"=>$row['UNIQUE_ID'],"contactType"=>1 );
            }
            $jsonResult=json_encode($apiRequestResponse);
            echo $jsonResult;
            die();
        }
    }
    $requestProcessor=new contactList;
    $requestProcessor->initializeData($connect,'','');

}




?>
