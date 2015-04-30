<div class="">
	<?php 
	if (validation_errors() ){
		echo '<div class="alert alert-danger" role="alert">';
		echo validation_errors('<span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span> ','');		echo '</div>';
	}
	?>
	<form role="form" method="post" enctype="multipart/form-data" action ="<?php echo site_url('epubs/new_entry_DB'); ?>" >
		<div id="libro" class="panel panel-default">
			<div class="panel-heading">
				<h3 class="panel-title">Libro</h3>
			</div>
			<div class="panel-body">
				<div class="form-group" >
					<label for="titulo">Título</label>
					<input type="text" class="form-control" id="titulo" name="titulo" value="<?php echo set_value('titulo'); ?>" />
				</div>
				<div class="form-group" >
					<label for="isbn">ISBN</label>
					<input type="number" class="form-control" id="isbn" name="isbn" value="<?php echo set_value('isbn'); ?>"/>
				</div>
				<div class="form-group">
					<label for="desc">Descripción</label>
					<textarea rows="3" class="form-control" id="desc" name="desc" value=""><?php echo set_value('desc'); ?></textarea>
				</div>
				<div class="form-group">
					<label for="imagen">Imagen de portada</label>
					<input id="imagen" name="imagen" type="file" accept=".png,.jpg,.gif"/>
				</div>
				<div class="form-group">
					<label for="epub">Archivo EPUB</label>
					<input id="epub" name="epub" type="file" accept=".epub"/>
				</div>
				
			</div>
		</div>
		<button type="submit" class="btn btn-default">Siguiente</button>
	</form>
</div>