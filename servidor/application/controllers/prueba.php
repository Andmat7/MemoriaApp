<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Prueba extends CI_Controller {
	
	function __construct()
	{
		parent::__construct();
	}
	
	function index()
	{
		$this->getTags('11111111');
	}
	public function getTags($isbn){
		$config['hostname'] = 'localhost';
		$config['username'] = 'app_cmh';
		$config['password'] = 'S34rch%CMH$#';
		$config['database'] = 'koha_biblio';
		$config['dbdriver'] = 'mysql';
		$config['dbprefix'] = '';
		$config['pconnect'] = TRUE;
		$config['db_debug'] = TRUE;
		$config['cache_on'] = FALSE;
		$config['cachedir'] = '';
		$config['char_set'] = 'utf8';
		$config['dbcollat'] = 'utf8_general_ci';
		$kohaDB = $this->load->database($config, TRUE);
		$kohaDB->select('marcxml');
		$kohaDB->where('isbn', $isbn);
		$query = $kohaDB->get('biblioitems',1);
		if($query->num_rows() > 0){
			$data = $query->result()['0'];
			$xmlData = $data->marcxml;
			$bookInfo = simplexml_load_string($xmlData);
// 			print_r($bookInfo);
			if ($bookInfo !== false){
				$i= 0;
				$tag= '';
				foreach($bookInfo as $datafield){
					if ($datafield['tag'] == 650){
						foreach($datafield as $subfield){
							if($subfield['code'] == 'a'){
								$i++;
								echo $subfield;
								echo "<br/>";
								$tag .= (string)$subfield;
								print_r($tag);
								print_r("<br/>");
							}
						}
					}
				}
			}
		}
		
	}
}