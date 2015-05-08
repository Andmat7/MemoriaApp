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
					<input type="text" class="form-control" id="titulo" name="titulo" value="<?php echo $title; ?>"  maxlength="150"></input>
				</div>
				<div class="form-group" >
					<label for="isbn">ISBN</label>
					<input type="number" class="form-control" id="isbn" name="isbn" value="<?php echo $ISBN; ?>"  maxlength="15"></input>
				</div>
				<div class="form-group">
					<label for="desc">Descripción</label>
					<textarea rows="3" class="form-control" id="desc" name="desc" value=""  maxlength="380"><?php echo $description; ?></textarea>
				</div>
				<div class="form-group" >
					<label for="url">URL del libro para compartir</label>
					<input type="text" class="form-control" id="url" name="url" value="<?php echo $url; ?>"  maxlength="400"></input>
				</div>
				<div class="form-group" >
					<label for="tags">Temas</label>
					<input type="text" class="form-control" id="tags" name="tags" value="<?php echo $tags; ?>"  maxlength="400"></input>
				</div>
				<div class="form-group">
					<label for="category">Categoría</label>
					<select class="form-control" name="category" id="category">
						<option value="1" <?php if ($category == "1"){ echo "selected='selected'";} ?> >Informe General ¡Basta Ya!</option>
						<option value="2" <?php if ($category == "2"){ echo "selected='selected'";} ?> >Informes de investigación</option>
						<option value="3" <?php if ($category == "3"){ echo "selected='selected'";} ?> >Herramientas metodológicas
						y pedagógicas</option>
						<option value="4" <?php if ($category == "4"){ echo "selected='selected'";} ?> >Iniciativas de memoria</option>
						<option value="5" <?php if ($category == "5"){ echo "selected='selected'";} ?> >Acuerdos de la Verdad</option>
						<option value="6" <?php if ($category == "6"){ echo "selected='selected'";} ?> >Diálogos de la memoria</option>
						<option value="7" <?php if ($category == "7"){ echo "selected='selected'";} ?> >Cartillas</option>
						<option value="8" <?php if ($category == "8"){ echo "selected='selected'";} ?> >Revistas</option>
						<option value="9" <?php if ($category == "9"){ echo "selected='selected'";} ?> >Resúmenes</option>
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