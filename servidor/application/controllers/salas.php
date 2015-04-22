<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
session_start(); //we need to call PHP's session object to access it through CI
class Salas extends CI_Controller {
  
  function __construct()
  {
    parent::__construct();
    
    ini_set('display_errors',1);
    ini_set('display_startup_errors',1);
    error_reporting(-1);
    $this->load->helper('form');  
    $this->load->model('municipios_departamentos_model');
  }
  
  function index()
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



  function listadosalas(){
   if($this->session->userdata('logged_in'))
    {
      $this->load->view('header');
      $this->load->view('navbar');

      $this->load->view('salas/listadosalas');
      
      $this->load->view('footer');
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
      $this->session->set_userdata(array('sala_id' => $id));
      $query = $this->db->get_where("salas",array('id' => $id));
      $data = $query->result()['0'];
      $data->countryDrop = $this->municipios_departamentos_model->getDepartamentos();
      $data->MunicipioDrop = $this->municipios_departamentos_model->getMunicipiobyDepartamentoArray($data->Departamento);
      $this->load->view('header');
      $this->load->view('navbar');
      $this->load->view('salas/editar', $data);
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
     
      $sql ="DELETE FROM `salas` WHERE `id`=?;";
      $this->db->query($sql, array($id)); 
      
      $this->listadosalas();
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }

  public function editarSave()
  {
    if($this->session->userdata('logged_in'))
    {
      $sala_id = $this->session->userdata("sala_id");
      $this->load->library('form_validation');
      $this->form_validation->set_rules('name', 'Nombre', 'required');
      $this->form_validation->set_rules('direccion', 'Dirección', 'required');
      $this->form_validation->set_rules('municipio', 'Municipio', 'required|numeric');
      $this->form_validation->set_rules('departamento', 'Departamento', 'required|numeric');
      $datasql=array();
      $datasql['NombreEstablecimiento'] = $this->input->post('name');
      $datasql['direccion'] = $this->input->post('direccion');
      $datasql['Ciudad'] = $this->input->post('municipio');
      $datasql['Departamento'] = $this->input->post('departamento');
      
      $datasql['Sala'] = $this->input->post('sala');
      $datasql['Rampas'] = $this->input->post('sala');
      $datasql['Transporte'] = $this->input->post('transporte');
      $datasql['Rampas'] = $this->input->post('rampas');
      $datasql['Escaleras'] = $this->input->post('escaleras');
      $datasql['otrasopciones'] = $this->input->post('otros');
            
      $datasql['bano']=0;
      if ($this->input->post('bano')) {
        
        
        $datasql['bano']=1 ;
      }

      
      
      if ($this->form_validation->run() == FALSE)
      {
        $this->load->view('header');
        $this->load->view('navbar');
        $data=array();
        $data['number']=1;
        $data['title']='Ingresa datos de  la sala';
        $data['countryDrop'] = $this->municipios_departamentos_model->getDepartamentos();
        $this->load->view('peliculas/title_number',$data);
        $this->load->view('peliculas/errors',$data);
        $this->load->view('salas/editar',$data);
        $this->load->view('footer');
      }
      else
      {
        $this->db->where('id', $sala_id);
        $this->db->update('salas', $datasql); 
        $this->listadosalas();
      }
  
      

      
      
      
      
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }
  public function agregarsala()
  {

    if($this->session->userdata('logged_in'))
    {
      $session_data = $this->session->userdata('logged_in');
      $data['username'] = $session_data['username'];
      $this->load->view('header');
      $this->load->view('navbar');
      $this->load->view('salas/agregarsala', $data);
      $this->load->view('footer');
      
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
    
  }
  public function agregar_info()
  {
    if($this->session->userdata('logged_in'))
    {
      
      $this->load->view('header');
      $this->load->view('navbar');
      $data=array();
      $data['number']=1;
      $data['title']='Ingresa datos de  la sala';
      $data['countryDrop'] = $this->municipios_departamentos_model->getDepartamentos();
      $this->load->view('peliculas/title_number',$data);
      $this->load->view('salas/infosala',$data);
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
  }


public function new_entry_DB(){
    if($this->session->userdata('logged_in'))
    {
      //$this->load->helper(array('form', 'url'));
      $this->load->library('form_validation');
      $this->form_validation->set_rules('name', 'Nombre', 'required');
      $this->form_validation->set_rules('direccion', 'Dirección', 'required');
      $this->form_validation->set_rules('municipio', 'Municipio', 'required|numeric');
      $this->form_validation->set_rules('departamento', 'Departamento', 'required|numeric');
      $datasql=array();
      $datasql['NombreEstablecimiento'] = $this->input->post('name');
      $datasql['direccion'] = $this->input->post('direccion');
      $datasql['Ciudad'] = $this->input->post('municipio');
      $datasql['Departamento'] = $this->input->post('departamento');
      
      $datasql['Sala'] = $this->input->post('sala');
      $datasql['Rampas'] = $this->input->post('sala');
      $datasql['Transporte'] = $this->input->post('transporte');
      $datasql['Rampas'] = $this->input->post('rampas');
      $datasql['Escaleras'] = $this->input->post('escaleras');
      $datasql['otrasopciones'] = $this->input->post('otros');
            
      $bano=0;
      if ($this->input->post('bano')) {
        $datasql['bano']=1 ;

      }

      
      

      if ($this->form_validation->run() == FALSE)
      {
        $this->load->view('header');
        $this->load->view('navbar');
        $data=array();
        $data['number']=1;
        $data['title']='Ingresa datos de  la sala';
        $data['countryDrop'] = $this->municipios_departamentos_model->getDepartamentos();
        $this->load->view('peliculas/title_number',$data);
        $this->load->view('peliculas/errors',$data);
        $this->load->view('salas/infosala',$data);
        $this->load->view('footer');
      }
      else
      {
        $this->db->insert('salas', $datasql);
        $this->finalizar();
      }

      
      
      
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
      $this->load->view('salas/finalizar');
      $this->load->view('footer');
    }
    else
    {
      //If no session, redirect to login page
      redirect('login', 'refresh');
    }
    
  }

  public function listDepartamentos(){
    header('Content-type: application/json');
    $sql = "SELECT DISTINCT departamentos.nombre, departamentos.id
      FROM departamentos
      INNER JOIN salas
      ON departamentos.id=salas.departamento
      ORDER BY departamentos.nombre;";
    
    $query = $this->db->query($sql);
    $result = $query->result();
    $json=json_encode($result);
    echo $json;

  }

  public function listMunicipios($idDepartamento){
    header('Content-type: application/json');
    $sql = "SELECT DISTINCT municipios.Nombre, municipios.id
      FROM municipios
      INNER JOIN salas
      ON municipios.id=salas.Ciudad 
      WHERE municipios.departamento=? 
      ORDER BY municipios.Nombre;";

    $query = $this->db->query($sql,  $idDepartamento);
    $result = $query->result();
    $json=json_encode($result);
    echo $json;

  }

  public function listSalas($idMunicipio){
    header('Content-type: application/json');
    $sql = "SELECT Sala, NombreEstablecimiento, id
      FROM salas
      WHERE Ciudad=? 
      ORDER BY Sala;";

    $query = $this->db->query($sql,  $idMunicipio);
    $result = $query->result();
    $json=json_encode($result);
    echo $json;

  }
  public function infoSala($idSala){
    header('Content-type: application/json');
    $sql = "SELECT * 
      FROM salas
      WHERE id=? ";

    $query = $this->db->query($sql,  $idSala);
    $result = $query->result();
    $json=json_encode($result);
    echo $json;
    
  }

  

}

?>