<html>
<head>
	<meta charset="utf-8">
	<title>MemoriApp</title>
	<link rel="stylesheet" href="<?php echo base_url(); ?>vendors/css/onsenui.css" />  
	<link rel="stylesheet" href="<?php echo base_url(); ?>vendors/css/onsen-css-components-memoria-theme.css" />  
	<style type="text/css">
	body{
		background-color:#04bfa9;
		color:white;
		font-family: 'TitilliumWeb-Regular';
		font-size: 1.3rem;
	}
	img{
		width: 30%;
		display: block;
		margin: 0 auto;
		width: 20rem;
	}

	</style>
</head>
<body style="text-align:center">
	<div style="display:inline-block">
   		<img src="<?php echo base_url(); ?>img/logo.png" 
   		style="display:inline-block;width:30px;vertical-align:middle">
   		<span style="font-size:2rem">MEMORIAPP</span>
	</div>
	<div>
		 <span>
		 	<img style="width:25px;margin:0 auto;">
		 	
		</span>
	</div>
	<p>
		<?php
			if ( !($url == "0" || $url == "" || $url == "http://0" )){
				echo '<a href="' . $url . '" style=" color:white;">';
				echo 'Si deseas leer este documento completo descárgalo aquí';
				echo '</a>';
			}
		?>
	</p>
	<p>
		Si  deseas conocer más documentos del centro de memoria histórica. te invitamos a descargar nuestra app en las diferentes tiendas
	</p>
	<p>
	<a href="http://www.google.com">
		<img src="<?php echo base_url(); ?>img/App-Store.png">
	</a>
	</p>
	<p>
	<a href="http://www.google.com">
		<img src="<?php echo base_url(); ?>img/Google-Play.png">
	</a>
	</p>
</body>
</html>