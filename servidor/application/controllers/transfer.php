<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Transfer extends CI_Controller {
  
	private $server2IP = "192.168.0.4";
	private $server2CMD = "python /var/www/html/servidor/python/alignment_by_row_channels.py ";
	private $max_jobs_server = array( 
	  1 => 4,
	  2 => 1,
	  );
// 	function __construct()
// 	{
// 		parent::__construct();
// 	}
// 
// 	public function index(){
// 	  echo 'hola';
// 	}
	public function download( $pelicula)
	{
	    /*
	     *--------- PRUEBA ---------
	     */
	//	$pelicula = "Frozen";
	    //**************************
		
		
		
		$downloaddir = FCPATH.'uploads/descripcion/';
		$audioDesc = $downloaddir . $pelicula . '_AD.mp3';

		if (file_exists($audioDesc)) {
  			header('Content-Description: File Transfer');
			header('Content-Type: application/octet-stream');
			header('Content-Disposition: attachment; filename='.basename($audioDesc));
			header('Expires: 0');
			header('Cache-Control: must-revalidate');
			header('Pragma: public');
			header('Content-Length: ' . filesize($audioDesc));
			readfile($audioDesc);
			exit;
		}
		else{
			echo ' no existe';
		}	
	}
	function do_upload($pelicula)
	{
		$this->load->library('filemanager');
		$this->filemanager->createFolder( './uploads/');

		$config['upload_path'] = './uploads/';
		$config['allowed_types'] = '*';
		$config['max_size']	= '100000';
		$config['file_name'] = substr(md5(mt_rand()), 0, 7) . ".wav"; //nombre de archivo aleatorio terminado en wav (confiando en la habilidad para dicernir el tipo de archivo en avconv)

		$this->load->library('upload', $config);

		if ( ! $this->upload->do_upload())
		{
			$error = array('error' => $this->upload->display_errors());
			$this->load->view('upload_form', $error);
		}
		else
		{		
			$data = array('upload_data' => $this->upload->data());
			
			
			$audioOR = FCPATH."uploads/original/" . $pelicula . "_OR.wav";
			$uploadfile = $data['upload_data']['full_path'];

			$count = 9999;
			$done = 0;
			$server = 0;
			while ($done == 0 ) {
			  $sql = "SELECT server, COUNT(*) FROM jobs group by server order by server;";
			  $query = $this->db->query($sql); 
			  foreach ($query->result_array() as $row ){
			    $count = $row['COUNT(*)'];
			    
			    if ($count <= $this->max_jobs_server[$row['server']]) {
			      $server = $row['server'];
			      $done = 1;
			      break;
			    }
			  }
			  if ($done == 0 ) sleep (1);
			}
			
			$sql = "INSERT INTO `jobs` (`name`, `server`) VALUES (?, ?);";
			$this->db->query($sql, array($uploadfile, $server)); 
			
			switch ($server) {
			  case 1:
			    echo exec (escapeshellcmd("python ./python/alignment_by_row_channels.py " . $audioOR . " " . $uploadfile ));
			    break;
			  case 2:
			    exec (escapeshellcmd("scp -i /etc/php_rsa " . $uploadfile . " root@"  . $this->server2IP .":/var/www/html/servidor/uploads"));
			    echo exec (escapeshellcmd("ssh -i /etc/php_rsa root@". $this->server2IP . " -x ". $this->server2CMD . $audioOR . " " . $uploadfile ));
			    break;
			}
			    
			
			
			$sql = "DELETE FROM `jobs` WHERE `name`= ?;";
			$this->db->query($sql, array($uploadfile));
// 			echo exec (escapeshellcmd("python /usr/local/bin/alignment_by_row_channels.py " . $audioOR . " " . $uploadfile ));
			unlink ( $uploadfile );
			exit();
		}
		
	}


}
?>