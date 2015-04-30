<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class EPubs extends CI_Controller {
	public function lista()	{
		if($this->session->userdata('logged_in'))		{
			$this->load->view('header');
			$this->load->view('navbar');
			$this->load->view('epubs/lista');
			$this->load->view('footer');
		}else{
			redirect('login', 'refresh');
		}
	}
	public function view()	{
		if($this->session->userdata('logged_in'))
		{
			$this->load->view('header');
			$this->load->view('navbar');
			$this->load->view('epubs/lista');
			$this->load->view('footer');
		}else{
			redirect('login', 'refresh');
		}
	}
	public function agregar(){
		if($this->session->userdata('logged_in'))	{
			$this->load->helper('form');
			$this->load->view('header');
			$this->load->view('navbar');
			$this->load->view('epubs/agregar');
			$this->load->view('footer');
			
		}else{
			//If no session, redirect to login page
			redirect('login', 'refresh');
		}
	}
	public function new_entry_DB(){
		if($this->session->userdata('logged_in')){
			//$this->load->helper(array('form', 'url'));
			$this->load->library('form_validation');
			$this->form_validation->set_rules('titulo', 'Título', 'required');
			$this->form_validation->set_rules('desc', 'Descripción', 'required');
			$this->form_validation->set_rules('isbn', 'ISBN', 'is_natural');
// 			$this->form_validation->set_rules('imagen', 'Imágen de portada', 'required');
// 			$this->form_validation->set_rules('epub', 'EPUB', 'required');
			if ($this->form_validation->run() == FALSE){
				$this->load->helper('form');
				$this->load->view('header');
				$this->load->view('navbar');
				$this->load->view('epubs/agregar');
				$this->load->view('footer');
			}else{
				//Validar archivos subidos
				if (!$_FILES["imagen"]["tmp_name"] || !$_FILES["epub"]["tmp_name"]) { // if img or epub not chosen 
					$this->load->helper('form');
					$this->load->view('header');
					$this->load->view('navbar');
					if (!$_FILES["imagen"]["tmp_name"]){
						$this->load->view('error_div', array ('error' => 'Es necesario escoger una imagen para la portada del libro.') );
					}
					if (!$_FILES["epub"]["tmp_name"]){
						$this->load->view('error_div', array ('error' => 'Es necesario escoger un archivo EPUB.') );
					}
					$this->load->view('epubs/agregar');
					$this->load->view('footer');
					return;
				}else{ // Validacion exitosa
					$titulo = $this->input->post('titulo');
					$desc   = $this->input->post('desc');
					$isbn   = $this->input->post('isbn');
					$tags   = $this->getTags($isbn);
					$data   = array( 
						'title'        => $titulo,
						'description'  => $desc, 
						'ISBN'         => $isbn, 
						'img'          => '', 
						'epub'         => '',
						'tags'         => '',
					);
					$this->db->insert('books', $data);
					$id = $this->db->insert_id();
					
					$this->load->library('filemanager');
					$this->filemanager->createFolder("./uploads/epub/");
					$this->filemanager->createFolder("./uploads/img/");
					//el nombre de la imagen y el epub es el ID
		//************GUARDAR IMAGEN
					$uploadPath   = "./uploads/img/";
					$fileExt 			= pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
					$imgFileName  = $id . "." . $fileExt ;
					$fileTmpLoc   = $_FILES["imagen"]["tmp_name"]; // File in the PHP tmp folder 
					$fileType     = $_FILES["imagen"]["type"]; // The type of file it is 
					$fileSize     = $_FILES["imagen"]["size"]; // File size in bytes 
					$fileErrorMsg = $_FILES["imagen"]["error"]; // 0 for false... and 1 for true 
					if(!move_uploaded_file($fileTmpLoc, $uploadPath . $imgFileName)){
						echo "move_uploaded_file function failed"; 
						exit();
					}
		//********GUARDAR EPUB
					$uploadPath   = "./uploads/epub/";
					$fileExt 			= pathinfo($_FILES['epub']['name'], PATHINFO_EXTENSION);
					$epubFileName = $id . "." . $fileExt ;
					$fileTmpLoc   = $_FILES["epub"]["tmp_name"]; // File in the PHP tmp folder 
					$fileType     = $_FILES["epub"]["type"]; // The type of file it is 
					$fileSize     = $_FILES["epub"]["size"]; // File size in bytes 
					$fileErrorMsg = $_FILES["epub"]["error"]; // 0 for false... and 1 for true 
					if(!move_uploaded_file($fileTmpLoc, $uploadPath . $epubFileName)){
						echo "move_uploaded_file function failed";
						exit();
					}
					$data = array( 
					'title'        => $titulo,
					'description'  => $desc, 
					'ISBN'         => $isbn, 
					'img'          => $imgFileName, 
					'epub'         => $epubFileName,
					'tags'         => $tags,
					);
					$this->db->where('id', $id);
					$this->db->update('books', $data);
					$this->agregar_exito();
				}
			}
		}else{
			//If no session, redirect to login page
			redirect('login', 'refresh');
		}
	}
	public function agregar_exito(){
		$this->load->helper('form');
		$this->load->view('header');
		$this->load->view('navbar');
		$this->load->view('epubs/agregar_exito');
		$this->load->view('footer');
	}
	public function borrar($id){
		if( $this->session->userdata('logged_in') ){
			$query = $this->db->get_where( "books",array('id' => $id) );
			unlink ("./uploads/img/" . $query->result()['0']->img);
			unlink ("./uploads/epub/" . $query->result()['0']->epub );
			$this->db->where('id', $id);
			$this->db->delete('books');
			$this->lista();
		}else{
			//If no session, redirect to login page
			redirect('login', 'refresh');
		}
	}
	public function editar($id){
		if($this->session->userdata('logged_in')){
			$query = $this->db->get_where("books",array('id' => $id));
			$data = $query->result()['0'];
			$this->load->helper('form');
			$this->load->view('header');
			$this->load->view('navbar');
			$isbn = $data->ISBN;
			$imagen_file = "./uploads/img/" . $data->img;
			$this->session->set_userdata( array('imagen_portada' => $imagen_file , 'isbn' => $isbn));
			$this->load->view('epubs/imagen_portada', array('imagen' => base_url() . $imagen_file));
			$this->load->view('epubs/editar', $data);
			$this->load->view('footer');
		}else{
			//If no session, redirect to login page
			redirect('login', 'refresh');
		}
	}
	public function save_entry_DB(){
		if($this->session->userdata('logged_in')){
			//$this->load->helper(array('form', 'url'));
			$this->load->library('form_validation');
			$this->form_validation->set_rules('titulo', 'Título', 'required');
			$this->form_validation->set_rules('desc', 'Descripción', 'required');
			$this->form_validation->set_rules('isbn', 'ISBN', 'is_natural');
			// 			$this->form_validation->set_rules('imagen', 'Imágen de portada', 'required');
			// 			$this->form_validation->set_rules('epub', 'EPUB', 'required');
			if ($this->form_validation->run() == FALSE){
				$this->load->helper('form');
				$data = array( 
					'title'       => set_value('titulo'),
					'ISBN'        => set_value('isbn'),
					'description' => set_value('desc'),
					'id'          => set_value('id'),
				);
				$this->load->view('header');
				$this->load->view('navbar');
				$this->load->view('epubs/imagen_portada', array( 'imagen' => base_url() . $this->session->userdata("imagen_portada") ));
				$this->load->view('epubs/editar', $data);
				$this->load->view('footer');
			}else{
				$titulo        = $this->input->post('titulo');
				$desc          = $this->input->post('desc');
				$isbn          = $this->input->post('isbn');
				$id            = $this->input->post('id');
				$this->db->where('id', $id);
				$query         = $this->db->get('books');
				$data          = $query->result()['0'];
				$imgFileName   = $data->img;
				$epubFileName  = $data->epub;
				$tags          = $this->getTags($isbn);
				$this->load->library('filemanager');
				$this->filemanager->createFolder("./uploads/epub/");
				$this->filemanager->createFolder("./uploads/img/");
				//el nombre de la imagen y el epub es el codigo ISBN
				//************GUARDAR IMAGEN
				if ($_FILES["imagen"]["tmp_name"]){
					$uploadPath   = "./uploads/img/";
					$fileExt 			= pathinfo($_FILES['imagen']['name'], PATHINFO_EXTENSION);
					$imgFileName  = $id . "." . $fileExt ;
					$fileTmpLoc   = $_FILES["imagen"]["tmp_name"]; // File in the PHP tmp folder 
					$fileType     = $_FILES["imagen"]["type"]; // The type of file it is 
					$fileSize     = $_FILES["imagen"]["size"]; // File size in bytes 
					$fileErrorMsg = $_FILES["imagen"]["error"]; // 0 for false... and 1 for true 
					if ($fileTmpLoc) { // if file chosen
						if(move_uploaded_file($fileTmpLoc, $uploadPath . $imgFileName)){
						}else{
							echo "move_uploaded_file function failed"; 
							exit();
						}
					}
				}
				//********GUARDAR EPUB
				if ($_FILES["epub"]["tmp_name"]){
					$uploadPath   = "./uploads/epub/";
					$fileExt 			= pathinfo($_FILES['epub']['name'], PATHINFO_EXTENSION);
					$epubFileName = $id . "." . "epub" ;
					$fileTmpLoc   = $_FILES["epub"]["tmp_name"]; // File in the PHP tmp folder 
					$fileType     = $_FILES["epub"]["type"]; // The type of file it is 
					$fileSize     = $_FILES["epub"]["size"]; // File size in bytes 
					$fileErrorMsg = $_FILES["epub"]["error"]; // 0 for false... and 1 for true 
					if ($fileTmpLoc) { // if file chosen 
						if(move_uploaded_file($fileTmpLoc, $uploadPath . $epubFileName)){
						}else{
							echo "move_uploaded_file function failed";
							exit();
						}
					}
				}
				$data = array(
					'title'       => $titulo,
					'description' => $desc,
					'ISBN'        => $isbn,
					'img'         => $imgFileName,
					'epub'        => $epubFileName,
					'tags'        => $tags,
				);
				$this->db->where('id', $id);
				$this->db->update('books', $data); 
				$this->agregar_exito();
			}
		}else{
			//If no session, redirect to login page
			redirect('login', 'refresh');
		}
	}
	public function is_isbn_unique($isbn){
		$isbn_old = $this->session->userdata("isbn");
		if ($isbn == $isbn_old){
			return TRUE;
		}else{
			$query = $this->db->get_where("books",array('ISBN' => $isbn));
			if($query->num_rows() > 0){
				$this->form_validation->set_message(' El campo %s debe contener un valor único."');
				return FALSE;
			}else{
				return TRUE;
			}
		}
	}
	public function getTags($isbn){
		$config['hostname'] = 'localhost';//192.168.0.80
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
				$i = 0;
				$tags = "";
				foreach($bookInfo as $datafield){
					if ($datafield['tag'] == 650){
						foreach($datafield as $subfield){
							if($subfield['code'] == 'a'){
								$tags .= (string)$subfield . " ; ";
								$i ++;
							}
						}
					}
				}
				return $tags;
			}
		}
		return FALSE;
	}
}