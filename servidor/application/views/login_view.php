<div class="container theme-showcase" role="main" >
	
	<div class="jumbotron" style="text-align: center ;">
		
		<p>Por favor digite su usuario y contraseña.</p>
		
		<div class="container" style="width: 500px; align: left;">
			<?php 
			if (validation_errors() ){
				echo '<div class="alert alert-danger" role="alert">';
				echo '<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>';
				echo '<span class="sr-only">Error:</s6pan>';
				echo validation_errors(' ',' ');
				echo '</div>';
			}
			?>
			
			<?php echo form_open('verifylogin'); ?>
			
			<input type="text" class="form-control" placeholder="Usuario" id="username" name="username" required autofocus />
			<input type="password" class="form-control" placeholder="Contraseña" id="password" name="password" required />
			
			<button class="btn btn-lg btn-primary btn-block" type="submit">Ingresar</button>
			<?php echo form_close(); ?>
		</div>
	</div>
</div>    