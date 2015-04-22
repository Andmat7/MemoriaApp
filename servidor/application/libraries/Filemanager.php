<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 
class Filemanager{
 
  public function createFolder($folder){
    if (!is_dir($folder)){
      if(!mkdir($folder, 0777, true)) {
	die('Fallo al crear las carpetas...');
      }
    }
  }
  
}

?>