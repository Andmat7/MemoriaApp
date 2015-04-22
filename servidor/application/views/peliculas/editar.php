
<div class="">
    <form role="form" method="post" action ="<?php echo site_url('peliculas/editarSave'); ?>">
    	<div class="form-group" >
    		<label for="name">Nombre</label>
        	<input type="text" class="form-control" id="name" name="name" value="<?php echo $Nombre; ?>">
      	</div>
	      <div class="form-group">
	        <label for="desc">Descripción</label>
	        <textarea rows="3" class="form-control" id="desc" name="desc"><?php echo $Descripcion; ?></textarea>
	      </div>
	      <div class="form-group">
	      	<label>
	      		<?php echo form_checkbox('EnCartelera', 'accept', $EnCartelera); ?>
	      		En cartelera
	      	</label>
	      </div>

		<button type="submit" class="btn btn-default">Siguiente</button>

	</form>
</div> 