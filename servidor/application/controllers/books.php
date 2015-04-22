<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Books extends CI_Controller {
	function __construct()
	{
		parent::__construct();
		$this->load->helper(array('form', 'url'));
	}

	public function lista()
	{
 	    //header('Content-type: application/json');
 	    header('Content-Type: application/json; charset=utf-8');
	    $query = $this->db->get('books');
	    $result = $query->result();
	    $json=json_encode($result);
	    echo $json;
	}


	public function search($search)
	{
		
 	    
	    $this->db->like('LOWER( Nombre )', strtolower($search));
	    $this->db->where("audiodescripcion = 1 AND (subtitulo = 1  OR original = 1)");
	    $query = $this->db->get('peliculas');
	    $result = $query->result();
	    $json=json_encode($result);
	    echo $json;
	}
}