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
				<div class="form-group" >
					<label for="url">URL del libro para compartir</label>
					<input type="text" class="form-control" id="url" name="url" value="<?php echo $url; ?>"></input>
				</div>
				<div class="form-group" >
					<label for="tags">Temas</label>
					<input type="text" class="form-control" id="tags" name="tags" value="<?php echo $tags; ?>"></input>
				</div>
				<div class="form-group">
					<label for="category">Categoría</label>
					<select class="form-control" name="category" id="category">
						<option value="1" <?php if ($category == "1"){ echo "selected='selected'";} ?> >1</option>
						<option value="2" <?php if ($category == "2"){ echo "selected='selected'";} ?> >2</option>
						<option value="3" <?php if ($category == "3"){ echo "selected='selected'";} ?> >3</option>
						<option value="4" <?php if ($category == "4"){ echo "selected='selected'";} ?> >4</option>
					</select>
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