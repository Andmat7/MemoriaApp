<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
session_start(); //we need to call PHP's session object to access it through CI
class Peliculas extends CI_Controller {
  
  function __construct()
  {
    parent::__construct();
    
    ini_set('display_errors',1);
    ini_set('display_startup_errors',1);
    error_reporting(-1);
    $this->load->helper('form');  
  }
  
  function index()
  {
    if($this->session->userdata('logged_in'))
    {
      $session_data = $this->session->userdata('logged_in');
      $data['username'] = $session_data['username'];
      $this->load->view('header');
      $this->load->view('navbar');
      $this->load->view('home_view', $data);
      $this->load->view('footer');
      
    }
    else
    {
      
      redirect('login', 'refresh');
    }
  }
  public function listado($value='')
  {
    
  }
  public function agregar()
  {
    if($this->session->userdata('logged_in'))
    {
      $session_data = $this->session->userdata('logged_in');
      $data['username'] = $session_data['username'];
      $this->load->view('header');
      $this->load->view('navbar');
      $this->load->view('add_movie_view', $data);
      $this->load->view('footer');
      
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
    
  }
  public function example_url()
  {
    sleep(5);
    if($this->session->userdata('logged_in'))
    {
      $response_array= array('success' => 1,
      'message_error'=>'se danio',
      'message_success'=>'funciono',
      'time'=>600
      );
      
    }else{
      $response_array= array('success' => 0,
      'message_error'=>'no tiene acceso',
      'message_success'=>'funciono'
      );
    }
    echo json_encode($response_array);
    exit();
    
  }
  public function tables()
  {
    if($this->session->userdata('logged_in'))
    {
      $this->load->view('header');
      $this->load->view('navbar');

      $this->load->view('peliculas/tables');
      
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
    
  }
  public function name_description($value='')
  {
    if($this->session->userdata('logged_in'))
    {
      
      $this->load->view('header');
      $this->load->view('navbar');
      $data=array();
      $data['number']=1;
      $data['title']='Ingresa nombre y descripción';
      $this->load->view('peliculas/title_number',$data);
      $this->load->view('peliculas/description_name',$data);
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }
  
  public function new_entry_DB (){
    if($this->session->userdata('logged_in'))
    {
      //$this->load->helper(array('form', 'url'));
      $this->load->library('form_validation');
      $this->form_validation->set_rules('name', 'Nombre', 'required');
      $this->form_validation->set_rules('desc', 'Descripcion', 'required');
    

      $nombre = $this->input->post('name');
      $desc = $this->input->post('desc');
      $EnCartelera=FALSE;
      if ($this->input->post('EnCartelera')) {
        $EnCartelera=TRUE;
      }
      if ($this->form_validation->run() == FALSE)
      {
        $this->load->view('header');
        $this->load->view('navbar');
        $data=array();
        $data['number']=1;
        $data['title']='Ingresa nombre y descripción';
        $this->load->view('peliculas/errors',$data);
        $this->load->view('peliculas/title_number',$data);
        $this->load->view('peliculas/description_name',$data);
        $this->load->view('footer');
      }
      else
      {
        $filename = $this->createFilename($nombre);
        $sql = "INSERT INTO `peliculas` (`Nombre`, `Descripcion`, `File`,`EnCartelera`) VALUES (?, ?, ?, ?);";
        
        $this->db->query($sql, array($nombre , $desc, $filename,$EnCartelera )); 
        $this->session->set_userdata(array('pelicula_file' => $filename));
        $this->session->set_userdata(array('pelicula_nombre' => $nombre));
        $this->audio_original();
      }

      
      
      
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }

  }

  public function audio_original(){
    if($this->session->userdata('logged_in'))
    {
      
      $this->load->view('header');
      $this->load->view('navbar');
      $data=array();
      $data['number']=2;
      $data['title']='Subir audio original de la película';
      $this->load->view('peliculas/title_number',$data);
      $data = array('title' => $this->session->userdata('pelicula_nombre'));
      $this->load->view('peliculas/audio_original', $data);
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }
  
  public function subtitulos(){
    if($this->session->userdata('logged_in'))
    {
      
      $this->load->view('header');
      $this->load->view('navbar');
      $data=array();
      $data['number']=4;
      $data['title']='Subir Subtitulo de la película';
      $this->load->view('peliculas/title_number',$data);
      $data = array('title' => $this->session->userdata('pelicula_nombre'));
      $this->load->view('peliculas/subtitulo', $data);
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }
  
  public function subir_AO(){
    if($this->session->userdata('logged_in'))
    {
      $this->load->library('filemanager');
      $this->filemanager->createFolder("./uploads/original/");
      
      $uploadPath = "./uploads/";
      $fileName = $this->session->userdata('pelicula_file');

      $fileTmpLoc = $_FILES["audioOriginal"]["tmp_name"]; // File in the PHP tmp folder 
      $fileType = $_FILES["audioOriginal"]["type"]; // The type of file it is 
      $fileSize = $_FILES["audioOriginal"]["size"]; // File size in bytes 
      $fileErrorMsg = $_FILES["audioOriginal"]["error"]; // 0 for false... and 1 for true 

      if (!$fileTmpLoc) { // if file not chosen 
        echo "ERROR: Please browse for a file before clicking the upload button."; exit(); 
	
      } 
      if(move_uploaded_file($fileTmpLoc, $uploadPath . $fileName)){ 
        exec (escapeshellcmd("/usr/bin/avconv -y -i " . $uploadPath . $fileName ." -vn -ac 1 -ar 8000 -t 00:20:00 -f wav " . $uploadPath . "original/" . $fileName . "_OR.wav" ));
        unlink ($uploadPath . $fileName);
        $data = array(
               'original' => 1
            );
        $this->db->where('File',$fileName ); 
        $this->db->update('peliculas',$data);
        echo "success";
      } else {
        echo "move_uploaded_file function failed"; 
	
      }
    }else{
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  
  
  }

public function subir_Sub(){
    if($this->session->userdata('logged_in'))
    {
      $this->load->library('filemanager');
      $this->filemanager->createFolder("./uploads/subtitulos/");
      
      $uploadPath = "./uploads/subtitulos/";
      $fileName = $this->session->userdata('pelicula_file');
      

      $fileTmpLoc = $_FILES["audioOriginal"]["tmp_name"]; // File in the PHP tmp folder 
      $fileType = $_FILES["audioOriginal"]["type"]; // The type of file it is 
      $fileSize = $_FILES["audioOriginal"]["size"]; // File size in bytes 
      $fileErrorMsg = $_FILES["audioOriginal"]["error"]; // 0 for false... and 1 for true 
      $fileErrorMsg = $_FILES["audioOriginal"]["error"];
      
      if (!$fileTmpLoc) { // if file not chosen 
        echo "ERROR: Please browse for a file before clicking the upload button."; exit(); 
  
      } 
      $path = $_FILES['audioOriginal']['name'];
      $ext = pathinfo($path, PATHINFO_EXTENSION);
      if (strtolower ( $ext!='xml' )) {
        echo "ERROR: Asegurese de que el archivo sea xml."; exit(); 
      }
      if(move_uploaded_file($fileTmpLoc, $uploadPath . $fileName.'.xml')){ 
        
        //unlink ($uploadPath . $fileName);
        $data = array(
               'subtitulo' => 1
        );
        $this->db->where('File',$fileName ); 
        $this->db->update('peliculas',$data);

        
        echo "success";
      } else {
        echo "move_uploaded_file function failed"; 
  
      }
    }else{
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  
  
  }

  public function subir_AD(){
    if($this->session->userdata('logged_in'))
    {
      $this->load->library('filemanager');
      $this->filemanager->createFolder("./uploads/descripcion/");
      
      $uploadPath = "./uploads/";
      $fileName = $this->session->userdata('pelicula_file');
      //       $fileName = $_FILES["audioOriginal"]["name"]; // The file name 
      $fileTmpLoc = $_FILES["audioOriginal"]["tmp_name"]; // File in the PHP tmp folder 
      $fileType = $_FILES["audioOriginal"]["type"]; // The type of file it is 
      $fileSize = $_FILES["audioOriginal"]["size"]; // File size in bytes 
      $fileErrorMsg = $_FILES["audioOriginal"]["error"]; // 0 for false... and 1 for true 
      if (!$fileTmpLoc) { // if file not chosen 
        echo "ERROR: Please browse for a file before clicking the upload button."; exit(); 
	
      } 
      if(move_uploaded_file($fileTmpLoc, $uploadPath . $fileName)){
        exec (escapeshellcmd("/usr/bin/avconv -y -i " . $uploadPath . $fileName ." -vn -ac 1 -maxrate 40k -minrate 40k -b 40k -ar 32000 -f mp3 " . $uploadPath . "descripcion/" . $fileName . "_AD.mp3" ));
        unlink ($uploadPath . $fileName);
        echo "success";
        
        $data = array(
               'audiodescripcion' => 1
            );

        $this->db->where('File',$fileName ); 
        $this->db->update('peliculas',$data);

      } else {
        echo "move_uploaded_file function failed"; 
	
      }
    }else{
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
    
    
  }
  
  public function audio_descripcion(){
    if($this->session->userdata('logged_in'))
    {
      
      $this->load->view('header');
      $this->load->view('navbar');
      $data=array();
      $data['number']=3;
      $data['title']='Subir audio descripción de la película';
      $this->load->view('peliculas/title_number',$data);
      $data = array('title' => $this->session->userdata('pelicula_nombre'));
      $this->load->view('peliculas/audio_descripcion', $data);
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
    
  }
  


  public function finalizar(){
    if($this->session->userdata('logged_in'))
    {
      
      $this->load->view('header');
      $this->load->view('navbar');
      $this->load->view('peliculas/finalizar');
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
    
  }
  
  
  public function borrar($id){
    if($this->session->userdata('logged_in'))
    {
      $query = $this->db->get_where("peliculas",array('id' => $id));
      
      unlink ("./uploads/original/" . $query->result()['0']->File . "_OR.wav");
      unlink ("./uploads/descripcion/" . $query->result()['0']->File . "_AD.mp3");
      $sql ="DELETE FROM `peliculas` WHERE `id`=?;";
      $this->db->query($sql, array($id)); 
      
      $this->tables();
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }
  
  public function editar($id){
    if($this->session->userdata('logged_in'))
    {
      $query = $this->db->get_where("peliculas",array('id' => $id));
      $data = $query->result()['0'];
      $filename = $data->File;
      $nombre = $data->Nombre;
      $this->session->set_userdata(array('pelicula_file' => $filename));
      $this->session->set_userdata(array('pelicula_nombre' => $nombre));
      $this->session->set_userdata(array('pelicula_audiodescripcion' => $data->audiodescripcion));
      $this->session->set_userdata(array('pelicula_original' => $data->original));
      $this->session->set_userdata(array('pelicula_subtitulo' => $data->subtitulo));
      $this->load->view('header');
      $this->load->view('navbar');
      $this->load->view('peliculas/editar', $data);
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }
  
  public function editar_AO(){
    if($this->session->userdata('logged_in'))
    {
      
      $this->load->view('header');
      $this->load->view('navbar');
      $data=array();
      $data['number']=2;
      $data['title']='Subir audio original de la película';
      $data['audiodescripcion']=$this->session->userdata('pelicula_audiodescripcion');
      $this->load->view('peliculas/title_number',$data);
      
      
      $data = array(
        'title' => $this->session->userdata('pelicula_nombre')
        );
      $this->load->view('peliculas/editar_AO', $data);
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }
  public function editar_AD(){
    if($this->session->userdata('logged_in'))
    {
      
      $this->load->view('header');
      $this->load->view('navbar');
      $data=array();
      $data['number']=3;
      $data['title']='Subir audio descripción de la película';
      $this->load->view('peliculas/title_number',$data);
      $data = array('title' => $this->session->userdata('pelicula_nombre'));
      $this->load->view('peliculas/editar_AD', $data);
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
    
  }
      
  public function editarSave(){
    if($this->session->userdata('logged_in'))
    {
      
      $nombre_old = $this->session->userdata("pelicula_file");
      $nombre = $this->input->post('name');
      $desc = $this->input->post('desc');
      $filename = $this->createFilename($nombre);
      $EnCartelera=FALSE;
      
      if ($this->input->post('EnCartelera')) {
        $EnCartelera=TRUE;
      }
      
      $data = array(
               'Nombre' => $nombre,
               'Descripcion' => $desc,
               'File' => $filename,
               'EnCartelera' => $EnCartelera,
            );

      $this->db->where('File', $nombre_old);
      $this->db->update('peliculas', $data); 


      /*$sql ="DELETE FROM `peliculas` WHERE `File`=?;";
      $this->db->query($sql, array($nombre_old)); 
      
      $sql = "INSERT INTO `peliculas` (`Nombre`, `Descripcion`, `File`) VALUES (?, ?, ?);";
      $this->db->query($sql, array($nombre , $desc, $filename )); */
      
      $this->session->set_userdata(array('pelicula_file' => $filename));

      if (file_exists (  "./uploads/original/" . $nombre_old . "_OR.wav" )) {
        rename ("./uploads/original/" . $nombre_old . "_OR.wav", "./uploads/original/" . $filename . "_OR.wav");
      }
      if (file_exists (  "./uploads/descripcion/" . $nombre_old . "_AD.mp3" )) {
        rename ("./uploads/descripcion/" . $nombre_old . "_AD.mp3", "./uploads/descripcion/" . $filename . "_AD.mp3");
      }
      if (file_exists (  "./uploads/subtitulos/" . $nombre_old . ".xml" )) {
        rename ("./uploads/subtitulos/" . $nombre_old . ".xml", "./uploads/subtitulos/" . $filename . ".xml");
      }
      
      
      $this->editar_AO();
      
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }
  
  public function finalizar_edicion(){
    if($this->session->userdata('logged_in'))
    {
      
      $this->load->view('header');
      $this->load->view('navbar');
      $this->load->view('peliculas/finalizar_edicion');
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }
  
  public function createFilename($string) {
    $string = str_replace(' ', '-', $string); // Replaces all spaces with hyphens.
    $string = preg_replace('/[^A-Za-z0-9\-]/', '', $string); // Removes special chars.
    
    $string = preg_replace('/-+/', '-', $string); // Replaces multiple hyphens with single one.
    return strtolower ($string);
  }
  


}

?>