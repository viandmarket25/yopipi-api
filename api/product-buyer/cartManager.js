
<?php
require_once $_SERVER['DOCUMENT_ROOT']."/shorpi/config/connection.php";
require_once $_SERVER['DOCUMENT_ROOT'].'/shorpi/lib/fileUploadHelper.php';
class cartManager{
    private $db_Connection;
    private $username;
    private $userId;
    private $resultCode;
    private $role;
    private $payload;
    private $action;
    private $token;
    private $serverKey='svr_key_ping_5f2b5cdbafyfafafbqbx1b87bx9bve4e2b24_monster';
    function __construct($token,$requestType,$action,$files,$payload,$connect){
        $this->payload = json_decode($payload);
        $this->db_Connection=$connect;
        $this->action = $action;
        $this->token=$token;
        $this->getUser();
        // ::::::::: check conditions, then add to cart
        if($action=="atc"){
            $this->addToCart();
        }else if($action=="gfc"){
            $this->getFromCart();
        }else if($action=="mci"){
            $this->modifyCartItem();
        }else if($action=="rfc"){
            $this->removeFromCart();
        }
    }
    public function getUser(){
        require_once $_SERVER['DOCUMENT_ROOT']."/shorpi/vendor/jwtAuthLib.php";
        $this->token = JWT::decode($this->token, $this->serverKey,array_keys(JWT::$supported_algs));
        //print_r($this->token);
        $this->userId=$this->token->userId;
        $this->username=$this->token->username;
        $this->role=$this->token->role;
    }
    public function addToCart(){
        //	ID	PRODUCT_ID	PRICE	QUANTITY	OWNER_ID	SELECTED_VARIATIONS	MEDIA_SOURCE	DATE_	TIME_
        $connection=$this->db_Connection;
        $userId=$this->userId;
        $productId=$this->payload->productId;
        $price=$this->payload->price;
        $quantity=$this->payload->quantity;
        $selectedVariations = $this->payload->selectedVariations;
        $mediaSource=$this->payload->mediaSource;
        $date_=date('d - M - Y');   // :::[ STRING ]
        $time_=date ('h:m:s');  // :::[ STRING ]
        $targetTable=" `cart` ";
        $insertionValues= " NULL,$productId,$price,$quantity,$userId,'$selectedVariations','$mediaSource','$date_','$time_' ";
        $queryStatements=" INSERT INTO $targetTable VALUES ( $insertionValues )  ";
        $execQuery=mysqli_query($connection, $queryStatements ) or trigger_error("insertion failed: ".mysqli_error($connection), E_USER_NOTICE);
        if($execQuery){
            // :::::::::::: after a successful request, return the request result
            $this->result= json_encode(array("result_code"=>1,"result_message"=>"success","result_content"=>"" ));
            echo $this->result;
            //return 1;
        }else{
            $this->result= json_encode(array("result_code"=>1,"result_message"=>"failed"));
            echo $this->result;
            //return 0;
        }


    }
    public function removeFromCart(){


    }
    public function getFromCart(){
        $queryResult=array();
        $ownerId=$this->userId;
        $connection=$this->db_Connection;
        $targetTable="`cart`";
        $queryStatements="SELECT DISTINCT * FROM $targetTable WHERE $targetTable.OWNER_ID=$ownerId ORDER BY ID DESC";
        $execQuery=mysqli_query($connection,$queryStatements);
        $indexObject=0;
        while($row=mysqli_fetch_assoc($execQuery)){
            $productId=$row['PRODUCT_ID'];
            $targetTable_="`products`";
            $queryStatements_="SELECT DISTINCT * FROM $targetTable_ WHERE $targetTable_.ID=$productId";
            $execQuery_=mysqli_query($connection,$queryStatements_);
            if($row_=mysqli_fetch_assoc($execQuery_)){
                $row['TITLE']=$row_['TITLE'];
                $row['DESCRIPTION']=$row_['DESCRIPTION'];
                $row['STOCK_CAPACITY']=$row_['STOCK_CAPACITY'];
                $row['PRODUCT_CATEGORY']=$row_['PRODUCT_CATEGORY'];
                $row['PRODUCT_CATEGORY']=$row_['PRODUCT_CATEGORY'];
                $row['BRAND']=$row_['BRAND'];
                $showTitle="";
                $shopId=$row_['SHOP_ID'];
                $masterId=$row_['MASTER_ID'];
                // ::::::::::
                $targetTable__="`shop`";
                $queryStatements__="SELECT DISTINCT * FROM $targetTable__ WHERE $targetTable__.ID=$shopId";
                $execQuery__=mysqli_query($connection,$queryStatements__);
                if($row__=mysqli_fetch_assoc($execQuery__)){
                    $row['SHOP_ID']=$row__['ID'];
                    $row['SHOP_TITLE']=$row__['NAME'];
                    // ::::::::::
                }
                if($row['MEDIA_SOURCE']==""){
                    $_targetTable="`product_media`";
                    $_queryStatements="SELECT DISTINCT $_targetTable.MEDIA_SOURCE FROM $_targetTable WHERE $_targetTable.MASTER_ID='$masterId'  ";
                    $_execQuery=mysqli_query($connection,$_queryStatements);
                    if($_row=mysqli_fetch_assoc($_execQuery)){
                        $row['PRODUCT_AVATAR']= str_replace("/Applications/XAMPP/xamppfiles/htdocs","",$_row['MEDIA_SOURCE'] );
                    }
                }
            }
            $queryResult[]=$row;

        }
        $this->resultContent=$queryResult;
        $this->resultMessage='Created Successfully';
        $this->resultCode=1;
        echo json_encode(array("resultMessage"=>$this->resultMessage,"resultCode"=>$this->resultCode,"resultContent"=>$this->resultContent) );

    }
    public function modifyCartItem(){


    }
}
$processCart = new cartManager($_POST['auth_crd'],$_POST['requestType'],$_POST['action'],$_FILES,$_POST['payload'],$connect);
//print_r($_POST);
?>
