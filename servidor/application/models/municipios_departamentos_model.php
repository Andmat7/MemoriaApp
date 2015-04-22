<?php
class municipios_departamentos_model extends CI_Model {

    public function __construct()
    {
        $this->load->database();
    }
    
    //fill your contry dropdown
    public function getDepartamentos()
    {
        $this->db->select('id,nombre');
        $this->db->from('departamentos'); 
        $query = $this->db->get();
        foreach($query->result_array() as $row){
            $data[$row['id']]=$row['nombre'];
        }
        return $data;
    }
    
//fill your cities dropdown depending on the selected city
    public function getMunicipiobyDepartamento($id_Departamento=string)
    {
        $this->db->select('id,Nombre');
        $this->db->from('municipios');
        $this->db->where('departamento',$id_Departamento); 
        $query = $this->db->get();
         
        return $query;
    }
    public function getMunicipiobyDepartamentoArray($id_Departamento=string)
    {
        $this->db->select('id,Nombre');
        $this->db->from('municipios'); 
        $query = $this->db->get();
        foreach($query->result_array() as $row){
            $data[$row['id']]=$row['Nombre'];
        }
        return $data;
    }
    
}