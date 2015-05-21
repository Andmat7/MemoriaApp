<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
session_start(); //we need to call PHP's session object to access it through CI
class Dictionary extends CI_Controller {
	
	function __construct()
	{
		parent::__construct();
	}
	function index()
	{
		if($this->session->userdata('logged_in'))   {
			$this->load->view('header');
			$this->load->view('navbar');
			$this->load->view('dictionary');
			$this->load->view('footer');
		}else{
			redirect('login', 'refresh');
		}
	}
	function download()
	{
		date_default_timezone_set('America/Bogota');
		$this->load->library('excel');
		//activate worksheet number 1
		$this->excel->setActiveSheetIndex(0);
		//name the worksheet
		
		
		
		
		
		$query = $this->db->query('SELECT * FROM dictionary');
		$contador=0;
		foreach ($query->result() as $row){
			$this->excel->getActiveSheet()->setCellValueByColumnAndRow(0, $contador + 1, $row->palabra);
			$this->excel->getActiveSheet()->setCellValueByColumnAndRow(1, $contador + 1, $row->definicion);
			$contador++;
		}
		
		
		$filename='diccionario.xls'; //save our workbook as this file name
		header('Content-Type: application/vnd.ms-excel'); //mime type
		header('Content-Disposition: attachment;filename="'.$filename.'"'); //tell browser what's the file name
		header('Cache-Control: max-age=0'); //no cache
		
		//if you want to save it as .XLSX Excel 2007 format
		$objWriter = PHPExcel_IOFactory::createWriter($this->excel, 'Excel5');  
		//force user to download the Excel file without writing it to server's HD
		$objWriter->save('php://output');
		
	}
	private function validateExcelEntry( $type ){
		$this->load->library('form_validation');
		return $this->form_validation->run();
	}
	function read()
	{
		if($this->session->userdata('logged_in')){
			$error = FALSE;
			if (!$_FILES["excel"]["tmp_name"]){
				$error = TRUE;
				$errorMessages[] = 'por favor ingrese el excel';
			}else{
				
				$file = $_FILES["excel"]["tmp_name"];
				$this->load->library('excel');
				//read file from path
				$objPHPExcel = PHPExcel_IOFactory::load($file);
				//get only the Cell Collection
				$sheet = $objPHPExcel->getActiveSheet();
				$highestRow = $sheet->getHighestRow();
				//extract to a PHP readable array format
				$data=array();
				if ($highestRow>=1) {
					
					for ($row = 1; $row <= $highestRow; $row++){ 
						//  Read a row of data into an array
						$rowData = $sheet->rangeToArray('A' . $row . ':B'  . $row,
						NULL,
						TRUE,
						FALSE);
						//  Insert row data array into your database of choice here
						$data[] = array(
							'palabra' => $rowData[0][0] ,
							'definicion' => $rowData[0][1] 
							);
							if ($rowData[0][0]==null||$rowData[0][1]==null ) {
								$error = TRUE;
								$errorMessages[] = 'Error en la fila '.$row.' del excel por favor verique y vuelva a intentarlo';
								break;
								
							}
							
							
							
							
					}
					
				}else{
					$error = TRUE;
					$errorMessages[] = 'El archivo excel esta vacio, por favor encuentre';
					
				}
				
				
			}
			if( $error == TRUE ){
				$this->form_upload_error( $errorMessages );
			}else{
				$this->db->truncate('dictionary');
				foreach ($data as &$valor) {
					$this->db->insert('dictionary', $valor); 
				}
				$this->agregar_exito();
			}
			
		}else{
			//If no session, redirect to login page
			redirect('login', 'refresh');
			
		}
		
	}
	private function form_upload_error( $messages){
		$this->load->helper('form');
		$this->load->view('header');
		$this->load->view('navbar');
		foreach( $messages as $message ){
			$this->load->view('error_div', array ('error' => $message) );
		}
		$this->load->view('dictionary');
		$this->load->view('footer');
	}
	public function agregar_exito(){
		$this->load->view('header');
		$this->load->view('navbar');
		$this->load->view('agregar_dic');
		$this->load->view('footer');
	}
	public function buscar($searchString){
		if( strlen( $searchString ) > 3 ){
			header('Content-Type: application/json; charset=utf-8');
			$this->db->where('LOWER(palabra)', strtolower(trim($searchString)) );
			$query  = $this->db->get('dictionary');
			$result = $query->result();
			$json   = json_encode($result);
		}else{
			$json   = json_encode( array () );
		}
		echo isset($_GET['callback'])
		? "{$_GET['callback']}($json)"
		: $json;
	}
}

?>