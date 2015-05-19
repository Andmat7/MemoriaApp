<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Landing_page extends CI_Controller {
	public function index( $id ){
		$this->db->where("id", $id);
		$query  = $this->db->get('books');
		$result = $query->result();
		$this->load->view('landing_page', $result[0]);
	}
}