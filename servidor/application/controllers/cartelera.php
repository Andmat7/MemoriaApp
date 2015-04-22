 
<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Cartelera extends CI_Controller {
	function __construct()
	{
		parent::__construct();
		$this->load->helper(array('form', 'url'));
	}

	public function lista()
	{
 	    //header('Content-type: application/json');
 	    $this->db->where("EnCartelera", 1);
 	    $this->db->where("audiodescripcion = 1 AND (subtitulo = 1  OR original = 1)");
	    $query = $this->db->get('peliculas');
	    $result = $query->result();
	    $json=json_encode($result);
	    echo $_GET['callback'].'('.$json.');';
	}


	public function search($search)
	{
 	    header('Content-type: application/json');
	    $this->db->like('LOWER( Nombre )', strtolower($search));
	    $this->db->where("audiodescripcion = 1 AND (subtitulo = 1  OR original = 1)");
	    $query = $this->db->get('peliculas');
	    $result = $query->result();
	    $json=json_encode($result);
	    echo $json;
	}
}