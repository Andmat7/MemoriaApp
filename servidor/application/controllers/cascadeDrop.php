<?php
class cascadeDrop extends CI_Controller {

    public function __construct()
    {
        parent::__construct();
        
        $this->load->database();
        $this->load->helper('url');
        $this->load->helper('form');
        $this->load->model('municipios_departamentos_model');
    
    }
    
    public function index()
    {
           //starts by running the query for the countries dropdown
         $data['countryDrop'] = $this->municipios_departamentos_model->getDepartamentos();
         
         //loads up the view with the query results
         $this->load->view('cascadeDrop/cascadeDrop', $data);
       
    }
    
    //call to fill the second dropdown with the cities
    public function buildDropCities()
    {
         //set selected country id from POST
        $id_Departamento = $this->input->post('id',TRUE);

        //run the query for the cities we specified earlier
        $districtData=$this->municipios_departamentos_model->getMunicipiobyDepartamento($id_Departamento);       
        $output = null;
        //print_r($districtData['districtDrop']);
        foreach ($districtData->result() as $row)
        {
            //here we build a dropdown item line for each query result
            $output .= "<option value='".$row->id."'>".$row->Nombre."</option>";
        }

        echo  $output;
    }
}