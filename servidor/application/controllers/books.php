<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Books extends CI_Controller {
	function __construct(){
		parent::__construct();
		$this->load->helper(array('form', 'url'));
	}
	public function lista($category){
		//header('Content-type: application/json');
		header('Content-Type: application/json; charset=utf-8');
		$this->db->where("category", $category);
		$query = $this->db->get('books');
		$result = $query->result();
		$result = $this->formatResult($result);
		$json=json_encode($result);
		//  	    echo $json;
		echo isset($_GET['callback'])
		? "{$_GET['callback']}($json)"
		: $json;
	}
	private function formatResult($result_org){
		$result = $result_org;
		foreach($result as $element){
			$image = file_get_contents("./uploads/img/" . $element->img);
			$ext = pathinfo("./uploads/img/" . $element->img, PATHINFO_EXTENSION);
			$element->img = 'data:image/' . $ext . ';base64,' . base64_encode($image);
			$element->url = base_url() . 'index.php/landing_page/index/'. $element->id;
		}
		return $result;
	}
	public function categorias(){
		//header('Content-type: application/json');
		header('Content-Type: application/json; charset=utf-8');
		$this->db->select("category, COUNT(*)");
		$this->db->group_by("category");
		$query  = $this->db->get('books');
		$result = $query->result();
		$json   = json_encode($result);
		//  	    echo $json;
		echo isset($_GET['callback'])
		? "{$_GET['callback']}($json)"
		: $json;
	}
	
	public function search($searchString){
		if( strlen( $searchString ) > 3 ){
			header('Content-Type: application/json; charset=utf-8');
			$this->db->like('LOWER( tags )', strtolower($searchString) );
			$query  = $this->db->get('books');
			$result = $query->result();
			$result = $this->formatResult($result);
			$json   = json_encode($result);
		}else{
			$json   = json_encode( array () );
		}
		echo isset($_GET['callback'])
		? "{$_GET['callback']}($json)"
		: $json;
	}
}