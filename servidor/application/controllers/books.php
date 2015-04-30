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
	    foreach($result as $element){
				$image = file_get_contents("./uploads/img/" . $element->img);
				$ext = pathinfo("./uploads/img/" . $element->img, PATHINFO_EXTENSION);
				$element->img = 'data:image/' . $ext . ';base64,' . base64_encode($image);
			}

	    $json=json_encode($result);
//  	    echo $json;
echo isset($_GET['callback'])
? "{$_GET['callback']}($json)"
: $json;
 	}


	public function search($search)
	{
	    $this->db->like('LOWER( Nombre )', strtolower($search));
	    $this->db->where("audiodescripcion = 1 AND (subtitulo = 1  OR original = 1)");
	    $query = $this->db->get('peliculas');
	    $result = $query->result();
	    $json=json_encode($result);
// 	    echo $json;
			echo isset($_GET['callback'])
					? "{$_GET['callback']($json)}"
					: $json;
	}
}