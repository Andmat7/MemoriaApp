<div class="">
	<?php 
	if (validation_errors() ){
	echo '<div class="alert alert-danger" role="alert">';
	echo validation_errors('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ','');		echo '</div>';
	}
	?>
	<form role="form" method="post" enctype="multipart/form-data" action ="<?php echo site_url('epubs/save_entry_DB'); ?>" >
		<div id="libro" class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">Editar información del eBook</h3>
			</div>
			<input id="id" name="id" type="hidden" value="<?php echo $id; ?>"></input>
			<div class="panel-body">
				<div class="form-group" >
					<label for="titulo">Título</label>
					<input type="text" class="form-control" id="titulo" name="titulo" value="<?php echo $title; ?>"></input>
				</div>
				<div class="form-group" >
					<label for="isbn">ISBN</label>
					<input type="number" class="form-control" id="isbn" name="isbn" value="<?php echo $ISBN; ?>"></input>
				</div>
				<div class="form-group">
					<label for="desc">Descripción</label>
					<textarea rows="3" class="form-control" id="desc" name="desc" value=""><?php echo $description; ?></textarea>
				</div>
				<div class="form-group">
					<label for="imagen">Imagen de portada</label>
					<input id="imagen" name="imagen" type="file" accept=".png,.jpg,.gif"></input>
					<p class="help-block">Si desea cambiar la imágen de la portada escoja un nuevo archivo.</p>
					</div>
				<div class="form-group">
					<label for="epub">Archivo EPUB</label>
					<input id="epub" name="epub" type="file" accept=".epub"/>
					<p class="help-block">Si desea cambiar el EPUB escoja un nuevo archivo.</p>
				</div>
			</div>
		</div>
		<button type="submit" class="btn btn-default">Guardar</button>
	</form>
</div>